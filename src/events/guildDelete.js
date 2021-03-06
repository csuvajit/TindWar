const serverClanDB = require("../database/serverClanData");
const waitListDb = require("../database/warMatch");

module.exports.run = async (client, guild) => {
    const logChannel = client.channels.cache.get(process.env.BOT_LOG);
    return logChannel?.send(`\`\`\`arm\nBot has left ${guild.name} \nOwner ID: ${guild.ownerID}\nServer ID: ${guild.id}\`\`\``);
};
