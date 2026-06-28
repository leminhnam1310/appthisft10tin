"use client";

import { useEffect, useState } from "react";

import {
ResponsiveContainer,
LineChart,
Line,
BarChart,
Bar,
PieChart,
Pie,
Cell,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
} from "recharts";

export default function StatisticsPage() {
const [period, setPeriod] = useState("7");
const [chartType, setChartType] =
useState("bar");

const [chartData, setChartData] =
useState([]);

useEffect(() => {
const allMoods =
JSON.parse(
localStorage.getItem("moods")
) || [];

const now = new Date();

const filtered = allMoods.filter(
  (item) => {
    const moodDate = new Date(
      item.date
    );

    const diff =
      (now - moodDate) /
      (1000 * 60 * 60 * 24);

    return diff <= Number(period);
  }
);

const result = filtered.map(
  (item) => ({
    day:
      period === "1"
        ? new Date(
            item.date
          ).toLocaleTimeString(
            "vi-VN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )
        : new Date(
    item.date
  ).toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
    }
  ),

    value: item.value,
    mood: item.mood,
  })
);

setChartData(result);

}, [period]);

const filters = [
"1",
"3",
"7",
"14",
"30",
"90",
"180",
"365",
];

const todayMoodData = [
  {
    name: "😊",
    value: chartData.filter(
      (m) => m.mood === "😊"
    ).length,
    color: "#22c55e",
  },
  {
    name: "😔",
    value: chartData.filter(
      (m) => m.mood === "😔"
    ).length,
    color: "#3b82f6",
  },
  {
    name: "😫",
    value: chartData.filter(
      (m) => m.mood === "😫"
    ).length,
    color: "#ef4444",
  },
  {
    name: "😴",
    value: chartData.filter(
      (m) => m.mood === "😴"
    ).length,
    color: "#f59e0b",
  },
].filter(item => item.value > 0);
const getMoodColor = (mood) => {
  switch (mood) {
    case "😊":
      return "#22c55e";

    case "😔":
      return "#3b82f6";

    case "😫":
      return "#ef4444";

    case "😴":
      return "#f59e0b";

    default:
      return "#8b5cf6";
  }
};
return ( <main className="min-h-screen bg-slate-950 text-white p-8">

  <h1 className="text-4xl font-bold mb-8">
    📊 Thống kê cảm xúc
  </h1>

  <div className="grid grid-cols-4 gap-6">

    <div className="bg-slate-900 rounded-3xl p-5">

      <h2 className="font-bold mb-4">
        Khoảng thời gian
      </h2>

      <div className="space-y-3">

        {filters.map((f) => (
          <button
            key={f}
            onClick={() =>
              setPeriod(f)
            }
            className={`
              w-full py-3 rounded-xl transition
              ${
                period === f
                  ? "bg-violet-500"
                  : "bg-white/10 hover:bg-white/20"
              }
            `}
          >
            {f === "1" &&
              "Hôm nay"}
            {f === "3" &&
              "3 ngày"}
            {f === "7" &&
              "7 ngày"}
            {f === "14" &&
              "14 ngày"}
            {f === "30" &&
              "1 tháng"}
            {f === "90" &&
              "3 tháng"}
            {f === "180" &&
              "6 tháng"}
            {f === "365" &&
              "1 năm"}
          </button>
        ))}

      </div>

    </div>

    <div className="col-span-3 bg-slate-900 rounded-3xl p-6">

      <div className="flex justify-between items-center mb-4">

  <h2 className="text-2xl font-bold">
    Biểu đồ cảm xúc
  </h2>

  {period === "1" && (
    <div className="flex gap-3">

      <button
        onClick={() => setChartType("bar")}
        className={`px-4 py-2 rounded-xl ${
          chartType === "bar"
            ? "bg-violet-500"
            : "bg-white/10"
        }`}
      >
        📊 Cột
      </button>

      <button
        onClick={() => setChartType("pie")}
        className={`px-4 py-2 rounded-xl ${
          chartType === "pie"
            ? "bg-violet-500"
            : "bg-white/10"
        }`}
      >
        🥧 Tròn
      </button>

    </div>
  )}

</div>

<div className="flex gap-5 mb-6 text-sm flex-wrap">

  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-green-500" />
    😊 Vui vẻ
  </div>

  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-blue-500" />
    😔 Buồn
  </div>

  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-red-500" />
    😫 Mệt mỏi
  </div>

  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-yellow-500" />
    😴 Buồn ngủ
  </div>

</div>

   {period === "1" ? (

  <div className="h-[600px]">

    <ResponsiveContainer
      width="100%"
      height="100%"
    >

      {chartType === "bar" ? (

        <BarChart data={todayMoodData}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            radius={[12, 12, 0, 0]}
          >
            {todayMoodData.map(
              (entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              )
            )}
          </Bar>

        </BarChart>

      ) : (

        <PieChart>

          <Pie
            data={todayMoodData}
            dataKey="value"
            nameKey="name"
            outerRadius={180}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {todayMoodData.map(
              (entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              )
            )}
          </Pie>

          <Tooltip
            formatter={(value) => {
              const total =
                todayMoodData.reduce(
                  (sum, item) =>
                    sum + item.value,
                  0
                );

              const percent =
                total === 0
                  ? 0
                  : (
                      (value / total) *
                      100
                    ).toFixed(1);

              return [
                `${value} lần (${percent}%)`,
                "Số lần",
              ];
            }}
          />

        </PieChart>

      )}

    </ResponsiveContainer>

  </div>

) : (

  <div className="overflow-x-auto">

    <div
      style={{
        minWidth: `${Math.max(
          chartData.length * 80,
          1000
        )}px`,
      }}
    >

      <LineChart
        width={Math.max(
          chartData.length * 80,
          1000
        )}
        height={600}
        data={chartData}
      >

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#334155"
        />

        <XAxis
          dataKey="day"
          interval={0}
          angle={-35}
          textAnchor="end"
          height={80}
        />

        <YAxis domain={[0, 5]} />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="value"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={(props) => {
            const {
              cx,
              cy,
              payload,
            } = props;

            return (
              <circle
                cx={cx}
                cy={cy}
                r={7}
                fill={getMoodColor(
                  payload.mood
                )}
                stroke="#fff"
                strokeWidth={2}
              />
            );
          }}
        />

      </LineChart>

    </div>

  </div>

)}

    </div>
  </div>

</main>
);
}