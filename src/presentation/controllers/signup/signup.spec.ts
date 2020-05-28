import {
    MOCK_USER_NONAME,
    MOCK_USER_NOEMAIL,
    MOCK_USER_NOPASSWORD,
    MOCK_USER_NOCONFIRMATIONPASSWORD,
    MOCK_USER_INVALIDEMAIL,
    MOCK_USER_INVALIDPASS,
    MOCK_USER_1,
    MOCK_USER_2
} from '../../../../__mocks__/signup.mocks'
import { SignUpController } from './signup'
import {
    MissingParamError,
    InvalidParamError,
    InternalError
} from '../../errors'
import {
    EmailValidator,
    PasswordValidator
} from './signup.protocols'
import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'

interface SutTypes {
    sut: SignUpController
    addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            return (email.indexOf('@') >= 0)
        }
    }
    return new EmailValidatorStub()
}

const makePasswordValidator = (): PasswordValidator => {
    class PasswordValidatorStub implements PasswordValidator {
        isConfirmed (pass: string, conf: string): boolean {
            return (pass === conf)
        }
    }
    return new PasswordValidatorStub()
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add (account: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: 1,
                ...account
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
    }
    return new AddAccountStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const passValidatorStub = makePasswordValidator()
    const addAccountStub = makeAddAccount()
    const sut = new SignUpController(emailValidatorStub, passValidatorStub, addAccountStub)

    return {
        sut,
        addAccountStub
    }
}

describe('SignUpController test suite', function () {
    test('Should return 400 if no name is provided', async function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_NONAME
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', async function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_NOEMAIL
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', async function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_NOPASSWORD
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no passwordConfirmation is provided', async function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_NOCONFIRMATIONPASSWORD
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('Should return 400 if an invalid email is provided', async function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_INVALIDEMAIL
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should return 400 if password and confirmation isnt equal', async function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_INVALIDPASS
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })

    test('Should call AddAcount with correct values', async function () {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = {
            body: MOCK_USER_1
        }
        await sut.handle(httpRequest)
        const mockResult = MOCK_USER_1
        delete mockResult.passwordConfirmation
        expect(addSpy).toHaveBeenCalledWith(mockResult)
    })

    test('Should return 500 if internal error', async function () {
        const { sut, addAccountStub } = makeSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()))
        })
        const httpRequest = {
            body: MOCK_USER_2
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new InternalError())
    })

    test('Should return 200 if valid account is provided', async function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_2
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body.name).toEqual(MOCK_USER_2.name)
    })
})
