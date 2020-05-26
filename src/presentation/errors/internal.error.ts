export class InternalError extends Error {
    constructor () {
        super('Internal server error')
        this.name = 'InternalError'
    }
}
