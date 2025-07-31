import React from 'react';
import { AnalysisResult } from '../types';

interface EnhancedAnalyticsProps {
  analysis: AnalysisResult;
}

const EnhancedAnalytics: React.FC<EnhancedAnalyticsProps> = ({ analysis }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 互动率分析 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">互动率分析</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">点赞率</span>
            <span className="text-blue-600 font-semibold">{analysis.engagementRates.likeRate.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">评论率</span>
            <span className="text-green-600 font-semibold">{analysis.engagementRates.commentRate.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">分享率</span>
            <span className="text-purple-600 font-semibold">{analysis.engagementRates.shareRate.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">收藏率</span>
            <span className="text-orange-600 font-semibold">{analysis.engagementRates.collectRate.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* 粉丝参与度 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">粉丝参与度</h3>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {analysis.fanEngagement.engagementScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">参与评分</div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            analysis.fanEngagement.viralPotential === '高' 
              ? 'bg-green-100 text-green-800' 
              : analysis.fanEngagement.viralPotential === '中'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            病毒传播潜力: {analysis.fanEngagement.viralPotential}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            活跃粉丝: {analysis.fanEngagement.activeFans.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 热门话题标签 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">热门话题标签</h3>
        <div className="space-y-2">
          {analysis.topHashtags.slice(0, 5).map((hashtag, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-blue-600 font-medium">#{hashtag.tag}</span>
              <div className="text-right">
                <div className="text-sm font-semibold">{hashtag.count}次</div>
                <div className="text-xs text-gray-500">{hashtag.avgLikes}平均赞</div>
              </div>
            </div>
          ))}
          {analysis.topHashtags.length === 0 && (
            <p className="text-gray-500 text-center py-4">暂无话题标签数据</p>
          )}
        </div>
      </div>

      {/* 发布时间优化 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">最佳发布时间</h3>
        <div className="space-y-3">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            推荐时段: <span className="font-semibold text-blue-600">{analysis.optimalPostTime.bestHours.join(', ')}</span>
          </div>
          <div className="space-y-2">
            {analysis.optimalPostTime.hourlyEngagement.slice(0, 3).map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{item.hour}</span>
                <span className="font-medium text-green-600">{item.engagement}互动</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 内容表现趋势 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">内容表现趋势</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analysis.contentPerformance.avgLikesPerVideo}</div>
            <div className="text-sm text-gray-600">平均点赞</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analysis.contentPerformance.avgCommentsPerVideo}</div>
            <div className="text-sm text-gray-600">平均评论</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{analysis.contentPerformance.avgSharesPerVideo}</div>
            <div className="text-sm text-gray-600">平均分享</div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">热门内容示例</h4>
          <div className="space-y-1">
            {analysis.contentPerformance.topPerformingContent.slice(0, 3).map((content, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                {content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalytics;