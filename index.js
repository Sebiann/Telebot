//Load the config from the .env file in (Usage: process.env.VALUE)
require('dotenv').config()
//set the api
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, {polling: true});

bot.start();