const { channelId } = require('./consts');

const haxCommands = (room) => ({
  '!start': () => {
    room.stopGame();
    const players = room.getPlayerList();
    const playerIds = players.filter((p) => p.name !== 'ADMIN').map((p) => p.id);
    const reorderPlayerIds = shuffle(playerIds);
    const halfwayThrough = Math.floor(reorderPlayerIds.length / 2);
    const teamOne = reorderPlayerIds.slice(0, halfwayThrough);
    const teamTwo = reorderPlayerIds.slice(halfwayThrough, reorderPlayerIds.length);
    for (const playerId of teamOne) {
      room.setPlayerTeam(playerId, 1);
    }
    for (const playerId of teamTwo) {
      room.setPlayerTeam(playerId, 2);
    }
    setTimeout(() => {
      room.startGame();
    }, 1000);
  },
  '!stats': async () => {
    const channel = await client.channels.fetch(channelId);
    channel.send('Estas son las stats');
  },
  '!admin': (player) => room.setPlayerAdmin(player.id, true),
  '!rr': () => {
    room.stopGame();
    setTimeout(() => {
      room.startGame();
    }, 10);
  },
});

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

module.exports = { shuffle, haxCommands, channelId };
