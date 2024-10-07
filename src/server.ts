import express from 'express'
import { AbstractProcess } from './AbstractProcess'

const app = express()
const port = 3000

export const runServer = (processes: AbstractProcess[]) => {
  app.get('/', (req, res) => {
    res.send(processes.map(process => `${process.processStatus.name}: ${process.processStatus.status}`).join(';\n\n'))
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
