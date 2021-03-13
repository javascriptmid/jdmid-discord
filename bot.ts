import * as Discord from "discord.js";
import { DISCORD_BOT_TOKEN } from "./config";
import createVoiceChannel from "./create-voice-channel";

const client = new Discord.Client();

client.login(DISCORD_BOT_TOKEN);
client.once("ready", () => {
  console.log("Client logged in... Setting up client.");
});

client.on("message", async (context) => {
  const [command, category, title] = context.content.split(" ");
  if (command === "!create-channel") {
    const result = await createVoiceChannel(context, {
      category,
      title,
    });

    if (result.kind === "failure") {
      return context.channel.send(result.error);
    }

    return context.channel.send(result.value);
  }
});
