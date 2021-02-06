// Libraries

import * as Discord from "discord.js";
import * as MySQL from "mysql";

// --- ===== --- Config interfaces --- ===== --- \\ 

/**
 * Interface for the config inside each and every command.
 */
export interface command_config {
    readonly name: string,
    readonly aliases: string[]
};

/**
 * Interface for the config inside each and every event.
 */
export interface event_config {
    readonly name: string 
};



// --- ===== --- Function interfaces --- ===== --- \\ 

export type event_function = (arg0: Discord.Client, arg1: MySQL.Connection, arg2: Map<string[], command_function>, arg3: Map<string, Map<string, string>>, ...args: any) => Promise<void>;
export type command_function = (arg0: Discord.Client, arg1: Discord.Message, arg2: MySQL.Connection, arg3: Map<string, Map<string, string>>, arg4: string[]) => Promise<void>;



// --- ===== --- Main interfaces --- ===== --- \\ 

/**
 * Command interface.
 */
export interface command {
    readonly run: command_function,
    readonly config: command_config
};

/**
 * Event interface.
 */
export interface event {
    readonly run: event_function,
    readonly config: event_config
}