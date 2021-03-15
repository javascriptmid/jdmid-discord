import dotenv from "dotenv";

dotenv.config();

const { DISCORD_BOT_TOKEN } = process.env;

type Config = {
  DISCORD_BOT_TOKEN: string;
};

const defaults: Config = {
  DISCORD_BOT_TOKEN: null,
};

// validate default values and required configs
Object.keys(defaults).forEach((key) => {
  if (!process.env[key]) {
    throw new Error(
      `Please enter a custom ${key} in .env on the root directory`
    );
  }
});

export { DISCORD_BOT_TOKEN };
