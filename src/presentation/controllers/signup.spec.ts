import {
    MOCK_USER_NONAME,
    MOCK_USER_NOEMAIL,
    MOCK_USER_NOPASSWORD,
    MOCK_USER_NOCONFIRMATIONPASSWORD
} from './../../../__mocks__/signup.mocks'
import { SignUpController } from './signup'
import { MissingParamError } from './../errors/missing-param.error'

describe('SignUpController test suite', function () {
    test('Should return 400 if no name is provided', function () {
        const sut = new SignUpController()
        const httpRequest = {
            body: MOCK_USER_NONAME
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', function () {
        const sut = new SignUpController()
        const httpRequest = {
            body: MOCK_USER_NOEMAIL
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', function () {
        const sut = new SignUpController()
        const httpRequest = {
            body: MOCK_USER_NOPASSWORD
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no passwordConfirmation is provided', function () {
        const sut = new SignUpController()
        const httpRequest = {
            body: MOCK_USER_NOCONFIRMATIONPASSWORD
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })
})
