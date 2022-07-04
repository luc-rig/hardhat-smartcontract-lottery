const { assert, expect, AssertionError } = require("chai")
const { network, getNamedAccounts, ethers, deployments } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              //raffle  = await deployments.get("Raffle")
              raffleEntranceFee = await raffle.getEntranceFee()
              console.log("BeforeEach completed!")
          })

          describe("fullfilRandomWords", function () {
              it("works with live Chainlink Keepers and Chainlink VRF", async function () {
                  console.log("Setting up test...")
                  const startingTimeStamp = await raffle.getLatestTimeStamp()
                  const accounts = await ethers.getSigners()

                  console.log("Setting up listener...")
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("Winner picked")
                          try {
                              console.log("Staring assertions...")
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLatestTimeStamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState, 0)
                              /* assert.equal(
                                  winnerEndingBalance.add(gasCost).toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              ) */
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              console.log("!!!Error found!!!")
                              console.log(error)
                              reject()
                          }
                      })
                      console.log("Entering raffle...")
                      const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                      console.log("Entered Raffle!!")
                      const txReceipt = tx.wait(1)
                      const { gasUsed, effectiveGasPrice } = txReceipt
                      const gasCost = gasUsed.mul(effectiveGasPrice)
                      const winnerStartingBalance = await accounts[0].getBalance()
                      console.log("Listening for events..")
                  })
              })
          })
      })
