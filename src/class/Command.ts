import Context from './Context'
import MiddlewareChainRunner from './MiddlewareChainRunner'
import { promiseOr } from '../types'

export type nameAndDescription = {
    name: string
    description: string
}

export type cond = (ctx: Context) => promiseOr<boolean>
export type executor = (ctx: Context) => promiseOr<Context>

export type condStringOrTrue = string | true

export const subCall = (
    condString: condStringOrTrue,
    executorCallBack: executor,
    tag: Partial<nameAndDescription> = {},
): Command =>
    new Command(
        (ctx: Context) =>
            ctx.header.currentCommand === condString || condString === true,
        executorCallBack,
        tag,
    )

export const indent = (
    condString: condStringOrTrue,
    subCommands: Array<Command>,
): Command =>
    new Command(
        (ctx: Context) =>
            ctx.header.currentCommand === condString || condString === true,
        (ctx: Context) => new MiddlewareChainRunner(subCommands).run(ctx),
    )

class Command implements Partial<nameAndDescription> {
    static alwaysTrue = (_: Context): boolean => true

    static alwaysFalse = (_: Context): boolean => false

    // eslint-disable-next-line no-undef
    static empty = (_: Context): Context => _

    name?: string

    description?: string

    constructor(
        readonly cond: cond,
        readonly executor: executor,
        tag: Partial<nameAndDescription> = {},
    ) {
        Object.assign(this, tag)
    }
}

export default Command
