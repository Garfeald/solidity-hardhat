import { network, ethers, artifacts } from "hardhat";
import { parseEther, Contract } from "ethers";
import * as path from 'path';
import * as fs from 'fs';
import * as Contracts from "../typechain-types";

async function main() {
    if (network.name === 'hardhat') {
        console.warn(
            "You are trying to deploy a contract to the Hardhat Network, which" +
            "gets automatically created and destroyed every time. Use the Hardhat" +
            " option '--network localhost'"
        );
    }

    const [deployer] = await ethers.getSigners()

    console.log('Deploying with', await deployer.getAddress());

    const DutchAuction = await ethers.getContractFactory("DutchAuction", deployer)
    const auction = await DutchAuction.deploy(
        parseEther('2.0'),
        1,
        "Motorbike"
    )
    await auction.waitForDeployment()

    saveFrontendFiles({
        DutchAuction: auction
    })

}


/**
 * @description write contracts to front dir
 * @param contracts 
 */
async function saveFrontendFiles(contracts: Record<string, Contracts.DutchAuction>) {
    const contractsDir = path.join(__dirname, '/..', 'front/contracts')

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir)
    }

    Object.entries(contracts).forEach(async (contract_item) => {

        const [name, contract] = contract_item

        fs.writeFileSync(
            path.join(contractsDir, '/', name + '-contract-address.json'),
            JSON.stringify({ [name]: contract.target }, undefined, 2)
        )


        const ContractArtifact = artifacts.readArtifactSync(name)

        fs.writeFileSync(
            path.join(contractsDir, '/', name + '.json'),
            JSON.stringify(ContractArtifact, null, 2)
        )
    })
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })

