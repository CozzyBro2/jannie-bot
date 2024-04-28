# About
Work-In-Progress discord bot written with [Discord.js](https://discord.js.org/).  

# Capabilities
## Slash commands:
- /mc     - Returns information about the specified Minecraft server (uses [mcsrvstat](https://api.mcsrvstat.us/))
- /ping   - Returns latency stats
- /ai     - Control the AI (W.I.P)
- /whatis - Returns the definition of a specified word (uses [Urban Dictionary](https://rapidapi.com/community/api/urban-dictionary))  
## AI
Will respond to you like an AI chat-bot if you mention the bot user.

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
AI_NAME=<name> # The name in which the AI is addressed by when you mention it
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