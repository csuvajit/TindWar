const Structures = require('../util/Structures');
const { Collection } = require('discord.js');

class ListenerHandler extends Structures.Handler {
	constructor(client, { directory } = {}) {
		super(client, { directory });
		this.emitters = new Collection();
		this.emitters.set('client', this.client);
	}

	construct(listener) {
		super.construct(listener);
		this.addToEmitter(listener.id);
		return listener;
	}

	addToEmitter(id) {
		const listener = this.modules.get(id.toString());
		if (!listener) throw new Error('MODULE_NOT_FOUND');

		const emitter = this.emitters.get(listener.emitter);
		if (!this.isEventEmitter(emitter)) throw new Error('INVALID_EVENT_EMITTIER');

		if (listener.type === 'once') {
			emitter.once(listener.event, listener.exec.bind(listener));
			return listener;
		}

		emitter.on(listener.event, listener.exec.bind(listener));
		return listener;
	}

	setEmitters(emitters) {
		for (const [key, value] of Object.entries(emitters)) {
			if (!this.isEventEmitter(value)) throw new Error('INVALID_EVENT_EMITTIER');
			this.emitters.set(key, value);
		}

		return this;
	}

	isEventEmitter(value) {
		return value && typeof value.on === 'function' && typeof value.emit === 'function';
	}
}

module.exports = ListenerHandler;
