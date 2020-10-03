// formatting
const { stripIndent } = require('common-tags')

// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const bot = new Discord.Client();

// stores API keys in separate JSON file
const { token } = require('./token.json');
// auth
bot.login(token);

// when the client is ready, run this code
// this event will only trigger one time after logging in
bot.once('ready', () => {
	console.log(stripIndent`
	--- Bot online ---
	`);
});

// new member welcome
bot.on('guildMemberAdd', member => {
	console.log(member)
	member.guild.channels.cache.get('750028068264869898').send(`:wave: Welcome, <@${member.id}> to **${member.guild.name}**!`); 
});

bot.on('message', message => {
	const args = message.content.trim().split(' ');

	console.log(message.author.username, ":", message.content)

	// simple info commands
	if (args[0] == 'server-info') {
		message.channel.send(stripIndent`
			----- **${message.guild.name}** -----

			Founded: ${message.guild.createdAt}
			Region: ${message.guild.region}

			Owner: ${message.guild.owner}
			Members: ${message.guild.memberCount}

			Rules: ${message.guild.rulesChannel}
		`);
	} 
	else if (args[0] === 'user-info') {
		return message.reply(`your username is ${message.author.username} and your user ID is ${message.author.id}`);
	} 

	// easily delete multiple messages
	else if (args[0] === 'prune') {
		message.channel.bulkDelete(6);
	}

	// fetch AtomicAssets items
	if (args[0] == 'ah') {
		if ( args[1] == 'latest' ) {
			const fetch = require('node-fetch');
			const querystring = require('querystring');
			query = "page=1&limit=1&order=desc&sort=updated"
			query = querystring.parse(query)
			query.limit = args[2]
			query = querystring.encode(query)
			fetch("http://test.wax.api.atomicassets.io/atomicassets/v1/assets?"+query).then(res => res.json()).then(
				assets => {
					amount = parseInt(args[1])
					total_items = amount - 1
					item = 0
					while (item <= total_items) {
						message.channel.send(stripIndent`
							**${ item + 1 }**
							Name: ${ assets.data[item].name }
							Owner: ${ assets.data[item].owner }
							Asset ID: ${ assets.data[item].asset_id }
						`)
						item += 1
					}
				}
			);
		}
	}
});

// Automatically reconnect if the bot disconnects due to inactivity
bot.on('disconnect', function(erMsg, code) {
	console.log('----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----');
	bot.connect();
});