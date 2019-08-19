// Load the config from the .env file in (Usage: process.env.VALUE)
require('dotenv').config();
// Set the api
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const session = require('telegraf/session');

const bot = new Telegraf(process.env.TOKEN);

bot.use(session());

console.log("Started");

bot.catch((err) => {
    console.log('Ooops', err);
});

// On /start send msg
bot.start((ctx) => ctx.reply('Hello'));
// On /help send msg
bot.help((ctx) => ctx.reply('Help message'));

bot.hears(/hallo/i, (ctx) => ctx.reply("Jallo"));

bot.hears(/wie g.*ht/i, (ctx) => ctx.reply("Mir gahts guet und wie gahts dir?"));

// Debugger start
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

// Calculator starts here:
let calculator_keys = Markup.inlineKeyboard([
    [
        Markup.callbackButton('1', '1-calc-action'),
        Markup.callbackButton('2', '2-calc-action'),
        Markup.callbackButton('3', '3-calc-action'),
        Markup.callbackButton('+', 'plus-calc-action')
    ],
    [
        Markup.callbackButton('4', '4-calc-action'),
        Markup.callbackButton('5', '5-calc-action'),
        Markup.callbackButton('6', '6-calc-action'),
        Markup.callbackButton('-', 'minus-calc-action')
    ],
    [
        Markup.callbackButton('7', '7-calc-action'),
        Markup.callbackButton('8', '8-calc-action'),
        Markup.callbackButton('9', '9-calc-action'),
        Markup.callbackButton('*', 'times-calc-action')
    ],
    [
        Markup.callbackButton('💣', 'del-calc-action'),
        Markup.callbackButton('0', '0-calc-action'),
        Markup.callbackButton('=', 'equals-calc-action'),
        Markup.callbackButton('/', 'divide-calc-action')
    ]
]).extra();

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

bot.action(/[0-9]-calc-action/, (ctx) => {
    ctx.answerCbQuery(''); // answerCbQuery also removes that lil clock on buttons as it basically tells TG that it has recieved the action
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    ctx.session.calcInputs += ctx.match[0].replace('-calc-action', '');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
bot.action(/plus-calc-action/, (ctx) => {
    ctx.answerCbQuery('addition');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    ctx.session.calcInputs += ctx.match[0].replace('plus-calc-action', '+');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
bot.action(/minus-calc-action/, (ctx) => {
    ctx.answerCbQuery('subtraction');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    ctx.session.calcInputs += ctx.match[0].replace('minus-calc-action', '-');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
bot.action(/times-calc-action/, (ctx) => {
    ctx.answerCbQuery('multiplication');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    ctx.session.calcInputs += ctx.match[0].replace('times-calc-action', '*');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
bot.action(/divide-calc-action/, (ctx) => {
    ctx.answerCbQuery('division');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    ctx.session.calcInputs += ctx.match[0].replace('divide-calc-action', '/');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
bot.action(/del-calc-action/, async (ctx) => { // https://javascript.info/async-await
    ctx.answerCbQuery('deleted');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    ctx.session.calcInputs = ctx.session.calcInputs.substring(0, ctx.session.calcInputs.length - 1);
    ctx.session.calcInputs += "💣";
    editcalc(ctx, "");
    await setTimeoutPromise(3000); // https://javascript.info/async-await
    // ctx.session.calcInputs.replace("💣", "💥");
    ctx.session.calcInputs = ctx.session.calcInputs.substring(0, ctx.session.calcInputs.length - 2);
    ctx.session.calcInputs += "💥";
    editcalc(ctx, "");
    await setTimeoutPromise(3000);
    ctx.session.calcInputs = ctx.session.calcInputs.substring(0, ctx.session.calcInputs.length - 2);
    editcalc(ctx, "");
});
bot.action(/equals-calc-action/, (ctx) => {
    ctx.answerCbQuery('calculating');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    };
    let res = "";
    try {
        res = eval(ctx.session.calcInputs);
    } catch (error) {
        /* This doesnt work yet
        if (ctx.session.debug_onoff == 1) {
            ctx.reply(error);
        }; */
        console.error(error);
        res = "ERROR";
    };
    editcalc(ctx, res);
    ctx.session.calcInputs = '';
});
// Calculator stops here:

// Reminder starts here:
let rem_start_key = Markup.inlineKeyboard([
    [
        Markup.callbackButton('New Reminder', 'new-rem-action'),
        Markup.callbackButton('List Reminders', 'list-rem-action'),
        Markup.callbackButton('Delete Reminder', 'del-rem-action')
    ]
]).extra();
let rem_new_name_key = Markup.inlineKeyboard([ // Actually dont need this, i think
    [
        Markup.callbackButton('Ex', 'ex')
    ]
]).extra();
let rem_new_date__key = Markup.inlineKeyboard([
    [
        Markup.callbackButton('1', 'first'),
        Markup.callbackButton('2', 'second'),
        Markup.callbackButton('3', 'third'),
        Markup.callbackButton('4', 'fourth'),
        Markup.callbackButton('5', 'fifth')
    ]
]).extra();

bot.command('rem', (ctx) => {
    ctx.session.reminder = []; // Its an Array
    return ctx.reply(`Reminders: `, rem_start_key);
});

bot.action(/new-rem-action/, (ctx) => {
    ctx.answerCbQuery('New Reminder');
});
bot.action(/list-rem-action/, (ctx) => {
    ctx.answerCbQuery('List Reminders');
});
bot.action(/del-rem-action/, (ctx) => {
    ctx.answerCbQuery('Delete Reminders');
});
// Reminder stops here:

// If any message comes that isnt defined, theres a chance of 1 in 9 that it will send
bot.hears(/.*/, (ctx) => {
    if (Math.floor(Math.random() * 9) == 1) {
        ctx.reply("HÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄH")
    }
});

// Bot start
bot.launch();
