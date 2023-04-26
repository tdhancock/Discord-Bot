require('dotenv').config()
const LoremIpsum = require('lorem-ipsum').LoremIpsum
const fetch = require('node-fetch')
const axios = require('axios')
const nodemailer = require('nodemailer')
var twilio = require('twilio')
const fs = require('fs')

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
})

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Our bot is ready to go`)
})

client.on('message', async (msg) => {
    if (msg.content == '!ping') {
        msg.reply('Pong!')
    }

    if (msg.content == '!help') {
        const file = fs.readFileSync('help.txt', 'utf8')
        msg.reply(file)
    }

    if (msg.content == '!lorem') {
        msg.reply(lorem.generateSentences(4))
    }

    if (msg.content == '!dadjoke') {
        const response = await fetch('http://icanhazdadjoke.com', {
            headers: {
                Accept: 'application/json'
            }
        })
        const joke = await response.json()
        msg.reply(joke.joke)
    }

    if (msg.content == '!chuck') {
        const response = await fetch('https://api.chucknorris.io/jokes/random')
        const joke = await response.json()
        msg.reply(joke.value)
    }

    if (msg.content == '!die') {
        await msg.reply('Shutting down.....')
        process.exit(0)
    }

    if (msg.content == '!weather') {
        const params = {
            access_key: process.env.WEATHER_ACCESS_KEY,
            query: 'Orem'
        }
        let response = await axios.get('http://api.weatherstack.com/current', {
            params
        })
        //let weather = await response.json()
        let weather = response.data
        msg.reply(
            `Currenly in ${weather.location.name} it is ${weather.current.weather_descriptions[0]} and ${weather.current.temperature} degrees celcius`
        )
    }

    if (msg.content == '!nba') {
        let data = await fetch(
            'https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json'
        )
        data = await data.json()
        let respString = 'Games today:\n'
        for (let item of data.scoreboard.games) {
            respString +=
                '\n' +
                item.awayTeam.teamName +
                ' @ ' +
                item.homeTeam.teamName +
                '\n'
        }
        msg.reply(respString)
    }

    if (msg.content == '!email') {
        let testAccount = await nodemailer.createTestAccount()

        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass // generated ethereal password
            }
        })

        const info = await transporter.sendMail({
            from: `Ethereal User ${testAccount.user}`,
            to: 'tdhancock10@gmail.com',
            subject: 'Test Nodemailer',
            text: 'This is a test from the discord bot',
            html: '<b>Hello world?</b>'
        })

        msg.reply(
            '\nMessage Sent!\nPreview URL: ' +
                nodemailer.getTestMessageUrl(info)
        )
    }

    if (msg.content == '!text') {
        var sender = new twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        )

        sender.messages.create({
            to: '+13853280334',
            from: '+18775444160',
            body: 'Hello from Twilio!'
        })

        msg.reply(
            `Text sent from +18775444160 to +13853280334 with the message "Hello from Twilio!"`
        )
    }

    if (msg.content == '!virus') {
        let response = await fetch(
            `https://api.covidactnow.org/v2/county/49049.json?apiKey=${process.env.COVID_API_KEY}`,
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        )
        let data = await response.json()
        msg.reply(
            `\n${data.county} has ${data.actuals.newCases} new cases of Covid. ${data.county} has ${data.actuals.icuBeds.capacity} ICU beds, ${data.actuals.icuBeds.currentUsageTotal} of which are being used. This week, ${data.actuals.hospitalBeds.weeklyCovidAdmissions} people have hospitalized for covid.`
        )
    }
})

client.login(process.env.BOT_TOKEN).catch((e) => console.log(e))
