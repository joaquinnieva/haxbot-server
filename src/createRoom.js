const HaxballJS = require('haxball.js');
const { haxCommands, channelId } = require('./functions.js');
const futsal = require('./stadium.js');
const express = require('express');
const { HaxNotification } = require('./consts.js');
const app = express();
const port = 3000;

let server;
const closeRoom = () => {
  server?.close((err) => {
    console.log('Server closed');
    process?.exit(err ? 1 : 0);
  });
};

const createRoom = ({ client, token }) => {
  server && closeRoom();
  server = app.listen(port, () => {
    HaxballJS.then((HBInit) => {
      // Same as in Haxball Headless Host Documentation
      const room = HBInit({
        roomName: 'Box',
        maxPlayers: 10,
        public: false,
        noPlayer: false,
        playerName: 'ADMIN',
        token: token, // Required
      });

      room.setCustomStadium(futsal);
      room.setScoreLimit(1);
      room.setTimeLimit(3);

      room.onTeamVictory = async function (scores) {
        const channel = { send: () => {} };
        // const channel = await client.channels.fetch(channelId);
        const redwinner = scores.red > scores.blue;
        const players = room.getPlayerList();
        const red = players.filter((p) => p.name !== 'ADMIN').map((p) => p.team === 1);
        const blue = players.filter((p) => p.name !== 'ADMIN').map((p) => p.team === 2);
        if (redwinner) {
          room.sendAnnouncement(`✨ Rojo gana ${scores.red} - ${scores.blue} | Partidazo pero esto sigueeee!`, null, 0xffefd6, 'bold', HaxNotification.CHAT);
          channel.send(`Ganan 3 puntos: ${red.map((p) => p.name).join(',')}`);
        } else {
          room.sendAnnouncement(`✨ Azul gana ${scores.blue} - ${scores.red} | Partidazo pero esto sigueeee!`, null, 0xffefd6, 'bold', HaxNotification.CHAT);
          channel.send(`Ganan 3 puntos: ${blue.map((p) => p.name).join(',')}`);
        }
        await haxCommands?.(room)?.['!start']?.();
      };

      room.onPlayerChat = async function (player, msg) {
        await haxCommands?.(room)?.[msg]?.(player);
      };

      room.onRoomLink = async function (link) {
        console.log(link);
        const channel = await client.channels.fetch(channelId);
        channel.send(`Chicos, acaba de caerse un link: ${link} , ¿Quién fue el desubicado?`);
      };
    }).catch((err) => {
      console.error(err);
    });
  });
};

module.exports = { createRoom, closeRoom };
