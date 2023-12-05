require("dotenv").config()

const {REST, Routes} = require("discord.js")
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
        if (process.argv[2] === true) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID),
                {body: []},
            );
        } else {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                {body: []},
            );
        }
	} catch (err) {
		throw new Error(err)
	}
})()