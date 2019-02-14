
const eris = require('eris');
const PREFIX = '!';
var auth = require('./auth.json');
// Initialize Discord Bot
const commandHandlerForCommandName[]
var bot = new eris.Client('NTQ0MzAzMTcwNTMzNDU3OTUz.D0ddGA.bRe_dJ0lvwpTBRKs0UsmLs7xYUQ');

bot.on('ready', function (evt) {
    console.log('connected');
});
bot.on('messageCreate', async(msg) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    const botWasMentioned = msg.mentions.find(mentionedUser => mentionedUser.id === bot.user.id);
    if (botWasMentioned) {
        try {
            await msg.channel.createMessage('here');
        } catch (err) {
            console.warn('failed');
            console.warn(err);
        }
    }
});



bot.on('error', err => {
    console.warn(err);
});

bot.connect();