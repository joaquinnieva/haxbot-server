const HaxballJS = require('haxball.js');
const { haxCommands, channelId } = require('./functions.js');
const futsal = require('./stadium.js');
const express = require('express');
const app = express();
const port = 3000;
let server;
const closeRoom = () => {
  server?.close((err) => {
    console.log('server closed');
    process?.exit(err ? 1 : 0);
  });
};
const createRoom = (client) => {
  server && closeRoom();
  server = app.listen(port, () => {
    HaxballJS.then((HBInit) => {
      // Same as in Haxball Headless Host Documentation
      const room = HBInit({
        roomName: 'Box',
        maxPlayers: 10,
        public: false,
        noPlayer: true,
        token: 'thr1.AAAAAGV8pTQ9J30W2WlcBg.S8oth5zywgg', // Required
      });

      room.setCustomStadium(futsal);
      room.setScoreLimit(3);
      room.setTimeLimit(0);

      room.onTeamVictory = async function (scores) {
        await haxCommands?.(room)?.['!start']?.();
      };

      room.onPlayerJoin = function (player) {
        room.setPlayerAdmin(player.id, true); // Give admin to the first non admin player in the list
      };

      room.onPlayerChat = async function (player, msg) {
        await haxCommands?.(room)?.[msg]?.();
      };

      room.onRoomLink = async function (link) {
        const channel = await client.channels.fetch(channelId);
        channel.send(`Chicos, acaba de caerse un link: ${link} , ¿Quién fue el desubicado?`);
      };
    });
  });
};

module.exports = { createRoom, closeRoom };
