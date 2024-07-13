import { getFinalTablePlayersContent } from '@/app/ui/client/helpers';
import Card from '@/app/ui/client/Card';
export default async function FinalTablePlayers({
  title,
  params,
}: {
  title: string;
  params: { userId: string };
}) {
  const date = new Date().toISOString().slice(0, 10);
  const content = (await getFinalTablePlayersContent(
    date,
    false,
    params.userId,
  )) as JSX.Element;
  if (!content) return null;

  return (
    <div
      className="full-width grid gap-1 sm:grid-cols-1 lg:grid-cols-1"
      style={{ marginBottom: 10, marginTop: -20 }}
    >
      <Card title={title} value={content} type="players" />
    </div>
  );
}
