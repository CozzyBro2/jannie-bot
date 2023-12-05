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
    }
}