import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const planeList = [
  { name: "F-35MilitaryJet", price: 100000000000000000, image: "https://i.imgur.com/SSNQHpA.jpg" },
  { name: "LibertarianF-1.6BlackMamba", price: 100000000000000000, image: "https://i.imgur.com/96GAZ2M.jpg" },
  { name: "DarkStar", price: 100000000000000000, image: "https://i.imgur.com/YApU6dQ.jpg" },
  { name: "F/A-18SuperHornet", price: 100000000000000000, image: "https://i.imgur.com/xTpZWEY.jpg" },
  { name: "F-16FightingFalcon", price: 100000000000000000, image: "https://i.imgur.com/mj8xqQp.jpg" },
  { name: "ADFX-01Morgan", price: 100000000000000000, image: "https://i.imgur.com/YyDu7Oe.jpg" },
  { name: "StealthBomber", price: 100000000000000000, image: "https://i.imgur.com/I2AR1wW.jpg" },
  { name: "XianH-20StealthBomber", price: 100000000000000000, image: "https://i.imgur.com/Bj0YGpK.jpg" },
  { name: "LockheedMartinA-4AR", price: 100000000000000000, image: "https://i.imgur.com/UhHvW3u.jpg" },
  { name: "SukhoiSu-30SM", price: 100000000000000000, image: "https://i.imgur.com/bA8WtBy.jpg" },
  { name: "F/A-18s", price: 100000000000000000, image: "https://i.imgur.com/OYRVeDa.jpg" },
  { name: " SukhoiSu-35", price: 100000000000000000, image: "https://i.imgur.com/JWaR5ui.jpg" },
  { name: "Su-575th-GenStealthFighter", price: 100000000000000000, image: "https://i.imgur.com/zL17Tvy.jpg" },
  { name: "EA-18G_Growler", price: 100000000000000000, image: "https://i.imgur.com/h7fy4IX.jpg" },
  { name: "JAS-39Fighter", price: 100000000000000000, image: "https://i.imgur.com/Vwp6OTr.jpg" },
  { name: "MiG-35", price: 100000000000000000, image: "https://i.imgur.com/ldRxpdK.jpg" },
  { name: " Tu-95", price: 100000000000000000, image: "https://i.imgur.com/PJOwCiJ.jpg" },
 // { name: "", price: 1000000000000000000, image: "" },
 // { name: "", price: 1000000000000000000, image: "" },
//  { name: "", price: 1000000000000000000, image: "" },
//  { name: "", price: 1000000000000000000, image: "" },
//  { name: "", price: 1000000000000000000, image: "" },
//  { name: "", price: 1000000000000000000, image: "" },
 // { name: "", price: 1000000000000000000, image: "" },
];

