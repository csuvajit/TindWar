const { CommandHandler, ListenerHandler } = require('../../packages');
const Discord = require('discord.js');
const Db = require('./Database');
const Settings = require('./Settings');
const path = require('path');

class Client extends Discord.Client {
	constructor() {
		super({ intents: Discord.Intents.ALL });

		this.db = new Db();
		this.commandHandler = new CommandHandler(this, {
			directory: path.join(__dirname, '..', 'commands')
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: path.join(__dirname, '..', 'listeners')
		});
	}

	async _init() {
		this.commandHandler.load();
		this.listenerHandler.load();

		this.settings = new Settings();
		await this.settings.init();
	}

	async start(token) {
		await this._init();
		return this.login(token);
	}
}

module.exports = Client;