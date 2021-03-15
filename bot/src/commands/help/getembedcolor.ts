// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";
import * as Canvas from "canvas";

// Configs and other dependencies
import * as devconfig from "../../../config/devconfig";
import * as helper from "../../helper_functions"

// Configs
import bot_config from "../../../config/config.json";
import private_config from "../../../config/private_config.json";

/**
 * The main function that will run the command
 * @param client Discord client
 * @param message The last message that invoked this command
 * @param args All the remaining arguments
 */
export const run: devconfig.command_function = async (client: Discord.Client, message: Discord.Message, connection: MySQL.Connection, storage: devconfig.bot_storage, args: string[]): Promise<void> => {
    // Settings
    const prefix: string = await helper.get_prefix(message?.guild?.id, storage.settings);
    const embed_color: string = await helper.get_embed_color(message?.guild?.id, storage.settings);

    // Canvas
    const canvas: Canvas.Canvas = Canvas.createCanvas(parseInt(bot_config.canvas_size), parseInt(bot_config.canvas_size));
    const ctx: Canvas.CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.fillStyle = `#${embed_color.toUpperCase()}`;
    ctx.fillRect(0, 0, parseInt(bot_config.canvas_size), parseInt(bot_config.canvas_size));

    // Image attachment
    const attachment: Discord.MessageAttachment = new Discord.MessageAttachment(canvas.toBuffer(), "image.png");
    
    // The embed that contains the embed color
    const embed: Discord.MessageEmbed = new Discord.MessageEmbed();
    embed.setColor(embed_color);
    embed.setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL());
    embed.setTimestamp();
    embed.setFooter(`${prefix}${config.name}`, client?.user?.displayAvatarURL());
    embed.setTitle("Embed color");
    embed.setDescription(`\`\`\`${embed_color}\`\`\``);
    embed.attachFiles([attachment]);
    embed.setImage(`attachment://image.png`)
    
    message.channel.send(embed).then(() => {
        helper.correct(message);
    });
}

/**
 * Command's config.
 */
export const config: devconfig.command_config = {
    name: "getembedcolor",
    aliases: [],
    description: "Shows the current embed color in the current guild.",
    mod: "Help",
    args: []
}
