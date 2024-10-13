import axios from 'axios';

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const config = {
  name: 'hapi',
  aliases: ['hapi'],
  description: '50% chance of getting money!',
  usage: '<hapi> or <hapi start>',
  cooldown: 25,
  credits: 'Duke Agustin',
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWinGif() {
  try {
    const response = await axios.get('https://media.tenor.com/w_xkJNZpzhgAAAAd/goofy.gif', {
      responseType: 'stream',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching win GIF:', error.message);
    return null;
  }
}

async function getLoseGif() {
  try {
    const response = await axios.get('https://media.tenor.com/u8M7kk5ZXmwAAAAC/banana-cat-crying.gif', {
      responseType: 'stream',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching lose GIF:', error.message);
    return null;
  }
}

async function getMenuGif() {
  try {
    const response = await axios.get('https://media.tenor.com/DmtMhYiw1CUAAAAd/gif.gif', {
      responseType: 'stream',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching menu GIF:', error.message);
    return null;
  }
}

function getNextHapiStart(userID) {
  const lastAttemptTime = userCooldowns.get(userID) || 0;
  const nextStart = new Date(lastAttemptTime + 3 * 60 * 60 * 1000);
  return nextStart <= Date.now() ? 'Now' : nextStart.toISOString();
}

async function onCall({ message, args }) {
  if (!message || !message.body) {
    console.error('Invalid message object!');
    return;
  }

  const { senderID } = message;

  if (args.length === 0 || args[0].toLowerCase() === 'menu') {
    const menuGif = await getMenuGif();
    if (!menuGif) {
      return message.reply('Error fetching menu GIF. Please try again later.');
    }

    const menuMessage = '😼 𝗛𝗮𝗽𝗶 𝗛𝗮𝗽𝗶 𝗛𝗮𝗽𝗶 𝗚𝗮𝗺𝗲🪙\n\n- 50% Chance of Winning Money with Hapi\n━━━━━━━━━━━━━\n' +
      'Type `#hapi start` to try your luck!\n\n';

    const menuResponse = await message.reply({
      body: menuMessage,
      attachment: menuGif,
    });

    return menuResponse;
  }

  if (args[0].toLowerCase() === 'start') {
    const lastAttemptTime = userCooldowns.get(senderID) || 0;
    const currentTime = Date.now();
    const nextStart = new Date(lastAttemptTime + 3 * 60 * 60 * 1000);

    if (nextStart > currentTime) {
      const timeUntilNextStart = nextStart - currentTime;
      const hours = Math.floor(timeUntilNextStart / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilNextStart % (1000 * 60 * 60)) / (1000 * 60));

      const cooldownMessage = `⏳ You must wait ${hours} hours and ${minutes} minutes before attempting again.`;
      return message.reply(cooldownMessage);
    }

    const robbingMessage = '😾 | 𝙰𝚝𝚝𝚎𝚖𝚙𝚝𝚒𝚗𝚐 𝚝𝚘 𝚠𝚒𝚗 𝚖𝚘𝚗𝚎𝚢 𝚠𝚒𝚝𝚑 𝙷𝚊𝚙𝚒 ⏳';
    const roll = (await getMenuGif()).data; // Use the menu GIF for robbing as well
    const robbing = await message.reply({
      body: robbingMessage,
      attachment: roll,
    });

    await delay(7000);

    if (Math.random() < 0.5) {

      const amountWon = getRandomValue(100000000, 1000000000000);
      const winGif = await getWinGif();

      const winMessage = `😹 | 𝗖𝗼𝗻𝗴𝗿𝗮𝘁𝘂𝗹𝗮𝘁𝗶𝗼𝗻𝘀! 𝚈𝚘𝚞 𝚠𝚘𝚗 𝚊 𝚖𝚘𝚗𝚎𝚢 𝚠𝚒𝚝𝚑 𝙷𝚊𝚙𝚒 𝚠𝚘𝚛𝚝𝚑:\n ${amountWon} 💰`;


      if (global.controllers && global.controllers.Users) {
        global.controllers.Users.increaseMoney(senderID, amountWon);
      }

      const winResponse = await message.reply({
        body: winMessage,
        attachment: winGif,
      });
    } else {

      const loseGif = await getLoseGif();

      const loseMessage = '😿 | 𝚄𝚗𝚏𝚘𝚛𝚝𝚞𝚗𝚊𝚝𝚎𝚕𝚢 𝚢𝚘𝚞 𝚍𝚒𝚍 𝚗𝚘𝚝 𝚠𝚒𝚗 𝚊𝚗𝚢 𝚖𝚘𝚗𝚎𝚢 𝚠𝚒𝚝𝚑 𝙷𝚊𝚙𝚒. 𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚏𝚘𝚛 𝚝𝚑𝚎 𝚗𝚎𝚡𝚝 3 𝚑𝚘𝚞𝚛𝚜';

      const loseResponse = await message.reply({
        body: loseMessage,
        attachment: loseGif,
      });
    }


    if (global.api && global.api.unsendMessage) {
      await global.api.unsendMessage(robbing.messageID);
    }


    userCooldowns.set(senderID, currentTime);


    const nextStartMessage = `🕒 Next hapi start available in ${hours} hours and ${minutes} minutes.`;
    return message.reply(nextStartMessage);
  }
}

const userCooldowns = new Map();

export default {
  config,
  onCall,
};
