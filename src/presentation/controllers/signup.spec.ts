import {
    MOCK_USER_NONAME
} from './../../../__mocks__/signup.mocks'
import { SignUpController } from './signup'

describe('SignUpController test suite', function () {
    test('Should return 400 if no name is provided', function () {
        const sut = new SignUpController()
        const httpRequest = {
            body: MOCK_USER_NONAME
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
    })
})
