// Setup
// Importing all the dependencies
import * as Discord from "discord.js";
import * as fs from "fs";

// Configuration files
import config from "../config.json";
import private_config from "../private_config.json";

// Initializing the client
const client: Discord.Client = new Discord.Client();

const commands = new Map(); // [name, aliases...] : { command }
const events = new Map(); // name : event

// Inputting all the commands
fs.readdirSync("./commands/").forEach(command_folder => {
    console.log(command_folder);
});

// ...

// Inputting all the events
// ...

// Logging in the client
client.login(private_config.token);