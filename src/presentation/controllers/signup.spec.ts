import { PasswordValidator } from './../protocols/password-validator'
import {
    MOCK_USER_NONAME,
    MOCK_USER_NOEMAIL,
    MOCK_USER_NOPASSWORD,
    MOCK_USER_NOCONFIRMATIONPASSWORD,
    MOCK_USER_INVALIDEMAIL,
    MOCK_USER_INVALIDPASS
} from './../../../__mocks__/signup.mocks'
import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError } from './../errors/'
import { EmailValidator } from './../protocols/email-validator'

const makeSut = (): SignUpController => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            return (email.indexOf('@') >= 0)
        }
    }
    const emailValidatorStub = new EmailValidatorStub()

    class PasswordValidatorStub implements PasswordValidator {
        isConfirmed (pass: string, conf: string): boolean {
            return (pass === conf)
        }
    }
    const passValidatorStub = new PasswordValidatorStub()

    return new SignUpController(emailValidatorStub, passValidatorStub)
}

describe('SignUpController test suite', function () {
    test('Should return 400 if no name is provided', function () {
        const sut = makeSut()
        const httpRequest = {
            body: MOCK_USER_NONAME
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', function () {
        const sut = makeSut()
        const httpRequest = {
            body: MOCK_USER_NOEMAIL
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', function () {
        const sut = makeSut()
        const httpRequest = {
            body: MOCK_USER_NOPASSWORD
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no passwordConfirmation is provided', function () {
        const sut = makeSut()
        const httpRequest = {
            body: MOCK_USER_NOCONFIRMATIONPASSWORD
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('Should return 400 if an invalid email is provided', function () {
        const sut = makeSut()
        const httpRequest = {
            body: MOCK_USER_INVALIDEMAIL
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should return 400 if password and confirmation isnt equal', function () {
        const sut = makeSut()
        const httpRequest = {
            body: MOCK_USER_INVALIDPASS
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })
})
