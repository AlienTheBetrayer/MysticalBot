// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";

// Dependencies
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
export const run: devconfig.command_function = async (client: Discord.Client, message: Discord.Message, connection: MySQL.Connection, storage: devconfig.bot_storage, args: string[]): Promise<void> => {
    // Settings
    const prefix: string = await helper.get_prefix(message?.guild?.id, storage.settings);
    const embed_color: string = await helper.get_embed_color(message?.guild?.id, storage.settings);

    // Obtaining the member
    let member: (Discord.GuildMember | null) = await helper.find_member(message, args[0]) || message.member;
    
    
    // Embed
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed();
    embed.setColor(embed_color);
    embed.setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL());
    embed.setTimestamp();
    embed.setFooter(`${prefix}${config.name}`, client?.user?.displayAvatarURL());
    embed.setDescription(`\`\`\`${member?.displayName}#${member?.user.discriminator}\`\`\``);
    embed.setImage(member?.user.displayAvatarURL({"dynamic" : true, "format": "png", "size" : 512}) as string);

    message.channel.send(embed).then((): void => {
        helper.correct(message);
    });
}

/**
 * Command's config.
 */
export const config: devconfig.command_config = {
    name: "avatar",
    aliases: ["av"],
    description: "Sends an embed that contains your or specified member profile picture.",
    args: ["[member]"],
    mod: "Informative"
}
