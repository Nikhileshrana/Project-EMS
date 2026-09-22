function requireEnv(name: string): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`${name} environment variable is required`)
  }

  return value
}

export function getDbName(): string {
  return requireEnv('DB_NAME')
}

export function getDatabaseURL(): string {
  const databaseURL = requireEnv('DATABASE_URL')
  const url = new URL(databaseURL)

  url.pathname = `/${getDbName()}`

  return url.toString()
}

export function getBlobStoragePrefix(): string {
  return `${getDbName()}/`
}

export function getBlobReadWriteToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || undefined
}

export function isVercelBlobEnabled(): boolean {
  return Boolean(getBlobReadWriteToken())
}
