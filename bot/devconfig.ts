import * as Discord from "discord.js";

// Configs interfaces
export interface command_config {
    readonly name: string,
    readonly aliases: string[]
};

export interface event_config {
    readonly name: string 
};

// Functions interfaces
export type event_function = (...args: any) => void;
export type command_function = (arg0: Discord.Client, arg1: Discord.Message, arg2: string[]) => void;

// Declarations
export interface command {
    run: command_function,
    readonly config: command_config
};

export interface event {
    run: event_function,
    readonly config: event_config
}