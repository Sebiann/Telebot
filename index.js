// Load the config from the .env file in (Usage: process.env.VALUE)
require('dotenv').config();
// Set the api
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const session = require('telegraf/session');

const bot = new Telegraf(process.env.TOKEN);

bot.use(session());

console.log("Started");

bot.catch((err) => {
    console.log('Ooops', err)
})

// On /start send msg
bot.start((ctx) => ctx.reply('Hello'));
// On /help send msg
bot.help((ctx) => ctx.reply('Help message'));

bot.hears(/hallo/i, (ctx) => ctx.reply("Jallo"));

bot.hears(/wie g.*ht/i, (ctx) => ctx.reply("Mir gahts guet und wie gahts dir?"));

// Calculator starts here:
let calculator_keys = Markup.inlineKeyboard([
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

bot.command('cal', (ctx) => {
    ctx.session.calcInputs = '';
    return ctx.reply(`Calculator:\nCalc:`, calculator_keys);
});

function editcalc (ctx, res) {
    if (res !== ""){
        ctx.editMessageText(`Calculator:\nCalc: ${ctx.session.calcInputs}=${res}`, calculator_keys);
    } else {
        ctx.editMessageText(`Calculator:\nCalc: ${ctx.session.calcInputs}`, calculator_keys);
    };
};

bot.action(/[0-9]-action/, (ctx) => {
    ctx.answerCbQuery(''); // answerCbQuery also removes that lil clock on buttons as it basically tells TG that it has recieved the action
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    ctx.session.calcInputs += ctx.match[0].replace('-action', '');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
bot.action(/plus-action/, (ctx) => {
    ctx.answerCbQuery('addition');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    ctx.session.calcInputs += ctx.match[0].replace('plus-action', '+');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
bot.action(/minus-action/, (ctx) => {
    ctx.answerCbQuery('subtraction');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    ctx.session.calcInputs += ctx.match[0].replace('minus-action', '-');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
bot.action(/times-action/, (ctx) => {
    ctx.answerCbQuery('multiplication');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    ctx.session.calcInputs += ctx.match[0].replace('times-action', '*');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
bot.action(/divide-action/, (ctx) => {
    ctx.answerCbQuery('division');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    ctx.session.calcInputs += ctx.match[0].replace('divide-action', '/');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
bot.action(/del-action/, (ctx) => {
    ctx.answerCbQuery('deleted');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    }; 
    ctx.session.calcInputs = ctx.session.calcInputs.substring(0, ctx.session.calcInputs.length - 1)
    editcalc(ctx, "");
});
bot.action(/equals-action/, (ctx) => {
    ctx.answerCbQuery('calculating');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    let res = "";
    try {
        res = eval(ctx.session.calcInputs);
    } catch (error) {
        console.error(error);
        res = "ERROR";
    };
    editcalc(ctx, res);
    ctx.session.calcInputs = '';
});
// Calculator stops here:

// Reminder starts here:
bot.command('rem', (ctx) => {
    ctx.session.reminder = []; // Its an Array
    return ctx.reply(`Reminders: `,
        Markup.inlineKeyboard([
            [
                Markup.callbackButton('New Reminder', 'new-action'),
                Markup.callbackButton('List Reminders', 'list-action'),
                Markup.callbackButton('Delete Reminder', 'del-action')
            ]
        ]).extra()
    );
});
bot.action(/new-action/, (ctx) => {
    ctx.answerCbQuery('New Reminder');
});
bot.action(/list-action/, (ctx) => {
    ctx.answerCbQuery('List Reminders');
});
bot.action(/del-action/, (ctx) => {
    ctx.answerCbQuery('Delete Reminders');
});
// Reminder stops here:

// If any message comes that isnt defined
bot.hears(/.*/, (ctx) => ctx.reply("HÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄH")); // make it a random chance of like 1/1000 to fire Hääää

// Bot start
bot.launch();