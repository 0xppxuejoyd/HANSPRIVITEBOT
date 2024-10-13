import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const titanList = [
  { name: "ColossalTitan", image: "https://i.imgur.com/LzTVRbY.jpg" },
  { name: "CartTitan", image: "https://i.imgur.com/wAirAzo.jpg" },
  { name: "Ymir'sFoundingTitan", image: "https://i.imgur.com/1UXo7Bq.jpg" },
  { name: "Grisha'sAttackTitan", image: "https://i.imgur.com/0isK2rZ.jpg" },
  { name: "FemaleTitan", image: "https://i.imgur.com/eI8QHU5.jpg" },
  { name: "BeastTitan", image: "https://i.imgur.com/Dy0VFAI.jpg" },
  { name: "ArmoredTitan", image: "https://i.imgur.com/xVQPgT5.jpg" },
  { name: "Eren'sAttackTitan", image: "https://i.imgur.com/RaCbIEC.jpg" },
  { name: "JawTitan", image: "https://i.imgur.com/KDgTuZL.jpg" },
  { name: "WarHammerTitan", image: "https://i.imgur.com/rBtKkxk.jpg" },
];

const config = {
  name: "attackontitan",
  aliases: ["aot", "titan"],
  version: "2.1",
  description: "Experience the thrill of Titan battles in an Attack on Titan multiplayer game!",
  usage: "<buy/upgrade/challenge/accept/check/kill>",
  cooldown: 5,
  credits: "Duke Agustin"
};
const FIGHT_COOLDOWN = 3 * 60 * 1000;


const lastFightTimestamps = new Map();
let titanOwners = new Map();
const CHALLENGE_DELAY = 9000; 
const CHALLENGE_GIF = "https://i.imgur.com/Nxu1S9c.gif";
function _0x2ea2(){const _0x37ce30=['2bpqHJC','162767SVhZPP','8LjKCeB','titan_owners.json','1150224wCAiTE','2726733JAeqHS','791454poiwao','385ZbyCIN','1468aRcoiJ','6528424OtHRVP','90RdgcGS','11482542kGASUm'];_0x2ea2=function(){return _0x37ce30;};return _0x2ea2();}const _0xfa53c9=_0x3150;function _0x3150(_0x27ecd6,_0x440c8d){const _0x2ea22a=_0x2ea2();return _0x3150=function(_0x31500c,_0x4bca9f){_0x31500c=_0x31500c-0x11f;let _0x37574b=_0x2ea22a[_0x31500c];return _0x37574b;},_0x3150(_0x27ecd6,_0x440c8d);}(function(_0x21bb42,_0x4f39a1){const _0x302a6c=_0x3150,_0xc079b0=_0x21bb42();while(!![]){try{const _0x335f51=-parseInt(_0x302a6c(0x124))/0x1+-parseInt(_0x302a6c(0x12a))/0x2*(parseInt(_0x302a6c(0x123))/0x3)+-parseInt(_0x302a6c(0x126))/0x4*(parseInt(_0x302a6c(0x125))/0x5)+parseInt(_0x302a6c(0x122))/0x6+parseInt(_0x302a6c(0x127))/0x7+parseInt(_0x302a6c(0x120))/0x8*(parseInt(_0x302a6c(0x129))/0x9)+parseInt(_0x302a6c(0x128))/0xa*(parseInt(_0x302a6c(0x11f))/0xb);if(_0x335f51===_0x4f39a1)break;else _0xc079b0['push'](_0xc079b0['shift']());}catch(_0x79e65e){_0xc079b0['push'](_0xc079b0['shift']());}}}(_0x2ea2,0xc4773));const PATH=join(global['assetsPath'],_0xfa53c9(0x121));

const threadStore = new Map();
const lastReleaseTimestamps = new Map();

function loadTitanOwners() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    titanOwners = new Map(JSON.parse(data));
  } catch (err) {
    console.error('Failed to load Titan owners:', err);
  }
}

function saveTitanOwners() {
  try {
    const data = JSON.stringify(Array.from(titanOwners));
    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save Titan owners:', err);
  }
}

