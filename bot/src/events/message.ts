// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";

// Dependencies
import * as devconfig from "../../config/devconfig";
import * as helper from "../helper_functions"

// Configs
import bot_config from "../../config/config.json";
import private_config from "../../config/private_config.json";

// Other events
import * as mention_event from "./mention";

/**
 * The main function that will be invoked upon the event
 * @param client The discord client
 * @param args All the remaining arguments
 */
export const run: devconfig.event_function = async (client: Discord.Client, connection: MySQL.Connection, storage: devconfig.bot_storage, ...args: any): Promise<void> => {
    // Args
    const message: Discord.Message = args[0];

    // If the message starts with a mention, run mention event
    if(message.content.startsWith(`<@!${client?.user?.id}>`))
        return (async (): Promise<void> => { 
            mention_event.run(client, connection, storage, message);
         })();

    // Settings
    const prefix: string = await helper.get_prefix(message?.guild?.id, storage.settings);

    // If the message does not start with a prefix, break out of this command
    if(!message.content.startsWith(prefix))
        return;

    const parts: string[] = message.content.slice(prefix.length).split(' ');
    const command_args: string[] = parts.slice(1);
    const command: string = parts[0];

    // Find the necessary command and run it.
    storage.commands.forEach((cmd: devconfig.command, names: string[]): void => {
        if(names.includes(command))
            cmd.run(client, message, connection, storage, command_args);
    });
}

/**
 * The event's config.
 */
export const config: devconfig.event_config = {
    name: "message",
    noload: false
}
