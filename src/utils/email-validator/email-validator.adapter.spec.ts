import { EmailValidatorAdapter } from './email-validator.adapter'
import validator from 'validator'

const makeSut = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
}

describe('EmailValidator adapter', () => {
    test('should return false if validator says its false', () => {
        const sut = makeSut()
        const result = sut.isValid('invalid_email')
        expect(result).toBe(false)
    })

    test('should return true if validator says its true', () => {
        const sut = makeSut()
        const result = sut.isValid('valid_email@mail.com')
        expect(result).toBe(true)
    })

    test('should use email sent through parameter in validation', () => {
        const sut = makeSut()
        const isEmailSpy = jest.spyOn(validator, 'isEmail')
        sut.isValid('valid_email@mail.com')
        expect(isEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
    })
})
