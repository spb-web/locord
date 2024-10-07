import https from 'https'
import { Readable } from 'stream'
import {
  type AudioPlayer,
  createAudioPlayer,
  createAudioResource,
} from '@discordjs/voice'
import { AbstractProcess } from './AbstractProcess'

export class DiscordAudioStream extends AbstractProcess {
  #stream = new Readable({ read() {} })
  #player = createAudioPlayer()
  #audioResource = createAudioResource(this.#stream, { inlineVolume: true })

  constructor() {
    super('DiscordAudioStream')

    this.#audioResource.volume?.setVolumeLogarithmic(0.04)
    this.#player.play(this.#audioResource)
  }

  get player(): AudioPlayer {
    return this.#player
  }

  setSource(url: string): void {
    this.wrapFunction(() => {
      return new Promise((resolve, reject) => {
        https
          .get(url, (response) => {
            this.setProcessStatusOk()
    
            response.on('data', (chunk: Buffer) => {
              this.#stream.push(chunk)
            })
    
            response.once('end', () => {
              this.#stream.push(null)
              reject()
            })
          })
          .on('error', (error) => {
            this.#stream.emit('error', error)
    
            reject()
          })
      })
    })
  }
}
