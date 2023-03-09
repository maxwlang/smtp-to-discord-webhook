import smtpServer from './smtpServer'

(async () => {
  console.log('Starting on port 7570 with insecure requests enabled')
  const server = smtpServer(onEmail)
  server.listen(7570)
})()

function onEmail (email: Buffer, webhook: string): void {
  // pretty the contents
//   const emailText = parse(email.text)

  // upload html to s3
  // const fileUrl = upload(email.html)

  // send to discord
//   sendToDiscord(emailText, fileUrl, webhook)
}
