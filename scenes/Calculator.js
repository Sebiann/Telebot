const Markup = require('telegraf/markup')
const Scene = require('telegraf/scenes/base')
const Stage = require('telegraf/stage')
const { leave } = Stage

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

const CalcScene = new Scene('Calc')
CalcScene.enter((ctx) => {
    ctx.session.calcInputs = '';
    ctx.reply(`Calculator:\nCalc:`, calculator_keys);
});

function editcalc (ctx, res) {
    if (res !== ""){
        ctx.editMessageText(`Calculator:\nCalc: ${ctx.session.calcInputs}=${res}`, calculator_keys);
    } else {
        ctx.editMessageText(`Calculator:\nCalc: ${ctx.session.calcInputs}`, calculator_keys);
    }
}

CalcScene.action(/[0-9]-calc-action/, (ctx) => {
    ctx.answerCbQuery(''); // answerCbQuery also removes that lil clock on buttons as it basically tells TG that it has recieved the action
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    }
    ctx.session.calcInputs += ctx.match[0].replace('-calc-action', '');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
CalcScene.action(/plus-calc-action/, (ctx) => {
    ctx.answerCbQuery('addition');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    }
    ctx.session.calcInputs += ctx.match[0].replace('plus-calc-action', '+');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
CalcScene.action(/minus-calc-action/, (ctx) => {
    ctx.answerCbQuery('subtraction');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    }
    ctx.session.calcInputs += ctx.match[0].replace('minus-calc-action', '-');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
CalcScene.action(/times-calc-action/, (ctx) => {
    ctx.answerCbQuery('multiplication');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    }
    ctx.session.calcInputs += ctx.match[0].replace('times-calc-action', '*');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
CalcScene.action(/divide-calc-action/, (ctx) => {
    ctx.answerCbQuery('division');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    }
    ctx.session.calcInputs += ctx.match[0].replace('divide-calc-action', '/');
    console.log('In: ', ctx.session.calcInputs);
    editcalc(ctx, "");
});
CalcScene.action(/del-calc-action/, (ctx) => {
    ctx.answerCbQuery('deleted');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    }
    ctx.session.calcInputs = ctx.session.calcInputs.substring(0, ctx.session.calcInputs.length - 1)
    editcalc(ctx, "");
});
CalcScene.action(/equals-calc-action/, (ctx) => {
    ctx.answerCbQuery('calculating');
    if (!ctx.session.calcInputs) {
        ctx.session.calcInputs = '';
    }
    let res = "";
    try {
        res = eval(ctx.session.calcInputs);
    } catch (error) {
        /* This doenst work yet
        if (ctx.session.debug_onoff == 1) {
            ctx.reply(error);
        }; */
        console.error(error);
        res = "ERROR";
    }
    editcalc(ctx, res);
    ctx.session.calcInputs = '';
});

CalcScene.command('cancel', leave())

exports.CalcScene = CalcScene