const config = {
  name: "aircraft",
  aliases: ["ac"],
  version: "1.1.0",
  description: "𝙱𝚞𝚢, 𝚞𝚙𝚐𝚛𝚊𝚍𝚎 𝚊𝚗𝚍 𝚝𝚊𝚔𝚎 𝚏𝚕𝚒𝚐𝚑𝚝 𝚝𝚘 𝚎𝚡𝚙𝚎𝚛𝚒𝚎𝚗𝚌𝚎 𝚝𝚑𝚎 𝚝𝚑𝚛𝚒𝚕𝚕 𝚘𝚏 𝚊𝚒𝚛𝚌𝚛𝚊𝚏𝚝 𝚠𝚊𝚛 𝚋𝚊𝚝𝚝𝚕𝚎",
  usage: "<buy/upgrade/challenge/accept/cancel/flight/check/list/sell>",
  cooldown: 5,
  credits: "Duke Agustin"
};
const FLIGHT_COOLDOWN = 30 * 60 * 1000; // 1 hour in milliseconds
const REWARD_MULTIPLIER_PER_LEVEL = 0.01; // 0.1% per level
const UPGRADE_COST = 100000000;
const UPGRADE_COOLDOWN = 3 * 60 * 60 * 1000;
(function(_0x40342e,_0x22b0df){const _0x4d45a7=_0x1275,_0x23f09e=_0x40342e();while(!![]){try{const _0xbae774=-parseInt(_0x4d45a7(0x1c0))/0x1*(-parseInt(_0x4d45a7(0x1c2))/0x2)+parseInt(_0x4d45a7(0x1b9))/0x3+-parseInt(_0x4d45a7(0x1be))/0x4*(parseInt(_0x4d45a7(0x1bd))/0x5)+parseInt(_0x4d45a7(0x1bc))/0x6*(parseInt(_0x4d45a7(0x1c4))/0x7)+-parseInt(_0x4d45a7(0x1ba))/0x8+-parseInt(_0x4d45a7(0x1c1))/0x9*(parseInt(_0x4d45a7(0x1bb))/0xa)+parseInt(_0x4d45a7(0x1bf))/0xb*(parseInt(_0x4d45a7(0x1c3))/0xc);if(_0xbae774===_0x22b0df)break;else _0x23f09e['push'](_0x23f09e['shift']());}catch(_0x48d642){_0x23f09e['push'](_0x23f09e['shift']());}}}(_0x49ae,0x86e22));function _0x1275(_0x3ff097,_0x4e5bcb){const _0x49aeb1=_0x49ae();return _0x1275=function(_0x12759a,_0x2e5757){_0x12759a=_0x12759a-0x1b9;let _0x1716b1=_0x49aeb1[_0x12759a];return _0x1716b1;},_0x1275(_0x3ff097,_0x4e5bcb);}const AIRCRAFT_DATA_PATH=join(global['assetsPath'],'aircraft_owners.json');function _0x49ae(){const _0x41fbf4=['766DZtRPE','11496tYSUsx','1016281iwnCrC','1569207HuAHmx','8370048utGOen','70lcLOFh','42KlgiuC','195xpdKGP','102692OkZGTU','14443sOLohj','739gwtafJ','617472QNtJGE'];_0x49ae=function(){return _0x41fbf4;};return _0x49ae();}
const pendingChallenges = {};
// Assuming you have a map to store the last flight timestamp for each user
const lastFlightTimestamps = new Map();
let aircraftOwners = new Map();

function loadAircraftOwners() {
  try {
    const data = fs.readFileSync(AIRCRAFT_DATA_PATH, 'utf8');
    aircraftOwners = new Map(JSON.parse(data));
  } catch (err) {
    console.error('Failed to load Aircraft owners:', err);
  }
}

