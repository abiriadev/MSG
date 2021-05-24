import Context from '../class/Context'
import Command from '../class/Command'

export default new Command(
    Command.alwaysTrue,
    (context: Context) => {
        if (context.msg.content.startsWith(<string>context.bot.config.prefix)) {
            context.ex.content = context.msg.content.slice(
                (context.bot.config.prefix as string).length,
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
