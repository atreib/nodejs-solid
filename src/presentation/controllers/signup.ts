import {
    MissingParamError,
    InvalidParamError,
    InternalError
} from './../errors'
import { badRequest, internalError } from './../helpers/http.helper'
import { HttpResponse, HttpRequest } from './../protocols/http'
import { Controller } from './../protocols/controller'
import { EmailValidator } from './../protocols/email-validator'
import { PasswordValidator } from './../protocols/password-validator'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly passwordValidator: PasswordValidator

    constructor (emailValidator: EmailValidator,
                passwordValidator: PasswordValidator) {
        this.emailValidator = emailValidator
        this.passwordValidator = passwordValidator
    }

    handle (httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpRequest.body[field])
                    return badRequest(new MissingParamError(field))
            }

            const { email, password, passwordConfirmation } = httpRequest.body

            if (!this.emailValidator.isValid(email))
                return badRequest(new InvalidParamError('email'))

            if (!this.passwordValidator.isConfirmed(password, passwordConfirmation))
                return badRequest(new InvalidParamError('passwordConfirmation'))
        } catch (err) {
            return internalError(new InternalError())
        }
    }
}
