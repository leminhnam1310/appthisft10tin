"use client";

export default function FriendSkeleton({ count = 6 }) {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="
            overflow-hidden rounded-3xl border
            bg-white dark:bg-slate-900
            border-slate-200 dark:border-slate-800
            shadow-sm
            animate-pulse
          "
        >
          {/* COVER */}
          <div className="h-24 bg-slate-200 dark:bg-slate-800" />

          {/* AVATAR */}
          <div className="flex justify-center -mt-12">
            <div className="
              h-24 w-24 rounded-full
              border-4 border-white dark:border-slate-900
              bg-slate-300 dark:bg-slate-700
            " />
          </div>

          <div className="p-6 space-y-4">

            {/* NAME */}
            <div className="mx-auto h-5 w-40 rounded bg-slate-200 dark:bg-slate-700" />

            {/* USERNAME */}
            <div className="mx-auto h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />

            {/* AI MATCH */}
            <div className="mt-6 space-y-2">

              <div className="flex justify-between">
                <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-10 rounded bg-slate-200 dark:bg-slate-700" />
              </div>

              <div className="h-2 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                <div className="h-full w-1/2 bg-slate-300 dark:bg-slate-600" />
              </div>

            </div>

            {/* INFO */}
            <div className="space-y-3 mt-4">

              <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />

            </div>

            {/* BUTTON */}
            <div className="h-11 w-full rounded-xl mt-6 bg-slate-200 dark:bg-slate-700" />

          </div>
        </div>
      ))}
    </div>
  );
}