
import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  description?: string;
}

const StatCard = ({ title, value, change, icon, description }: StatCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const changeAbsolute = change ? Math.abs(change) : undefined;
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        
        {change !== undefined && (
          <div className="flex items-center mt-1">
            <div
              className={cn(
                "flex items-center text-xs font-medium",
                isPositive && "text-emerald-600",
                isNegative && "text-red-600",
                !isPositive && !isNegative && "text-gray-500"
              )}
            >
              {isPositive && <ArrowUp className="h-3 w-3 mr-1" />}
              {isNegative && <ArrowDown className="h-3 w-3 mr-1" />}
              <span>{changeAbsolute}%</span>
            </div>
            
            {description && (
              <span className="text-xs text-muted-foreground ml-1.5">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
