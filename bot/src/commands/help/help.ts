// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";

// Dependencies
import * as devconfig from "../../../config/devconfig";
import * as helper from "../../helper_functions"

// Configs
import bot_config from "../../../config/config.json";
import private_config from "../../../config/private_config.json";

const concat = (parts: string[], prefix?: string): string => {
    let str: string = "";
    for(let i = 0; i < parts.length; ++i) {
        if(prefix)
            str += prefix;
        (i == parts.length - 1) ? str += parts[i] : str += parts[i] + ", ";
    } 
    return str;
};
/**
 * The main function that will run the command
 * @param client Discord client
 * @param message The last message that invoked this command
 * @param args All the remaining arguments
 */
export const run: devconfig.command_function = async (client: Discord.Client, message: Discord.Message, connection: MySQL.Connection, storage: devconfig.bot_storage, args: string[]): Promise<void> => {
    // Args
    const help_subject: string = args[0];

    // Settings
    const prefix: string = await helper.get_prefix(message?.guild?.id, storage.settings);
    const embed_color: string = await helper.get_embed_color(message?.guild?.id, storage.settings);

    // Embed
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed();

    // Filling in all the commands. Module : commands
    const commands: Map<string, devconfig.command[]> = new Map<string, devconfig.command[]>();
    helper.forEach(storage.commands, (names, command) => {
        if(!commands.has(command.config.mod))
            commands.set(command.config.mod, []);
        commands.get(command.config.mod)?.push(command);
    });

    // Main help logic
    if(!help_subject) { // All modules
        // Shows all the modules and the amount of commands in them
        helper.forEach(commands, (mod: string, commands: devconfig.command[]): void => {
            embed.addField(mod, `\`\`\`${commands.length}\`\`\``, true);
        });
        embed.setTitle("All modules help");
    } else if(help_subject.length != 0 && !help_subject.startsWith(await helper.get_prefix(message?.guild?.id, storage.settings))) { // Module-specific
        let description: string = "";

        // The module name which is deduced from the part of it
        const mod_name: string = helper.find_first_matching([...commands.keys()], help_subject);
        if(mod_name == "") // If module does not exist
            return;
        commands.get(mod_name)?.forEach((cmd: devconfig.command): void => {
            description += `${prefix}${cmd.config.name}{${concat(cmd.config.aliases, prefix)}}\n`;
        });

        embed.setDescription("```" + description + "```");
        embed.setTitle(`${mod_name} module help`);
    } else { // Command-specific
        let description: string = "";

        // Filling in all the commands
        let commands: string[] = [];
        helper.forEach(storage.commands, (names: string[], cmd: devconfig.command): void => {
            commands.push(...names);
        });
        
        // The command name which is deduced from the part of it
        const cmd_name: string = helper.find_first_matching(commands, help_subject.substr(prefix.length));
        if(cmd_name == "") // If command does not exist
            return;

        // Finding the right command
        let cmd: devconfig.command | undefined = undefined;
        helper.forEach(storage.commands, (names: string[], cmd_: devconfig.command) => {
            if(names.includes(cmd_name))
                cmd = cmd_;
        });
        
        if(cmd) {
            const command: devconfig.command = cmd as devconfig.command;
            description += `${prefix}${command.config.name}{${concat(command.config.aliases, prefix)}} ${concat(command.config.args)} - ${command.config.description}`;
            embed.setDescription("```" + description + "```");
            embed.setTitle(`${command.config.mod} | ${prefix}${cmd_name} help`);
        }
    }

    embed.setColor(embed_color);
    embed.setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL());
    embed.setTimestamp();
    embed.setFooter(`${prefix}${config.name}`, client.user?.displayAvatarURL());
    message.channel.send(embed).then((): void => {
        helper.correct(message);
    });
}

/**
 * Command's config.
 */
export const config: devconfig.command_config = {
    name: "help",
    aliases: ["h"],
    description: "A command that can help with any module or command.",
    args: ["[$command/module]"],
    mod: "Help"
}
