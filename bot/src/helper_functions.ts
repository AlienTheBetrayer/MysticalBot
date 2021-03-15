// Dependencies
import * as MySQL from "mysql";
import * as Discord from "discord.js";

// Config
import * as config from "../config/config.json";
import * as private_config from "../config/private_config.json";

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
 * @param guild_id The guild's id
 * @param setting The setting itself
 */
export const get_db_setting = async (connection: MySQL.Connection, guild_id: string | undefined, setting: string): Promise<string> => {
    const rows: any = await mysql_query(connection, `SELECT * FROM settings WHERE guild_id = "${guild_id}" AND setting = "${setting}"`);
    return new Promise((resolve, reject) => {
        return resolve((rows.length < 1) ? "" : rows[0].value);
    });
};

/**
 * All the default settings
 */ 
const defaults = new Map<string, string>([
    ["prefix", "$"],
    ["embed_color", config.defaults.color]
]);

type settings_t = Map<string, Map<string, string>>;

export const get_setting = async (connection: MySQL.Connection, guild_id: string | undefined, setting: string, settings: settings_t): Promise<string> => {
    const setting_val: string = await get_db_setting(connection, guild_id, setting);
    if(setting_val != "")
        return setting_val;
    settings?.set(guild_id as string, new Map<string, string>([[setting, defaults.get("prefix") as string]]));
    set_db_setting(connection, guild_id, setting, defaults.get(setting) as string);
    return defaults.get(setting) as string;
};

/**
 * Sets the new value in the guild's settings database
 * @param connection The connection to the database
 * @param guild_id The guild's id
 * @param setting The setting itself
 * @param value The new value to set
 */
export const set_db_setting = async (connection: MySQL.Connection, guild_id: string | undefined, setting: string, value: string): Promise<void> => {
    get_db_setting(connection, guild_id as string, setting)
    .then(async (setting_val): Promise<void> => { 
        let sql: string;
        if(setting_val == "")
            sql = `INSERT INTO settings(setting, guild_id, value) VALUES(${connection.escape(setting)}, "${guild_id}", ${connection.escape(value)})`;
        else
            sql = `UPDATE settings SET value = ${connection.escape(value)} WHERE guild_id = "${guild_id}" AND setting = ${connection.escape(setting)}`;
        await mysql_query(connection, sql);
    });
};

export const set_setting = async (connection: MySQL.Connection, guild_id: string | undefined, setting: string, value: string, settings: settings_t): Promise<void> => {
    set_db_setting(connection, guild_id as string, setting, value);
    if(settings?.has(guild_id as string))
        settings.get(guild_id as string)?.set(setting, value);
    else
        settings.set(guild_id as string, new Map<string, string>([[setting, value]]));
};

type confirmation_fn_t = (arg0?: Discord.Message) => void;

export const await_confirmation = async (message: Discord.Message, embed: Discord.MessageEmbed, confirm_fn: confirmation_fn_t, reject_fn?: confirmation_fn_t) => {
    message.channel.send(embed).then(async embed_message => {
        await embed_message.react(config.emojis.correct);
        await embed_message.react(config.emojis.wrong);

        embed_message.awaitReactions((reaction, user) => {
            return (reaction.emoji.name === config.emojis.correct || reaction.emoji.name === config.emojis.wrong) && user.id === message.author.id;
        }, { max : 1, time: 15000, errors: ["time"]}).then(collected => {
            const emoji_name = collected.first()?.emoji.name;

            switch(emoji_name) {
                case config.emojis.correct:
                    confirm_fn(embed_message);
                    break;
                case config.emojis.wrong:
                    message.react(config.emojis.wrong);

                    break;
            }
        }).catch(_collected => {
            message.react(config.emojis.wrong);
            reject_fn?.(embed_message);
        });
    });
};//618422341717983243

export const get_flags = (args: string[]): string[] => {
    return args.filter(arg => arg.startsWith('-'));
}

export const find_member = async (message: Discord.Message, subject: string): Promise<Discord.GuildMember | undefined> => {
    if(subject?.startsWith("<@!") && subject?.endsWith('>'))
        return message.guild?.members.cache?.get(subject?.substr(3, subject?.length - 4));
    else if((subject?.length == 18 || subject?.length == 17) && !isNaN(parseInt(subject)))
        return message.guild?.members.cache.get(subject);
    else
        return ((await message.guild?.members.fetch())?.filter(m => { return m.displayName?.toLowerCase()?.includes(subject?.toLowerCase()) || m.user.username.toLowerCase().includes(subject?.toLowerCase()); } ))?.first();
}


/**
 * Checks whether the member has the specified permission.
 * @param member The guild's member
 * @param permission The permission. Defaults to ADMINISTRATOR
 * @returns Whether the member has the specified permission
 */
export const has_permission = (member: Discord.GuildMember | null, permission: Discord.PermissionResolvable = "ADMINISTRATOR"): boolean => {
    return member?.hasPermission(permission, { checkAdmin: true, checkOwner: true }) || member?.id == private_config.owner_id;
};

/**
 * Reacts to the message with a wrong emoji.
 * @param message A Discord message object.
 */
export const wrong = async (message: Discord.Message): Promise<void> => {
    message.react(config.emojis.wrong);
}

/**
 * Reacts to the message with a correct emoji.
 * @param message A Discord message object.
 */
export const correct = async (message: Discord.Message): Promise<void> => {
    message.react(config.emojis.correct);
}

export const get_prefix = async (guild_id: string | undefined, settings: settings_t): Promise<string> => {
    return settings.get(guild_id as string)?.get("prefix") as string;
};

export const get_embed_color = async (guild_id: string | undefined, settings: settings_t): Promise<string> => {
    return settings.get(guild_id as string)?.get("embed_color") as string;
};


/**
 * A type for callback functions in the forEach function.
 */
export type func_t<T, T_> = (arg0: T, arg1: T_) => void;

/**
 * Iterates a map with a key first and then value.
 * @param map The map to iterate through
 * @param callback The callback function that is gonna be called on each iteration
 */
export const forEach = <T, T_>(map: Map<T, T_>, callback: func_t<T, T_>): void => {
    map.forEach((val: T_, key: T): void => {
        callback(key, val);
    });
}

export const find_first_matching = (values: string[], value: string): string => {
    for(let i = 0; i < values.length; ++i)
        if(values[i].toLowerCase().indexOf(value.toLowerCase()) != -1)    
            return values[i];       
    return "";
}