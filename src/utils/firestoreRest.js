// Server-side Firestore reads over the REST API.
//
// The Firebase JS SDK is deliberately browser-only here (see firebase_config.jsx),
// but the public event and challenge pages have to render their content on the
// server: a crawler or a link preview that only sees an empty shell defeats the
// point of giving each event its own page. The REST API needs no SDK, so
// getServerSideProps can call it directly.
//
// This only works for collections whose security rules allow unauthenticated
// reads — `publicEvents` and `hackathonChallenges`. Never route authenticated
// course content through here; it has no user credentials and would be denied.

import { firebaseConfig } from "../firebase_config.js";

const BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

function decodeValue(value) {
  if (!value || typeof value !== "object") return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  // Timestamps stay ISO strings: getServerSideProps props must be JSON
  // serialisable, and asDate() in utils/dates.js accepts strings.
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(decodeValue);
  if ("mapValue" in value) return decodeFields(value.mapValue.fields);
  return null;
}

function decodeFields(fields) {
  return Object.fromEntries(
    Object.entries(fields || {}).map(([key, value]) => [key, decodeValue(value)]),
  );
}

function decodeDocument(document) {
  if (!document?.name) return null;
  return { id: document.name.split("/").pop(), ...decodeFields(document.fields) };
}

export async function fetchPublicDocument(collectionPath, documentId) {
  if (!documentId) return null;
  const url = `${BASE}/${collectionPath}/${encodeURIComponent(documentId)}?key=${firebaseConfig.apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return decodeDocument(await response.json());
  } catch (error) {
    console.error(`Unable to read ${collectionPath}/${documentId} over REST`, error);
    return null;
  }
}

// These collections hold tens of documents, not thousands, so reading the whole
// thing and filtering in JS keeps us clear of composite index requirements.
export async function fetchPublicCollection(collectionPath) {
  const url = `${BASE}/${collectionPath}?key=${firebaseConfig.apiKey}&pageSize=300`;

  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const body = await response.json();
    return (body.documents || []).map(decodeDocument).filter(Boolean);
  } catch (error) {
    console.error(`Unable to read ${collectionPath} over REST`, error);
    return [];
  }
}
