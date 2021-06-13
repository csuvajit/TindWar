const Discord = require("discord.js");
const serverDB = require("../Database/serverClanData");             // server-clan database
const warMatchDB = require("../Database/warMatch");                 // wait list/ war-match Database

module.exports.run = async (client, interaction, options) => {

    // getting clan from wait list
    const wait_list = await warMatchDB.getAll();
    // getting server details
    const issue_server = await serverDB.getServer(interaction.guild_id);


    // if the server isn't registered
    if (!issue_server) {

        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setDescription("You **have not** registered any clan or details for this server. First complete that using `register` slash command!");

        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [embed] }
        });
    }

    // if there is a clan in wait list
    if (wait_list) {

        // if same server war search twice in a row
        if (wait_list.clan_tag === issue_server.clan_tag) {
            // sending the wait message
            const embed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Still No match found!");

            return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
                data: { embeds: [embed] }
            });
        }

        // message that will go in wait list clan's server
        const target_channel = client.channels.cache.get(wait_list.channel_id);
        const target_channel_embed = new Discord.MessageEmbed()
            .setColor()
            .setTitle("Match Found!")
            .setDescription(`**Team - ${issue_server.team_name}**\n**Clan - [${issue_server.clan_name}-${issue_server.clan_tag}]()`)
            .addField("__Server Invite__", issue_server.server_invite)
            .addField("__Representative__", issue_server.representative_id)
            .setThumbnail()
            .setTimestamp();

        // message that will go in command issuer's channel
        const issuer_embed = new Discord.MessageEmbed()
            .setColor()
            .setTitle("Match Found!")
            .setDescription(`**Team - ${wait_list.team_name}**\n**Clan - [${wait_list.clan_name}-${wait_list.clan_tag}]()`)
            .addField("__Server Invite__", wait_list.server_invite)
            .addField("__Representative__", wait_list.representative_id)
            .setThumbnail()
            .setTimestamp();

        // sending the messages
        target_channel.send(target_channel_embed);
        client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [issuer_embed] }
        });

        // deleting wait entry
        await warMatchDB.deleteClanByServer(wait_list.server_id);
        return;
    }

    else {
        // saving the issue in wait list
        await warMatchDB.addClan(issue_server.clan_tag, `${options[0].value} hours`, options[0].value, issue_server.server_id);

        // sending the wait message
        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle("No Clan is waiting for a match-up. I have put your entry as waiting, as soon as another clan searches for war i will match you up!");

        return client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({
            data: { embeds: [embed] }
        });
    }
}