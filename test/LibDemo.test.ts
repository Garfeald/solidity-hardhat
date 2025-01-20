import { loadFixture, ethers, expect, Signer } from './setup'
import { LibDemo } from '../typechain-types';

describe('LibDemo', function () {

    let libDemo: LibDemo;

    async function deploy() {
        const LibDemo = await ethers.getContractFactory('LibDemo');
        libDemo = await LibDemo.deploy();
        await libDemo.waitForDeployment();
    }

    beforeEach(async () => {
        await loadFixture(deploy);
    });

    it('should return false when cant find el', async function () {
        const arr = [10, 5, 3];
        const el = 6;

        const nonFound = await libDemo.runnerArr(arr, el)

        expect(nonFound).to.false
    })

    it('should return true when find el', async function () {
        const arr = [10, 5, 3];
        const el = 5;

        const nonFound = await libDemo.runnerArr(arr, el)

        expect(nonFound).to.true
    })

    it('should return false when string dosnt match', async function () {
        const str1 = 'one';
        const str2 = 'two';

        const notMatch = await libDemo.runnerStr(str1, str2)

        expect(notMatch).to.false
    })

    it('should return true when string match', async function () {
        const str1 = 'one';
        const str2 = 'one';

        const notMatch = await libDemo.runnerStr(str1, str2)

        expect(notMatch).to.true
    })

})