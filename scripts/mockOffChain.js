const { ethers, network } = require("hardhat")

async function mockKeepers() {
    console.log("MOCK KEEPERS STARTED...")
    console.log(`Chain ID is: ${network.config.chainId}`)
    const raffle = await ethers.getContract("Raffle")
    const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
    const { upkeepNeeded } = await raffle.callStatic.checkUpkeep(checkData)
    if (upkeepNeeded) {
        console.log("upKeepNeede detected!")
        const tx = await raffle.performUpkeep(checkData)
        const txReceipt = await tx.wait(1)
        const requestId = txReceipt.events[1].args.requestId
        console.log(`Performed upkeep with Request ID: ${requestId}`)
        if (network.config.chainId == 31337) {
            await mockVrf(requestId, raffle)
        } else {
            console.log("No upkeep needed!")
        }
    } else {
        console.log(`upKeepNeeded returned: ${upkeepNeeded}`)
    }
}

async function mockVrf(requestId, raffle) {
    console.log("requestedRandomWords has been called, let's call fulfillRandomWords")
    const vfrCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
    await vfrCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
    console.log("Responded!")
    const recentWinner = await raffle.getRecentWinner()
    console.log(`The winner is: ${recentWinner}`)
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
