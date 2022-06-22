const d = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const client = new d.Client({
  intents: [
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MEMBERS'
  ]
});
const datasz = require('croxydb');
client.commands = new d.Collection();
const fs = require('fs');

client.on('ready', async () =>{
  console.log('bot hazır.');
});

const commands = [];
const commandFiles = fs.readdirSync('./komutlar').filter(file => file.endsWith('.js'));
for (const cmd of commandFiles) {
  const command = require(`./komutlar/${cmd}`);
  commands.push({
    name: command.name,
    description: command.description,
    options: command.options || [],
    type: 1
  });
  client.commands.set(command.name, command);
}

const token = process.env.token, clientId = "bot id", guildId = "sunucu id";
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (datasz.has(`soru.${message.content}`)) {
    const cevap = datasz.get(`cevap.${message.content}`);
    return message.reply(cevap);
  } else {
    return message.reply(`Buna nasıl karşılık vereceğimi bilmiyorum. :cry:\n**/aydınlat** ile beni aydınlatabilirsin.`);
  }
});

client.on('interactionCreate', async (interaction) => {
  const cmdz = client.commands.get(interaction.commandName);
  try {
    return cmdz.run(client, interaction);
  } catch (e) {
    return;
  }
});

client.login(process.env.token);