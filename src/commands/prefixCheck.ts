import Context from '../class/Context'
import Command from '../class/Command'

export default new Command(
    Command.alwaysTrue,
    (context: Context) => {
        if (context.msg.content.startsWith(context.ex.bot.config.prefix)) {
            context.ex.content = context.msg.content.slice(
                context.ex.bot.config.prefix.length,
            )
            return context
        }
        return context.finish()
    },
    {
        name: 'prefix checker',
        description: 'check that the prefix is right',
    },
)
