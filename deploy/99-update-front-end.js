const { network, getNamedAccounts, ethers, deployments } = require("hardhat")
const fs = require("fs")
require("dotenv").config()

const FRONT_END_ADDRESSES_FILE = "../nextjs-smartcontract-lottery/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../nextjs-smartcontract-lottery/constants/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END == "true") {
        console.log("Updating frontend...")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const chainId = network.config.chainId
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(raffle.address)) {
            // chaind present, but not the address
            currentAddresses[chainId].push(raffle.address)
        }
    } else {
        // chain ID not present
        currentAddresses[chainId] = [raffle.address]
    }
    console.log("Writing contract addresses...")
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    console.log("Writing abi json")
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

module.exports.tags = ["all", "frontend"]

/* const { ethers, network } = require("hardhat")
const fs = require("fs-extra")
require("dotenv").config()

const FRONT_END_ADDRESSES_FILE = "../nextjs-smartcontract-lottery/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../nextjs-smartcontract-lottery/constants/abi.json"

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        console.log(`Current chain ID is ${network.config.chainId}`)
        updateContractAddresses()
        updateAbi()
        console.log("Front end updated!")
        console.log("----------------------------------------")
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
    console.log("Wrote on ABI")
}

async function updateContractAddresses() {
    console.log("ciaooo")
    const raffle = await ethers.getContract("Raffle")
    console.log("OBTAINDED CONTRACT!!!!")
    const chainId = network.config.chainId.toString()
    console.log("Writing contract address")
    const contractAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))

    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId].includes(raffle.address)) {
            contractAddresses[chainId].push(raffle.address)
        } else {
            contractAddresses[chainId] = [raffle.address]
        }
        fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(contractAddresses))
    }

    console.log("Wrote on Contract Addresses")
}

module.exports.tags = ["all", "frontend"]
 */
