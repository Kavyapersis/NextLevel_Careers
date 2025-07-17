import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from './firebase-admin';

export async function getCurrentUser() {
  const sessionCookie = cookies().get('session')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedIdToken = await getAuth(adminApp).verifySessionCookie(sessionCookie, true);
    return decodedIdToken;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}
