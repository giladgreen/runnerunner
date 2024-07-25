import SideNav from '@/app/ui/client/SideNav';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string };
}) {
  return (
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="cellular">
              <SideNav userId={params.userId}/>
          </div>
          <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
          <div className="only-wide-screen w-full flex-none md:w-64">
              <SideNav userId={params.userId}/>
          </div>
      </div>
  );
}
