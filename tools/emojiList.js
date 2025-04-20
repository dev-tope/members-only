const emoji = require("node-emoji");

const fs = require("fs");

const emojiList = Object.keys(emoji)
  .filter(key => typeof emoji[key] === 'string')
  .map(name => ({
    name,
    emoji: emoji[name]
  }))


fs.writeFileSync("emoji-list.json", JSON.stringify(emojiList, null, 2));