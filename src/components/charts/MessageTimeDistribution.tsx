'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MessageTimeDistributionProps {
  data: Record<string, number>;
}

export default function MessageTimeDistributionChart({ data }: MessageTimeDistributionProps) {
  const chartData = Object.entries(data).map(([time, count]) => ({
    time: time.charAt(0).toUpperCase() + time.slice(1),
    count
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Messages by Time of Day</h2>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 