const core = require('@actions/core');
//const github = require('@actions/github');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const targetChatId = process.env.TELEGRAM_CHAT_ID;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
async function sendMessage() {
	const who = core.getInput('who-to-greet');

	try {
		await bot.sendMessage(targetChatId, `Workflow ejecutado correctamente tras el último commit. Saludos ${who}`);
		console.log("Mensaje enviado");
	} catch (e) {
		console.error(e);
		process.exit(1);
	}

	process.exit(0);
}

sendMessage();
/*bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Chat id: ' + chatId);
});*/

