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

    // Choosing the right emoji for the status
    let description: string = "```";

    switch(member?.presence.status) {
        case "online":
            description += `Online ${bot_config.defaults.online_status}`;
        break;
        case "idle":
            description += `Idle ${bot_config.defaults.away_status}`;    
        break;
        case "dnd":
            description += `DND ${bot_config.defaults.dnd_status}`;
        break;
        case "offline":
            description += `Offline ${bot_config.defaults.offline_status}`;
        break;
    }

    // Making the description of the embed
    description += ` ${member?.displayName}#${member?.user.discriminator} \`\`\` \`\`\``;


    // Embed
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed();
    embed.setColor(embed_color);
    embed.setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL());
    embed.setTimestamp();
    embed.setFooter(`${prefix}${config.name}`, client?.user?.displayAvatarURL());
    embed.setDescription(description);
    //${member?.presence.activities[0].type[0]}${member?.presence.activities[0].type.slice(1).toLowerCase()} ${member?.presence.activities[0].name}
    embed.setImage(member?.user.displayAvatarURL({"dynamic" : true, "format": "png", "size" : 512}) as string);

    message.channel.send(embed).then((): void => {
        helper.correct(message);
    });
}

/**
 * Command's config.
 */
export const config: devconfig.command_config = {
    name: "userinfo",
    aliases: ["ui", "infouser", "userinformation"],
    description: "Sends an embed that contains your or specified member profile info.",
    args: ["[member]"],
    mod: "Informative"
}
