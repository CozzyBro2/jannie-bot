const {Events} = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName)
    
            if (!command) {
                console.error(`Command ${interaction.commandName} not found`)
                return
            }
    
            try {
                await interaction.deferReply({ephemeral: command.ephemeral || false})
                await command.execute(interaction)
            } catch (err) {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({content: "Error while executing command", ephemeral: true})
                } else {
                    await interaction.reply({content: "Error while executing command", ephemeral: true, fetchReply: true})
                }

                console.error(`Could not execute ${interaction.commandName} command: ${err}`)
            }
        }
    }
}