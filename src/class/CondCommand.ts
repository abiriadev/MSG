import Context from './Context'
import MiddlewareChainRunner from './MiddlewareChainRunner'
import Command, {
    condStringOrTrue,
    executor,
    nameAndDescription,
} from './Command'
import { promiseOr } from '../types'

export default class CondCommand {
    private innerMiddlewareChainRunner: Array<Command> = []

    constructor(
        private condString: condStringOrTrue,
        public nameAndDescription: Partial<nameAndDescription> = {},
    ) {}

    cond(ctx: Context): promiseOr<boolean> {
        return (
            ctx.header.currentCommand === this.condString ||
            this.condString === true
        )
    }

    executor(ctx: Context): promiseOr<Context> {
        return new MiddlewareChainRunner(this.innerMiddlewareChainRunner).run(
            ctx,
        )
    }

    subCommand(subCommand: Command): this {
        this.innerMiddlewareChainRunner.push(subCommand)
        return this
    }

    subCall(
        condString: condStringOrTrue,
        executorCallBack: executor,
        tag: Partial<nameAndDescription> = {},
    ): this {
        this.innerMiddlewareChainRunner.push(
            new Command(
                (ctx: Context) =>
                    ctx.header.currentCommand === condString ||
                    condString === true,
                executorCallBack,
                tag,
            ),
        )
        return this
    }
}
