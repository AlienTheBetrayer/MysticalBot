// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";

// Configs and other dependencies
import * as devconfig from "../../../config/devconfig";
import * as helper from "../../helper_functions"

// Configs
import bot_config from "../../../config/config.json";
import private_config from "../../../config/private_config.json";

/**
 * The main function that will run the command
 * @param client Discord client
 * @param message The last message that invoked this command
 * @param args All the remaining arguments
 */
export const run: devconfig.command_function = async (client: Discord.Client, message: Discord.Message, connection: MySQL.Connection, settings: Map<string, Map<string, string>>, args: string[]): Promise<void> => {
    helper.get_setting(connection, message, "prefix", settings)
    .then((prefix): void => {
        const embed: Discord.MessageEmbed = new Discord.MessageEmbed();
        embed.setColor(bot_config.colors.default);
        embed.setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL());
        embed.setTimestamp();
        embed.setFooter(`${settings.get(message?.guild?.id as string)?.get("prefix")}${config.name}`, client?.user?.displayAvatarURL());
        embed.setTitle("Prefix");
        embed.setDescription(`\`\`\`${prefix}\`\`\``);
        
        message.channel.send(embed);
    });
}

/**
 * Command's config.
 */
export const config: devconfig.command_config = {
    name: "getprefix",
    aliases: ["prefixget", "prefix"]
}
