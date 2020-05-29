import { AccountModel } from './../../../domain/models/account'
import { AddAccountModel } from './../../../domain/usecases/add-account'
import { MOCK_USER_1 } from './../../../../__mocks__/signup.mocks'
import { DbAddAccount } from './../../../data/usecases/add-account/db-add-account'
import { Encrypter } from './../../protocols/encrypter'
import { AddAccountRepository } from './../../protocols/add-account-repository'

interface SubTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt (value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add (value: AddAccountModel): Promise<AccountModel> {
            const accountCreated = {
                id: 1,
                ...value
            }
            return new Promise(resolve => resolve(accountCreated))
        }
    }

    return new AddAccountRepositoryStub()
}

const makeSut = (): SubTypes => {
    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
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

    test('should call AddAccountRepository with correct account', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        await sut.add(MOCK_USER_1)
        expect(addSpy).toHaveBeenCalledWith({
            ...MOCK_USER_1,
            password: 'hashed_password'
        })
    })

    test('should throw if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const promise = sut.add(MOCK_USER_1)
        await expect(promise).rejects.toThrow()
    })
})
