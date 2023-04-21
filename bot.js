require("dotenv").config()

const Discord = require("discord.js")
const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Our bot is ready to go`)
})
  
client.on('message', (msg) => {
    console.log(msg.content)
if (msg.content == '!ping') {
    msg.reply('Pong!');
}
});
  
client.login(process.env.BOT_TOKEN)