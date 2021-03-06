const Discord = require("discord.js");
const chalk = require("chalk");
const OWNERS = [process.env.OWNER_1, process.env.OWNER_2, process.env.OWNER_3];

module.exports.run = async (client, interaction) => {
    const guild = client.guilds.cache.get(interaction.guild_id);
    if (!guild) {
        return client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: 'This command doesn\'t work in DM.'
                }
            }
        }).catch(() => null);
    }
    const slash = client.interactions.get(interaction.data.name);
    if (!slash) return;
    const member = await guild.members.fetch(interaction.member.user.id).catch(() => null);
    if (!member) return;

    // Acknowledging the interaction
    await client.api.interactions(interaction.id, interaction.token).callback.post({
        data: { type: 5 }
    }).catch(() => null);

    // checking permissions for the command user
    if (slash.permissions && !member.permissions.has(slash.permissions) && !OWNERS.includes(interaction.member.user.id)) {
        const error_embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setDescription(`Need ${slash.permissions} or higher permission for you to use this command!`);

        return client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({
            data: { embeds: [error_embed] }
        });
    }

    const date = new Date();
    try {
        await slash.run(client, interaction, interaction.data.options, guild);
        console.log(`>> ${chalk.green(date.toUTCString())}-${interaction.guild_id}: ${interaction.member.user.username}#${interaction.member.user.discriminator}: ${chalk.green(interaction.data.name)}`);
    } catch (error) {
        console.log(`${chalk.red(error)}: ${chalk.green(date.toUTCString())}-${interaction.guild_id}: ${interaction.member.user.username}#${interaction.member.user.discriminator}: ${chalk.red(interaction.data.name)}\n${error.message}`);
    }
};
