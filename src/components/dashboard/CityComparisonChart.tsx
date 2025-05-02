
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for city comparisons
const data = [
  {
    name: 'Employment',
    Johannesburg: 67,
    CapeTown: 71,
    Durban: 64,
    Pretoria: 69,
  },
  {
    name: 'Education',
    Johannesburg: 72,
    CapeTown: 78,
    Durban: 68,
    Pretoria: 74,
  },
  {
    name: 'Healthcare',
    Johannesburg: 65,
    CapeTown: 73,
    Durban: 62,
    Pretoria: 68,
  },
  {
    name: 'Infrastructure',
    Johannesburg: 70,
    CapeTown: 75,
    Durban: 65,
    Pretoria: 72,
  },
  {
    name: 'Safety',
    Johannesburg: 58,
    CapeTown: 62,
    Durban: 60,
    Pretoria: 65,
  },
];

interface CityComparisonChartProps {
  title?: string;
  description?: string;
}

const CityComparisonChart = ({ 
  title = "City Comparison", 
  description = "Key metrics across major South African cities" 
}: CityComparisonChartProps) => {
  return (
    <Card className="col-span-2 animate-fade-in">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Johannesburg" fill="#0032A0" />
            <Bar dataKey="CapeTown" fill="#007A4D" />
            <Bar dataKey="Durban" fill="#E03C31" />
            <Bar dataKey="Pretoria" fill="#FFB81C" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CityComparisonChart;
