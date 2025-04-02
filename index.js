require("dotenv").config()

const {readdirSync} = require("fs")
const {join} = require("path")
const {Client, Collection, GatewayIntentBits, ActivityType} = require("discord.js")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
})

client.guildCache = new Collection()
client.commands = new Collection()

const commandFolder = join(__dirname, "src", "commands")
const eventFolder = join(__dirname, "src", "events")

for (const file of readdirSync(commandFolder)) {
    if (file.endsWith(".js")) {
        const command = require(join(commandFolder, file))

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command)
        } else {
            throw new Error(`Command file ${join(commandFolder, file)} is missing a 'data' or 'execute' property.`)
        }
    }
}

for (const file of readdirSync(eventFolder)) {
    if (file.endsWith(".js")) {
        const event = require(join(eventFolder, file))

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

client.on("ready", bot => {
    console.log(`Logged in as ${bot.user.tag}`)
    client.user.setPresence({activities: [{name: "Fortnite", type: ActivityType.Competing}], status: "online"})
})

client.login(process.env.TOKEN)