// Load the config from the .env file in (Usage: process.env.VALUE)
require('dotenv').config();
// Set the api
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const session = require('telegraf/session')

const bot = new Telegraf(process.env.TOKEN);

bot.use(session());

// On /start send msg
bot.start((ctx) => ctx.reply('Hello'));
// On /help send msg
bot.help((ctx) => ctx.reply('Help message'));

bot.command('cal', (ctx) => {
    ctx.session.calcInputs = ''
    return ctx.reply('Calculator: ', 
        Markup.inlineKeyboard([
            [
                Markup.callbackButton('1', '1-action'),
                Markup.callbackButton('2', '2-action'),
                Markup.callbackButton('3', '3-action'),
                Markup.callbackButton('+', 'plus-action')
            ],
            [
                Markup.callbackButton('4', '4-action'),
                Markup.callbackButton('5', '5-action'),
                Markup.callbackButton('6', '6-action'),
                Markup.callbackButton('-', 'minus-action')
            ],
            [
                Markup.callbackButton('7', '7-action'),
                Markup.callbackButton('8', '8-action'),
                Markup.callbackButton('9', '9-action'),
                Markup.callbackButton('*', 'times-action')
            ],
            [
                Markup.callbackButton('💣', 'del-action'),
                Markup.callbackButton('0', '0-action'),
                Markup.callbackButton('=', 'equals-action'),
                Markup.callbackButton('/', 'divide-action')
            ]
        ]).extra()
    );
});

bot.action(/[0-9]-action/, (ctx) => {
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = ''
    };
    ctx.session.calcInputs += ctx.match[0].replace('-action', '');
    console.log('In: ', ctx.session.calcInputs);
    ctx.answerCbQuery('Ur stoopid');
})

// Bot start
bot.launch();