import { loadFixture, ethers, expect, parseEther, BigNumberish } from './setup'

describe('AucEngine', function () {
    async function deploy() {
        const [owner, seller, buyer] = await ethers.getSigners();
        const Factory = await ethers.getContractFactory('AucEngine');
        const auction = await Factory.deploy();
        await auction.waitForDeployment();

        return { owner, seller, buyer, auction }
    }
    it("sets owner", async function () {
        const { owner, seller, buyer, auction } = await loadFixture(deploy);
        const currentOwnerAddress = await auction.owner();
        console.log(currentOwnerAddress, owner.address);
        expect(currentOwnerAddress).to.eq(owner.address)
    })
    it("create auction correctly", async function () {
        const { owner, seller, buyer, auction } = await loadFixture(deploy);
        const startPrice: bigint | BigNumberish = parseEther("0.0001");
        const tx = await auction.createAuction(
            startPrice,
            3,
            "fake item",
            60
        );
        const cAuction = await auction.auctions(0);
        console.log('AUCTIONS_0', cAuction);

    })
})