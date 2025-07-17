import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { NextLevelCareersClient } from '@/components/next-level-careers-client';

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <NextLevelCareersClient />
  );
}
