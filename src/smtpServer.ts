import axios from 'axios'
import { isEmpty, isNil } from 'ramda'
import { SMTPServer, type SMTPServerSession, type SMTPServerAuthentication, type SMTPServerDataStream } from 'smtp-server'

export default (onEmail: (email: Buffer, webhook: string) => void): SMTPServer => new SMTPServer({
  secure: false,
  onAuth: handleAuth,
  onData: (stream: SMTPServerDataStream, session: SMTPServerSession, callback) => { prepareData(stream, session, onEmail, callback) }
})

function handleAuth (auth: SMTPServerAuthentication, _session: SMTPServerSession, callback): void {
  const { username, password } = auth
  if (
    isNil(username) ||
        isNil(password) ||
        isEmpty(username) ||
        isEmpty(password)) {
    return callback(new Error('Invalid username or password syntax'))
  }

  const webhook = `https://discord.com/api/webhooks/${username}/${password}`

  axios({
    method: 'get',
    url: webhook
  })
    .then(result => {
      if (result.status !== 200) {
        callback(new Error('Invalid webhook id or secret, validate smtp username and password are correct.'))
      } else {
        callback(null, { user: webhook })
      }
    })
    .catch(() => {
      callback(new Error('Invalid webhook id or secret, validate smtp username and password are correct.'))
    })
}

function prepareData (stream: SMTPServerDataStream, session: SMTPServerSession, onEmail: (email: Buffer, webhook: string) => void, callback): void {
  if (isNil(session.user)) {
    throw new Error('Failed to prepare email data. Missing user session.')
  }

  const webhook = session.user
  const buffers: Buffer[] = []

  stream.on('data', (buffer: Buffer) => buffers.push(buffer))
  stream.on('end', () => {
    const buffer = Buffer.concat(buffers)
    onEmail(buffer, webhook)
    callback()
  })
}
