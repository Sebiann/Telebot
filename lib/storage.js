const SQLite = require('better-sqlite3')
const sqlrem = new SQLite('./rem.sqlite')

const remindertable = sqlrem.prepare('SELECT count(*) FROM sqlite_master WHERE type=\'table\' AND name = \'reminder\';').get()
if (!remindertable['count(*)']) {
    sqlrem.prepare('CREATE TABLE reminder (id INTEGER PRIMARY KEY AUTOINCREMENT, chatid INTEGER, title TEXT, date INTEGER, recurring INTEGER);').run()
    sqlrem.prepare('CREATE UNIQUE INDEX idx_reminder_id ON reminder (id);').run()
    sqlrem.pragma('synchronous = 1')
    sqlrem.pragma('journal_mode = wal')
}
let getReminderTable = sqlrem.prepare('SELECT * FROM reminder WHERE chatid = ?')

module.exports = {  
    remset: function (chatid, data) {
        getReminderTable[chatid] = data
        return sqlrem.prepare('INSERT OR REPLACE INTO reminder (chatid, title, date, recurring) VALUES (@chatid, @title, @date, @recurring);')
    },
    remget: function (chatid) {
        return getReminderTable[chatid]
    }
}