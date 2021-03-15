// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";

// Dependencies
import * as devconfig from "../../config/devconfig";
import * as helper from "../helper_functions"

// Configs
import bot_config from "../../config/config.json";
import private_config from "../../config/private_config.json";

/**
 * The main function that will be invoked upon the event
 * @param client The discord client
 * @param args All the remaining arguments
 */
export const run: devconfig.event_function = async (client: Discord.Client, connection: MySQL.Connection, storage: devconfig.bot_storage, ...args: any): Promise<void> => {
    // Args
    const message: Discord.Message = args[0];

    // Settings
    const prefix: string = await helper.get_prefix(message?.guild?.id, storage.settings);
    const embed_color: string = await helper.get_embed_color(message?.guild?.id, storage.settings);

    // The embed
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed();
    embed.setColor(embed_color);
    embed.setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL());
    embed.setTimestamp();
    embed.setFooter(`${prefix}${config.name}`, client?.user?.displayAvatarURL());
    embed.setTitle("Guild's prefix");
    embed.setDescription(`\`\`\`My prefix here is '${prefix}'.\`\`\``)

    message.channel.send(embed);
}

/**
 * The event's config.
 */
export const config: devconfig.event_config = {
    name: "mention",
    noload: true
}
