const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const {request} = require("undici")

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("whatis")
        .setDescription("Returns the definition of a specified word")
        .addStringOption(option => option
            .setName("word")
            .setDescription("The word to query")
            .setRequired(true))
        .setDMPermission(false),
    async execute(interaction) {
        const word = interaction.options.getString("word")
        const query = new URLSearchParams({word})

        const embed = new EmbedBuilder()
        embed.setColor(0x0099FF)
        embed.setTitle(`No definition found for **${word}**.`)

        const dictionary = await request(`https://api.urbandictionary.com/v0/define?term=${query}`)
        const {list} = await dictionary.body.json()

        if (list.length) {
            const [answer] = list;

            embed.setTitle(answer.word)
            embed.addFields(
                {name: "Definition", value: trim(answer.definition, 1024)},
            )
        }

        await interaction.editReply({embeds: [embed]})
    }
}