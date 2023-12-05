require("dotenv").config()

const {REST, Routes} = require("discord.js")
const fs = require("fs");
const path = require("path");

const commands = []
const folder = path.join(__dirname, "commands")

for (const file of fs.readdirSync(folder)) {
    if (file.endsWith(".js")) {
        const command = require(path.join(folder, file))

        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON())
        } else {
            throw new Error(`Command file ${path.join(folder, file)} is missing a 'data' or 'execute' property.`)
        }
    }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`Deploying ${commands.length} slash commands`);

        if (process.argv[2] === true) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID),
                {body: commands},
            );
        } else {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                {body: commands},
            );
        }
	} catch (err) {
		throw new Error(err)
	}
})()