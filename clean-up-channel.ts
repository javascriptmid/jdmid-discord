import * as Discord from "discord.js";
import async from "async";
import { PromiseResult, none, some } from "./result";

type CleanUpChannel = {
  category: string;
  title: string;
};

export default async function cleanUpChannel(
  context: Discord.Message,
  options: CleanUpChannel
): PromiseResult<string, string> {
  if (options.category == null) {
    return none(
      "No olvides agregar una categoría \n" + `clean-up-channel category-name`
    );
  }

  if (options.title == null) {
    return none(
      "No olvides agregar el nombre del canal \n" +
        `clean-up-channel ${options.category} channel-title`
    );
  }

  const channel = context.guild.channels.cache.find((channel) => {
    return (
      channel.name.toLowerCase().includes(options.title.toLowerCase()) &&
      channel.parent.name
        .toLowerCase()
        .includes(options.category.toLowerCase()) &&
      channel.type === "text"
    );
  });

  if (channel == null) {
    return none("No pude encontrar el canal que me pediste");
  }

  try {
    const limit = 100;
    const textChannel = channel as Discord.TextChannel;
    const messages = await textChannel.messages.fetch();
    const times = Math.trunc(messages.size / limit);
    const remaining = textChannel.messages.cache.size % limit;

    if (times > 0) {
      await async.timesSeries(times, () => {
        return textChannel.bulkDelete(limit);
      });
    }

    if (remaining > 0) {
      await textChannel.bulkDelete(remaining);
    }

    return some("Limpieza lista...");
  } catch (err) {
    return none("No pude limpiar el canal que me pediste");
  }
}
