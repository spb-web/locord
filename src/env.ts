import z from 'zod'
require('dotenv').config()

const envCondition = z.object({
  DISCORD_TOKEN: z.string(),
  CHANNEL_ID: z.string(),
  AUDIO_STREAM_URL: z.string(),
})

export const env = envCondition.parse(process.env)
