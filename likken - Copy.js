const mineflayer = require('mineflayer');
const readline = require('readline');

// Lijst met accounts
const accounts = [
    { username: 'ostbyclevepn@outlook.com', auth: 'microsoft' },
    { username: 'cohonbruntyb@outlook.com', auth: 'microsoft' },
    { username: 'kealyleiba0v@outlook.com', auth: 'microsoft' },
    { username: 'glawebybellq@outlook.com', auth: 'microsoft' },
    { username: 'plottdrustai@outlook.com', auth: 'microsoft' },
    { username: 'cleinkobisg6@outlook.com', auth: 'microsoft' },
    { username: 'jamenzies007@outlook.com', auth: 'microsoft' },
    { username: 'kev825242@hotmail.com', auth: 'microsoft' },
    { username: 'hansol0824@outlook.com', auth: 'microsoft' },
    { username: 'lufe_bm@hotmail.com', auth: 'microsoft' },

];

const bots = {}; // Object om bots op te slaan

// Functie om een bot te starten
function startBot(account, index) {
  console.log(`⏳ Probeer in te loggen met account: ${account.username}`);

  const bot = mineflayer.createBot({
    host: 'eu.donutsmp.net',
    username: account.username,
    auth: account.auth,
    version: false, // Automatische versie-detectie
  });

  bot.on('login', () => console.log(`🔐 Bot ${index + 1} is ingelogd!`));
  bot.on('spawn', () => {
    console.log(`✅ Bot ${index + 1} (${account.username}) ingelogd!`);
    bots[index + 1] = bot; // Opslaan in de lijst met ingelogde bots
  });
  bot.on('end', (reason) => {
    console.log(`🔴 Bot ${index + 1} (${account.username}) uitgelogd! Reden: ${reason}`);
    delete bots[index + 1]; // Verwijderen uit de lijst met ingelogde bots
  });
  bot.on('kicked', (reason) => console.error(`⚠️ Bot ${index + 1} werd gekickt! Reden: ${JSON.stringify(reason, null, 2)}`));
  bot.on('error', (err) => console.error(`❌ Fout bij bot ${index + 1}:`, err));

  // Toon chatberichten in de console
  bot.on('message', (jsonMsg) => {
    console.log(`💬 Bot ${index + 1} (${account.username}) - Chat: ${jsonMsg.toString()}`);
  });
}

// ✅ Start ALLE bots met een vertraging tussen elke inlog
accounts.forEach((account, index) => {
  const delay = index * 1000; // Vertraging van 6 seconden per bot
  setTimeout(() => startBot(account, index), delay); // Start bot na vertraging
});

// Readline interface om commando's naar bots te sturen
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log("Gebruik 'nummer: commando' om een bot een bericht te laten sturen.");
console.log("Gebruik 'all: commando' om alle bots een bericht te laten sturen.");

rl.on('line', (input) => {
  const [botIndex, ...command] = input.split(':');
  const commandText = command.join(':').trim();

  if (botIndex.trim().toLowerCase() === 'all') {
    Object.values(bots).forEach(bot => bot.chat(commandText));
    console.log(`📢 Commando gestuurd naar alle ingelogde bots: ${commandText}`);
  } else {
    const bot = bots[parseInt(botIndex.trim())];
    if (bot) {
      bot.chat(commandText);
      console.log(`📩 Commando gestuurd naar bot ${botIndex}: ${commandText}`);
    } else {
      console.log(`⚠️ Bot ${botIndex} is niet ingelogd!`);
    }
  }
});
