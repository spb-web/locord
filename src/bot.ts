import { env } from './env'
import { DiscordClient } from './DiscordClient'
import { DiscordVoiceChat } from './DiscordVoiceChat'
import { DiscordAudioStream } from './DiscordAudioStream'
import { runServer } from './server'

const URL =
  'https://fluxfm.streamabc.net/flx-chillhop-mp3-128-8581707?sABC=6701o016%230%234o035o52p5n23r25snqon3598r4op036%23fgernzf.syhksz.qr&aw_0_1st.playerid=streams.fluxfm.de&amsparams=playerid:streams.fluxfm.de;skey:1728163862'

const run = async () => {
  const client = new DiscordClient(env.DISCORD_TOKEN)
  const voiceChat = new DiscordVoiceChat(client, env.CHANNEL_ID)
  const audioStream = new DiscordAudioStream()

  await client.login()
  await voiceChat.joinChannel()
  await voiceChat.play(audioStream)

  audioStream.setSource(URL)

  runServer()
}

run()
