import { loadFixture, ethers, expect, Signer } from './setup'

describe('Require', function () {


    async function deploy() {
        const [user1, user2] = await ethers.getSigners();
        const Factory = await ethers.getContractFactory('Require');
        const req = await Factory.deploy();
        await req.waitForDeployment();

        return { user1, user2, req }
    }


    async function sendMoney(sender: Signer) {
        const amount = 100
        const txData = {
            to: sender.getAddress(),
            value: amount
        }

        const tx = await sender.sendTransaction(txData)
        await tx.wait();
        return [tx, amount];
    }

    it("should allawed to send money", async function () {

        const { user2 } = await loadFixture(deploy);

        const [sendMoneyTx, amount] = await sendMoney(user2)

        console.log(sendMoneyTx, amount);


    })

})