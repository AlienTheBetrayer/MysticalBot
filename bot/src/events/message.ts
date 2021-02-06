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
export const run: devconfig.event_function = async (client: Discord.Client, connection: MySQL.Connection, commands: Map<string[], devconfig.command_function>, settings: Map<string, Map<string, string>>, ...args: any): Promise<void> => {
    // Args
    const message = args[0];
    
    // Settings
    const prefix = await helper.get_setting(connection, message, "prefix", settings);

    if(!message.content.startsWith(prefix))
        return;

    const parts: string[] = message.content.slice(prefix.length).split(' ');
    const command_args: string[] = parts.slice(1);
    const command: string = parts[0];

    commands.forEach((func: any, names: string[]): void => {
        if(names.includes(command))
            func(client, message, connection, settings, command_args);
    });
}

/**
 * The event's config.
 */
export const config: devconfig.event_config = {
    name: "message"
}
