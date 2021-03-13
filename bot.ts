import * as Discord from "discord.js";
import { DISCORD_BOT_TOKEN } from "./config";
import { PromiseResult, none, some, Result } from "./result";

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

    if (result.kind === "failure") {
      return context.channel.send(result.error);
    }

    return context.channel.send(result.value);
  }
});

type CreateChannelOptions = {
  category: string;
  title: string;
};

async function createChannel(
  context: Discord.Message,
  options: CreateChannelOptions
): PromiseResult<string, string> {
  if (options.category) {
    return none(
      "No olvides agregar una categoría \n" + `!create-channel category-name`
    );
  }

  if (options.title) {
    return none(
      "No olvides agregar una categoría \n" +
        `!create-channel ${options.category} channel-title`
    );
  }

  const category = getCategory(context.guild, options.category);
  if (category.kind === "failure") {
    return none(`No puedo encontrar la categoría ${options.category}`);
  }

  try {
    await context.guild.channels.create(options.title, {
      type: "voice",
      topic: `A meetup hosted by ${context.member.nickname} about "${options.title}"`,
      reason: "Meetup started",
      parent: category.value,
      permissionOverwrites: [
        {
          type: "member",
          id: context.member.id,
          allow: ["MANAGE_CHANNELS", "MUTE_MEMBERS", "DEAFEN_MEMBERS"],
        },
      ],
    });

    return some("Tu canal esta listo");
  } catch (err) {
    return none("No pude crear el canal que me pediste");
  }
}

function getCategory(
  guild: Discord.Guild,
  name: string
): Result<Discord.GuildChannel, string> {
  const channel = guild.channels.cache.find(
    (channel) =>
      channel.name.toLowerCase().includes(name.toLowerCase()) &&
      "category" === channel.type
  );

  if (!channel) {
    return none();
  }

  return some(channel);
}
