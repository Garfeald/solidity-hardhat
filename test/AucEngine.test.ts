import { loadFixture, ethers, expect, parseEther, BigNumberish } from './setup'

describe('AucEngine', function () {
    async function deploy() {
        const [owner, seller, buyer] = await ethers.getSigners();
        const Factory = await ethers.getContractFactory('AucEngine');
        const auction = await Factory.deploy();
        await auction.waitForDeployment();

        return { owner, seller, buyer, auction }
    }

    beforeEach(async () => {
        const { owner, seller, buyer, auction } = await loadFixture(deploy);
    });

    it("sets owner", async function () {
        const { owner, seller, buyer, auction } = await loadFixture(deploy);
        const currentOwnerAddress = await auction.owner();
        console.log(currentOwnerAddress, owner.address);
        expect(currentOwnerAddress).to.eq(owner.address)
    })

    async function getTimeStamp(bn: number) {

        const _block = await ethers.provider.getBlock(bn)

        return _block?.timestamp
    }

    it("create auction correctly", async function () {
        const { owner, seller, buyer, auction } = await loadFixture(deploy);
        const startPrice: bigint | BigNumberish = parseEther("0.0001");
        const _duration = 60
        const tx = await auction.createAuction(
            startPrice,
            3,
            "fake item",
            _duration
        );
        const cAuction = await auction.auctions(0);
        expect(cAuction.item).to.eq("fake item")
        const ts = await getTimeStamp(tx.blockNumber ?? 0)
        ts && expect(cAuction.endsAt).to.eq(ts + _duration)
    })

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    it("should buy function work correctly", async function () {
        const { owner, seller, buyer, auction } = await loadFixture(deploy);
        const startPrice: bigint | BigNumberish = parseEther("0.0001");
        await auction.connect(seller).createAuction(
            startPrice,
            3,
            "fake item",
            60
        );

        this.timeout(5000) // 5s
        await delay(1000)

        const buyTx = await auction.connect(buyer).buy(0, { value: startPrice })

        const cAuction = await auction.auctions(0);

        const _finalPrice = Number(cAuction.finalPrice); // преобразуем в number

        console.log('PRICE!!!', _finalPrice, buyTx);


        // n - преобразование типа number в bigint
        // await expect(() => buyTx).to.changeEtherBalance(seller, _finalPrice - Math.floor(((_finalPrice * 10n) / 100n)))
        await expect(() => buyTx).to.changeEtherBalance(
            seller, _finalPrice - Math.floor((_finalPrice * 10) / 100)
        )

        // провернка на порождение события
        await expect(buyTx)
            .to.emit(auction, 'AuctionEnded')
            .withArgs(0, _finalPrice, buyer.address)

        await expect(
            auction.connect(buyer).buy(0, { value: startPrice })
        ).to.be.revertedWith("Stopped!")
    })
})