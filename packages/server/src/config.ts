import { resolve } from 'path'
import { homedir } from 'os'

let _sessionStore: 'local' | 'remote' = (process.env.SESSION_STORE || 'local') as 'local' | 'remote'

export function getSessionStore(): 'local' | 'remote' {
  return _sessionStore
}

export function setSessionStore(mode: 'local' | 'remote'): void {
  _sessionStore = mode
}

export const config = {
  port: parseInt(process.env.PORT || '8648', 10),
  upstream: process.env.UPSTREAM || 'http://127.0.0.1:8642',
  uploadDir: process.env.UPLOAD_DIR || resolve(homedir(), '.hermes-web-ui', 'upload'),
  dataDir: resolve(__dirname, '..', 'data'),
  corsOrigins: process.env.CORS_ORIGINS || '*',
  /** Session store: 'local' (self-built SQLite) or 'remote' (Hermes CLI) */
  get sessionStore() { return _sessionStore },
}
