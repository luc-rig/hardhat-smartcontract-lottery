const { assert, expect, AssertionError } = require("chai")
const { network, getNamedAccounts, ethers, deployments } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("RAFFLE SMART CONTRACT STAGING TESTS", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              console.log(`Wallet address is: ${deployer}`)
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
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
                              // There is only one player
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLatestTimeStamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted // There are not player anymore
                              assert.equal(recentWinner.toString(), accounts[0].address) // Last winner is accounts[0]
                              assert.equal(raffleState, 0)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)

                              resolve()
                          } catch (error) {
                              console.log("!!!Error found!!!")
                              console.log(error)
                              reject()
                          }
                      })

                      console.log("Entering raffle....")
                      const balance1 = await accounts[0].getBalance()
                      const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
                      const txReceipt = await tx.wait(1)
                      console.log("Entered Raffle!!")
                      const { gasUsed, effectiveGasPrice } = txReceipt
                      const gasCost = gasUsed.mul(effectiveGasPrice)
                      // Player starting balance right after entering the Raffle
                      const winnerStartingBalance = await accounts[0].getBalance()
                      console.log("Listening for events...")
                  })
              })
          })
      })
