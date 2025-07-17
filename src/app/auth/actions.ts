'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';

const auth = getAuth(app);

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    cookies().set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    redirect('/');
  } catch (error: any) {
    console.error('Login failed:', error.message);
    // You might want to redirect to login with an error query param
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    cookies().set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    redirect('/');
  } catch (error: any) {
    console.error('Signup failed:', error.message);
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}
