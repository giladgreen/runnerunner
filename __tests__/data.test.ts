import Data, {fetchUserById} from '../app/lib/data'
describe('Data', () => {
    it('should check something', () => {
        // arrange


        // act
        const result = Data.fetchUserById(1);

        //assert
        expect(result).toBe({})
    })
})
