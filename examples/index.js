const discord = require('discord.js')
const chalk = require('chalk')
const MSG = require('../dist')

const bot = new MSG.Bot()

bot.setConfig({
    prefix: '!',
})

bot.on('readyState', client => {
    console.log(chalk.yellow('[ready]'))
    console.log(`client.user.tag: ${client.user.tag}`)
    console.log(`client.host.tag: ${client.owner.tag}`)

    if (client.owner instanceof discord.User)
        client.owner.send("I'm here, master!")
})

const bookmarkCache = {}

bot.middlewareManager.addCommand(
    new MSG.Command(
        ctx => ctx.header.currentCommand === 'bookmark',
        async ctx => {
            const res = await new MSG.MiddlewareChainRunner([
                new MSG.Command(
                    ctx => ctx.header.currentCommand === 'add',
                    ctx => {
                        const bookmarkName = ctx.ex?.currentArgs?.[0]
                        const bookmarkData = ctx.ex?.currentArgs?.[1]

                        if (!bookmarkName)
                            ctx.msg.reply('please input bookmark name!')
                        else if (bookmarkName in bookmarkCache)
                            ctx.msg.reply(
                                `bookmark with name \`${bookmarkName}\` is already exist`,
                            )
                        else if (!bookmarkData)
                            ctx.msg.reply(
                                'please input bookmark data that will saved!',
                            )
                        else {
                            bookmarkCache[bookmarkName] = bookmarkData

                            ctx.msg.reply(
                                `saved \`${bookmarkData}\` with name \`${bookmarkName}\` !`,
                            )
                        }
                        return ctx.finish()
                    },
                    {
                        name: 'add bookmark',
                        description: 'add a bookmark in cache',
                    },
                ),
                new MSG.Command(
                    ctx => ctx.header.currentCommand === 'delete',
                    ctx => {
                        const bookmarkName = ctx.ex?.currentArgs?.[0]

                        if (!bookmarkName)
                            ctx.msg.reply(
                                'please input the bookmark you want to delete',
                            )
                        else if (!(bookmarkName in bookmarkCache))
                            ctx.msg.reply(
                                `can't find the bookmark named \`${bookmarkName}\`!`,
                            )
                        else {
                            delete bookmarkCache[bookmarkName]
                            ctx.msg.reply(`\`${bookmarkName}\` now deleted!`)
                        }

                        return ctx.finish()
                    },
                    {
                        name: 'delete bookmark',
                    },
                ),
                new MSG.Command(
                    ctx => ctx.header.currentCommand === 'update',
                    ctx => {
                        const bookmarkName = ctx.ex?.currentArgs?.[0]
                        const bookmarkData = ctx.ex?.currentArgs?.[1]

                        if (!bookmarkName)
                            ctx.msg.reply(
                                'please input the bookmark name that will be modified!',
                            )
                        else if (!(bookmarkName in bookmarkCache))
                            ctx.msg.reply(
                                `there is no bookmark with the name \`${bookmarkName}\`!`,
                            )
                        else if (!bookmarkData)
                            ctx.msg.reply(
                                'please input the bookmark data that will be modified!',
                            )
                        else {
                            bookmarkCache[bookmarkName] = bookmarkData

                            ctx.msg.reply(
                                `bookmark data changed from \`${bookmarkName}\` into \`${bookmarkData}\`!`,
                            )
                        }

                        return ctx.finish()
                    },
                    {
                        name: 'update bookmark',
                    },
                ),
                new MSG.Command(
                    ctx => ctx.header.currentCommand === 'list',
                    ctx => {
                        if (Object.keys(bookmarkCache).length === 0) {
                            ctx.msg.reply('no bookmarks have been saved yet!')
                            ctx.msg.channel.send(
                                'save new bookmark using `!bookmark add <name> <value>`!',
                            )

                            return ctx.finish()
                        }

                        ctx.msg.channel.send(
                            (() => {
                                const resStr = []
                                let i = 0
                                for (const bookmarkName in bookmarkCache) {
                                    i += 1
                                    resStr.push(
                                        `[${i}] ${bookmarkName} = ${bookmarkCache[bookmarkName]}`,
                                    )
                                }
                                return `\`\`\`toml\n${resStr.join(
                                    '\n',
                                )}\n\`\`\``
                            })(),
                        )
                        return ctx.finish()
                    },
                    {
                        name: 'show list of bookmarks',
                    },
                ),
                new MSG.Command(
                    MSG.Command.alwaysTrue,
                    ctx => {
                        const commandUsage = [
                            {
                                usage: `add <name> <value>`,
                                doWhat: 'saves new bookmark',
                            },

                            {
                                usage: `delete <name>`,
                                doWhat: 'deletes exist bookmark',
                            },

                            {
                                usage: `update <name> <value>`,
                                doWhat: 'updates exist bookmark',
                            },

                            {
                                usage: `list`,
                                doWhat: 'shows list of saved bookmarks',
                            },
                        ]

                        ctx.msg.channel.send(
                            commandUsage
                                .map(
                                    ({ usage, doWhat }) =>
                                        `\`${'!bookmark'} ${usage}\`: ${doWhat}`,
                                )
                                .join('\n'),
                        )
                        return ctx
                    },
                    {
                        name: 'bookmark command default',
                    },
                ),
            ]).run(ctx)

            return res
        },
        {
            name: 'bookmark',
        },
    ),
)

if (!process.env.TOKEN) {
    console.log('token is undefined')
    process.exit(3)
}

bot.login(process.env.TOKEN)
