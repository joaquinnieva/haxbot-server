const TOKEN = 'MTE4NTI2MTM5NDY2OTYwNDkwNA.GC3l9f.gT6ka4cUpyhKUYLOqNhVj94jTuuucHQvm22AE8';
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
  {
    name: 'token',
    description: 'Update a token room!',
  },
];
const channelId = '1133863506081493084';
const tokenHaxball = 'thr1.AAAAAGWAaRufp_-zJHbDeg.XYRBLJy4JTE';
const HaxNotification = { NONE: 0, CHAT: 1, MENTION: 2 };

module.exports = { commands, CLIENT_ID, TOKEN, channelId, tokenHaxball, HaxNotification };
