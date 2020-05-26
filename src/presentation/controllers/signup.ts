import {
    MissingParamError,
    InvalidParamError,
    InternalError
} from './../errors'
import { badRequest, internalError } from './../helpers/http.helper'
import { HttpResponse, HttpRequest } from './../protocols/http'
import { Controller } from './../protocols/controller'
import { EmailValidator } from './../protocols/email-validator'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor (emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    handle (httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpRequest.body[field])
                    return badRequest(new MissingParamError(field))
            }

            if (!this.emailValidator.isValid(httpRequest.body.email))
                return badRequest(new InvalidParamError('email'))
        } catch (err) {
            return internalError(new InternalError())
        }
    }
}
