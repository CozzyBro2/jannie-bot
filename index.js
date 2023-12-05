require("dotenv").config()

const fs = require("fs")
const path = require("path")
const {Client, Collection, Events, GatewayIntentBits} = require("discord.js")

const client = new Client({intents: [GatewayIntentBits.Guilds]})
client.commands = new Collection()

const folder = path.join(__dirname, "commands")

for (const file of fs.readdirSync(folder)) {
    if (file.endsWith(".js")) {
        const command = require(path.join(folder, file))

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command)
        } else {
            throw new Error(`Command file ${path.join(folder, file)} is missing a 'data' or 'execute' property.`)
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName)

        if (!command) {
            console.error(`Command ${interaction.commandName} not found`)
            return
        }

        try {
            await command.execute(interaction)
        } catch (err) {
            console.error(err)

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({content: "Error while executing command", ephemeral: true})
            } else {
                await interaction.reply({content: "Error while executing command", ephemeral: true})
            }
        }
    }
})

client.once(Events.ClientReady, bot => {
    console.log(`Logged in as ${bot.user.tag}`)
})

client.login(process.env.TOKEN)