const { Client, Partials, Collection } = require("discord.js")
const ms = require("ms")
const { promisify } = require("util")
const { glob } = require("glob")
const express = require("express")
const app = express()
const PG = promisify(glob)
const Ascii = require("ascii-table")
require("dotenv").config()
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: { parse: ["everyone", "roles", "users"] },
    rest: { timeout: ms("1m") }
})

client.events = new Collection()
client.commands = new Collection()

require("./Systems/GiveawaySystem")(client)

const Handlers = ["Events", "Commands", "Errors"]
 // express
app.get('/', (req, res) => {
    res.send('GeantBot is online')
  })


app.listen(80)

Handlers.forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, Ascii)
})

module.exports = client

client.login(process.env.TOKEN)