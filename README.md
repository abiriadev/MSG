<div align="center">
  <br />
  <p>
    <a href="https://github.com/abiriadev/MSG"><img src="https://github.com/abiriadev/MSG/blob/master/assets/msg_logo/MSG.png" width="546" alt="MSG" /></a>
  </p>
  <br />
  <p>

[![Discord](https://img.shields.io/discord/687271752224735233?color=%235865f2&label=discord&logo=discord)](https://discord.com/invite/coding-lab)
[![npm](https://img.shields.io/npm/v/msg.ts?color=%23E63A11&logo=npm)][2]
[![Build Status](https://travis-ci.com/abiriadev/MSG.svg?branch=master)](https://travis-ci.com/abiriadev/MSG)
[![npm](https://img.shields.io/npm/dt/msg.ts?color=%23db5d51)][2]
[![NPM](https://img.shields.io/npm/l/msg.ts?color=%238b51db)](https://opensource.org/licenses/MIT)

  </p>

---

  <p>
    MSG is a powerful, adaptable and complementary framework for building discord bot applications
  </p>
</div>

## Table of contents

-   [About](#about)
-   [Installation](#installation)
-   [Usage](#Usage)
-   [Other packages](#Other-packages)
-   [Contributing](#contributing)
-   [Links](#links)

## About

MSG is a discord bot framework that made for complement [discord.js](https://github.com/discordjs/discord.js) library.

it runs on discord.js base, but it can do a lot of things to easy, than discord.js does.

so, MSG can provide legacy workload that base on discord.js library.

also, MSG can help you more with repetitive and meaningless tasks such as separation and controlling commands.

## Installation

**Node.js 16.0.0 or newer is required.**

```sh
npm i msg.ts
```

alternatively, you can use yarn.

```sh
yarn add msg.ts
```

## Usage

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
        ctx.reply(
            `current day is \`${new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
            }).format(new Date().getDay())}\``,
        )
        return ctx.finish()
    }),
    MSG.subCall('date', ctx => {
        ctx.reply(`today is the \`${new Date().getDate()}th\``)
        return ctx.finish()
    }),
    MSG.subCall(true, ctx => {
        ctx.reply(`now time is \`${new Date()}\``)
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

        ctx.reply(`command list:\n\`\`\`yml\n${commandDoc}\n\`\`\``)
        return ctx.finish()
    }),
)

bot.login(process.env.DISCORD_TOKEN)
```

## Other packages

[generator-msg](https://github.com/abiriadev/generator-msg) scaffolding for MSG framework (`npm i -g yo generator-msg ; yo msg`)

## Contributing

are you want to contribute?

thanks so much!

please read our [contributing guide](./CONTRIBUTING.md) before start contribute

## links

- [repository][1]
- [npm page][2]
- [yarn page](https://yarnpkg.com/package/msg.ts)
- [generator-msg](https://github.com/abiriadev/generator-msg)

[1]: https://github.com/abiriadev/MSG
[2]: https://www.npmjs.com/package/msg.ts
