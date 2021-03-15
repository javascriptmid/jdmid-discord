import * as Discord from "discord.js";
import { PromiseResult, none, some } from "./result";

type DeleteVoiceChannel = {
  title: string;
  category: string;
};

export default async function deleteVoiceChannel(
  context: Discord.Message,
  options: DeleteVoiceChannel
): PromiseResult<string, string> {
  if (options.category == null) {
    return none(
      "No olvides agregar una categoría \n" +
        `delete-voice-channel category-name`
    );
  }

  if (options.title == null) {
    return none(
      "No olvides agregar el nombre del canal \n" +
        `delete-voice-channel  ${options.category} channel-title`
    );
  }

  const channel = context.guild.channels.cache.find((channel) => {
    return (
      channel.name.toLowerCase().includes(options.title.toLowerCase()) &&
      channel.parent.name.toLowerCase().includes(options.category.toLowerCase())
    );
  });

  if (channel == null) {
    return none(`El canal ${options.title} no existe`);
  }

  try {
    await channel.delete();
    return some("El canal se a eliminado");
  } catch (err) {
    return none("No pude crear el canal que me pediste");
  }
}
