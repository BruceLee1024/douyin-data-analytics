import React from 'react';
import { TrendingUp, Heart, MessageCircle, Share, Play } from 'lucide-react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: 'play' | 'heart' | 'message' | 'share' | 'trending';
  trend?: number;
  className?: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className = '' 
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const iconComponents = {
    play: Play,
    heart: Heart,
    message: MessageCircle,
    share: Share,
    trending: TrendingUp,
  };

  const IconComponent = iconComponents[icon];

  const displayValue = typeof value === 'number' ? formatNumber(value) : value;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayValue}</p>
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-sm font-medium ${
            trend >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            <TrendingUp className={`h-4 w-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsCard;