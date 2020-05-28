import {
    MissingParamError,
    InvalidParamError,
    InternalError
} from './../../errors'
import { badRequest, internalError, ok } from './../../helpers/http.helper'
import {
    Controller,
    HttpResponse,
    HttpRequest,
    EmailValidator,
    PasswordValidator
} from './signup.protocols'
import { AddAccount } from './../../../domain/usecases/add-account'

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

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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

            const account = await this.addAccount.add({
                name,
                email,
                password
            })

            return ok(account)
        } catch (err) {
            return internalError(new InternalError())
        }
    }
}
