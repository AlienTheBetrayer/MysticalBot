// Setup
// Importing all the dependencies
import * as Discord from "discord.js";
import * as fs from "fs";
import * as MySQL from "mysql";

// Configuration files
import config from "../config/config.json";
import private_config from "../config/private_config.json";

import * as helper from "./helper_functions";
import * as devconfig from "../config/devconfig"

// Initializing the client
const client: Discord.Client = new Discord.Client();

// Bot storage  
const commands = new Map<string[], devconfig.command_function>(); // [name, aliases...] : { command }
const events = new Map<string, devconfig.event_function>(); // name : event
const settings = new Map<string, Map<string, string>>(); // setting : value



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
    events.get(event_name)?.(client, connection, commands, settings, ...args);
};



// Storing all the commands
read_files("./commands/", (command_folder: string): void => {
    if(command_folder != "template.txt") { 
        read_files(`./commands/${command_folder}`, (command_file: string): void => {
            const cmd: devconfig.command = require(`./commands/${command_folder}/${command_file}`);
            commands.set([cmd.config.name, ...cmd.config.aliases], cmd.run);
            console.log(`[INFO] ${command_file} command has been successfully loaded.`);
        });
    }   
})

// Storing all the events 
read_files("./events/", (event_file: string): void => {
    if(event_file != "template.txt") {
        const event: devconfig.event = require(`./events/${event_file}`);
        events.set(event.config.name, event.run);
        console.log(`[INFO] ${event_file} event has been successfully loaded.`);
    }
});

// Connecting to MySQL
const connection = MySQL.createConnection({
    host: private_config.sql.host,
    user: private_config.sql.user,
    password: private_config.sql.password,
    database: private_config.sql.database,
    charset: private_config.sql.charset
});

interface settings_db {
    setting: string,
    guild_id: string,
    value: string
};

const load_settings = async (): Promise<void> => {
    helper.mysql_query(connection, `SELECT * FROM settings`)
    .then((settings_rows: any): void => {
        for(let i = 0; i < settings_rows.length; ++i) {
            const row: settings_db = settings_rows[i];
            if(settings.has(row.guild_id)) {
                settings.get(row.guild_id)?.set(row.setting, row.value);
            } else {
                settings.set(row.guild_id, new Map<string, string>([[row.setting, row.value]]));
            }
        }
    });
};

connection.connect(err => {
    if(err)
        throw err;
    console.log(`[INFO] Connection to the database has been successfully established.`);
    load_settings();
});


// --- ===== --- Events --- ===== --- \\ 

client.on("ready", (): void => {
    handle_event("ready");
});

client.on("message", (message): void => {
    handle_event("message", message, commands, connection, settings);
});



// Logging in the client
client.login(private_config.token);