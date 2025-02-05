import React from 'react';
import CreateBugForm from '@/app/ui/client/CreateBugForm';
import { fetchAllBugs } from '@/app/lib/data';
import { BugDB } from '@/app/lib/definitions';
import DeleteBugButton from '@/app/ui/client/DeleteBugButton';
import { formatDateToLocal } from '@/app/lib/serverDateUtils';
import Breadcrumbs from '@/app/ui/client/Breadcrumbs';
function ReportBugForm({ bugs, userId }: { bugs: BugDB[]; userId: string }) {
  return (
    <div
      className="config-section rtl"
      style={{ marginTop: 130, textAlign: 'right' }}
    >
      <h1 className="text-2xl">דיווח על תקלה</h1>
      <CreateBugForm />
      <hr style={{ marginTop: 20, marginBottom: 10 }} />
      <div>
        <div>
          <u>{bugs.length > 0 ? 'בעיות ידועות:' : ''}</u>
        </div>
        <div>
          {bugs.map((bug) => (
            <div
              key={bug.id}
              style={{
                marginTop: 20,
                border: '1px solid #CCCCCC',
                padding: 5,
                borderRadius: 8,
              }}
            >
              <div>
                <DeleteBugButton id={bug.id} userId={userId} />
                <div> {formatDateToLocal(bug.updated_at)}</div>
                <div>{bug.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function BugsPage({
                                                     params,
                                                   }: {
  params: { userId: string };
}){
  const bugs = await fetchAllBugs();
  return <div>
    <Breadcrumbs
      breadcrumbs={[
        { label: '.', href: `/${params.userId}` },
        {
          label: 'הגדרות',
          href: `/${params.userId}/configurations`,
        },
        {
          label: 'דיווח באגים',
          href: `/${params.userId}/configurations/bugs`,
          active: true,
        },
      ]}
    />
    <ReportBugForm bugs={bugs} userId={params.userId} />
  </div>
}
