import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import {
  getBlobReadWriteToken,
  getBlobStoragePrefix,
  getDatabaseURL,
  isVercelBlobEnabled,
} from './lib/env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const blobToken = getBlobReadWriteToken()

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Posts, Media],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: getDatabaseURL(),
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: isVercelBlobEnabled(),
      collections: {
        media: {
          prefix: getBlobStoragePrefix(),
        },
      },
      token: blobToken ?? '',
      clientUploads: isVercelBlobEnabled(),
    }),
  ],
})
