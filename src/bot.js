const { Client, Events, GatewayIntentBits } = require('discord.js');

const token = process.env['BOT_TOKEN']

if (token) {
    const client = new Client ({intents: [GatewayIntentBits.Guilds]});

    client.once(Events.ClientReady, botClient => {
        console.log(`Logged in as ${botClient.user.tag}`)
    })

    client.login(token)
} else {
    console.error('Missing BOT_TOKEN environment variable.')
}
