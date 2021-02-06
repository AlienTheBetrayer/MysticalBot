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
    client?.user?.setActivity(`${private_config.status} | $help`, {type: "STREAMING", url: "https://www.twitch.tv/alienbetrayer"});
}

/**
 * The event's config.
 */
export const config: devconfig.event_config = {
    name: "ready"
}

