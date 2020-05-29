import { MOCK_USER_1 } from './../../../../__mocks__/signup.mocks'
import { DbAddAccount } from './../../../data/usecases/add-account/db-add-account'
import { Encrypter } from './../../protocols/encrypter'

interface SubTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt (value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub()
}

const makeSut = (): SubTypes => {
    const encrypterStub = makeEncrypter()
    const sut = new DbAddAccount(encrypterStub)
    return {
        sut,
        encrypterStub
    }
}

describe('data layer - db add account - usecase', () => {
    test('should call Encrypter with passowrd', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.add(MOCK_USER_1)
        expect(encryptSpy).toHaveBeenCalledWith(MOCK_USER_1.password)
    })

    test('should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.add(MOCK_USER_1)
        await expect(promise).rejects.toThrow()
    })
})
