import { env } from './env'
import { DiscordClient } from './DiscordClient'
import { DiscordVoiceChat } from './DiscordVoiceChat'
import { DiscordAudioStream } from './DiscordAudioStream'
import { runServer } from './server'

const run = async () => {
  const client = new DiscordClient(env.DISCORD_TOKEN)
  const voiceChat = new DiscordVoiceChat(client, env.CHANNEL_ID)
  const audioStream = new DiscordAudioStream()

  await client.login()
  await voiceChat.joinChannel()
  await voiceChat.play(audioStream)

  audioStream.setSource(env.AUDIO_STREAM_URL)

  runServer([
    client,
    voiceChat,
    audioStream,
  ])
}

run()
