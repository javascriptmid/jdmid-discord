import * as Discord from "discord.js";
import * as yargs from "yargs";
import { some, none, PromiseResult } from "./result";
import { DISCORD_BOT_TOKEN } from "./config";
import createVoiceChannel from "./create-voice-channel";
import deleteVoiceChannel from "./delete-voice-channel";
import cleanUpChannel from "./clean-up-channel";

const client = new Discord.Client();
const app = yargs.command("meetbot <command> [category] [title]", "");

client.login(DISCORD_BOT_TOKEN);
client.once("ready", () => {
  console.log("Client logged in... Setting up client.");
});

enum Commands {
  CreateVoiceChannel = "create-voice-channel",
  DeleteVoiceChannel = "delete-voice-channel",
  CleanUpChannel = "clean-up-channel",
}

client.on("message", async (context) => {
  const { _: root, command, ...options } = app.parse(context.content);
  if (root[0] !== "meetbot") {
    return;
  }

  const result = await executeCommand(context, command as Commands, options);
  if (result.kind === "failure") {
    return context.channel.send(result.error);
  }

  return context.channel.send(result.value);
});

async function executeCommand(
  context: Discord.Message,
  command: Commands,
  options: any
): PromiseResult<string, string> {
  switch (command) {
    case Commands.CreateVoiceChannel: {
      const { category, title } = options;
      return createVoiceChannel(context, {
        category,
        title,
      });
    }
    case Commands.DeleteVoiceChannel: {
      const { category, title } = options;
      return deleteVoiceChannel(context, {
        category,
        title,
      });
    }
    case Commands.CleanUpChannel: {
      const { category, title } = options;
      return cleanUpChannel(context, {
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
