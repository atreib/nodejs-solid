const MOCK_USER_NONAME = {
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
}

const MOCK_USER_INVALIDEMAIL = {
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    passwordConfirmation: 'any_password'
}

const MOCK_USER_INVALIDPASS = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password_diff'
}

const MOCK_USER_1 = {
    name: 'any_name_1',
    email: 'any_email_1@mail.com',
    password: 'any_password_1',
    passwordConfirmation: 'any_password_1'
}

const MOCK_USER_2 = {
    name: 'any_name_2',
    email: 'any_email_2@mail.com',
    password: 'any_password_2',
    passwordConfirmation: 'any_password_2'
}

export {
    MOCK_USER_1,
    MOCK_USER_2,
    MOCK_USER_INVALIDEMAIL,
    MOCK_USER_INVALIDPASS,
    MOCK_USER_NONAME
}
