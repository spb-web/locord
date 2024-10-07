import assert from 'assert'
import { Channel, ChannelType } from 'discord.js'
import {
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice'
import { type DiscordClient } from './DiscordClient'
import { type DiscordAudioStream } from './DiscordAudioStream'
import { AbstractProcess } from './AbstractProcess'

export class DiscordVoiceChat extends AbstractProcess {
  #client: DiscordClient
  #channel?: Channel
  #channelId: string
  #connection?: VoiceConnection

  constructor(client: DiscordClient, channelId: string) {
    super('DiscordVoiceChat')

    this.setProcessStatusOk()

    this.#client = client
    this.#channelId = channelId
  }

  joinChannel(): Promise<void> {
    return this.wrapFunction(async () => {
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
    })
  }

  play(discordAudioStream: DiscordAudioStream): Promise<void> {
    return this.wrapFunction(() => {
      return new Promise<void>((resolve) => {
        assert(this.#connection, 'connection is nil; call joinChannel')
  
        this.#connection.setSpeaking(true)
  
        if (this.#connection.state.status === VoiceConnectionStatus.Ready) {
          this.#connection.subscribe(discordAudioStream.player)
          this.setProcessStatusOk()
  
          resolve()
        } else {
          this.#connection.on(VoiceConnectionStatus.Ready, async () => {
            assert(this.#connection, 'connection is nil; call joinChannel')
  
            this.#connection.subscribe(discordAudioStream.player)
            this.setProcessStatusOk()
  
            resolve()
          })
        }
      })
    })
  }
}
