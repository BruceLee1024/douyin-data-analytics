import React from 'react';
import { AnalysisResult } from '../types';

interface ViralContentAnalysisProps {
  analysis: AnalysisResult;
}

const ViralContentAnalysis: React.FC<ViralContentAnalysisProps> = ({ analysis }) => {
  const { viralContentFeatures } = analysis;

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
  };

  const totalVideos = analysis.totalVideos;

  const TitleLengthCard = () => {
    const { titleLengthAnalysis } = viralContentFeatures;
    const maxAvgLikes = Math.max(
      titleLengthAnalysis.short.avgLikes,
      titleLengthAnalysis.medium.avgLikes,
      titleLengthAnalysis.long.avgLikes
    );

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          📏 标题长度优化分析
        </h3>
        <div className="space-y-4">
          {[
            { key: 'short', label: '短标题 (≤15字)', data: titleLengthAnalysis.short },
            { key: 'medium', label: '中标题 (16-30字)', data: titleLengthAnalysis.medium },
            { key: 'long', label: '长标题 (>30字)', data: titleLengthAnalysis.long },
          ].map(({ key, label, data }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{data.count}条内容</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatNumber(data.avgLikes)}
                </div>
                <div className="text-sm text-gray-500">平均点赞</div>
              </div>
              <div className="w-20">
                <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${maxAvgLikes > 0 ? (data.avgLikes / maxAvgLikes) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 建议：{getTitleLengthRecommendation(titleLengthAnalysis)}
          </p>
        </div>
      </div>
    );
  };

  const EmojiUsageCard = () => {
    const { emojiUsage } = viralContentFeatures;
    const maxAvgEngagement = Math.max(
      emojiUsage.noEmoji.avgEngagement,
      emojiUsage.withEmoji.avgEngagement,
      emojiUsage.highEmoji.avgEngagement
    );

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          😊 表情符号使用分析
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'noEmoji', label: '无表情', data: emojiUsage.noEmoji, icon: '📝' },
            { key: 'withEmoji', label: '少量表情', data: emojiUsage.withEmoji, icon: '😊' },
            { key: 'highEmoji', label: '大量表情', data: emojiUsage.highEmoji, icon: '🎉' },
          ].map(({ key, label, data, icon }) => (
            <div key={key} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-medium text-gray-900 dark:text-white">{label}</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {formatNumber(data.avgEngagement)}
              </div>
              <div className="text-sm text-gray-500">平均互动</div>
              <div className="text-xs text-gray-400 mt-1">{data.count}条</div>
              <div className="mt-2">
                <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                  <div
                    className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                    style={{
                      width: `${maxAvgEngagement > 0 ? (data.avgEngagement / maxAvgEngagement) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            💡 建议：{getEmojiUsageRecommendation(emojiUsage)}
          </p>
        </div>
      </div>
    );
  };

  const MentionStrategyCard = () => {
    const { mentionStrategy } = viralContentFeatures;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          @ 提及策略分析
        </h3>
        <div className="space-y-4">
          {[
            { key: 'noMention', label: '无@提及', data: mentionStrategy.noMention, icon: '🔇' },
            { key: 'userMention', label: '@普通用户', data: mentionStrategy.userMention, icon: '👥' },
            { key: 'officialMention', label: '@官方账号', data: mentionStrategy.officialMention, icon: '✅' },
          ].map(({ key, label, data, icon }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {data.count}条内容 · 占比{((data.count / totalVideos) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatNumber(data.avgLikes)}
                </div>
                <div className="text-sm text-gray-500">平均点赞</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            💡 建议：{getMentionRecommendation(mentionStrategy)}
          </p>
        </div>
      </div>
    );
  };

  const getTitleLengthRecommendation = (analysis: any) => {
    const { short, medium, long } = analysis;
    const max = Math.max(short.avgLikes, medium.avgLikes, long.avgLikes);
    
    if (max === short.avgLikes) return "短标题表现最佳，建议保持简洁有力的表达风格";
    if (max === medium.avgLikes) return "中等长度标题效果最优，建议保持信息密度与可读性的平衡";
    return "长标题表现突出，可以适当增加详细信息提升内容吸引力";
  };

  const getEmojiUsageRecommendation = (analysis: any) => {
    const { noEmoji, withEmoji, highEmoji } = analysis;
    const max = Math.max(noEmoji.avgEngagement, withEmoji.avgEngagement, highEmoji.avgEngagement);
    
    if (max === noEmoji.avgEngagement) return "当前无表情符号的内容表现更好，建议保持简洁文字风格";
    if (max === withEmoji.avgEngagement) return "适量表情符号能有效提升互动，建议使用1-3个相关emoji";
    return "大量表情符号效果最佳，但需注意不要过度使用影响阅读体验";
  };

  const getMentionRecommendation = (analysis: any) => {
    const { noMention, userMention, officialMention } = analysis;
    const max = Math.max(noMention.avgLikes, userMention.avgLikes, officialMention.avgLikes);
    
    if (max === noMention.avgLikes) return "当前无@提及的内容表现更好，建议专注于内容本身质量";
    if (max === userMention.avgLikes) return "@普通用户能有效提升传播，建议适当@相关用户扩大影响力";
    return "@官方账号效果突出，可以尝试参与官方活动或@相关官方账号";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 爆款内容特征分析
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          深度分析内容特征与互动效果的关系，优化创作策略
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TitleLengthCard />
        <EmojiUsageCard />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <MentionStrategyCard />
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-3">📈 综合优化建议</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-semibold mb-1">标题优化</div>
            <div>{getTitleLengthRecommendation(viralContentFeatures.titleLengthAnalysis)}</div>
          </div>
          <div>
            <div className="font-semibold mb-1">表情使用</div>
            <div>{getEmojiUsageRecommendation(viralContentFeatures.emojiUsage)}</div>
          </div>
          <div>
            <div className="font-semibold mb-1">提及策略</div>
            <div>{getMentionRecommendation(viralContentFeatures.mentionStrategy)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViralContentAnalysis;