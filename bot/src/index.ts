// Setup
// Importing all the dependencies
import * as Discord from "discord.js";

// Configuration files
import config from "../config.json";
import private_config from "../private_config.json";

// Initializing the client
const client: Discord.Client = new Discord.Client();

const events = new Map(); // name : event
const commands = new Map(); // [name, aliases...] : { command }
// Inputting all the commands
// ...

// Inputting all the events
// ...

// Logging in the client
client.login(private_config.token);