const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "apply",
    /**
     * @param {client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const questions = [
            "Your Real Name?",
            "Your Age?",
            "Your Steam Profile Link",
            "Your TruckersMP Profile Link",
            "Why do you want to Join Primers Trucking? (30 words max)"
        ];

        let collectCounter = 0;
        let endCounter = 0;

        const filter = (m) => m.author.id === message.author.id;

        const appStart = await message.author.send(questions[collectCounter++]);
        const channel = appStart.channel;

        const collecter = channel.createMessageCollector(filter);

        collecter.on("collect", () => {
            if (collectCounter < questions.length) {
                channel.send(questions[collectCounter++]);
            } else {
                channel.send("Your Application has been sent to Staff Team!")
                collecter.stop("fulfilled");
            }
        });

        const appsChannel = client.channels.cache.get('861501587711983620');
        collecter.on('end', (collected, reason) => {
            if(reason === 'fulfilled') {
                let index = 1;
                const mappedResponses = collected.map((msg) => {
                    return `**${index++}) ${questions[endCounter++]}**\nAns- ${msg.content}`
                })
                .join("\n\n");

                appsChannel.send(
                    new MessageEmbed()
                    .setAuthor(message.author.tag)
                    .setTitle('New Application!')
                    .setDescription(mappedResponses)
                    .setColor('RED')
                    .setTimestamp()
                    .setFooter('Primers Trucking')
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                );
            }
        });
    },
};