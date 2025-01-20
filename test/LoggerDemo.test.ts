import { loadFixture, ethers, expect, Signer } from './setup'
import { LoggerDemo } from '../typechain-types';

describe('LoggerDemo', function () {

    let owner: Signer;
    let demoSmart: LoggerDemo;

    async function deploy() {
        [owner] = await ethers.getSigners();
        const Logger = await ethers.getContractFactory('Logger', owner);
        const logger = await Logger.deploy();
        await logger.waitForDeployment();

        const LoggerDemo = await ethers.getContractFactory('LoggerDemo', owner);
        demoSmart = await LoggerDemo.deploy(logger.getAddress());
        await demoSmart.waitForDeployment();
    }

    beforeEach(async () => {
        await loadFixture(deploy);
    });

    it('allows to get pay and get payments info', async function () {
        const sum = 350;

        const txData = {
            value: sum,
            to: demoSmart.getAddress()
        }

        const tx = await owner.sendTransaction(txData)

        await tx.wait()

        await expect(tx).to.changeEtherBalance(demoSmart, sum)

        const amount = await demoSmart.payments(owner.getAddress(), 0)

        expect(amount).to.eq(sum)
    })
})