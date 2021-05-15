import chalk from 'chalk'
import Command from './Command'
import Context from './Context'

type MiddlewareChain = Array<Command>

const logMid = (middleware: Command, index: number, depth = 0) => {
    const tab = '    '

    let outStr = `${tab.repeat(depth)}${chalk.hex('#1AB7AF')(`[${index}]`)} `

    if (middleware.name) {
        outStr += `current middleware: ${chalk.hex('#7BA047')(
            `${middleware.name}`,
        )}`
        // if (middleware.description)
        //     outStr += `\n${tab.repeat(depth)}${chalk.hex('#4A4444')(
        //         `*** description: ${middleware.description} ***`,
        //     )}`
    } else outStr += `(anonymous middleware)`
    console.log(outStr)
}

const checkAndExecuteF = async (ctx: Context, cmd: Command) => {
    const ctxCopyForCond = ctx.copyAndIncrease()

    if (await cmd.cond(ctxCopyForCond)) {
        const ctxCopyForExecute = ctx.copyAndIncrease()

        const res = (await cmd.executor(ctxCopyForExecute)).copyAndDiminish()

        if (res.header.getIsFinished()) {
            res.header.setHit()
            cmd.name && res.header.setHitCommand(cmd.name)
        }

        return res
    }

    return ctxCopyForCond.copyAndDiminish()
}

export default class MiddlewareChainRunner {
    constructor(private middlewareChain: MiddlewareChain) {}

    async run(firstContext: Context): Promise<Context> {
        let lastContext = firstContext
        for (let i = 0; i < this.middlewareChain.length; i += 1) {
            const middleware = this.middlewareChain[i]
            logMid(middleware, i, lastContext.header.getDepth())

            try {
                const res = await checkAndExecuteF(lastContext, middleware)

                if (res.header.getIsFinished()) {
                    if (process.argv.includes('--log')) {
                        console.log(
                            `${'    '.repeat(res.header.getDepth())}${chalk.red(
                                '<terminated>',
                            )}`,
                        )
                    }
                    return res
                }

                lastContext = res
            } catch (e) {
                console.error(e)
            }
        }
        console.log('middleware chain has drain')
        return lastContext
    }
}