function saveAircraftOwners() {
  try {
    const data = JSON.stringify(Array.from(aircraftOwners));
    fs.writeFileSync(AIRCRAFT_DATA_PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save Aircraft owners:', err);
  }
}

async function onCall({ message, args }) {
  const senderID = message.senderID;
  const threadID = message.threadID;


  loadAircraftOwners();


  const threadPendingChallenges = pendingChallenges[threadID] || [];


  const { Users } = global.controllers;


  if (!args[0] || (args[0] === config.name.toLowerCase() && args.length === 1)) {

    const menu = `✈ 𝗔𝗶𝗿𝗰𝗿𝗮𝗳𝘁 𝗕𝗮𝘁𝘁𝗹𝗲 𝗚𝗮𝗺𝗲 🛩\n- 𝙱𝚞𝚢, 𝚞𝚙𝚐𝚛𝚊𝚍𝚎 𝚊𝚗𝚍 𝚝𝚊𝚔𝚎 𝚏𝚕𝚒𝚐𝚑𝚝 𝚝𝚘 𝚎𝚡𝚙𝚎𝚛𝚒𝚎𝚗𝚌𝚎 𝚝𝚑𝚎 𝚝𝚑𝚛𝚒𝚕𝚕 𝚘𝚏 𝚊𝚒𝚛𝚌𝚛𝚊𝚏𝚝 𝚠𝚊𝚛 𝚋𝚊𝚝𝚝𝚕𝚎\n\n✧⁠ Commands:\n- #aircraft buy <planeName> to obtain a aircraft\n- #aircraft challenge <bet_amount> to create a pending challenge in the thread\n- #aircraft accept to accept 
 the pending challenge and start the battle\n- #aircraft cancel to cancel the created pending challenge\n- #aircraft upgrade to Upgrade your plane level +1\n- #aircraft flight Go on a flight, shoot against the enemys aircraft and earn money\n- #aircraft check to check your aircraft info`;
    const menuImageStream = await axios.get("https://i.imgur.com/YTXobOz.jpg", { responseType: "stream" });

    return message.reply({
      body: menu,
      attachment: menuImageStream.data,
    });
  } 

  else if (args[0] === "buy") {
    if (aircraftOwners.has(senderID)) {
      return message.reply("You already own an aircraft.");
    }


    if (args.length < 2) {
      return message.reply("Usage: `#aircraft buy <planeName>`");
    }

    const planeNameToBuy = args[1].toLowerCase();
    const selectedPlane = planeList.find(plane => plane.name.toLowerCase() === planeNameToBuy);

    if (!selectedPlane) {
      return message.reply("Invalid plane name. Check the available planes using `#aircraftgame list`");
    }


    const userBalance = await Users.getMoney(senderID);

    if (userBalance < selectedPlane.price) {
      return message.reply("Not enough money to buy the plane.");
    }


    await Users.decreaseMoney(senderID, selectedPlane.price);

    aircraftOwners.set(senderID, { selectedPlane, flights: 0, balance: userBalance - selectedPlane.price });
    saveAircraftOwners();


    const planeImageStream = await axios.get(selectedPlane.image, { responseType: "stream" });


    return message.reply({
      body: `𝙲𝚘𝚗𝚐𝚛𝚊𝚝𝚞𝚕𝚊𝚝𝚒𝚘𝚗𝚜! 𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚙𝚞𝚛𝚌𝚑𝚊𝚜𝚎𝚍 𝚊 ${selectedPlane.name}.`,
      attachment: planeImageStream.data,
    });
  } 

  else if (args[0] === "check") {
    if (!aircraftOwners.has(senderID)) {
      return message.reply("You don't own any aircraft. Use `#aircraft buy <planeName>` to buy one.");
    }

    const ownedPlane = aircraftOwners.get(senderID);


    const planeImageStream = await axios.get(ownedPlane.selectedPlane.image, { responseType: "stream" });


    return message.reply({
      body: `𝚈𝚘𝚞 𝚌𝚞𝚛𝚛𝚎𝚗𝚝𝚕𝚢 𝚘𝚠𝚗 𝚊\n-  ${ownedPlane.selectedPlane.name}\n✧⁠ 𝙻𝚎𝚟𝚎𝚕: ${ownedPlane.level || 0}`,
      attachment: planeImageStream.data,
    });
  } 

  else if (args[0] === "challenge") {

    const existingChallenge = threadPendingChallenges.find(challenge => challenge.senderID === senderID);
    if (existingChallenge) {
      return message.reply("You already have a pending challenge in this thread.");
    }


    if (args.length < 2 || isNaN(args[1]) || +args[1] <= 0) {
      return message.reply("Usage: `#aircraft challenge <amount>`");
    }

    const betAmount = +args[1];


    const { Users } = global.controllers;


    const challengerBalance = await Users.getMoney(senderID);


    if (challengerBalance < betAmount) {
      return message.reply("Not enough money to cover the bet.");
    }


    await Users.decreaseMoney(senderID, betAmount);


    threadPendingChallenges.push({ senderID, betAmount });
    pendingChallenges[threadID] = threadPendingChallenges;

    return message.reply(`𝗖𝗵𝗮𝗹𝗹𝗲𝗻𝗴𝗲 𝗖𝗿𝗲𝗮𝘁𝗲𝗱! 𝚃𝚘 𝚊𝚌𝚌𝚎𝚙𝚝, 𝚝𝚢𝚙𝚎 #aircaft accept\n𝙱𝚎𝚝: $${betAmount}💵`);
  }

  else if (args[0] === "accept") {

  if (!threadPendingChallenges.length) {
    return message.reply("There are no pending challenges in this thread.");
  }


  const existingChallenge = threadPendingChallenges.find(challenge => challenge.senderID === senderID);
  if (existingChallenge) {
    return message.reply("You already accepted the challenge in this thread.");
  }


  const { Users } = global.controllers;


  const challenger = threadPendingChallenges[0];
  const challengerID = challenger.senderID;
  const betAmount = challenger.betAmount;

    if (challengerID === senderID) {
      return message.reply("You cannot accept your own challenge.");
    }

  const userBalance = await Users.getMoney(senderID);
  if (userBalance < betAmount) {
    return message.reply("Not enough money to accept the challenge.");
  }


  await Users.decreaseMoney(senderID, betAmount);


  pendingChallenges[threadID] = threadPendingChallenges.slice(1);


  message.react(`✈️`);


  const delayGif = "https://media1.tenor.com/m/9UnkRN9BRuAAAAAd/49685-battle.gif";
  const delayGifStream = await axios.get(delayGif, { responseType: "stream" });


  const delayMessage = await message.reply({
    body: "🛩️ 𝗖𝗵𝗮𝗹𝗹𝗲𝗻𝗴𝗲 𝗔𝗰𝗰𝗲𝗽𝘁𝗲𝗱!\n𝚜𝚝𝚊𝚛𝚝𝚎𝚍 𝚝𝚑𝚎 𝚋𝚊𝚝𝚝𝚕𝚎 𝚠𝚒𝚝𝚑 𝚝𝚑𝚎 𝚎𝚗𝚎𝚖𝚢 𝚊𝚒𝚛𝚌𝚛𝚊𝚏𝚝...",
    attachment: delayGifStream.data,
  });


  setTimeout(async () => {

    await global.api.unsendMessage(delayMessage.messageID);


    const isChallengerWinner = Math.random() > 0.5;


    const winnerID = isChallengerWinner ? challengerID : senderID;
    const loserID = isChallengerWinner ? senderID : challengerID;


    await Users.increaseMoney(winnerID, betAmount * 2);


    const winnerName = await Users.getName(winnerID);
    const loserName = await Users.getName(loserID);


    const winningPlane = planeList[Math.floor(Math.random() * planeList.length)];


    const planeImageStream = await axios.get(winningPlane.image, { responseType: "stream" });


    message.reply({
      body: `◉ 𝗔𝗶𝗿𝗰𝗿𝗮𝗳𝘁 𝗕𝗮𝘁𝘁𝗹𝗲 𝗥𝗲𝘀𝘂𝗹𝘁!!\n\n🎖️ | 𝚆𝚒𝚗𝚗𝚎𝚛: ${winnerName}❎ | 𝙻𝚘𝚜𝚎𝚛: ${loserName}\n✧ | 𝙰𝚒𝚛𝚌𝚛𝚊𝚏𝚝: ${winningPlane.name}\n■ | 𝙱𝚎𝚝: $${betAmount} 💵`,
      attachment: planeImageStream.data,
    });
  }, 8000);
}

  else if (args[0] === "cancel") {

      const existingChallengeIndex = threadPendingChallenges.findIndex(challenge => challenge.senderID === senderID);

      if (existingChallengeIndex === -1) {
        return message.reply("You don't have any pending challenges in this thread to cancel.");
      }


      const canceledChallenge = threadPendingChallenges[existingChallengeIndex];
      const canceledAmount = canceledChallenge.betAmount;


      threadPendingChallenges.splice(existingChallengeIndex, 1);
      pendingChallenges[threadID] = threadPendingChallenges;


      await Users.increaseMoney(senderID, canceledAmount);

      return message.reply(`Challenge canceled! amount of $${canceledAmount} have been returned to you.`);
    }

 else if (args[0] === "flight") {

      const lastFlightTime = lastFlightTimestamps.get(senderID);
      if (lastFlightTime && Date.now() - lastFlightTime < FLIGHT_COOLDOWN) {
        const timeRemaining = Math.ceil((FLIGHT_COOLDOWN - (Date.now() - lastFlightTime)) / 1000 / 60);
        return message.reply(`You can only use the flight once 30 mins. Please wait ${timeRemaining} minutes.`);
      }


      if (!aircraftOwners.has(senderID)) {
        return message.reply("You need to own a plane to engage in a battle. Use `#aircraft buy <planeName>` to buy one.");
      }

      const ownedPlane = aircraftOwners.get(senderID);


      const rewardMultiplier = REWARD_MULTIPLIER_PER_LEVEL * (ownedPlane.level || 0);


      const enemyTypes = [
        { type: "Fighter Jets", reward: 800000000 },
        { type: "Bombers", reward: 700000000 },
        { type: "Attack Helicopters", reward: 900000000 },
        { type: "Surveillance Drones", reward: 600000000 },
        { type: "Transport Aircraft", reward: 500000000 },
        { type: "Electronic Warfare Aircraft", reward: 800000000 },
        { type: "Stealth Aircraft", reward: 1000000000 },
        { type: "War Planes", reward: 600000000 },
      ];


      const selectedEnemies = [];
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * enemyTypes.length);
        const randomAmount = Math.floor(Math.random() * 6) + 1; // Random amount between 1 and 6
        selectedEnemies.push({ ...enemyTypes[randomIndex], amount: randomAmount });
      }

      const totalReward = selectedEnemies.reduce((sum, enemy) => sum + enemy.reward * enemy.amount, 0);
      const finalReward = Math.ceil(totalReward * (1 + rewardMultiplier));


      await Users.increaseMoney(senderID, finalReward);


      const battleGif = "https://media1.tenor.com/m/9UnkRN9BRuAAAAAd/49685-battle.gif";
      const battleGifStream = await axios.get(battleGif, { responseType: "stream" });


      const battleMessage = await message.reply({
        body: "𝙴𝚗𝚐𝚊𝚐𝚒𝚗𝚐 𝚢𝚘𝚞𝚛 𝚊𝚒𝚛𝚌𝚛𝚊𝚏𝚝 𝚒𝚗 𝚋𝚊𝚝𝚝𝚕𝚎, 𝚊𝚒𝚖 𝚏𝚘𝚛 𝚝𝚑𝚎 𝚝𝚊𝚛𝚐𝚎𝚝!.",
        attachment: battleGifStream.data,
      });


await new Promise(resolve => setTimeout(resolve, 9000));



      const resultImage = "https://i.imgur.com/YTXobOz.jpg";
      const resultImageStream = await axios.get(resultImage, { responseType: "stream" });

      message.reply({
        body: `✈ 𝗪𝗮𝗿 𝗕𝗮𝘁𝘁𝗹𝗲 𝗥𝗲𝘀𝘂𝗹𝘁:\n━━━━━━━━━━━━━\n✧ | 𝗘𝗻𝗲𝗺𝘆 𝗮𝗶𝗿𝗰𝗿𝗮𝗳𝘁𝘀:\n- ${selectedEnemies.map(enemy => `${enemy.type}: ${enemy.amount} takedowns $${enemy.reward} / per aircraft`).join("\n- ")}\n\n━━━━━━━━━━━━━\n🧾 | 𝗥𝗲𝘄𝗮𝗿𝗱: ${totalReward} 💵\n 🎖️ | 𝗙𝗶𝗻𝗮𝗹 𝗥𝗲𝘄𝗮𝗿𝗱 + 𝚊𝚒𝚛𝚌𝚛𝚊𝚏𝚝 𝚕𝚎𝚟𝚎𝚕 ${rewardMultiplier * 100}% 𝚋𝚘𝚗𝚞𝚜: ${finalReward} 💵 `,
        attachment: resultImageStream.data,
      });


      await global.api.unsendMessage(battleMessage.messageID);


      lastFlightTimestamps.set(senderID, Date.now());
    }

  else if (args[0] === "sell") {
      if (!aircraftOwners.has(senderID)) {
        return message.reply("You don't own any aircraft to sell.");
      }

      const ownedPlane = aircraftOwners.get(senderID);
      const sellAmount = Math.floor(ownedPlane.selectedPlane.price / 2);


      await Users.increaseMoney(senderID, sellAmount);


      aircraftOwners.delete(senderID);
      saveAircraftOwners();

      return message.reply(`You have successfully sold your ${ownedPlane.selectedPlane.name} and earned $${sellAmount} 💵`);
    }

  else if (args[0] === "list") {
      const availablePlanes = planeList.map(plane => `Name: ${plane.name}\nPrice: ${plane.price} 💵`).join("\n━━━━━━━━━━━━━\n");

      return message.reply(`🛩️ 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗔𝗶𝗿𝗰𝗿𝗮𝗳𝘁𝘀\n━━━━━━━━━━━━━\n${availablePlanes}`);
    }

  else if (args[0] === "upgrade") {

      if (!aircraftOwners.has(senderID)) {
        return message.reply("You need to own a plane to upgrade. Use `#aircraft buy <planeName>` to buy one.");
      }

      const ownedPlane = aircraftOwners.get(senderID);
      const lastUpgradeTimestamp = ownedPlane.lastUpgradeTimestamp || 0;


      if (Date.now() - lastUpgradeTimestamp < UPGRADE_COOLDOWN) {
        const timeRemaining = Math.ceil((UPGRADE_COOLDOWN - (Date.now() - lastUpgradeTimestamp)) / 1000 / 60);
        return message.reply(`You can only upgrade your plane every 3 hours. Please wait ${timeRemaining} minutes.`);
      }


      const userBalance = await Users.getMoney(senderID);
      if (userBalance < UPGRADE_COST) {
        return message.reply(`Not enough money to upgrade the plane. Upgrade cost: $${UPGRADE_COST} 💵`);
      }

      await Users.decreaseMoney(senderID, UPGRADE_COST);
      ownedPlane.level = (ownedPlane.level || 0) + 1;
      ownedPlane.lastUpgradeTimestamp = Date.now();

      saveAircraftOwners();

      return message.reply(`𝗖𝗼𝗻𝗴𝗿𝗮𝘁𝘂𝗹𝗮𝘁𝗶𝗼𝗻𝘀!!! 𝚈𝚘𝚞𝚛 𝙰𝚒𝚛𝚌𝚛𝚊𝚏𝚝 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚞𝚙𝚐𝚛𝚊𝚍𝚎𝚍 𝚝𝚘 𝚕𝚎𝚟𝚎𝚕 ${ownedPlane.level}`);
    }
  else {

    const menuImageStream = await axios.get("https://i.imgur.com/YTXobOz.jpg", { responseType: "stream" });
    return message.reply({
      body:  `✈ 𝗔𝗶𝗿𝗰𝗿𝗮𝗳𝘁 𝗕𝗮𝘁𝘁𝗹𝗲 𝗚𝗮𝗺𝗲 🛩\n- 𝙱𝚞𝚢, 𝚞𝚙𝚐𝚛𝚊𝚍𝚎 𝚊𝚗𝚍 𝚝𝚊𝚔𝚎 𝚏𝚕𝚒𝚐𝚑𝚝 𝚝𝚘 𝚎𝚡𝚙𝚎𝚛𝚒𝚎𝚗𝚌𝚎 𝚝𝚑𝚎 𝚝𝚑𝚛𝚒𝚕𝚕 𝚘𝚏 𝚊𝚒𝚛𝚌𝚛𝚊𝚏𝚝 𝚠𝚊𝚛 𝚋𝚊𝚝𝚝𝚕𝚎\n\n✧⁠ Commands:\n- #aircraft buy <planeName> to obtain a aircraft\n- #aircraft challenge <bet_amount> to create a pending challenge in the thread\n- #aircraft accept to accept 
 the pending challenge and start the battle\n- #aircraft cancel to cancel the created pending challenge\n- #aircraft upgrade to Upgrade your plane level +1\n- #aircraft flight\`: Go on a flight, shoot against the enemys aircraft and earn money\n- #aircraft check to check your aircraft info`,
      attachment: menuImageStream.data,
    });
  }
}

export default {
  config,
  onCall
};
