# SMTP to Discord webhooks
Runs a SMTP server that services may use to call Discord webhooks.

## Connecting
1. Point your SMTP client to the hosted server IP and port
2. Configure the connection to be insecure, without TLS authentication. **Remember! You should really only run this for local services!**
3. Set the username and password for the SMTP connection. The SMTP username will be the webhook client ID and the SMTP password will be the webhook secret.
    For example, webhook URL `https://discord.com/api/webhooks/1083944189114466304/mztK4WqhJabw9jJrRu8A1IBsMbRHj6JhjFzVWL6HbW3KmUW68hN2VkxOL7NTH7ijPuVC` would yield a username of `1083944189114466304` and a password of `mztK4WqhJabw9jJrRu8A1IBsMbRHj6JhjFzVWL6HbW3KmUW68hN2VkxOL7NTH7ijPuVC`
4. If you would like to use S3 for HTML, set the env variable `STDW_ENABLE_S3` to `true`, and configure AWS related env variables found in `.env`.
5. Run service