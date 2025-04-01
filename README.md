# About
Work-In-Progress discord bot written with [Discord.js](https://discord.js.org/).  

# Capabilities
## Slash commands:
- /mc        - Returns information about the specified Minecraft server (uses [mcsrvstat](https://api.mcsrvstat.us/))
- /ping      - Returns latency stats
- /ai        - Generate an AI response without mentioning the bot, optionally without a prompt for use of bare Gemini
- /manage_ai - Change the AI prompt during runtime, dump conversation history, wipe conversation history
- /whatis    - Returns the definition of a specified word (uses [Urban Dictionary](https://rapidapi.com/community/api/urban-dictionary))  
## AI
Will respond to you like an AI chat-bot if you mention the bot user, or with the `/ai` command.

# Setup packages
First, ensure you have all the production dependencies:  
(I use pnpm, you could substitute it for npm)  
```
pnpm install --production
```
You may encounter errors with installing the optional dependencies. This is okay. They are not required, just used to improve performance.  
Learn more about these dependencies [here](https://discord.js.org/docs/packages/discord.js/main).

# Configure

Create a file called `.env` in the project directory.
Here is the outline of the file. Replace any <> fields with their respective values.
```
TOKEN=<bot_token>
CLIENT_ID=<bot_client_id>
GUILD_ID=<dev_guild_id> # OPTIONAL: When not deploying commands globally, deploys commands to this guild for development purposes.
RAPIDAPI_KEY=<key> # Needed to use the /whatis command. Get a key here: https://rapidapi.com/community/api/urban-dictionary
GOOGLEAI_KEY=<key> # Needed to use AI functionality. Get a key here: https://ai.google.dev/tutorials/setup
GOOGLEAI_PROMPT=<prompt> # Tells the AI what to do and how to act. Example: "You are a fish. You speak only like a fish, you speak no other way."
AI_HUMANS_ONLY=<trueorfalse> # Whether the AI responds when other bots/apps mention it
```

# Deploy slash commands
You will need to deploy slash commands for them to be available for use:
```
pnpm run deploy-commands true
```
This deploys the commands globally; to every server the bot has joined.
If you wish to deploy to a specified server (`GUILD_ID` in `.env`), for say, development purposes, run:
```
pnpm run deploy-commands false
```

# Running
To run the bot, run:
```
node .
```
You can also run it with [Bun](https://bun.sh/). 
Most everything should work with Bun. If it doesn't, you can seamlessly revert to pnpm/node.


~~As of Bun 1.1.5, everything works except for TextDecoderStream used in the Generative AI Package and the Brotli implementation used in Axios.
Currently, i've implemented a workaround or Axios at run-time. To make `TextDecoderStream` in Google's package work, see this [issue](https://github.com/oven-sh/bun/issues/5648#issuecomment-1824093837).~~


Tip: If you plan to deploy this bot in production and are using Bun, try [building](https://bun.sh/docs/bundler/executables) a standalone executable:

`bun build ./index.js --compile --minify --sourcemap --target=bun-windows-x64 --outfile jannie-bot.exe`