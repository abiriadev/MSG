import Command from './Command'

class MiddlewareManager {
    constructor(private middlewareChain: Array<Command> = []) {}

    addCommand(...mids: Array<Command>): this {
        this.middlewareChain = this.middlewareChain.concat(mids)
        return this
    }

    array(): Array<Command> {
        return [...this.middlewareChain]
    }
}

export default MiddlewareManager
