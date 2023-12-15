const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const { createRoom } = require('./createRoom');
const TOKEN = 'MTE4NTI2MTM5NDY2OTYwNDkwNA.Gm6GLy.w8dfk1cCm6SZuQdIFSYEc5cr9dKyYqCGSNddJA';
const CLIENT_ID = '1185261394669604904';
const commands = [
  {
    name: 'stats',
    description: 'Replies with stats!',
  },
  {
    name: 'create',
    description: 'Open a room!',
  },
  {
    name: 'close',
    description: 'Close a room!',
  },
];

// -----------------
const rest = new REST({ version: '10' }).setToken(TOKEN);
const action = async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};
action();

// -----------------
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on('interactionCreate', async (interaction) => {
  // console.log('interaction', interaction);
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'stats') {
    await interaction.reply('Stats haxball');
  }
  if (interaction.commandName === 'create') {
    createRoom(client);
  }
  if (interaction.commandName === 'close') {
    closeRoom(client);
  }
});
const startBot = () => client.login(TOKEN);

module.exports = { startBot, client };
