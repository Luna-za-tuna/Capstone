
const eris = require('eris');
const schedule = require('node-schedule');
const PREFIX = '!';
var auth = require('./auth.json');
// Initialize Discord Bot
const commandHandlerForCommandName = {};
const token = auth.token;
var bot = new eris.Client(token);
var guildOb;
var announceChannel;
var initialRole;
var secondRole;
var thirdRole;
var fourthRole;
var fifthRole;
var sixthRole;
var BreakException = {};


// handles a test command by saying hi
commandHandlerForCommandName['sayhi'] = (msg, args) => 
{
    return msg.channel.createMessage('hi');
};

commandHandlerForCommandName['updateusers'] = (msg, args) =>
{
    roleUpdateFunc();
};
// changes roles once a year and kicks old members 
var roleUpdateFunc = function()
{
    try 
    {
    guildOb.members.forEach(members =>
    {
        if (members.username !== 'BadJokesMcGee' & members.username !== 'TrumanACMBot')
        {
        console.log('member: ' + members.username);
        var found = false;
        try
        {
        members.roles.forEach(role =>
        {
            
            console.log('role: ' + role);
            if (role == sixthRole)
            {
				console.log('kicking because they are too old');
                guildOb.kickMember(members.id, "You've been here a while and probably graduated");
                throw BreakException;
            }
            else if (role == fifthRole)
            {
                if(!found)
                {
					console.log('updating to role six');
                    guildOb.addMemberRole(members.id, sixthRole);
                    guildOb.removeMemberRole(members.id, fifthRole);
                    found = true;
                }
            }
            else if (role == fourthRole)
            {
                if(!found)
                {
					console.log('updating to role five');
                    guildOb.addMemberRole(members.id, fifthRole);
                    guildOb.removeMemberRole(members.id, fourthRole);
                    found = true;
                }
            }
            else if (role == thirdRole)
            {
                if(!found)
                {
                    console.log('updating to role four');
                    guildOb.addMemberRole(members.id, fourthRole);
                    guildOb.removeMemberRole(members.id, thirdRole);
                    found = true;
                }
            }
            else if (role == secondRole)
            {
                if(!found)
                {
                    console.log('updating to role three');
                    guildOb.addMemberRole(members.id, thirdRole);
                    guildOb.removeMemberRole(members.id, secondRole);
                    found = true;
                }
            }
            else if (role == initialRole)
            {
                if(!found)
                {
                    console.log('updating to role two');
                    guildOb.addMemberRole(members.id, secondRole);
                    guildOb.removeMemberRole(members.id, initialRole);
                    found = true;
                }
            }
           
        });
         if (found == false)
            {
                console.log('member doesnt have role. adding first role');
                guildOb.addMemberRole(members.id, initialRole);
                found = true;
            }
        } catch (e)
        {
            if (e !== BreakException) throw e;
        }
        }
        
    });
    
    } catch(e){
        console.log('error' + e);
    }
}
var roleUpdate = schedule.scheduleJob('0 0 0 0 8 *', roleUpdateFunc);




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
            console.log('setting announcement channel');
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

bot.on('messageDelete', async (message) =>
{
    console.log('message deleted');
    announceChannel.createMessage('message deleted: ' + message.content);
});

bot.on('messageUpdate', async (message, oldMessage) =>
{
    if (oldMessage !== null)
    {
        console.log('message updated');
        announceChannel.createMessage('message edited. Old message: ' + oldMessage.content);
        announceChannel.createMessage('new message: ' + message.content);
    }
});

bot.on('guildMemberAdd', async (guild, member) => 
{
    // announces person joining.    
    announceChannel.createMessage(member.username + " has joined the server");
    
    //console.log("initial role" + initialRole);
    member.addRole(initialRole, "for joining the server");
});

bot.on('guildMemberRemove', async (guild, member) => 
{
    // announces person leaving.    
    announceChannel.createMessage(member.username + " has left the server");
});

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
            console.log('default announce channel is general');
            announceChannel = channel;
        } 
    });
    guildOb.roles.forEach(role => 
    {
        if (role.name == 'one')
        {
            initialRole = role.id;
            console.log('initialRole: ' + role.id);
        }
        else if (role.name == 'two')
        {
            secondRole = role.id;
            console.log('secondRole: ' + role.id);
        }
        else if (role.name == 'three')
        {
            thirdRole = role.id;
            console.log('thirdRole: ' + role.id);
        }
        else if (role.name == 'four')
        {
            fourthRole = role.id;
            console.log('fourthRole: ' + role.id);
        }
        else if (role.name == 'five')
        {
            fifthRole = role.id;
            console.log('fifthRole: ' + role.id);
        }
        else if (role.name == 'six')
        {
            sixthRole = role.id;
            console.log('sixthRole: ' + role.id);
        }
    });
});

bot.on('error', err => 
{
    console.warn(err);
});

bot.connect();
//TODO: possibly use regex to block language