// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl  p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md " />
        <div className="ml-2 h-6 w-16 rounded-md   font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md " />
      </div>
    </div>
  );
}

export function CardsSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </>
  );
}

export function PlayerSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b  py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full " />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md " />
          <div className="mt-2 h-4 w-12 rounded-md " />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md " />
    </div>
  );
}

export function PlayersSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
    >
      <div className="mb-4 h-8 w-36 rounded-md " />
      <div className="flex grow flex-col justify-between rounded-xl  p-4">
        <div className="px-6">
          <PlayerSkeleton />
          <PlayerSkeleton />
          <PlayerSkeleton />
          <PlayerSkeleton />
          <PlayerSkeleton />
          <div className="flex items-center pb-2 pt-6">
            <div className="h-5 w-5 rounded-full " />
            <div className="ml-2 h-4 w-20 rounded-md " />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md `}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <PlayersSkeleton />
      </div>
    </>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b  last-of-type:border-none ">
      {/* Customer Name and Image */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full "></div>
          <div className="h-6 w-24 rounded "></div>
        </div>
      </td>

      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded "></div>
      </td>
      {/* Amount */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded "></div>
      </td>
      {/* Date */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded "></div>
      </td>
      {/* Status */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded "></div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded "></div>
          <div className="h-[38px] w-[38px] rounded "></div>
        </div>
      </td>
    </tr>
  );
}

export function PlayersMobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b  pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full "></div>
          <div className="h-6 w-16 rounded "></div>
        </div>
        <div className="h-6 w-16 rounded "></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded "></div>
          <div className="mt-2 h-6 w-24 rounded "></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded "></div>
          <div className="h-10 w-10 rounded "></div>
        </div>
      </div>
    </div>
  );
}

export function PlayersTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg  p-2 md:pt-0">
          <div className="md:hidden">
            <PlayersMobileSkeleton />
            <PlayersMobileSkeleton />
            <PlayersMobileSkeleton />
            <PlayersMobileSkeleton />
            <PlayersMobileSkeleton />
            <PlayersMobileSkeleton />
          </div>
          <table className="hidden min-w-full md:table">
            <thead className="rounded-lg text-left  font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  .
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  .
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  .
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  .
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  .
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  .
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
