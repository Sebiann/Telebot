/* eslint-disable no-case-declarations */
const storage = require('../lib/storage.js')
// const star = require('../lib/star.js')

const Markup = require('telegraf/markup')
const Scene = require('telegraf/scenes/base')
const Stage = require('telegraf/stage')
const { leave } = Stage

const newRemScene = new Scene('newRem')

newRemScene.enter((ctx) => {
  ctx.replyWithMarkdown('*Creating a new Reminder*\n\nEnter a title: ')

  ctx.session.nextEntry = 'title'
  ctx.session.newRem = {
    'title': '',
    'date': 0,
    'recurring': ''
  }
})

let Recurrancekey = Markup.inlineKeyboard([
  [
    Markup.callbackButton('Week', 'recurring-week'),
    Markup.callbackButton('Weekdays', 'recurring-weekdays'),
    Markup.callbackButton('Weekends', 'recurring-weekends')
  ],
  [
    Markup.callbackButton('Monday', 'recurring-monday'),
    Markup.callbackButton('Tuesday', 'recurring-tuesday'),
    Markup.callbackButton('Wednesday', 'recurring-wednesday')
  ],
  [
    Markup.callbackButton('Thursday', 'recurring-thursday'),
    Markup.callbackButton('Friday', 'recurring-friday')
  ],
  [
    Markup.callbackButton('Saturday', 'recurring-saturday'),
    Markup.callbackButton('Sunday', 'recurring-sunday')
  ],
  [
    Markup.callbackButton('Not recurring', 'recurring-no')
  ]
]).extra()

newRemScene.on('text', (ctx) => {
  switch (ctx.session.nextEntry) {
    case 'title':
      if (ctx.message.text.length <= 32) {
        ctx.session.newRem.title = ctx.message.text
        ctx.replyWithMarkdown('Nice!\nNext enter a Date')
        ctx.session.nextEntry = 'date'
      } else {
        ctx.replyWithMarkdown('Sorry, that title is a bit too long.\nPlease enter one shorter than 32 characters:')
      }
      break
    case 'date':
      let dateValidator = /^(?:(?:31(\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
      if (dateValidator.test(ctx.message.text)) {
        ctx.session.newRem.date = ctx.message.text
        ctx.replyWithMarkdown('recurring:', Recurrancekey)
      } else {
        ctx.replyWithMarkdown('Sorry your message was invalid. Please send your message in the following format:\n`01.01.2020`').then(x => {
          setTimeout(function () {
            ctx.tg.deleteMessage(x.chat.id, x.message_id)
          }, 20000)
        })
      }
      break
    default:
      // do nothing
  }
})

newRemScene.action(/recurring-.+/, (ctx) => {
  ctx.deleteMessage()
  let match = ctx.match[0]
  match = match.replace(/recurring-/, '')
  ctx.session.newRem.recurring = match
  ctx.replyWithMarkdown(`Nice!\nThis good?:\n\nTitle:\n${ctx.session.newRem.title}\n\nDate:\n${ctx.session.newRem.date}\n\nRecurring:\n${ctx.session.newRem.recurring}`,
    Markup.inlineKeyboard([
      [
        Markup.callbackButton('Yes', 'save-yes'),
        Markup.callbackButton('No', 'save-no')
      ]
    ]).extra()
  );
})

newRemScene.action(/save-.+/, (ctx) => {
  ctx.deleteMessage()
  let match = ctx.match[0]
  match = match.replace(/save-/, '')
  if (match == 'yes') {
    const unixTime = Date.Parse(ctx.session.newRem.date + ' 00:00:00')
    return console.log(unixTime)
  } else if (match == 'no') {
    return ctx.reply('WHAT U DO???')
  }
})

newRemScene.command('cancel', (ctx) => {
  ctx.session.nextEntry = ''
  leave()
})

exports.newRemScene = newRemScene