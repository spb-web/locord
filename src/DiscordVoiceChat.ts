import assert from 'assert'
import { Channel, ChannelType } from 'discord.js'
import {
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice'
import { type DiscordClient } from './DiscordClient'
import { type DiscordAudioStream } from './DiscordAudioStream'

export class DiscordVoiceChat {
  #client: DiscordClient
  #channel?: Channel
  #channelId: string
  #connection?: VoiceConnection

  constructor(client: DiscordClient, channelId: string) {
    this.#client = client
    this.#channelId = channelId
  }

  async joinChannel() {
    this.#channel = await this.#client.fetchChannel(this.#channelId)

    assert(
      this.#channel.type === ChannelType.GuildVoice,
      'is not voice channel',
    )

    this.#connection = joinVoiceChannel({
      channelId: this.#channel.id,
      guildId: this.#channel.guild.id,
      // Проблема в не соответствие типов зависимостей пакета @discordjs/opus
      // @ts-ignore
      adapterCreator: this.#channel.guild.voiceAdapterCreator,
      selfMute: false,
      selfDeaf: true,
      debug: true,
    })
  }

  play(discordAudioStream: DiscordAudioStream) {    
    return new Promise<void>((resolve) => {
      assert(this.#connection, 'connection is nil; call joinChannel')

      this.#connection.setSpeaking(true)

      if (this.#connection.state.status === VoiceConnectionStatus.Ready) {
        this.#connection.subscribe(discordAudioStream.player)

        resolve()
      } else {
        this.#connection.on(VoiceConnectionStatus.Ready, async () => {
          assert(this.#connection, 'connection is nil; call joinChannel')

          this.#connection.subscribe(discordAudioStream.player)

          resolve()
        })
      }
    })
  }
}
