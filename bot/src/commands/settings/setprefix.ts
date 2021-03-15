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
    // If the author does not have ADMINISTRATOR permission, just break out of this command
    if(!helper.has_permission(message.member))
        return helper.wrong(message);
    
    // Flags
    const flags: string[] = helper.get_flags(args);

    // Settings
    const prefix: string = await helper.get_prefix(message?.guild?.id, storage.settings);
    const embed_color: string = await helper.get_embed_color(message?.guild?.id, storage.settings);

    // Prefix arg
    const new_prefix: string = args[0].replace("default", bot_config.defaults.prefix);

    const embed: Discord.MessageEmbed = new Discord.MessageEmbed();
    embed.setColor(bot_config.colors.warn);
    embed.setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL());
    embed.setTimestamp();
    embed.setFooter(`${prefix}${config.name}`, client?.user?.displayAvatarURL());
    embed.setTitle("Confirmation");
    embed.setDescription(`\`\`\`Are you sure you want to change the prefix from '${prefix}' to '${new_prefix}'?\`\`\``);

    // Setting everything and reacting
    const set_func = async () => {
        helper.set_setting(connection, message?.guild?.id, "prefix", new_prefix, storage.settings).then((): void => {
            helper.correct(message);
        });
    };

    if(flags.includes("-y")) {
        set_func();
    } else {
        helper.await_confirmation(message, embed, () => {
            set_func();
        });
    }
}

/**
 * Command's config.
 */
export const config: devconfig.command_config = {
    name: "setprefix",
    aliases: ["prefixset"],
    description: "Sets the prefix in the current guild. Administrator-only. You can also enter default.",
    args: ["<prefix>"," [-flags...]"],
    mod: "Settings"
}
