require("dotenv").config()

const fs = require("fs")
const path = require("path")
const {Client, Collection, GatewayIntentBits} = require("discord.js")

const client = new Client({intents: [GatewayIntentBits.Guilds]})
client.commands = new Collection()

const commandFolder = path.join(__dirname, "commands")
const eventFolder = path.join(__dirname, "events")

for (const file of fs.readdirSync(commandFolder)) {
    if (file.endsWith(".js")) {
        const command = require(path.join(commandFolder, file))

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command)
        } else {
            throw new Error(`Command file ${path.join(commandFolder, file)} is missing a 'data' or 'execute' property.`)
        }
    }
}

for (const file of fs.readdirSync(eventFolder)) {
    if (file.endsWith(".js")) {
        const event = require(path.join(eventFolder, file))

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

client.on("ready", bot => {
    console.log(`Logged in as ${bot.user.tag}`)
    client.user.setPresence({activities: [{name: "with your noor", type: 0}], status: "online"})
})

client.login(process.env.TOKEN)