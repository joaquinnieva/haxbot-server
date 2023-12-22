const HaxballJS = require('haxball.js');
const { haxCommands, channelId } = require('./functions.js');
const futsal = require('./stadium.js');
const express = require('express');
const { HaxNotification, stats } = require('./consts.js');
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
      room.setScoreLimit(3);
      room.setTimeLimit(3);

      const setStats = ({ winner, loser }) => {
        for (const player of winner) {
          const oldPoints = playerStats?.[player.name] ? Number(playerStats?.[player.name]) : 0;
          stats.current = { ...playerStats, [player.name]: oldPoints + points };
        }
        if (inOvertime) {
          for (const player of loser) {
            const oldPoints = playerStats?.[player.name] ? Number(playerStats?.[player.name]) : 0;
            stats.current = { ...playerStats, [player.name]: oldPoints + 1 };
          }
        }
      };

      room.onTeamVictory = async function (scores) {
        const playerStats = stats.current;
        const channel = await client.channels.fetch(channelId);
        // const channel = { send: console.log };
        const players = room.getPlayerList();
        const red = players.filter((p) => p.name !== 'ADMIN').filter((p) => p.team === 1);
        const blue = players.filter((p) => p.name !== 'ADMIN').filter((p) => p.team === 2);
        const redwinner = scores.red > scores.blue;
        const points = scores.time > scores.timeLimit ? 2 : 3;
        const inOvertime = scores.time > scores.timeLimit;

        if (redwinner) {
          setStats({ winner: red, loser: blue });
          room.sendAnnouncement(`✨ Rojo gana ${scores.red} - ${scores.blue} | Partidazo pero esto sigueeee!`, null, 0xffefd6, 'bold', HaxNotification.CHAT);
          channel.send(`Ganan ${points} puntos: ${red.map((p) => p.name).join(',')}`);
          inOvertime && channel.send(`Ganan 1 punto: ${blue.map((p) => p.name).join(',')}`);
        } else {
          setStats({ winner: blue, loser: red });
          room.sendAnnouncement(`✨ Azul gana ${scores.blue} - ${scores.red} | Partidazo pero esto sigueeee!`, null, 0xffefd6, 'bold', HaxNotification.CHAT);
          channel.send(`Ganan ${points} puntos: ${blue.map((p) => p.name).join(',')}`);
          inOvertime && channel.send(`Ganan 1 punto: ${red.map((p) => p.name).join(',')}`);
        }
        haxCommands?.(room)?.['!start']?.();
        console.log(playerStats);
      };

      room.onPlayerChat = async function (player, msg) {
        await haxCommands?.(room)?.[msg]?.(player);
      };

      room.onRoomLink = async function (link) {
        console.log(link);
        const channel = await client.channels.fetch(channelId);
        // channel.send(`Chicos, acaba de caerse un link: ${link} , ¿Quién fue el desubicado?`);
        channel.send(`Uff, se habilito el famosooo : ${link}`);
      };
    }).catch((err) => {
      console.error(err);
    });
  });
};

module.exports = { createRoom, closeRoom };
