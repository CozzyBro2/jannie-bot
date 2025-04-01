const {SlashCommandBuilder, EmbedBuilder} = require("discord.js")
const {request} = require("axios")

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
    defer: true,
    data: new SlashCommandBuilder()
        .setName("whatis")
        .setDescription("Returns the definition of a specified word")
        .addStringOption(option => option
            .setName("word")
            .setDescription("The word to query")
            .setMaxLength(50)
            .setRequired(true)),
    async execute(interaction) {
        const word = interaction.options.getString("word")

        const embed = new EmbedBuilder()
        embed.setColor("#ffbb00")
        embed.setTitle(`No definition found for **${word}**.`)

        const options = {
            method: "GET",
            url: "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
            params: {term: word},
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "mashape-community-urban-dictionary.p.rapidapi.com"
            }
        }
        const dictionary = await request(options)
        const {list} = await dictionary.data

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