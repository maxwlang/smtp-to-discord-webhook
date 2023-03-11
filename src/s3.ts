import {S3Client} from '@aws-sdk/client-s3'
import {Upload} from '@aws-sdk/lib-storage'
import {isEmpty} from 'ramda'
import {v4 as uuid} from 'uuid'

export const s3Client = (): S3Client => new S3Client({})

export type UploadEmailReturn =
    | {
          success: true
          url: string
      }
    | {
          success: false
      }

export const uploadEmail = async (
    s3Client: S3Client,
    html: string
): Promise<UploadEmailReturn> => {
    if (isEmpty(html)) return {success: false}

    try {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env['S3_BUCKET'] ?? 'discord-to-smtp',
                Key: `${uuid()}.html`,
                ACL: 'public-read',
                Body: 'content'
            }
        })

        const result = await upload.done()
        // result.
        console.log(result)
    } catch (e) {
        return {
            success: false
        }
    }

    if (html)
        return {
            success: false
        }
    return {
        success: true,
        url: 'as'
    }
}
