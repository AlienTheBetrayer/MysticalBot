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
    console.log("hi");
}

/**
 * The event's config.
 */
export const config: devconfig.event_config = {
    name: "ready"
}
