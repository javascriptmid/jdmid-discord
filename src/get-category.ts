import * as Discord from "discord.js";
import { none, some, Result } from "./result";

export default function getCategory(
  guild: Discord.Guild,
  name: string
): Result<Discord.GuildChannel, string> {
  const channel = guild.channels.cache.find((channel) => {
    return (
      channel.name.toLowerCase().includes(name.toLowerCase()) &&
      "category" === channel.type
    );
  });

  if (!channel) {
    return none();
  }

  return some(channel);
}
