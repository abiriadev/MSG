import Context from './Context'

type nameAndDescription = {
    name: string
    description: string
}

type promiseOr<T> = T | Promise<T>

class Command implements Partial<nameAndDescription> {
    static alwaysTrue = (_: Context): boolean => true

    static alwaysFalse = (_: Context): boolean => false

    // eslint-disable-next-line no-undef
    static empty = (_: Context): Context => _

    name?: string

    description?: string

    constructor(
        readonly cond: (ctx: Context) => promiseOr<boolean>,
        readonly executor: (ctx: Context) => promiseOr<Context>,
        tag: Partial<nameAndDescription> = {},
    ) {
        Object.assign(this, tag)
    }
}

export default Command
