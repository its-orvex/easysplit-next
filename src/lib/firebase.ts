import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const IS_CONFIGURED = !!(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.startsWith('your_')
)

let app  = null as ReturnType<typeof initializeApp> | null
let auth = null as ReturnType<typeof getAuth> | null
let db   = null as ReturnType<typeof getFirestore> | null

if (IS_CONFIGURED) {
  try {
    app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    auth = getAuth(app)
    db   = getFirestore(app)
  } catch (err: any) {
    console.warn('[EasySplit] Firebase init failed:', err.message)
  }
}

export { app, auth, db }
