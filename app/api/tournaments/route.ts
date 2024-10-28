import { fetchTournaments } from '@/app/lib/data';

export async function GET(request: Request) {
  try {
    const tournaments = await fetchTournaments();
    return Response.json({ tournaments });
  } catch (error) {
    console.error('fetchTournaments Error:', error);
    return Response.json({ error });
  }
}
