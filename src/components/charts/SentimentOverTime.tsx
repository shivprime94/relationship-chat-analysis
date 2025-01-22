'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface SentimentData {
  dates: string[];
  [key: string]: string[] | number[];
}

interface SentimentOverTimeProps {
  data: SentimentData;
  participants: string[];
}

export default function SentimentOverTimeChart({ data, participants }: SentimentOverTimeProps) {
  if (!data.dates || data.dates.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sentiment Over Time</h2>
        <p className="text-gray-500 dark:text-gray-400">No sentiment data available</p>
      </div>
    );
  }

  const chartData = data.dates.map((date, index) => ({
    date,
    [participants[0]]: (data[participants[0]] as number[])[index] || 0,
    [participants[1]]: (data[participants[1]] as number[])[index] || 0,
  }));

  const formatSentiment = (value: number) => `${(value * 100).toFixed(0)}%`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sentiment Over Time</h2>
      <div className="h-64">
        <LineChart width={600} height={250} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            domain={[0, 1]} 
            tickFormatter={formatSentiment}
            ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
          />
          <Tooltip 
            formatter={(value: number) => formatSentiment(value)}
            labelStyle={{ color: '#374151' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={participants[0]} 
            stroke="#8884d8" 
            name={participants[0] + "'s Sentiment"}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey={participants[1]} 
            stroke="#82ca9d" 
            name={participants[1] + "'s Sentiment"}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </div>
    </div>
  );
} 