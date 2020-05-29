import { AddAccountRepository } from './../../protocols/add-account-repository'
import { Encrypter } from './../../protocols/encrypter'
import { AccountModel } from './../../../domain/models/account'
import { AddAccount, AddAccountModel } from './../../../domain/usecases/add-account'

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter
    private readonly addAccountRepository: AddAccountRepository

    constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
        this.encrypter = encrypter
        this.addAccountRepository = addAccountRepository
    }

    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const account = {
            ...accountData,
            password: await this.encrypter.encrypt(accountData.password)
        }
        const result = await this.addAccountRepository.add(account)
        return new Promise(resolve => resolve(result))
    }
}
