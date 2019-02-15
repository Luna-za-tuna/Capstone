
const eris = require('eris');
const PREFIX = '!';
var auth = require('./auth.json');
// Initialize Discord Bot
const commandHandlerForCommandName = {};
const token = auth.token;
var bot = new eris.Client(token);


// handles a test command by saying hi
commandHandlerForCommandName['sayhi'] = (msg, args) => {
    return msg.channel.createMessage('hi');
};

//TODO: when someone joins the server, add initial role to them

bot.on('guildMemberAdd', (member) => 
{
     var annouceChannel = member.channels.get("544304255515754500");
     console.log(announceChannel);
     annouceChannel.send(member + "Welcome to Truman's ACM Discord. Make sure to ask for permissions to view other channels.");
     
});

//TODO: need to make event handler to deal with changing roles. 
//gotta check each persons role and move it forward at a certain time. 
//if they dont have one, add one, if they hit the limit, kick them from the server



//This shouldnt change really. Main function that controls which 
//command is run. 
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
        await commandHandler(msg, args);
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