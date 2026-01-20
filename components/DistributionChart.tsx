import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { DistributionRange } from '../types';

interface DistributionChartProps {
  data: DistributionRange[];
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data }) => {
  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: '#6b7280' }} 
            interval={0}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={1000}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList dataKey="count" position="top" fill="#374151" fontSize={14} fontWeight="bold" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionChart;
