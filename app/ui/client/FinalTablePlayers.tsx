'use client';

import Card from '@/app/ui/client/Card';
export default function FinalTablePlayers({
  title,
  content,
}: {
  title: string;
  content: JSX.Element;
}) {
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
