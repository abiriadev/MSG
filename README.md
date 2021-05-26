<center>

<br>
<br>

# MSG

<br>

</center>

---

MSG is a framework for make discord bot easier

## installation

```sh
npm i msg.ts
```

## usage

```js
const MSG = require('msg.ts')

const prefix = '!'

const bot = new MSG.Bot()

bot.setConfig({
    prefix,
})

bot.on('readyState', bot => {
    console.log(`${bot.user.tag} is ready!`)
})

bot.indent('now', [
    MSG.subCall('day', ctx => {
        ctx.msg.reply(
            `current day is \`${new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
            }).format(new Date().getDay())}\``,
        )
        return ctx.finish()
    }),
    MSG.subCall('date', ctx => {
        ctx.msg.reply(`today is the \`${new Date().getDate()}th\``)
        return ctx.finish()
    }),
    MSG.subCall(true, ctx => {
        ctx.msg.reply(`now time is \`${new Date()}\``)
        return ctx.finish()
    }),
])

bot.addCommand(
    MSG.subCall(true, ctx => {
        const commandDoc = `now:
    usage: \`${prefix}now\`
    description: show current time
    subcommands:
        name: day
            usage: \`${prefix}now day \`
            description: show current day of week
        name: date
            usage: \`${prefix}now  date\`
            description: show current date
        <default>
            description: just show all data
            usage: \`${prefix}now\``

        ctx.msg.reply(`command list:\n\`\`\`yml\n${commandDoc}\n\`\`\``)
        return ctx.finish()
    }),
)
bot.login(process.env.DISCORD_TOKEN)
```