
const eris = require('eris');
const PREFIX = '!';
var auth = require('./auth.json');
// Initialize Discord Bot
const commandHandlerForCommandName = {};
const token = auth.token;
var bot = new eris.Client(token);
var guildOb;
var announceChannel


// handles a test command by saying hi
commandHandlerForCommandName['sayhi'] = (msg, args) => 
{
    return msg.channel.createMessage('hi');
};

// Handles setting the announcements channel
commandHandlerForCommandName['setAnnounce'] = (msg, args) =>
{
    checkChannel = args[0];
    console.log(checkChannel);
    var set = false;
    guildOb.channels.forEach(channel => 
    {
        if (channel.name == checkChannel)
        {
            announceChannel = channel;
            set = true;
            return;
        }
    });
    if (!set)
    {
        msg.channel.createMessage('Channel does not exist');
    }
};

bot.on('guildMemberAdd', async (guild, member) => 
{
    // announces person joining.    
    announceChannel.createMessage(member + "Welcome to fuck this. Make sure to ask for permissions to view other channels.");
    //Adds initial role to someone who joins
    //TODO: check to see if role exists first
    var initialRole 
    guild.roles.forEach(role => 
    {
        if (role.name == 'one')
        {
            initialRole = role.id
            return true;
        }
    });
    //console.log("initial role" + initialRole);
    member.addRole(initialRole, "for joining you bich");
});

//TODO: need to make event handler to deal with changing roles. 
//gotta check each persons role and move it forward at a certain time. 
//if they dont have one, add one, if they hit the limit, kick them from the server

//TODO: add event handler for people who leave the server
//TODO: record changes to messages
//TODO: record deleted messages 


//This shouldnt change really. Main function that controls which 
//command is run. 
bot.on('messageCreate', async (msg) => 
{
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

bot.on('ready', function (evt) 
{
    console.log('connected');
    bot.guilds.forEach(guild => 
    {
        guildOb = guild;
    });
    guildOb.channels.forEach(channel => 
    { 
        if (channel.name == "general")
        {
            announceChannel = channel;
        } 
    });
});

bot.on('error', err => {
    console.warn(err);
});

bot.connect();
//TODO: possibly use regex to block language