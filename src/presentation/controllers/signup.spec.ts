import {
    MOCK_USER_NONAME,
    MOCK_USER_NOEMAIL,
    MOCK_USER_NOPASSWORD,
    MOCK_USER_NOCONFIRMATIONPASSWORD,
    MOCK_USER_INVALIDEMAIL,
    MOCK_USER_INVALIDPASS,
    MOCK_USER_1
} from './../../../__mocks__/signup.mocks'
import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError } from './../errors/'
import { EmailValidator } from './../protocols/email-validator'
import { PasswordValidator } from './../protocols/password-validator'
import { AccountModel } from './../../domain/models/account'
import { AddAccount, AddAccountModel } from './../../domain/usecases/add-account'

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
        add (account: AddAccountModel): AccountModel {
            const fakeAccount = {
                id: 1,
                ...account
            }
            return fakeAccount
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
    test('Should return 400 if no name is provided', function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_NONAME
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_NOEMAIL
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_NOPASSWORD
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no passwordConfirmation is provided', function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_NOCONFIRMATIONPASSWORD
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('Should return 400 if an invalid email is provided', function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_INVALIDEMAIL
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should return 400 if password and confirmation isnt equal', function () {
        const { sut } = makeSut()
        const httpRequest = {
            body: MOCK_USER_INVALIDPASS
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })

    test('Should call AddAcount with correct values', function () {
        const { sut, addAccountStub } = makeSut()
        const addSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = {
            body: MOCK_USER_1
        }
        sut.handle(httpRequest)
        const mockResult = MOCK_USER_1
        delete mockResult.passwordConfirmation
        expect(addSpy).toHaveBeenCalledWith(mockResult)
    })
})
