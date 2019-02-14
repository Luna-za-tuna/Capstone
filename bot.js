
const eris = require('eris');
const PREFIX = '!';
var auth = require('./auth.json');
// Initialize Discord Bot
const commandHandlerForCommandName = {};
const token = auth.token;
var bot = new eris.Client(token);

// handles a test command by saying hi
commandHandlerForCommandName['sayhi'] = (msg) => {
    return msg.channel.createMessage('hi');
};


//This shouldnt change really
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
    
    //get arguments
    const args = parts.slice(1);
    
    //run command
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