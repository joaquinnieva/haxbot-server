const { REST, Routes, Client, GatewayIntentBits } = require('discord.js');
const { createRoom, closeRoom } = require('./createRoom');
const { TOKEN, commands, CLIENT_ID, tokenHaxball, stats } = require('./consts');
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

// -----------------
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  createRoom({ token, client });
});
client.on('interactionCreate', async (interaction) => {
  console.log('interaction', interaction);
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
    if (Object.entries(stats.current).length === 0) {
      await interaction.reply('Todavia no hay stats');
      return;
    }
    await interaction.reply(`Estas son las stats \n
    ${Object.entries(stats.current).map(([name, points]) => `${name} sumó ${points} \n`)}
    `);
  }
  if (interaction.commandName === 'token') {
    await interaction.reply('Primero compren manos,despues actualizen el token');
  }
});

client.on('message', (message) => {
  console.log(message);
  if (message.author.bot) return;
  if (message.content.indexOf('!') !== 0) return;

  const args = message.content.slice('!'.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  console.log(command);
  if (command === 'q') {
    message.channel.send('q');
  }
  if (command === 'token') {
    closeRoom();
    message.channel.send('Actualizando link...');
    createRoom({ client, token: args[0] });
  }
});
const startBot = () => client.login(TOKEN);

module.exports = { startBot, client };
