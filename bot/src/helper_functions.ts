// Dependencies
import * as MySQL from "mysql";
import * as Discord from "discord.js";

// Config
import * as config_ from "../config/config.json";
import * as private_config_ from "../config/private_config.json";

/**
 * Sends a query to a MySQL database, promise-based.
 * @param connection The connection to the database
 * @param query A string query itself
 */
export const mysql_query = (connection: MySQL.Connection, query: string) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if(error)
                console.log(`[ERROR] mysql_query function has failed: ${error.message}`);
            return resolve(results);
        });
    });
};

/**
 * Gets the specific setting from the database
 * @param connection The connection to the database
 * @param object The object that has the id of the guild
 * @param setting The setting itself
 */
export const get_db_setting = async (connection: MySQL.Connection, object: any, setting: string): Promise<string> => {
    const rows: any = await mysql_query(connection, `SELECT * FROM settings WHERE guild_id = "${object.guild.id}" AND setting = "${setting}"`);
    return new Promise((resolve, reject) => {
        return resolve((rows.length < 1) ? "" : rows[0].value);
    });
};

/**
 * All the default settings
 */ 
const defaults = new Map<string, string>([
    ["prefix", "$"]
]);

export const get_setting = async (connection: MySQL.Connection, object: any, setting: string, settings: Map<string, Map<string, string>>): Promise<string> => {
    const setting_val: string = await get_db_setting(connection, object, setting);
    if(setting_val != "")
        return setting_val;
    settings?.set(object.guild.id, new Map<string, string>([[setting, defaults.get("prefix") as string]]));
    set_db_setting(connection, object, setting, defaults.get(setting) as string);
    return defaults.get(setting) as string;
};

/**
 * Sets the new value in the guild's settings database
 * @param connection The connection to the database
 * @param object The object that has the id of the guild
 * @param setting The setting itself
 * @param value The new value to set
 */
export const set_db_setting = async (connection: MySQL.Connection, object: any, setting: string, value: string): Promise<void> => {
    get_db_setting(connection, object, setting)
    .then(async (setting_val): Promise<void> => { 
        let sql: string;
        if(setting_val == "")
            sql = `INSERT INTO settings(setting, guild_id, value) VALUES(${connection.escape(setting)}, "${object.guild.id}", ${connection.escape(value)})`;
        else
            sql = `UPDATE settings SET value = ${connection.escape(value)} WHERE guild_id = "${object.guild.id}" AND setting = ${connection.escape(setting)}`;
        await mysql_query(connection, sql);
    });
};

export const set_setting = async (connection: MySQL.Connection, object: any, setting: string, value: string, settings: Map<string, Map<string, string>>): Promise<void> => {
    set_db_setting(connection, object, setting, value);
    settings.set(object.guild.id, new Map<string, string>([[setting, value]]));
};


/**
 * Checks whether the member has the specified permission.
 * @param member The guild's member
 * @param permission The permission. Defaults to ADMINISTRATOR
 * @returns Whether the member has the specified permission
 */
export const has_permission = (member: Discord.GuildMember | null, permission: Discord.PermissionResolvable = "ADMINISTRATOR"): boolean => {
    return member?.hasPermission(permission, { checkAdmin: true, checkOwner: true }) || member?.id == private_config_.owner_id;
};

/**
 * Reacts to the message with a wrong emoji.
 * @param message A Discord message object.
 */
export const wrong = async (message: Discord.Message): Promise<void> => {
    message.react(config_.emojis.wrong);
}

/**
 * Reacts to the message with a correct emoji.
 * @param message A Discord message object.
 */
export const correct = async (message: Discord.Message): Promise<void> => {
    message.react(config_.emojis.correct);
}