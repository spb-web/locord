import assert from 'assert'
import { type Channel, Client, Events, GatewayIntentBits } from 'discord.js'
import { AbstractProcess } from './AbstractProcess'

export class DiscordClient extends AbstractProcess {
  #client = new Client({
    intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds],
  })
  #token: string

  constructor(token: string) {
    super('DiscordClient')

    this.#token = token
    this.#client.once(Events.ClientReady, (readyClient) => {
      this.setProcessStatusOk()

      console.log(`Ready! Logged in as ${readyClient.user.tag}`)
    })
  }

  async login(): Promise<void> {
    await this.wrapFunction(() => this.#client.login(this.#token))
  }

  async fetchChannel(channelId: string): Promise<Channel> {
    return this.wrapFunction(async () => {
      const channel = await this.#client.channels.fetch(channelId, {
        allowUnknownGuild: true,
      })
  
      assert(channel, 'Channel not found')
  
      return channel
    })
  }
}
