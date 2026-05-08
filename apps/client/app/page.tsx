import { redirect } from 'next/navigation';

export default function HomePage() {
  const landingUrl =
    process.env.LANDING_URL ||
    process.env.NEXT_PUBLIC_LANDING_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://instareplyer.vercel.app'
      : 'http://localhost:3002');

  redirect(landingUrl);
}
