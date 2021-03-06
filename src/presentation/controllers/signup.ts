import { ServerError } from './../errors/server-error'
import { InvalidParamError } from './../errors/invalid-param-error'
import { Controller } from './../protocols/controller'
import { badRequest } from './../helpers/http-helper'
import { MissingParamError } from './../errors/missing-param-error'
import { HttpResponse, HttpRequest } from './../protocols/http'
import { EmailValidator } from './../protocols/email-validator'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFiels = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFiels) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
