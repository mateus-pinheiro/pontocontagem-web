// Firebase só é usado para Remote Config (feature flags). Projeto:
// pontocontagem-eb570 — as chaves do app web não são segredo (ficam no bundle),
// mas vêm de NEXT_PUBLIC_* pra não ficarem hardcoded no repo.
//
// Só deve ser importado de dentro de componentes 'use client': o export
// estático (`output: 'export'`) pré-renderiza no build, e o Remote Config
// precisa de window/IndexedDB.
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * App do Firebase, ou `null` se as env vars não foram configuradas — nesse
 * caso as flags caem no default (tudo desligado), que é o lado seguro.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!config.apiKey || !config.projectId || !config.appId) return null;
  return getApps().length ? getApp() : initializeApp(config);
}
