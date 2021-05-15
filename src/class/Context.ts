import discord from 'discord.js'
import ContextHeader from './ContextHeader'
import Bot from './Bot'

function currentUpdate(ctx: Context) {
    ctx.header.currentCommand =
        ctx.ex?.args?.[ctx.header.getDepth() - 1] ?? null
    ctx.ex.currentArgs = ctx.ex?.args?.slice(ctx.header.getDepth())
    return ctx
}

class Context {
    static copy: (ctx: Context) => Context

    copy(this: Context): Context {
        const newCtx = new Context(this.msg)

        newCtx.ex = { ...this.ex }

        const copiedHeader = new ContextHeader({
            depth: this.header.getDepth(),
        })

        if (this.header.getIsFinished()) copiedHeader.setFinish()
        if (this.header.getIsHit()) copiedHeader.setHit()
        copiedHeader.currentCommand = this.header.currentCommand
        if (this.header.getHitCommand() !== null)
            copiedHeader.setHitCommand(<string>this.header.getHitCommand())

        newCtx.header = copiedHeader

        return newCtx
    }

    copyAndIncrease(this: Context): Context {
        const ctxCopy = this.copy()
        ctxCopy.header.increaseDepth()
        return currentUpdate(ctxCopy)
    }

    copyAndDiminish(this: Context): Context {
        const ctxCopy = this.copy()
        ctxCopy.header.diminishDepth()
        return currentUpdate(ctxCopy)
    }

    header: ContextHeader = new ContextHeader()

    ex: {
        [key: string]: any
    } = {}

    finish(): this {
        this.header.setFinish()

        if (this.ex.bot instanceof Bot) {
            this.ex.bot.emit('finish', this)
        }
        return this
    }

    constructor(public msg: discord.Message) {}
}

Context.copy = (originalCtx: Context) =>
    Context.prototype.copy.call(originalCtx)

export default Context
