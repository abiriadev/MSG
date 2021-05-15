import Command from './Command'

class MiddlewareManager {
    constructor(private middlewareChain: Array<Command> = []) {}

    addCommand(mid: Command): this {
        this.middlewareChain.push(mid)
        return this
    }

    array(): Array<Command> {
        return [...this.middlewareChain]
    }
}

export default MiddlewareManager
