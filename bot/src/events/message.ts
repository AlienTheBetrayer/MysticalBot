// Libraries
import * as Discord from "discord.js";

// Dependencies
import * as devconfig from "../../devconfig";

/**
 * The main function that will be invoked upon the event
 * @param client The discord client
 * @param args All the remaining arguments
 */
export const run = (client: Discord.Client, ...args: any): void => {
    const message = args[0];
    const commands = args[1];

    const prefix = "$";

    if(!message.content.startsWith(prefix))
        return;

    const parts: string[] = message.content.slice(prefix.length).split(' ');
    const command_args: string[] = parts.slice(1);
    const command: string = parts[0];

    commands.forEach((func: any, names: string[]): void => {
        if(names.includes(command)) {
            func(client, message, command_args);
        }
    });
}

/**
 * The event's config.
 */
export const config: devconfig.event_config = {
    name: "message"
}
