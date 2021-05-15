import Context from '../class/Context'
import Command from '../class/Command'

export default new Command(
    Command.alwaysTrue,
    (ctx: Context) => {
        ctx.ex.args = ctx.ex?.content?.trimLeft()?.split(/\s+/)
        ctx.ex.command = ctx.ex.args?.[0] // TODO 나중에 currentCommand가 ctx에 자동 추가되도록 하기
        return ctx
    },
    {
        name: 'parse arguments',
        description: 'parse arguments for msg.content',
    },
)
