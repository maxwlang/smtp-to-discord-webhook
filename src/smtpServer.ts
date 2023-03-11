import axios from 'axios'
import {isEmpty, isNil} from 'ramda'
import {
    SMTPServer,
    type SMTPServerAuthentication,
    SMTPServerAuthenticationResponse,
    type SMTPServerDataStream,
    type SMTPServerSession
} from 'smtp-server'

export const smtpServer = (
    onEmail: (email: Buffer, webhook: string) => Promise<void>
): SMTPServer =>
    new SMTPServer({
        secure: false,
        onAuth: handleAuth,
        onData: (
            stream: SMTPServerDataStream,
            session: SMTPServerSession,
            callback
        ): void => prepareData(stream, session, onEmail, callback)
    })

function handleAuth(
    auth: SMTPServerAuthentication,
    _session: SMTPServerSession,
    callback: (
        err: Error | null | undefined,
        response?: SMTPServerAuthenticationResponse | undefined
    ) => void
): void {
    const {username, password} = auth
    if (
        isNil(username) ||
        isNil(password) ||
        isEmpty(username) ||
        isEmpty(password)
    ) {
        return callback(new Error('Invalid username or password syntax'))
    }

    const webhook = `https://discord.com/api/webhooks/${username}/${password}`

    axios({
        method: 'get',
        url: webhook
    })
        .then(result => {
            if (result.status !== 200) {
                callback(
                    new Error(
                        'Invalid webhook id or secret, validate smtp username and password are correct.'
                    )
                )
            } else {
                callback(null, {user: webhook})
            }
        })
        .catch(() => {
            callback(
                new Error(
                    'Invalid webhook id or secret, validate smtp username and password are correct.'
                )
            )
        })
}

function prepareData(
    stream: SMTPServerDataStream,
    session: SMTPServerSession,
    onEmail: (email: Buffer, webhook: string) => Promise<void>,
    callback: (err?: Error | null | undefined) => void
): void {
    if (isNil(session.user)) {
        throw new Error('Failed to prepare email data. Missing user session.')
    }

    const webhook = session.user
    const buffers: Buffer[] = []

    stream.on('data', (buffer: Buffer) => buffers.push(buffer))
    stream.on('end', async () => {
        const buffer = Buffer.concat(buffers)

        try {
            await onEmail(buffer, webhook)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            callback(e)
        }
        callback()
    })
}
