import discord from 'discord.js'
import chalk from 'chalk'
import msgToContext from '../utils/MsgToContext'
import Context from './Context'
import MiddlewareManager from './MiddlewareManager'
import MiddlewareChainRunner from './MiddlewareChainRunner'
import isBot from '../commands/isBot'
import prefixCheck from '../commands/prefixCheck'
import parseArgs from '../commands/parseArgs'
import Command from './Command'

type Config = Readonly<{
    [key: string]: string | number
}>

class Bot extends discord.Client {
    middlewareManager = new MiddlewareManager([isBot, prefixCheck, parseArgs])

    config: Config

    setConfig(config: Config): this {
        this.config = config
        return this
    }

    owner: discord.User | discord.Team | null = null

    constructor(options?: discord.ClientOptions, config?: Config) {
        super(options)

        this.config = config || {}
    }

    addCommand (...cmds: Array<Command>): this {
        this.middlewareManager.addCommand(...cmds)
        return this
    }

    login(token: discord.Snowflake): Promise<string> {
        this.on('ready', async () => {
            this.owner = (await this.fetchApplication()).owner
            this.emit('readyState', this)
        })
            .on('message', async (msg: discord.Message) => {
                if (process.argv.includes('--log')) {
                    console.log(
                        `\n${chalk.hex('#E38833')('New message received!')}: ${
                            msg.content
                        }`,
                    )
                }

                const context = msgToContext(msg)
                context.ex.bot = this

                const finalContext = await new MiddlewareChainRunner(
                    this.middlewareManager.array(),
                ).run(context)

                this.emit('final', finalContext)
            })
            .on('final', async (context: Context) => {
                console.log(context.header)
            })

        return super.login(token)
    }
}

export default Bot
