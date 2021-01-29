// Setup
// Importing all the dependencies
import * as Discord from "discord.js";
import * as fs from "fs";

// Configuration files
import config from "../config.json";
import private_config from "../private_config.json";
import * as devconfig from "../devconfig"

// Initializing the client
const client: Discord.Client = new Discord.Client();

// Bot storage
const commands = new Map<string[], devconfig.command_function>(); // [name, aliases...] : { command }
const events = new Map<string, devconfig.event_function>(); // name : event



// --- ===== --- Helper functions --- ===== --- \\ 

/**
 * Reads the files in the specified path and calls a function on each and every path.
 * @param path The path
 * @param callback_fn The function that will be called on every path. Must take a string argument.
 */
const read_files = (path: string, callback_fn: (arg0: string) => void): void => {
    fs.readdirSync(path).forEach((new_path: string): void => {
        callback_fn(new_path);
    });
}

/**
 * Helper function that helps handling events.
 * @param event_name The event name that is displayed in the event config
 * @param args All the arguments that will be passed to the event function
 */
const handle_event = (event_name: string, ...args: any): void => {
    events.get(event_name)?.(client, ...args);
};



// Storing all the commands
read_files("./commands/", (command_folder: string): void => {
    if(command_folder != "template.txt") { 
        read_files(`./commands/${command_folder}`, (command_file: string): void => {
            const cmd: devconfig.command = require(`./commands/${command_folder}/${command_file}`);
            commands.set([cmd.config.name, ...cmd.config.aliases], cmd.run);
        });
    }   
})

// Storing all the events 
read_files("./events/", (event_file: string): void => {
    if(event_file != "template.txt") {
        const event: devconfig.event = require(`./events/${event_file}`);
        events.set(event.config.name, event.run);
    }
});

// --- ===== --- Events --- ===== --- \\ 

client.on("ready", (): void => {
    handle_event("ready");
});

client.on("message", (message): void => {
    handle_event("message", message, commands);
});



// Logging in the client
client.login(private_config.token);