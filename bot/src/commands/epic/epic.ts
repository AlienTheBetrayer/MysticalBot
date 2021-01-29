// Libraries
import * as Discord from "discord.js";

// Dependencies
import * as devconfig from "../../../devconfig";

/**
 * The main function that will run the command
 * @param client Discord client
 * @param message The last message that invoked this command
 * @param args All the remaining arguments
 */
export const run = (client: Discord.Client, message: Discord.Message, args: Array<string>): void => {
    message.channel.send("hi");
}

/**
 * Command's config.
 */
export const config: devconfig.command_config = {
    name: "hi",
    aliases: ["hey", "howdy"]
}
