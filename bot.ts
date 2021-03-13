import * as Discord from "discord.js";
import { DISCORD_BOT_TOKEN } from "./config";

const client = new Discord.Client();
client.login(DISCORD_BOT_TOKEN);
client.once("ready", () => {
  console.log("Client logged in... Setting up client.");
});

client.on("message", async (context) => {
  const [command, category, title] = context.content.split(" ");
  if (command === "!create-channel") {
    const result = await createChannel(context, {
      category,
      title,
    });

    console.log([result]);
    if (result instanceof Error) {
      return context.channel.send(result.message);
    }

    return context.channel.send(result);
  }
});

type CreateChannelOptions = {
  category: string;
  title: string;
};

async function createChannel(
  context: Discord.Message,
  options: CreateChannelOptions
): Promise<string | Error> {
  try {
    if (options.category == null || options.title == null) {
      return new Error("No pude crear el canal que me pediste");
    }

    const category = getCategory(context.guild, options.category);
    if (category == null) {
      return new Error("No puedo encontrar la categoría");
    }

    await context.guild.channels.create(options.title, {
      type: "voice",
      topic: `A meetup hosted by ${context.member.nickname} about "${options.title}"`,
      reason: `Meetup started`,
      parent: category,
      permissionOverwrites: [
        {
          type: "member",
          id: context.member.id,
          allow: ["MANAGE_CHANNELS", "MUTE_MEMBERS", "DEAFEN_MEMBERS"],
        },
      ],
    });

    return "Tu canal esta listo";
  } catch (err) {
    return new Error("No pude crear el canal que me pediste");
  }
}

function getCategory(guild: Discord.Guild, name: string) {
  const channel = guild.channels.cache.find(
    (channel) =>
      channel.name.toLowerCase().includes(name.toLowerCase()) &&
      "category" === channel.type
  );

  if (!channel) {
    return null;
  }

  return channel;
}
