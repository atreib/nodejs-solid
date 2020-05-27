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
import { AddAccount } from './../../domain/usecases/add-account'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly passwordValidator: PasswordValidator
    private readonly addAccount: AddAccount

    constructor (emailValidator: EmailValidator,
                passwordValidator: PasswordValidator,
                addAccount: AddAccount) {
        this.emailValidator = emailValidator
        this.passwordValidator = passwordValidator
        this.addAccount = addAccount
    }

    handle (httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpRequest.body[field])
                    return badRequest(new MissingParamError(field))
            }

            const { name, email, password, passwordConfirmation } = httpRequest.body

            if (!this.emailValidator.isValid(email))
                return badRequest(new InvalidParamError('email'))

            if (!this.passwordValidator.isConfirmed(password, passwordConfirmation))
                return badRequest(new InvalidParamError('passwordConfirmation'))

            this.addAccount.add({
                name,
                email,
                password
            })
        } catch (err) {
            return internalError(new InternalError())
        }
    }
}
