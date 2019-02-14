
const eris = require('eris');
const PREFIX = '!';
var auth = require('./auth.json');
// Initialize Discord Bot
const commandHandlerForCommandName = {};
var bot = new eris.Client('NTQ0MzAzMTcwNTMzNDU3OTUz.D0ddGA.bRe_dJ0lvwpTBRKs0UsmLs7xYUQ');

// handles a test command by saying hi
commandHandlerForCommandName['sayhi'] = (msg) => {
    return msg.channel.createMessage('hi');
};

bot.on('messageCreate', async (msg) => {
    const content = msg.content;
    
    //ignore direct messages
    if (!msg.channel.guild) 
    {
        return;
    }
    
    //ignore messages without prefix
    if (!content.startsWith(PREFIX))
    {
        return;
    }
    
    //get command
    const parts = content.split(' ').map(s => s.trim()).filter(s => s);
    const commandName = parts[0].substr(PREFIX.length)
    
    //get handler
    const commandHandler = commandHandlerForCommandName[commandName];
    if (!commandHandler)
    {
        return msg.channel.createMessage('invalid command');
    }
    
    try 
    {
        await commandHandler(msg);
    } 
    catch (err)
    {
        console.warn('error handling command');
        console.warn(err);
    }
});




bot.on('ready', function (evt) {
    console.log('connected');
});




bot.on('error', err => {
    console.warn(err);
});

bot.connect();