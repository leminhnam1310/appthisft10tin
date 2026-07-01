"use client";

export default function FriendSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border bg-white shadow-sm"
        >
          {/* Cover */}
          <div className="h-24 animate-pulse bg-gray-200" />

          {/* Avatar */}
          <div className="flex justify-center -mt-12">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 animate-pulse" />
          </div>

          <div className="p-6">
            {/* Name */}
            <div className="mx-auto h-5 w-40 rounded bg-gray-200 animate-pulse" />

            {/* Username */}
            <div className="mx-auto mt-3 h-4 w-24 rounded bg-gray-100 animate-pulse" />

            {/* AI Match */}
            <div className="mt-6">
              <div className="mb-2 flex justify-between">
                <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-10 rounded bg-gray-200 animate-pulse" />
              </div>

              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full w-2/3 rounded-full bg-gray-300 animate-pulse" />
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-3/5 rounded bg-gray-100 animate-pulse" />
            </div>

            {/* Button */}
            <div className="mt-7 h-11 rounded-xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}