import React, { useMemo } from 'react';
import { DouyinData, AnalysisResult } from '../types';
import { analyzeData } from '../utils/dataProcessor';
import StatisticsCard from './StatisticsCard';
import LineChart from './charts/LineChart';
import WordCloudAnalysis from './WordCloudAnalysis';
import EnhancedAnalytics from './EnhancedAnalytics';
import ViralContentAnalysis from './ViralContentAnalysis';
import { ParetoAnalysis } from './ParetoAnalysis';
import PopularVideoCard from './PopularVideoCard';

interface DataAnalyticsProps {
  data: DouyinData[];
}

const DataAnalytics: React.FC<DataAnalyticsProps> = ({ data }) => {
  const analysis: AnalysisResult = useMemo(() => analyzeData(data), [data]);

  const topVideos = useMemo(() => {
    return [...data]
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 5);
  }, [data]);

  // 月度趋势图数据
  const monthlyTrendData = {
    labels: analysis.monthlyTrend.map(item => item.month),
    datasets: [
      {
        label: '发布数量',
        data: analysis.monthlyTrend.map(item => item.videos),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        yAxisID: 'y',
      },
      {
        label: '平均点赞数',
        data: analysis.monthlyTrend.map(item => item.likes),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        yAxisID: 'y1',
      },
      {
        label: '平均评论数',
        data: analysis.monthlyTrend.map(item => item.comments),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        yAxisID: 'y1',
      },
    ],
  };







  const creatorInfo = data.length > 0 ? data[0] : null;

  return (
    <div className="space-y-8">
      {/* 达人信息卡片 */}
      {creatorInfo && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{creatorInfo.creatorName}</h2>
              <p className="text-blue-100 mb-2">@{creatorInfo.douyinNumber}</p>
              <p className="text-blue-100 text-sm">{creatorInfo.creatorBio}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{((creatorInfo.fansCount || 0) / 10000).toFixed(1)}万</div>
              <div className="text-blue-100">粉丝数</div>
            </div>
          </div>
        </div>
      )}

      {/* 总体统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatisticsCard
          title="总视频数"
          value={analysis.totalVideos}
          icon="trending"
        />
        <StatisticsCard
          title="粉丝数"
          value={analysis.totalFans}
          icon="trending"
        />
        <StatisticsCard
          title="总点赞数"
          value={analysis.totalLikes}
          icon="heart"
        />
        <StatisticsCard
          title="总收藏数"
          value={analysis.totalCollects}
          icon="heart"
        />
        <StatisticsCard
          title="总评论数"
          value={analysis.totalComments}
          icon="message"
        />
        <StatisticsCard
          title="粉丝互动率"
          value={`${analysis.avgEngagementRate.toFixed(2)}%`}
          icon="trending"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LineChart
          data={monthlyTrendData}
          title="月度数据趋势"
          height={350}
        />
        <WordCloudAnalysis
          data={data}
          title="选题词云分析"
          height={350}
        />
      </div>

      {/* 爆款内容特征分析 */}
      <div className="mb-8">
        <ViralContentAnalysis analysis={analysis} />
      </div>

      {/* 80/20原则分析 */}
      <div className="mb-8">
        <ParetoAnalysis analysis={analysis} />
      </div>

      {/* 互动分布 */}
      <div className="grid grid-cols-1 gap-8">
        <EnhancedAnalytics analysis={analysis} />
      </div>

      {/* 热门作品展示 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">最受欢迎作品</h3>
          <div className="space-y-4">
            {topVideos.slice(0, 3).map((video, index) => (
              <PopularVideoCard
                key={video.videoID}
                video={video}
                rank={index + 1}
              />
            ))}
          </div>
        </div>

      {/* 详细排行榜 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">作品详细排行</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {topVideos.map((video, index) => (
            <PopularVideoCard
              key={video.videoID}
              video={video}
              rank={index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataAnalytics;