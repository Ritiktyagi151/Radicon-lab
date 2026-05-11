export default function BlogSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm border border-gray-100 bg-white shadow-sm">
      <div className="h-[245px] animate-pulse bg-gray-100" />
      <div className="space-y-4 p-6">
        <div className="h-4 w-2/3 animate-pulse rounded-sm bg-gray-100" />
        <div className="h-6 w-full animate-pulse rounded-sm bg-gray-100" />
        <div className="h-6 w-5/6 animate-pulse rounded-sm bg-gray-100" />
        <div className="h-16 w-full animate-pulse rounded-sm bg-gray-100" />
        <div className="h-10 w-32 animate-pulse rounded-sm bg-gray-100" />
      </div>
    </div>
  )
}
