import { MongoHelper } from './../helpers/mongodb.helper'
import { MOCK_USER_1 } from './../../../../../__mocks__/signup.mocks'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
}

describe('Account MongoDB Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    test('should return an account on success', async () => {
        const sut = makeSut()
        const account = await sut.add(MOCK_USER_1)
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe(MOCK_USER_1.name)
        expect(account.password).toBe(MOCK_USER_1.password)
        expect(account.email).toBe(MOCK_USER_1.email)
    })
})
