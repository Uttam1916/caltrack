import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import React from 'react';

interface CalorieChartProps {
  data: Array<{ date: string; calories: number }>;
  goal: number;
}

export function CalorieChart({ data, goal }: CalorieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="date" stroke="#999" />
        <YAxis stroke="#999" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1e1e1e', 
            border: '1px solid #333',
            borderRadius: '8px'
          }}
          labelStyle={{ color: '#fff' }}
        />
        <ReferenceLine y={goal} stroke="#4CAF50" strokeDasharray="5 5" />
        <Bar dataKey="calories" fill="#4CAF50" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
