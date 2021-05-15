import Context from '../class/Context'
import Command from '../class/Command'

export default new Command(
    (ctx: Context) => ctx.msg.author.bot,
    Command.empty,
    {
        name: 'is bot?',
        description: 'check author is bot',
    },
)
