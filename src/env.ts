import z from 'zod'
require('dotenv').config()

const envCondition = z.object({
  DISCORD_TOKEN: z.string(),
  CHANNEL_ID: z.string(),
})

export const env = envCondition.parse(process.env)
