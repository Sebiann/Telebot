// Load the config from the .env file in (Usage: process.env.VALUE)
require('dotenv').config();
// Set the api
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage')

const { newRemScene } = require('./scenes/newRem.js');
const { CalcScene } = require('./scenes/Calculator.js');

const bot = new Telegraf(process.env.TOKEN);

const stage = new Stage([newRemScene, CalcScene]);
bot.use(session());
bot.use(stage.middleware());

console.log("Started");

bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

// On /start send msg
bot.start((ctx) => ctx.reply('Hello'));
// On /help send msg
bot.help((ctx) => ctx.reply('Help message'));

bot.command('cal', (ctx) => {
    ctx.scene.enter('Calc')
});

bot.command('newRem', (ctx) => {
    ctx.scene.enter('newRem')
});

// Bot start
bot.launch();

/* Debugger start
bot.command('debug', (ctx) => {
    ctx.session.debug_onoff = '';
    return ctx.reply(`Debugger`,
        Markup.inlineKeyboard([
            [
                Markup.callbackButton('Debug Start', 'start-debug-action'),
                Markup.callbackButton('Debug Stop', 'stop-debug-action')
            ]
        ]).extra()
    );
});
bot.action(/start-debug-action/, (ctx) => {
    ctx.answerCbQuery('Debugger On');
    ctx.session.debug_onoff = 1;
    console.log(ctx.session.debug_onoff);
});
bot.action(/stop-debug-action/, (ctx) => {
    ctx.answerCbQuery('Debugger Off');
    ctx.session.debug_onoff = 0;
    console.log(ctx.session.debug_onoff);
});
// Debugger stop
*/