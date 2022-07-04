# Smart Contract Lottery with Hardhat

## Intro

Credits to [PatrickAlphaC](https://github.com/PatrickAlphaC) creator of the [Learn Blockchain, Solidity, and Full Stack Web3 Development with JavaScript – 32-Hour Course](https://www.youtube.com/watch?v=gyMwXuJrbJQ&t=49271s) course.

This repo contains the "Smart Contract Lottery" project developed using the **Hardhat suite** to deploy and testing the smart contract. It consists of the contract `Raffle.sol` which allows user to send funds and take part to the lottery draw. The winner will be automatically determined using the **Chainlink VRF (Verifiable Random Function)**, to get an off-chain random number, and **Chainlink Keepers**, used to trigger the draw automatically based on a time interval.

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`
- [Yarn](https://yarnpkg.com/getting-started/install) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
    - You might need to [install it with `npm`](https://classic.yarnpkg.com/lang/en/docs/install/) or `corepack`

## Quickstart

```
git clone https://github.com/luc-rig/hardhat-smartcontract-lottery.git
cd hardhat-smartcontract-lottery-fcc
yarn
```

## Useage

### Deploy

Deploy the contract on the `<network>` network. Will run scripts located in the `./deploy` folder:
```
yarn hardhat deploy --network <network>
```
Supported networks:
| Network | \<network> |
|--|:--:|
| Hardhat local network (default) | `hardhat` |
| Rinkeby Ethereum testnet | `rinkeby` |

### Testing
Depending on the `<network>` selected, will run unit tests or staging tests:
```
yarn hardhat test --network <network>
```
Supported networks:
| Network | \<network> |
|--|:--:|
| Hardhat local network (default) | `hardhat` |
| Rinkeby Ethereum testnet | `rinkeby` |

### Deploy on the Rinkeby testnet

**1. Setup environmental variables:**

Rename the `.envExample` file to `.env` and compile it:
```
RINKEBY_RPC_URL = #RPC URL, you can use alchemy.com or infura.io
```
```
PRIVATE_KEY = #your wallet private key (USE JUST TEST WALLETS WITHOUT MAINNET FUNDS)
```

**2. Setup a Chainlink VRF Subscription ID**
Head over to [vrf.chain.link](https://vrf.chain.link/) and setup a new subscription, and get a subscriptionId. You can reuse an old subscription if you already have one. 

[You can follow the instructions](https://docs.chain.link/docs/get-a-random-number/) if you get lost. You should leave this step with:

1. A subscription ID
2. Your subscription should be funded with LINK
3. Deploy

In your `helper-hardhat-config.js` add your `subscriptionId` under the section of the chainId you're using (aka, if you're deploying to rinkeby, add your `subscriptionId` in the `subscriptionId` field under the `4` section.)

Then run:
```
yarn hardhat deploy --network rinkeby
```

And copy / remember the contract address.

**3.  Add your contract address as a Chainlink VRF Consumer**

Go back to [vrf.chain.link](https://vrf.chain.link) and under your subscription add `Add consumer` and add your contract address. You should also fund the contract with a minimum of 1 LINK.

**4. Register a Chainlink Keepers Upkeep**

Go to [keepers.chain.link](https://keepers.chain.link/new) and register a new upkeep.

**5. Enter the Raffle**

Now that the contract is deployed and integrated with Chainlink Keeprs and VRF, run:
```
yarn hardhat run scripts/fund.js --network rinkeby
```
To send 0.01ETH to the lottery. After about 30 seconds, the draw will be triggered and you, the only participant, will win the prize.