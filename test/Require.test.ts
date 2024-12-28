import { loadFixture, ethers, expect, Signer, TransactionResponse } from './setup'

describe('Require', function () {


    async function deploy() {
        const [user1, user2] = await ethers.getSigners();
        const Factory = await ethers.getContractFactory('Require');
        const requireSmart = await Factory.deploy();
        await requireSmart.waitForDeployment();

        return { user1, user2, requireSmart }
    }

    /**
     * @description метод отправки монет с кошелька на кошелёк
     * @param sender от имени плательщика
     * @param _to адрес кошелька
     * @returns возвращает инфо о транзакции и количество отправленных средств
     */
    async function sendMoney(sender: Signer, _to: string): Promise<[tx: TransactionResponse, amount: number]> {
        const amount = 100
        const txData = {
            to: _to,
            value: amount
        }

        const tx = await sender.sendTransaction(txData)
        await tx.wait();
        return [tx, amount];
    }

    it("should allawed to send money", async function () {

        const { user2, requireSmart } = await loadFixture(deploy);

        const ownerAddress = await requireSmart.getAddress()

        const [sendMoneyTx, amount] = await sendMoney(user2, ownerAddress)

        /**
         * @description проверка на изменение баланса на смартконтракте
         */
        await expect(() => sendMoneyTx).to.changeEtherBalance(requireSmart, amount)

        const block = await ethers.provider.getBlock(sendMoneyTx.blockNumber ?? 0)

        /**
         * @description проверка на порождение события "Paid" из контракта "Require"
         */
        await expect(sendMoneyTx)
            .to
            .emit(requireSmart, "Paid")
            .withArgs(user2.address, amount, block?.timestamp)
    })

    it("should allawed owner to withdraw funds", async function () {
        const { user1, user2, requireSmart } = await loadFixture(deploy);

        const ownerAddress = await requireSmart.getAddress()

        const [_, amount] = await sendMoney(user2, ownerAddress)

        console.log(await requireSmart.getBalance());

        const tx = await requireSmart.withdraw(user1.address)

        console.log(await requireSmart.getBalance());

        /**
         * @description проверка на изменение быланса на контракте и на кошельке user1
         */
        await expect(tx).to.changeEtherBalances([requireSmart, user1], [-amount, amount])
    })

    it("should not allawed other accounts to withdraw funds", async function () {

        const { user1, user2, requireSmart } = await loadFixture(deploy);

        const ownerAddress = await requireSmart.getAddress()

        await sendMoney(user2, ownerAddress)

        /**
         * @description функция вызывается не от владельца контракта
         */
        const revertTx = requireSmart.connect(user2).withdraw(user2.address)

        /**
         * @description проверка на невозможность выполнения функции withdraw (вывода средств) кем-то другим кроме владельца контракта
         */
        await expect(revertTx).to.be.revertedWith("you are not an owner")
        await expect(revertTx).not.to.be.revertedWith("fuck you asshole")
    })
})