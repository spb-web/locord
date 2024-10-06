import assert from 'assert'
import { type Channel, Client, Events, GatewayIntentBits } from 'discord.js'

export class DiscordClient {
  #client = new Client({
    intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds],
  })
  #token: string

  constructor(token: string) {
    this.#token = token
    this.#client.once(Events.ClientReady, (readyClient) => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}`)
    })
  }

  async login(): Promise<void> {
    await this.#client.login(this.#token)
  }

  async fetchChannel(channelId: string): Promise<Channel> {
    const channel = await this.#client.channels.fetch(channelId, {
      allowUnknownGuild: true,
    })

    assert(channel, 'Channel not found')

    return channel
  }
}
