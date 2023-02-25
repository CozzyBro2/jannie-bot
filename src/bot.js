const { Client, Events, GatewayIntentBits } = require('discord.js');

const token = process.env['BOT_TOKEN']

if (!token) {
    console.error('Missing BOT_TOKEN environment variable.')
    return
}

const client = new Client ({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
});

client.once(Events.ClientReady, botClient => {
    console.log(`Logged in as ${botClient.user.tag}`)
})

client.on(Events.MessageCreate, message => {
    console.log(message.content)
})

client.login(token)