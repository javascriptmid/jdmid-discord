import * as Discord from "discord.js";
import { PromiseResult, none, some } from "./result";
import getCategory from "./get-category";

type CreateVoiceChannelOptions = {
  category: string;
  title: string;
};

export default async function createVoiceChannel(
  context: Discord.Message,
  options: CreateVoiceChannelOptions
): PromiseResult<string, string> {
  if (options.category == null) {
    return none(
      "No olvides agregar una categoría \n" +
        `create-voice-channel category-name`
    );
  }

  if (options.title == null) {
    return none(
      "No olvides agregar el nombre del canal \n" +
        `create-voice-channel ${options.category} channel-title`
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
