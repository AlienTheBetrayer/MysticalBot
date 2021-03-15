// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";
import * as Canvas from "canvas";

// Dependencies
import * as devconfig from "../../../config/devconfig";
import * as helper from "../../helper_functions"

// Configs
import bot_config from "../../../config/config.json";
import private_config from "../../../config/private_config.json";

// All the colors that can be used
const colors = new Map<string, string>([
    ["red", "A01A1A"],
    ["orange", "BB6A0E"],
    ["yellow", "B3B314"],
    ["green", "23B314"],
    ["cyan", "119585"],
    ["blue", "147EB3"],
    ["indigo", "1447B3"],
    ["purple", "8814B3"],
    ["pink", "D01893"]
]);

/**
 * The main function that will run the command
 * @param client Discord client 
 * @param message The last message that invoked this command
 * @param args All the remaining arguments
 */
export const run: devconfig.command_function = async (client: Discord.Client, message: Discord.Message, connection: MySQL.Connection, storage: devconfig.bot_storage, args: string[]): Promise<void> => {
    // If the author does not have ADMINISTRATOR permission, just break out of this command
    if(!helper.has_permission(message.member))
        return helper.wrong(message);

    // Flags
    const flags: string[] = helper.get_flags(args);
    
    // Settings
    const prefix: string = await helper.get_prefix(message?.guild?.id, storage.settings);
    const embed_color: string = await helper.get_embed_color(message?.guild?.id, storage.settings);

    // Color arg
    let color: string = args[0].toLowerCase().replace("default", bot_config.defaults.color);
    helper.forEach(colors, (color_name, color_value) => {
        color = color.replace(color_name, color_value);
    });

    // Canvas
    const canvas: Canvas.Canvas = Canvas.createCanvas(parseInt(bot_config.canvas_size), parseInt(bot_config.canvas_size));
    const ctx: Canvas.CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.fillStyle = args[0].startsWith('#') ? color : `#${color}`;
    ctx.fillRect(0, 0, parseInt(bot_config.canvas_size), parseInt(bot_config.canvas_size));

    // Image attachment
    const attachment: Discord.MessageAttachment = new Discord.MessageAttachment(canvas.toBuffer(), "image.png");

    // Embed
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed();
    embed.setColor(bot_config.colors.warn);
    embed.setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL());
    embed.setTimestamp();
    embed.setFooter(`${prefix}${config.name}`, client?.user?.displayAvatarURL());
    embed.setTitle("Confirmation");
    embed.setDescription(`\`\`\`Are you sure you want to change the embed color from '${embed_color}' to '${color}'?\`\`\``);
    embed.attachFiles([attachment]);
    embed.setImage(`attachment://image.png`)

    // Setting everything and reacting
    const set_func = async () => {
        helper.set_setting(connection, message?.guild?.id, "embed_color", color, storage.settings).then((): void => {
            helper.correct(message);
        });
    };

    if(flags.includes("-y")) {
        set_func();
    } else {
        helper.await_confirmation(message, embed, () => {
            set_func();
        });
    }
}

/**
 * Command's config.
 */
export const config: devconfig.command_config = {
    name: "setcolor",
    aliases: ["embedcolorset", "setembedcolor"],
    description: "Sets the color of the embed in the current guild. Administrator-only. Supports default and other colors like red or purple.",
    args: ["<color>", "[-flags...]"],
    mod: "Settings"
}
