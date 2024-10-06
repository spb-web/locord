import https from 'https'
import { Readable } from 'stream'
import {
  type AudioPlayer,
  createAudioPlayer,
  createAudioResource,
} from '@discordjs/voice'

export class DiscordAudioStream {
  #stream = new Readable({ read() {} })
  #player = createAudioPlayer()
  #audioResource = createAudioResource(this.#stream, { inlineVolume: true })

  constructor() {
    this.#audioResource.volume?.setVolumeLogarithmic(0.04)
    this.#player.play(this.#audioResource)
  }

  get player(): AudioPlayer {
    return this.#player
  }

  setSource(url: string) {
    https
      .get(url, (response) => {
        response.on('data', (chunk: Buffer) => {
          this.#stream.push(chunk)
        })

        response.on('end', () => {
          this.#stream.push(null)
        })
      })
      .on('error', (error) => {
        this.#stream.emit('error', error)
      })
  }
}
