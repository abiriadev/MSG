import discord from 'discord.js'
import Context from '../class/Context'

export default (msg: discord.Message): Context => new Context(msg)
