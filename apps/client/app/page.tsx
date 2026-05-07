import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect(process.env.LANDING_URL || 'http://localhost:3002');
}
