import * as Discord from "discord.js";
import { some, none, PromiseResult } from "./result";
import { DISCORD_BOT_TOKEN } from "./config";
import createVoiceChannel from "./create-voice-channel";
import deleteVoiceChannel from "./delete-voice-channel";

const client = new Discord.Client();

client.login(DISCORD_BOT_TOKEN);
client.once("ready", () => {
  console.log("Client logged in... Setting up client.");
});

enum Commands {
  CreateVoiceChannel = "create-voice-channel",
  DeleteVoiceChannel = "delete-voice-channel",
}

client.on("message", async (context) => {
  const [identity, command, ...args] = context.content.split(" ");
  if (identity !== "meetbot") return;
  const result = await executeCommand(context, command as Commands, args);
  if (result.kind === "failure") {
    return context.channel.send(result.error);
  }

  return context.channel.send(result.value);
});

async function executeCommand(
  context: Discord.Message,
  command: Commands,
  args: string[]
): PromiseResult<string, string> {
  switch (command) {
    case Commands.CreateVoiceChannel: {
      const [category, title] = args;
      return createVoiceChannel(context, {
        category,
        title,
      });
    }
    case Commands.DeleteVoiceChannel: {
      const [category, title] = args;
      return deleteVoiceChannel(context, {
        category,
        title,
      });
    }
    default: {
      if (context.author.bot) return none();
      return some(":C");
    }
  }
}
