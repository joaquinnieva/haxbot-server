const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const { createRoom, closeRoom } = require('./createRoom');
const { TOKEN, commands, CLIENT_ID, tokenHaxball } = require('./consts');
let token = tokenHaxball;

// -----------------
const initDiscordBot = async () => {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};
initDiscordBot();
createRoom({ token });
// -----------------
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on('interactionCreate', async (interaction) => {
  // console.log('interaction', interaction);
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'create') {
    createRoom({ client, token });
    await interaction.reply('Uff');
  }
  if (interaction.commandName === 'close') {
    closeRoom();
    await interaction.reply('que hace??¿');
  }
  if (interaction.commandName === 'stats') {
    await interaction.reply('Estas son las stats');
  }
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  // This is where we'll put our code.
  if (message.content.indexOf('!') !== 0) return;

  const args = message.content.slice('!'.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.channel.send('Pong!');
  }
  if (command === 'token') {
    closeRoom();
    message.channel.send('Se actualizó el token de la sala');
    createRoom({ client, token: args[0] });
  }
});
const startBot = () => client.login(TOKEN);

module.exports = { startBot, client };
