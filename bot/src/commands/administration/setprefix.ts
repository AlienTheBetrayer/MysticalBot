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
export const run: devconfig.command_function = async (client: Discord.Client, message: Discord.Message, connection: MySQL.Connection, settings: Map<string, Map<string, string>>, args: string[]): Promise<void> => {
    if(!helper.has_permission(message.member))
        return helper.wrong(message);
    helper.set_setting(connection, message, "prefix", args[0], settings)
    .then((): void => {
        helper.correct(message);
    });
}

/**
 * Command's config.
 */
export const config: devconfig.command_config = {
    name: "setprefix",
    aliases: ["prefixset"]
}
