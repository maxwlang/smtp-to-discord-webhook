import {s3Client, uploadEmail} from './s3'

import {S3Client} from '@aws-sdk/client-s3'
import {SMTPServer} from 'smtp-server'
import {isEmpty} from 'ramda'
import {sendToDiscord} from './discord'
import {simpleParser} from 'mailparser'
import {smtpServer} from './smtpServer'
import {stripHtml} from 'string-strip-html'

let server: SMTPServer
let s3: S3Client
;(async (): Promise<void> => {
    s3 = s3Client()
    server = smtpServer(onEmail)
    console.log('Starting on port 7570 with insecure requests enabled')
    server.listen(7570)
})()

async function onEmail(email: Buffer, webhook: string): Promise<void> {
    const parsedEmail = await simpleParser(email)

    const emailHtml = parsedEmail.html
        ? parsedEmail.html
        : parsedEmail.textAsHtml

    let emailText: string | undefined
    if (parsedEmail.text) {
        emailText = parsedEmail.text
    } else if (emailHtml && !isEmpty(emailHtml)) {
        emailText = stripHtml(emailHtml).result
    }
    parsedEmail.text = emailText

    let s3ResourceUrl: string | undefined
    if (emailHtml) {
        const uploadResult = await uploadEmail(s3, emailHtml)
        if (uploadResult.success) s3ResourceUrl = uploadResult.url
    }

    await sendToDiscord(webhook, parsedEmail, s3ResourceUrl)
}
