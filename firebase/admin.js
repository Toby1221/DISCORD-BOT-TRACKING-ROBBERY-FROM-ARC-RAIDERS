import admin from 'firebase-admin';

let appInitialized = false;

export function initFirebase() {
  if (appInitialized) return admin.app();

  // Prefer JSON string in GOOGLE_CREDENTIALS (useful for CI / envs)
  try {
    // First, support a base64-encoded JSON blob in GOOGLE_CREDENTIALS_B64
    if (process.env.GOOGLE_CREDENTIALS_B64) {
      const cleanedB64 = process.env.GOOGLE_CREDENTIALS_B64.replace(/[\s\n\r]/g, '');
      const decoded = Buffer.from(cleanedB64, 'base64').toString('utf8');
      const cred = JSON.parse(decoded);
      admin.initializeApp({
        credential: admin.credential.cert(cred),
        projectId: process.env.FIREBASE_PROJECT_ID || cred.project_id
      });
      appInitialized = true;
      return admin.app();
    }

    // Next, support a plain JSON string in GOOGLE_CREDENTIALS
    if (process.env.GOOGLE_CREDENTIALS) {
      const cred = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      admin.initializeApp({
        credential: admin.credential.cert(cred),
        projectId: process.env.FIREBASE_PROJECT_ID || cred.project_id
      });
      appInitialized = true;
      return admin.app();
    }
  } catch (err) {
    console.warn('Failed to parse GOOGLE_CREDENTIALS JSON', err);
  }

  // If GOOGLE_APPLICATION_CREDENTIALS is set to a file path, the SDK will pick it up automatically
  try {
    admin.initializeApp();
    appInitialized = true;
    return admin.app();
  } catch (err) {
    console.error('Failed to initialize Firebase Admin SDK. Set GOOGLE_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS.', err);
    throw err;
  }
}

export function getDb() {
  if (!appInitialized) initFirebase();
  return admin.firestore();
}

initFirebase();
