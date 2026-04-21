const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

//blacklist
const forbiddenRegex = / /i;

const sources = [ //add your random apis here


];


client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '/rfact') {
        let attempts = 0;
        const maxAttempts = 5; 
        let success = false;

        while (attempts < maxAttempts && !success) {
            attempts++;
            const source = sources[Math.floor(Math.random() * sources.length)];

            try {
                const response = await axios.get(source.url, { timeout: 8000 });
                const result = source.path(response.data);

                // blacklist check
                const textToCheck = typeof result === 'object' ? result.text : result;

                // nfsw check
                if (forbiddenRegex.test(textToCheck)) {
                    console.log(`Filtered brainrot/nsfw from ${source.name}`);
                    continue; 
                }

                if (typeof result === 'object' && result.image) {
                    await message.reply({
                        content: `**Source: ${source.name}**\n${result.text}`,
                        files: [result.image] 
                    });
                } else {
                    await message.reply(`**Source: ${source.name}**\n> ${result}`);
                }
                
                success = true; 
            } catch (error) {
                console.error(`Attempt ${attempts} failed (${source.name}):`, error.message);
                
            }
        }

        if (!success) {
            await message.reply("no fact for you lolz");
        }
    }
});

client.login(''); //add bot token here
