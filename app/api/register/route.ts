import { registerPlayerForDay } from '@/app/lib/actions';

export async function POST(request: Request) {
  const body = await request.json();
  const { phone_number, date, tournament_id, register } = body;

  try {
    await registerPlayerForDay(phone_number, date, tournament_id, register);
  } catch (error) {
    console.error('rsvpPlayerForDay Error:', error);
    return Response.json({ error });
  }

  return Response.json({ isRegistered: register });
}
