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
(I use pnpm, you could substitute it for npm or bun)
```
pnpm install --production
```
You may encounter errors with installing the optional dependencies. This is okay. They are not required, just used to improve performance.  
Learn more about these dependencies [here](https://discord.js.org/docs/packages/discord.js/main).

# Configure

Create a file called `.env` in the project directory.
Here is the outline of the file. Replace any <> fields with their respective values.
```
TOKEN=<bot_token> # Needed for basic bot function
CLIENT_ID=<bot_client_id> # Needed to deploy commands
GUILD_ID=<dev_guild_id> # OPTIONAL: When not deploying commands globally, deploys commands to this specific guild.
RAPIDAPI_KEY=<key> # Needed to use the /whatis command. Get a key here: https://rapidapi.com/community/api/urban-dictionary
AI_KEY=<key> # Needed to use AI functionality. Get a key here: https://ai.google.dev/tutorials/setup
AI_PROMPT=<prompt> # OPTIONAL: Tells the AI what to do and how to act. Example: "You are a fish. You speak only like a fish, you speak no other way."
AI_HUMANS_ONLY=<boolean> # OPTIONAL: If set to true, only discord members can use the AI chat feature.
AI_MEMORY_DISABLED=<boolean> # OPTIONAL: Prevents the AI from keeping a short memory of what users have said to it
AI_SELF_MEMORY_DISABLED=<boolean> # OPTIONAL: Prevents the AI from keeping a short memory of what it has said to users
AI_MEMORIZE_MEMBERS=<boolean> # OPTIONAL: Whether the AI memory includes information about the top 25 members per server (nickname, username)
AI_ANNOY_SERVERS=<boolean> # OPTIONAL: Whether the bot will randomly generate a message in the #general of each server daily
AI_ANNOY_PROMPT=<string> # OPTIONAL: The prompt that will be used for the annoy messsage
AI_MODEL=<string> # OPTIONAL: The Gemini model which will be used for AI features. View available models here: https://ai.google.dev/gemini-api/docs/models
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