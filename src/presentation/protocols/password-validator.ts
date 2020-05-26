export interface PasswordValidator {
    isConfirmed(pass: string, confirmation: string): boolean
}
