'use client';

import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ConversationInitiationProps {
  data: Record<string, number>;
}

export default function ConversationInitiationChart({ data }: ConversationInitiationProps) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Conversation Initiation</h2>
        <p className="text-gray-500 dark:text-gray-400">No conversation initiation data available</p>
      </div>
    );
  }

  const chartData = Object.entries(data).map(([name, count]) => ({
    name,
    value: count
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Conversation Initiation</h2>
      <div className="h-64">
        <PieChart width={400} height={250}>
          <Pie
            data={chartData}
            cx={200}
            cy={125}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name} (${((value / total) * 100).toFixed(0)}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} conversations`} />
        </PieChart>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {item.name}: {item.value} starts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 