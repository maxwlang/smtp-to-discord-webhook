import {ParsedMail} from 'mailparser'

import {MessageBuilder, Webhook} from 'discord-webhook-node'

export const sendToDiscord = async (
    webhook: string,
    parsedEmail: ParsedMail,
    fileUrl?: string
): Promise<void> => {
    const subject = parsedEmail.subject ?? 'No Subject'
    const from =
        parsedEmail.from?.value[0].name ??
        parsedEmail.from?.text ??
        'Unknown Sender'
    const body = parsedEmail.text ?? 'Email body contained no text content.'

    const hook = new Webhook(webhook)
    hook.setUsername('smtp-to-discord-webhook')
    const embed = new MessageBuilder()
        .setTitle(subject)
        .setAuthor(from)
        .setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
        .setDescription(body)
        .setFooter('Email Forwarded by smtp-to-discord-webhook')
        .setUrl('https://github.com/maxwlang/smtp-to-discord-webhook')
        .setTimestamp()

    if (fileUrl) {
        embed.addField('View Email HTML', fileUrl)
    }

    hook.send(embed)
}