function getTitanPowerLevel(userID) {
  return titanOwners.has(userID) ? titanOwners.get(userID).powerLevel : 0;
}

async function updateTitanData(userID, result) {
  if (!titanOwners.has(userID)) {
    console.error(`User with ID ${userID} not found in titanOwners.`);
    return;
  }

  const userData = titanOwners.get(userID);
  if (result === 'win') {
    userData.wins = (userData.wins || 0) + 1;
  } else if (result === 'lose') {
    userData.losses = (userData.losses || 0) + 1;
  }

  saveTitanOwners();
}

async function challengeDelayMessage(message, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(message);
    }, delay);
  });
}

async function onCall({ message, args }) {
  const { Users } = global.controllers;

  if (!message || !message.body) {
    console.error('Invalid message object!');
    return;
  }

  const { senderID, threadID } = message;

  loadTitanOwners();

  if (args[0] === "buy") {
    if (titanOwners.has(senderID)) {
      return message.reply("𝚈𝚘𝚞 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚑𝚊𝚟𝚎 𝚊 𝚃𝚒𝚝𝚊𝚗");
    }

    // Check if the user provided a valid Titan name to buy
    if (args.length < 2) {
      return message.reply("Usage: `#aot buy <titanName>`");
    }

    const titanNameToBuy = args[1].toLowerCase();
    const selectedTitan = titanList.find(titan => titan.name.toLowerCase() === titanNameToBuy);

    if (!selectedTitan) {
      return message.reply("𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚃𝚒𝚝𝚊𝚗 𝚗𝚊𝚖𝚎. 𝙲𝚑𝚎𝚌𝚔 𝚝𝚑𝚎 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚃𝚒𝚝𝚊𝚗𝚜 𝚞𝚜𝚒𝚗𝚐 '#aot list'");
    }

    // Deduct the Titan cost from user's balance
    const titanCost = 1000000000000; // Cost of a Titan
    const userBalance = await Users.getMoney(senderID);

    if (userBalance < titanCost) {
      return message.reply("𝙽𝚘𝚝 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚋𝚞𝚢 𝚊 𝚃𝚒𝚝𝚊𝚗");
    }

    await Users.decreaseMoney(senderID, titanCost);
    titanOwners.set(senderID, { powerLevel: 1, selectedTitan, wins: 0, losses: 0 }); // Initial power level, selected Titan, wins, and losses
    saveTitanOwners(); // Save user data after buying

    // Fetch the Titan image as a stream using Axios
    const titanImageStream = await axios.get(selectedTitan.image, { responseType: "stream" });

    // Send the Titan information and image as a stream
    return message.reply({
      body: `𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚋𝚘𝚞𝚐𝚑𝚝 𝚊 ${selectedTitan.name} 𝚃𝚒𝚝𝚊𝚗 💀\nPower Level: 1`,
      attachment: titanImageStream.data,
    });
  }

  else if (args[0] === "upgrade") {
    if (!titanOwners.has(senderID)) {
      return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚘𝚠𝚗 𝚊 𝚃𝚒𝚝𝚊𝚗. 𝚄𝚜𝚎 '#𝚊𝚘𝚝 𝚕𝚒𝚜𝚝' 𝚝𝚘 𝚜𝚑𝚘𝚠 𝚝𝚑𝚎 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚃𝚒𝚝𝚊𝚗𝚜 𝚊𝚗𝚍 '#𝚊𝚘𝚝 𝚋𝚞𝚢 <𝚗𝚊𝚖𝚎_𝚘𝚏_𝚝𝚑𝚎_𝚃𝚒𝚝𝚊𝚗>' 𝚝𝚘 𝚐𝚎𝚝 𝚘𝚗𝚎");
    }

    const upgradeCost = 1000000000000; // Cost of upgrade
    const userBalance = await Users.getMoney(senderID);

    if (userBalance < upgradeCost) {
      return message.reply("𝙽𝚘𝚝 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚞𝚙𝚐𝚛𝚊𝚍𝚎 𝚢𝚘𝚞𝚛 𝚃𝚒𝚝𝚊𝚗");
    }

    // Check if enough time has passed since the last upgrade
    const lastUpgradeTime = titanOwners.get(senderID).lastUpgradeTime || 0;
    const currentTime = Date.now();
    const upgradeCooldown = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

    if (currentTime - lastUpgradeTime < upgradeCooldown) {
      const remainingTime = upgradeCooldown - (currentTime - lastUpgradeTime);
      const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
      const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

      return message.reply(`𝚈𝚘𝚞 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚞𝚙𝚐𝚛𝚊𝚍𝚎 𝚢𝚘𝚞𝚛 𝚃𝚒𝚝𝚊𝚗 𝚘𝚗𝚌𝚎 𝚎𝚟𝚎𝚛𝚢 3 𝚑𝚘𝚞𝚛𝚜. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 ${remainingHours} 𝚑𝚘𝚞𝚛𝚜 𝚊𝚗𝚍 ${remainingMinutes} 𝚖𝚒𝚗𝚞𝚝𝚎𝚜`);
    }

    // Deduct the upgrade cost from user's balance
    await Users.decreaseMoney(senderID, upgradeCost);

    // Upgrade the Titan power level
    titanOwners.get(senderID).powerLevel++;
    titanOwners.get(senderID).lastUpgradeTime = currentTime; // Update last upgrade time
    saveTitanOwners(); // Save user data after upgrading

    // Fetch the Titan image as a stream using Axios
    const upgradeGifStream = await axios.get("https://i.imgur.com/AlA3azZ.gif", { responseType: "stream" });

    // Send the upgrade GIF and set a timeout to unsend the message after 15 seconds
    const upgradeMessage = await message.reply({
      body: "🚀 𝗬𝗼𝘂𝗿 𝗧𝗶𝘁𝗮𝗻 𝗶𝘀 𝗡𝗼𝘄 𝗨𝗽𝗴𝗿𝗮𝗱𝗲𝗱! Power Level: " + getTitanPowerLevel(senderID),
      attachment: upgradeGifStream.data,
    });

    setTimeout(async () => {
      if (global.api && global.api.unsendMessage && upgradeMessage && upgradeMessage.messageID) {
        await global.api.unsendMessage(upgradeMessage.messageID);
      }
    }, 30000); // 20 seconds

    return; // Return to avoid sending duplicate messages
  } 

  else if (args[0] === "challenge") {
        if (!titanOwners.has(senderID)) {
            return message.reply("𝙽𝚘𝚝 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚒𝚗𝚒𝚝𝚒𝚊𝚝𝚎 𝚝𝚑𝚎 𝚃𝚒𝚝𝚊𝚗 𝚋𝚊𝚝𝚝𝚕𝚎 𝚌𝚑𝚊𝚕𝚕𝚎𝚗𝚐𝚎");
        }

        if (args.length < 2 || isNaN(args[1])) {
            return message.reply("Usage: `#aot challenge <betAmount>`");
        }

        const betAmount = parseInt(args[1]);

        if (betAmount < 1000000000000) {
            return message.reply("𝙼𝚒𝚗𝚒𝚖𝚞𝚖 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝 𝚒𝚜 $1,000,000,000,000 💵");
        }

        // Check if the user has enough money to initiate the challenge
        const userBalance = await Users.getMoney(senderID);

        if (userBalance < betAmount) {
            return message.reply("𝙽𝚘𝚝 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚒𝚗𝚒𝚝𝚒𝚊𝚝𝚎 𝚝𝚑𝚎 𝚃𝚒𝚝𝚊𝚗 𝚋𝚊𝚝𝚝𝚕𝚎 𝚌𝚑𝚊𝚕𝚕𝚎𝚗𝚐𝚎");
        }

        // Deduct the bet amount from the user's balance
        await Users.decreaseMoney(senderID, betAmount);

        // Set up the pending challenge in the thread store
        threadStore.set(threadID, {
            challengerID: senderID,
            betAmount,
            timestamp: Date.now(),
        });

        return message.reply(`🔰𝗧𝗜𝗧𝗔𝗡 𝗕𝗔𝗧𝗧𝗟𝗘 𝗖𝗛𝗔𝗟𝗟𝗘𝗡𝗚𝗘🔰\n\n` +
            `- You have initiated a Titan battle challenge with a bet of $${betAmount} 💵.\n` +
            `Ask another player to type \`#aot accept\` in this thread to start the fight.`);
    } 

  else if (args[0] === "accept") {
    if (!titanOwners.has(senderID)) {
        return message.reply("You don't own a Titan. Use '#aot list' to show the available Titans and '#aot buy <name_of_the_Titan>' to get one");
    }

    const pendingChallenge = threadStore.get(threadID);

    if (!pendingChallenge) {
        return message.reply("There's no pending Titan battle challenge");
    }

    const { challengerID, betAmount, accepted } = pendingChallenge;

    if (accepted) {
        return message.reply("Someone already accepted this challenge");
    }

    // Check if the user accepting the challenge has the same power level as the challenger
    const challengerPower = getTitanPowerLevel(challengerID);
    const userPower = getTitanPowerLevel(senderID);

    if (userPower !== challengerPower) {
      return message.reply("Notification: You cannot accept the challenge due to different power levels. Challenges can only be accepted if both users have the same power levels in multiplayer. Use '#aot fight' to start the fight from the bot Titans ⚔️");
    }

    if (userPower > challengerPower) {
        return message.reply("You have a higher level, you cannot accept this challenge");
    }
    // Check if the user accepting the challenge is not the same as the challenger
    if (senderID === challengerID) {
        return message.reply("You cannot accept your own challenge");
    }

    const userBalance = await Users.getMoney(senderID);

    if (userBalance < betAmount) {
        return message.reply("You don't have enough money to accept the challenge");
    }

    // Deduct the bet amount from the user's balance
    await Users.decreaseMoney(senderID, betAmount);

    // Set accepted to true to mark the challenge as accepted
    pendingChallenge.accepted = true;
    // React to the message with ⚔️
    message.react('⚔️');
    // Simulate battle delay with a GIF
    const gifStream = await axios.get(CHALLENGE_GIF, { responseType: 'stream' });

    // Wait for the delay
    const delayMessage = await challengeDelayMessage(null, CHALLENGE_DELAY);

    // Send the GIF as a stream
    const gifMessage = await message.reply({
      body: "⚔️ 𝗧𝗜𝗧𝗔𝗡 𝗕𝗔𝗧𝗧𝗟𝗘 𝗖𝗛𝗔𝗟𝗟𝗘𝗡𝗚𝗘 𝗛𝗔𝗦 𝗕𝗘𝗘𝗡 𝗦𝗧𝗔𝗥𝗧𝗘𝗗 🔰",
      attachment: gifStream.data,
    });

    // Check if messages were sent successfully before attempting to unsend
    if (delayMessage && delayMessage.messageID && global.api && global.api.unsendMessage) {
      await global.api.unsendMessage(delayMessage.messageID);
    }

    if (gifMessage && gifMessage.messageID) {
      // Wait for the delay to complete
      await challengeDelayMessage(null, CHALLENGE_DELAY);

      // Unsend the GIF message
      if (global.api && global.api.unsendMessage) {
        await global.api.unsendMessage(gifMessage.messageID);
      }

      // Simulate battle logic (you can customize this based on your requirements)
      const challengerPower = getTitanPowerLevel(challengerID);
      const opponentPower = getTitanPowerLevel(senderID);

      let winnerID, loserID;

      if (challengerPower > opponentPower) {
          winnerID = challengerID;
          loserID = senderID;
      } else if (opponentPower > challengerPower) {
          winnerID = senderID;
          loserID = challengerID;
      } else {
          // If powers are equal, randomly select a winner
          winnerID = Math.random() < 0.5 ? challengerID : senderID;
          loserID = winnerID === challengerID ? senderID : challengerID;
      }

      // Update Titan data for winner and loser
      updateTitanData(winnerID, 'win');
      updateTitanData(loserID, 'lose');

      // Fetch the Titan information of the winner
      const winnerTitan = titanOwners.get(winnerID).selectedTitan;
      const winnerTitanImageStream = await axios.get(winnerTitan.image, { responseType: "stream" });

      // Calculate new balance for the winner
      const newBalance = betAmount * 2;
      const winnerBalance = await Users.increaseMoney(winnerID, newBalance);

      // Get the names of the winner and loser
      const winnerName = await Users.getName(winnerID);
      const loserName = await Users.getName(loserID);

      // Clear the pending challenge in the thread store
      threadStore.delete(threadID);
      saveTitanOwners();

      // Send battle result message with the winner's Titan image
      return message.reply({
          body: `🔰 𝗧𝗜𝗧𝗔𝗡 𝗕𝗔𝗧𝗧𝗟𝗘 𝗥𝗘𝗦𝗨𝗟𝗧 🔰\n━━━━━━━━━━━━━\n` +
              `🏆 𝗪𝗜𝗡𝗡𝗘𝗥: ${winnerName}\n` +
              `🧣 𝗟𝗢𝗦𝗘𝗥: ${loserName}\n` +
              `💲 𝗕𝗘𝗧 𝗔𝗠𝗢𝗨𝗡𝗧: $${newBalance} 💵\n`,
          attachment: winnerTitanImageStream.data,
      });
      }
  } 

  else if (args[0] === "remove") {
      if (!titanOwners.has(senderID)) {
          return message.reply("You don't own a Titan. Use '#aot list' to show the available Titans and '#aot buy <name_of_the_Titan>' to get on");
      }

      const pendingChallenge = threadStore.get(threadID);

      if (!pendingChallenge) {
          return message.reply("𝚃𝚑𝚎𝚛𝚎'𝚜 𝚝𝚘 𝚙𝚎𝚗𝚍𝚒𝚗𝚐 𝚃𝚒𝚝𝚊𝚗 𝙱𝚊𝚝𝚝𝚕𝚎 𝙲𝚑𝚊𝚕𝚕𝚎𝚗𝚐𝚎 𝚝𝚘 𝚌𝚊𝚗𝚌𝚎𝚕");
      }

      const { challengerID, betAmount } = pendingChallenge;

      if (challengerID !== senderID) {
          return message.reply("𝚈𝚘𝚞 𝚍𝚒𝚍 𝚗𝚘𝚝 𝚒𝚗𝚒𝚝𝚒𝚊𝚝𝚎 𝚝𝚑𝚎 𝚌𝚑𝚊𝚕𝚕𝚎𝚗𝚐𝚎, 𝚜𝚘 𝚢𝚘𝚞 𝚌𝚊𝚗'𝚝 𝚌𝚊𝚗𝚌𝚎𝚕 𝚒𝚝");
      }

      // Add the bet amount back to the user's balance
      await Users.increaseMoney(challengerID, betAmount);

      // Remove the pending challenge from the thread store
      threadStore.delete(threadID);

      return message.reply("🏳️ 𝙿𝚎𝚗𝚍𝚒𝚗𝚐 𝚃𝚒𝚝𝚊𝚗 𝙱𝚊𝚝𝚝𝚕𝚎 𝙲𝚑𝚊𝚕𝚕𝚎𝚗𝚐𝚎 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚌𝚊𝚗𝚌𝚎𝚕𝚕𝚎𝚍");
  }

  else if (args[0] === "check") {
    if (!titanOwners.has(senderID)) {
      return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚘𝚠𝚗 𝚊 𝚃𝚒𝚝𝚊𝚗. 𝚄𝚜𝚎 '#𝚊𝚘𝚝 𝚕𝚒𝚜𝚝' 𝚝𝚘 𝚜𝚑𝚘𝚠 𝚝𝚑𝚎 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚃𝚒𝚝𝚊𝚗𝚜 𝚊𝚗𝚍 '#𝚊𝚘𝚝 𝚋𝚞𝚢 <𝚗𝚊𝚖𝚎_𝚘𝚏_𝚝𝚑𝚎_𝚃𝚒𝚝𝚊𝚗>' 𝚝𝚘 𝚐𝚎𝚝 𝚘𝚗𝚎");
    }

    const { powerLevel, selectedTitan, wins, losses } = titanOwners.get(senderID);

    // Fetch the Titan image as a stream using Axios
    const titanImageStream = await axios.get(selectedTitan.image, { responseType: "stream" });

    // Send the Titan information and image as a stream
    return message.reply({
      body: `💀 𝗬𝗼𝘂𝗿 𝗧𝗶𝘁𝗮𝗻 𝗦𝘁𝗮𝘁𝘀 ⚜\n━━━━━━━━━━━━━\n` +
        `🔰 𝗧𝗜𝗧𝗔𝗡: ${selectedTitan.name}\n` +
        `🐎 | 𝗣𝗢𝗪𝗘𝗥 𝗟𝗘𝗩𝗘𝗟: ${powerLevel}\n` +
        `⚔️ | 𝗩𝗜𝗖𝗧𝗢𝗥𝗜𝗘𝗦: ${wins || 0}\n` +
        `🧣 | 𝗗𝗘𝗙𝗘𝗔𝗧𝗦: ${losses || 0}`,
      attachment: titanImageStream.data,
    });
  } 

  else if (args[0] === "kill") {
  const releaseCooldown = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  if (!titanOwners.has(senderID)) {
    return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚘𝚠𝚗 𝚊 𝚃𝚒𝚝𝚊𝚗. 𝚄𝚜𝚎 '#𝚊𝚘𝚝 𝚕𝚒𝚜𝚝' 𝚝𝚘 𝚜𝚑𝚘𝚠 𝚝𝚑𝚎 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚃𝚒𝚝𝚊𝚗𝚜 𝚊𝚗𝚍 '#𝚊𝚘𝚝 𝚋𝚞𝚢 <𝚗𝚊𝚖𝚎_𝚘𝚏_𝚝𝚑𝚎_𝚃𝚒𝚝𝚊𝚗>' 𝚝𝚘 𝚐𝚎𝚝 𝚘𝚗𝚎");
  }

  // Check if enough time has passed since the last release
  const lastReleaseTime = lastReleaseTimestamps.get(senderID) || 0;
  const currentTime = Date.now();

  if (currentTime - lastReleaseTime < releaseCooldown) {
    const remainingTime = releaseCooldown - (currentTime - lastReleaseTime);
    const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
    const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

    return message.reply(`𝚈𝚘𝚞 𝚌𝚊𝚗 𝚔𝚒𝚕𝚕 𝚢𝚘𝚞𝚛 𝚃𝚒𝚝𝚊𝚗 𝚎𝚟𝚎𝚛𝚢 24 𝚑𝚘𝚞𝚛𝚜. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 ${remainingHours} hours and ${remainingMinutes} minutes.`);
  }

  // Retrieve information about the Titan being released
  const { selectedTitan } = titanOwners.get(senderID);

  // Remove the Titan from the user's ownership
  titanOwners.delete(senderID);
  saveTitanOwners(); // Save updated user data

  // Update the last release timestamp for the user
  lastReleaseTimestamps.set(senderID, currentTime);

  // Send the kill message with the GIF
  const killGifStream = await axios.get("https://i.imgur.com/xwmKKRV.gif", { responseType: 'stream' });
  const killMessage = await message.reply({
    body: `𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚟𝚊𝚗𝚒𝚜𝚑𝚎𝚍 𝚢𝚘𝚞𝚛 ${selectedTitan.name} 🗡️`,
    attachment: killGifStream.data,
  });

  // Unsend the kill message after 15 seconds
  setTimeout(async () => {
    if (global.api && global.api.unsendMessage && killMessage && killMessage.messageID) {
      await global.api.unsendMessage(killMessage.messageID);
    }
  }, 40000);

} 



  else if (args[0] === "leaderboard") {
    const sortedUsers = Array.from(titanOwners.entries())
      .map(([userID, userData]) => ({
        userID,
        userData,
        score: (userData.wins || 0) - (userData.losses || 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const leaderboard = await Promise.all(
      sortedUsers.map(async ({ userID, userData, score }) => {
        const userName = await global.controllers.Users.getName(userID);
        const titanName = userData.selectedTitan.name;
        const titanLevel = userData.powerLevel;
        const wins = userData.wins || 0;
        const losses = userData.losses || 0;
        const totalMatches = wins + losses;

        return {
          userName,
          score,
          wins,
          losses,
          titanName,
          titanLevel,
          totalMatches,
        };
      })
    );

    const leaderboardMessage = leaderboard.map(
      (user, index) =>
        `━━━━━━ ${index + 1} ━━━━━━\n➤ ${user.userName}\n🔰 | 𝗧𝗶𝘁𝗮𝗻: ${user.titanName}\n🔝 | 𝗟𝗲𝘃𝗲𝗹: ${user.titanLevel}\n🏆 | 𝗧𝗶𝘁𝗮𝗻 𝗦𝗰𝗼𝗿𝗲: ${user.score}\n⚔️ | 𝗪𝗶𝗻𝘀: ${user.wins} / 𝗟𝗼𝘀𝘀𝗲𝘀: ${user.losses}\n🗡️ | 𝗧𝗼𝘁𝗮𝗹 𝗠𝗮𝘁𝗰𝗵𝗲𝘀: ${user.totalMatches}`
    );

    return message.reply(`🏆 𝗧𝗼𝗽 𝟭𝟬 𝗟𝗲𝗮𝗱𝗲𝗿𝗯𝗼𝗮𝗿𝗱𝘀 🏆\n━━━━━━━━━━━━━\n${leaderboardMessage.join('\n')}`);
  }

    else if (args[0] === "fight") {
      // Check the last fight timestamp for the user
      const lastFightTime = lastFightTimestamps.get(senderID);

      // Check if the user is still on cooldown
      if (lastFightTime && Date.now() - lastFightTime < FIGHT_COOLDOWN) {
        const remainingCooldown = Math.ceil((FIGHT_COOLDOWN - (Date.now() - lastFightTime)) / 1000 / 60);
        return message.reply(`You are on cooldown. Please wait ${remainingCooldown} minutes before the next fight. Challenge other user to fight`);
      }

      // Update the last fight timestamp for the user
      lastFightTimestamps.set(senderID, Date.now());

      // Rest of your existing code for the "fight" command...

      if (!titanOwners.has(senderID)) {
        return message.reply("You don't own a Titan. Use '#aot list' to show the available Titans and '#aot buy <name_of_the_Titan>' to get one");
      }

      if (args.length < 2 || isNaN(args[1])) {
        return message.reply("Usage: `#aot fight <betAmount>`");
      }

      const betAmount = parseInt(args[1]);

      if (betAmount < 1000000000000) {
        return message.reply("Minimum bet amount is $1,000,000,000,000 💵");
      }

    // Check if the user has enough money to initiate the fight
    const userBalance = await Users.getMoney(senderID);

    if (userBalance < betAmount) {
    return message.reply("You don't have enough money to initiate the fight");
    }

    // Deduct the bet amount from the user's balance before the battle
    await Users.decreaseMoney(senderID, betAmount);

    // Simulate battle delay with a GIF
    const gifStream = await axios.get(CHALLENGE_GIF, { responseType: 'stream' });
    message.react('⚔️');

    // Wait for the delay
    const delayMessage = await challengeDelayMessage(null, CHALLENGE_DELAY);

    // Send the GIF as a stream
    const gifMessage = await message.reply({
    body: "⚔️ 𝗧𝗜𝗧𝗔𝗡 𝗙𝗜𝗚𝗛𝗧 𝗛𝗔𝗦 𝗕𝗘𝗘𝗡 𝗦𝗧𝗔𝗥𝗧𝗘𝗗 🔰",
    attachment: gifStream.data,
    });

    // Check if messages were sent successfully before attempting to unsend
    if (delayMessage && delayMessage.messageID && global.api && global.api.unsendMessage) {
    await global.api.unsendMessage(delayMessage.messageID);
    }

    if (gifMessage && gifMessage.messageID) {
    // Wait for the delay to complete
    await challengeDelayMessage(null, CHALLENGE_DELAY);

    // Unsend the GIF message
    if (global.api && global.api.unsendMessage) {
      await global.api.unsendMessage(gifMessage.messageID);
    }

    // Simulate battle logic with a 50% chance of winning
    const isWinner = Math.random() < 0.5;

    // Update Titan data for the user
    const userTitan = titanOwners.get(senderID);

    if (isWinner) {
    userTitan.wins = (userTitan.wins || 0) + 1;
    const winnings = 2 * betAmount;  // Twice the bet amount for a win
    await Users.increaseMoney(senderID, winnings);
    saveTitanOwners();

    // Fetch the Titan information of the winner
    const winnerTitan = userTitan.selectedTitan;
    const winnerTitanImageStream = await axios.get(winnerTitan.image, { responseType: "stream" });
    message.react('🏆');
    return message.reply({
      body: `🔰 𝗬𝗼𝘂'𝘃𝗲 𝘄𝗼𝗻 𝘁𝗵𝗲 𝗳𝗶𝗴𝗵𝘁! 🔰\n━━━━━━━━━━━━━\n` +
            `🏆 𝗪𝗶𝗻𝗻𝗲𝗿: ${winnerTitan.name}\n` +
            `💲 𝗕𝗲𝘁 𝗔𝗺𝗼𝘂𝗻𝘁: ${betAmount} 💵\n` +
            `💰 Winnings: ${winnings} 💵\n`,
      attachment: winnerTitanImageStream.data,
    });
    } else {
    userTitan.losses = (userTitan.losses || 0) + 1;
    const lostAmount = betAmount;
    saveTitanOwners();

    // Bot wins, select a random Titan from the list
    const botTitan = titanList[Math.floor(Math.random() * titanList.length)];
    const botTitanImageStream = await axios.get(botTitan.image, { responseType: "stream" });

    return message.reply({
      body: `🔰 𝗬𝗼𝘂'𝘃𝗲 𝗹𝗼𝘀𝘁 𝘁𝗵𝗲 𝗙𝗶𝗴𝗵𝘁 🔰\n━━━━━━━━━━━━━\n` +
            `🏆 𝗧𝗵𝗲 𝗕𝗼𝘁 𝗧𝗶𝘁𝗮𝗻: ${botTitan.name}\n💲 𝗕𝗲𝘁 𝗔𝗺𝗼𝘂𝗻𝘁:${lostAmount}`,
      attachment: botTitanImageStream.data,
          });
        }
      }
    }


 else if (args[0] === "list") {
    const titanNames = titanList.map(titan => titan.name).join('\n');
    return message.reply(`📜 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗧𝗶𝘁𝗮𝗻𝘀 📜\n━━━━━━━━━━━━━\n${titanNames}`);
  } else {
  return message.reply({
    body: `⚜ 𝗔𝗧𝗧𝗔𝗖𝗞 𝗢𝗡 𝗧𝗜𝗧𝗔𝗡 🔰\n━━━━━━━━━━━━━\n` +
      "- Use the following commands:\n" +
      "1. #aot buy <titanName> » Buy a Titan 💀.\n" +
      "2. #aot upgrade » Upgrade your Titan 🔝.\n" +
      "3. #aot fight <betAmount> » Fight to the bot Titans ⚔️.\n" +
      "4. #aot challenge <betAmount> » Initiate a multiplayer Titan battle challenge ⚔️.\n" +
      "5. #aot accept » Accept a pending Titan battle challenge 🔥.\n" +
      "6. #aot remove » Remove the challenge created 🏳️.\n" +
      "7. #aot check » Check your Titan stats 📜.\n" + 
      "8. #aot leaderboard » Check the top Titan users score 🏆.\n" +
      "9. #aot list » Show available Titans 📜.\n" +
      "10. #aot kill » Remove your Titan 🗡️.\n", 
    attachment: await axios.get("https://i.imgur.com/IYhO1DX.png", { responseType: "stream" }).then(response => response.data),
    });
  }
}

export default {
  config,
  onCall
};
