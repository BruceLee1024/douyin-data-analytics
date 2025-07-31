import { DouyinData, AnalysisResult } from '../types';
import { format, parseISO, getHours, getMonth, getYear } from 'date-fns';

export const parseExcelData = (data: any[]): DouyinData[] => {
  return data.slice(1).map((row) => ({
    creatorUID: row[0] || '',
    douyinNumber: row[1] || '',
    creatorName: row[2] || '未知达人',
    creatorLink: row[3] || '',
    fansCount: parseInt(row[4]) || 0,
    creatorBio: row[5] || '',
    videoID: row[6] || '',
    videoLink: row[7] || '',
    mediaType: row[8] || '视频',
    videoDescription: row[9] || '无描述',
    likeCount: parseInt(row[10]) || 0,
    collectCount: parseInt(row[11]) || 0,
    commentCount: parseInt(row[12]) || 0,
    shareCount: parseInt(row[13]) || 0,
    publishTime: row[14] || new Date().toISOString(),
  }));
};

export const analyzeData = (data: DouyinData[]): AnalysisResult => {
  const totalVideos = data.length;
  const totalFans = data.length > 0 ? data[0].fansCount : 0;
  const totalLikes = data.reduce((sum, item) => sum + item.likeCount, 0);
  const totalCollects = data.reduce((sum, item) => sum + item.collectCount, 0);
  const totalComments = data.reduce((sum, item) => sum + item.commentCount, 0);
  const totalShares = data.reduce((sum, item) => sum + item.shareCount, 0);
  
  const totalEngagements = totalLikes + totalCollects + totalComments + totalShares;
  const avgEngagementRate = totalFans > 0 
    ? (totalEngagements / (totalFans * totalVideos)) * 100 
    : 0;

  const mostPopularVideo = data.reduce((max, item) => 
    item.likeCount > max.likeCount ? item : max, data[0] || {} as DouyinData
  );



  // 月度趋势分析
  const monthlyData: { [key: string]: { likes: number; comments: number; videos: number } } = {};
  data.forEach(item => {
    try {
      let date: Date;
      // 处理Excel序列号日期格式
      if (typeof item.publishTime === 'number') {
        const excelEpoch = new Date(1899, 11, 30);
        date = new Date(excelEpoch.getTime() + item.publishTime * 24 * 60 * 60 * 1000);
      } else {
        date = parseISO(item.publishTime);
      }
      
      const monthKey = format(date, 'yyyy-MM');
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { likes: 0, comments: 0, videos: 0 };
      }
      monthlyData[monthKey].likes += item.likeCount;
      monthlyData[monthKey].comments += item.commentCount;
      monthlyData[monthKey].videos += 1;
    } catch (error) {
      console.error('日期解析错误:', item.publishTime, error);
    }
  });

  // 确保月度数据按时间排序
  const monthlyTrend = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      likes: Math.round(data.likes),
      comments: Math.round(data.comments),
      videos: data.videos,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.month + '-01');
      const dateB = new Date(b.month + '-01');
      return dateA.getTime() - dateB.getTime();
    });

  // 媒体类型分布
  const mediaTypeDistribution: { [key: string]: number } = {};
  data.forEach(item => {
    mediaTypeDistribution[item.mediaType] = (mediaTypeDistribution[item.mediaType] || 0) + 1;
  });

  // 互动率分析
  const engagementRates = {
    likeRate: totalFans > 0 ? (totalLikes / (totalFans * totalVideos)) * 100 : 0,
    commentRate: totalFans > 0 ? (totalComments / (totalFans * totalVideos)) * 100 : 0,
    shareRate: totalFans > 0 ? (totalShares / (totalFans * totalVideos)) * 100 : 0,
    collectRate: totalFans > 0 ? (totalCollects / (totalFans * totalVideos)) * 100 : 0,
  };

  // 热门话题标签分析
  const hashtagMap: { [key: string]: { count: number; totalLikes: number } } = {};
  data.forEach(item => {
    const description = String(item.videoDescription || '');
    const hashtags = description.match(/#\w+/g) || [];
    hashtags.forEach(tag => {
      const cleanTag = tag.replace('#', '');
      if (!hashtagMap[cleanTag]) {
        hashtagMap[cleanTag] = { count: 0, totalLikes: 0 };
      }
      hashtagMap[cleanTag].count += 1;
      hashtagMap[cleanTag].totalLikes += item.likeCount;
    });
  });

  const topHashtags = Object.entries(hashtagMap)
    .map(([tag, data]) => ({
      tag,
      count: data.count,
      avgLikes: Math.round(data.totalLikes / data.count),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 发布时间优化分析
  const hourlyData: { [key: string]: { engagement: number; count: number } } = {};
  data.forEach(item => {
    try {
      let date: Date;
      if (typeof item.publishTime === 'number') {
        const excelEpoch = new Date(1899, 11, 30);
        date = new Date(excelEpoch.getTime() + item.publishTime * 24 * 60 * 60 * 1000);
      } else {
        date = parseISO(item.publishTime);
      }
      
      const hour = date.getHours().toString().padStart(2, '0') + ':00';
      const engagement = item.likeCount + item.commentCount + item.shareCount + item.collectCount;
      
      if (!hourlyData[hour]) {
        hourlyData[hour] = { engagement: 0, count: 0 };
      }
      hourlyData[hour].engagement += engagement;
      hourlyData[hour].count += 1;
    } catch (error) {
      // 忽略日期解析错误
    }
  });

  const hourlyEngagement = Object.entries(hourlyData)
    .map(([hour, data]) => ({
      hour,
      engagement: Math.round(data.engagement / data.count),
    }))
    .sort((a, b) => b.engagement - a.engagement);

  const bestHours = hourlyEngagement.slice(0, 3).map(item => item.hour);

  // 粉丝参与度分析
  const activeFans = Math.min(totalEngagements, totalFans);
  const engagementScore = Math.min(avgEngagementRate * 10, 100);
  let viralPotential = '低';
  if (engagementScore > 50) viralPotential = '高';
  else if (engagementScore > 20) viralPotential = '中';

  // 内容表现趋势
  const contentPerformance = {
    avgLikesPerVideo: Math.round(totalLikes / totalVideos),
    avgCommentsPerVideo: Math.round(totalComments / totalVideos),
    avgSharesPerVideo: Math.round(totalShares / totalVideos),
    topPerformingContent: data
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 5)
      .map(item => String(item.videoDescription || '').substring(0, 50) + '...'),
  };

  // 爆款内容特征分析
  const titleLengthAnalysis = {
    short: { count: 0, totalLikes: 0, totalEngagement: 0 },
    medium: { count: 0, totalLikes: 0, totalEngagement: 0 },
    long: { count: 0, totalLikes: 0, totalEngagement: 0 },
  };

  const emojiUsage = {
    noEmoji: { count: 0, totalLikes: 0, totalEngagement: 0 },
    withEmoji: { count: 0, totalLikes: 0, totalEngagement: 0 },
    highEmoji: { count: 0, totalLikes: 0, totalEngagement: 0 },
  };

  const mentionStrategy = {
    noMention: { count: 0, totalLikes: 0, totalEngagement: 0 },
    userMention: { count: 0, totalLikes: 0, totalEngagement: 0 },
    officialMention: { count: 0, totalLikes: 0, totalEngagement: 0 },
  };

  data.forEach(item => {
    const description = String(item.videoDescription || '');
    const engagement = item.likeCount + item.commentCount + item.shareCount + item.collectCount;

    // 标题长度分析
    const length = description.length;
    if (length <= 15) {
      titleLengthAnalysis.short.count += 1;
      titleLengthAnalysis.short.totalLikes += item.likeCount;
      titleLengthAnalysis.short.totalEngagement += engagement;
    } else if (length <= 30) {
      titleLengthAnalysis.medium.count += 1;
      titleLengthAnalysis.medium.totalLikes += item.likeCount;
      titleLengthAnalysis.medium.totalEngagement += engagement;
    } else {
      titleLengthAnalysis.long.count += 1;
      titleLengthAnalysis.long.totalLikes += item.likeCount;
      titleLengthAnalysis.long.totalEngagement += engagement;
    }

    // Emoji使用分析
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    const emojiCount = (description.match(emojiRegex) || []).length;
    
    if (emojiCount === 0) {
      emojiUsage.noEmoji.count += 1;
      emojiUsage.noEmoji.totalLikes += item.likeCount;
      emojiUsage.noEmoji.totalEngagement += engagement;
    } else if (emojiCount <= 3) {
      emojiUsage.withEmoji.count += 1;
      emojiUsage.withEmoji.totalLikes += item.likeCount;
      emojiUsage.withEmoji.totalEngagement += engagement;
    } else {
      emojiUsage.highEmoji.count += 1;
      emojiUsage.highEmoji.totalLikes += item.likeCount;
      emojiUsage.highEmoji.totalEngagement += engagement;
    }

    // @提及策略分析
    const mentionMatches = description.match(/@\w+/g) || [];
    const hasOfficialMention = mentionMatches.some(mention => 
      mention.toLowerCase().includes('official') || 
      mention.toLowerCase().includes('douyin') ||
      mention.length < 5
    );

    if (mentionMatches.length === 0) {
      mentionStrategy.noMention.count += 1;
      mentionStrategy.noMention.totalLikes += item.likeCount;
      mentionStrategy.noMention.totalEngagement += engagement;
    } else if (hasOfficialMention) {
      mentionStrategy.officialMention.count += 1;
      mentionStrategy.officialMention.totalLikes += item.likeCount;
      mentionStrategy.officialMention.totalEngagement += engagement;
    } else {
      mentionStrategy.userMention.count += 1;
      mentionStrategy.userMention.totalLikes += item.likeCount;
      mentionStrategy.userMention.totalEngagement += engagement;
    }
  });

  const viralContentFeatures = {
    titleLengthAnalysis: {
      short: {
        count: titleLengthAnalysis.short.count,
        avgLikes: Math.round(titleLengthAnalysis.short.totalLikes / titleLengthAnalysis.short.count) || 0,
        avgEngagement: Math.round(titleLengthAnalysis.short.totalEngagement / titleLengthAnalysis.short.count) || 0,
      },
      medium: {
        count: titleLengthAnalysis.medium.count,
        avgLikes: Math.round(titleLengthAnalysis.medium.totalLikes / titleLengthAnalysis.medium.count) || 0,
        avgEngagement: Math.round(titleLengthAnalysis.medium.totalEngagement / titleLengthAnalysis.medium.count) || 0,
      },
      long: {
        count: titleLengthAnalysis.long.count,
        avgLikes: Math.round(titleLengthAnalysis.long.totalLikes / titleLengthAnalysis.long.count) || 0,
        avgEngagement: Math.round(titleLengthAnalysis.long.totalEngagement / titleLengthAnalysis.long.count) || 0,
      },
    },
    emojiUsage: {
      noEmoji: {
        count: emojiUsage.noEmoji.count,
        avgLikes: Math.round(emojiUsage.noEmoji.totalLikes / emojiUsage.noEmoji.count) || 0,
        avgEngagement: Math.round(emojiUsage.noEmoji.totalEngagement / emojiUsage.noEmoji.count) || 0,
      },
      withEmoji: {
        count: emojiUsage.withEmoji.count,
        avgLikes: Math.round(emojiUsage.withEmoji.totalLikes / emojiUsage.withEmoji.count) || 0,
        avgEngagement: Math.round(emojiUsage.withEmoji.totalEngagement / emojiUsage.withEmoji.count) || 0,
      },
      highEmoji: {
        count: emojiUsage.highEmoji.count,
        avgLikes: Math.round(emojiUsage.highEmoji.totalLikes / emojiUsage.highEmoji.count) || 0,
        avgEngagement: Math.round(emojiUsage.highEmoji.totalEngagement / emojiUsage.highEmoji.count) || 0,
      },
    },
    mentionStrategy: {
      noMention: {
        count: mentionStrategy.noMention.count,
        avgLikes: Math.round(mentionStrategy.noMention.totalLikes / mentionStrategy.noMention.count) || 0,
        avgEngagement: Math.round(mentionStrategy.noMention.totalEngagement / mentionStrategy.noMention.count) || 0,
      },
      userMention: {
        count: mentionStrategy.userMention.count,
        avgLikes: Math.round(mentionStrategy.userMention.totalLikes / mentionStrategy.userMention.count) || 0,
        avgEngagement: Math.round(mentionStrategy.userMention.totalEngagement / mentionStrategy.userMention.count) || 0,
      },
      officialMention: {
        count: mentionStrategy.officialMention.count,
        avgLikes: Math.round(mentionStrategy.officialMention.totalLikes / mentionStrategy.officialMention.count) || 0,
        avgEngagement: Math.round(mentionStrategy.officialMention.totalEngagement / mentionStrategy.officialMention.count) || 0,
      },
    },
  };

  // 发布频率分析
  const postingFrequency = {
    monthly: [] as { month: string; count: number }[],
    weekly: [] as { week: string; count: number }[],
    avgPerMonth: 0,
    avgPerWeek: 0,
  };

  const monthlyFreq: { [key: string]: number } = {};
  const weeklyFreq: { [key: string]: number } = {};

  data.forEach(item => {
    try {
      let date: Date;
      if (typeof item.publishTime === 'number') {
        const excelEpoch = new Date(1899, 11, 30);
        date = new Date(excelEpoch.getTime() + item.publishTime * 24 * 60 * 60 * 1000);
      } else {
        date = parseISO(item.publishTime);
      }

      const monthKey = format(date, 'yyyy-MM');
      const weekKey = format(date, 'yyyy-ww');

      monthlyFreq[monthKey] = (monthlyFreq[monthKey] || 0) + 1;
      weeklyFreq[weekKey] = (weeklyFreq[weekKey] || 0) + 1;
    } catch (error) {
      // 忽略日期解析错误
    }
  });

  postingFrequency.monthly = Object.entries(monthlyFreq)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  postingFrequency.weekly = Object.entries(weeklyFreq)
    .map(([week, count]) => ({ week, count }))
    .sort((a, b) => a.week.localeCompare(b.week));

  postingFrequency.avgPerMonth = postingFrequency.monthly.length > 0 
    ? Math.round(data.length / postingFrequency.monthly.length) 
    : 0;

  postingFrequency.avgPerWeek = postingFrequency.weekly.length > 0 
    ? Math.round(data.length / postingFrequency.weekly.length) 
    : 0;

  // 80/20原则分析 (帕累托分析)
  const sortedByLikes = [...data].sort((a, b) => b.likeCount - a.likeCount);
  const top20Count = Math.ceil(data.length * 0.2);
  const top20Videos = sortedByLikes.slice(0, top20Count);

  const top20Total = {
    likes: top20Videos.reduce((sum, video) => sum + video.likeCount, 0),
    collects: top20Videos.reduce((sum, video) => sum + video.collectCount, 0),
    comments: top20Videos.reduce((sum, video) => sum + video.commentCount, 0),
    shares: top20Videos.reduce((sum, video) => sum + video.shareCount, 0),
  };

  // 重新设计桑基图数据结构
  const sankeyNodes = [
    { name: '全部视频', itemStyle: { color: '#6366f1' } },
    { name: '爆款视频', itemStyle: { color: '#ef4444' } },
    { name: '优质视频', itemStyle: { color: '#f59e0b' } },
    { name: '普通视频', itemStyle: { color: '#10b981' } },
    { name: '点赞', itemStyle: { color: '#3b82f6' } },
    { name: '收藏', itemStyle: { color: '#8b5cf6' } },
    { name: '评论', itemStyle: { color: '#f97316' } },
    { name: '分享', itemStyle: { color: '#06b6d4' } },
  ];

  // 按互动总量分层
  const sortedByEngagement = [...data].sort((a, b) => 
    (b.likeCount + b.commentCount + b.shareCount + b.collectCount) - 
    (a.likeCount + a.commentCount + a.shareCount + a.collectCount)
  );

  const viralCount = Math.ceil(data.length * 0.1);
  const qualityCount = Math.ceil(data.length * 0.2);

  const viralVideos = sortedByEngagement.slice(0, viralCount);
  const qualityVideos = sortedByEngagement.slice(viralCount, viralCount + qualityCount);
  const normalVideos = sortedByEngagement.slice(viralCount + qualityCount);

  const viralTotals = {
    likes: viralVideos.reduce((sum, video) => sum + video.likeCount, 0),
    collects: viralVideos.reduce((sum, video) => sum + video.collectCount, 0),
    comments: viralVideos.reduce((sum, video) => sum + video.commentCount, 0),
    shares: viralVideos.reduce((sum, video) => sum + video.shareCount, 0),
  };

  const qualityTotals = {
    likes: qualityVideos.reduce((sum, video) => sum + video.likeCount, 0),
    collects: qualityVideos.reduce((sum, video) => sum + video.collectCount, 0),
    comments: qualityVideos.reduce((sum, video) => sum + video.commentCount, 0),
    shares: qualityVideos.reduce((sum, video) => sum + video.shareCount, 0),
  };

  const normalTotals = {
    likes: normalVideos.reduce((sum, video) => sum + video.likeCount, 0),
    collects: normalVideos.reduce((sum, video) => sum + video.collectCount, 0),
    comments: normalVideos.reduce((sum, video) => sum + video.commentCount, 0),
    shares: normalVideos.reduce((sum, video) => sum + video.shareCount, 0),
  };

  const paretoAnalysis = {
    top20Videos: {
      videos: top20Videos,
      totalLikes: top20Total.likes,
      totalCollects: top20Total.collects,
      totalComments: top20Total.comments,
      totalShares: top20Total.shares,
      percentage: {
        likes: totalLikes > 0 ? (top20Total.likes / totalLikes) * 100 : 0,
        collects: totalCollects > 0 ? (top20Total.collects / totalCollects) * 100 : 0,
        comments: totalComments > 0 ? (top20Total.comments / totalComments) * 100 : 0,
        shares: totalShares > 0 ? (top20Total.shares / totalShares) * 100 : 0,
      },
    },
    sankeyData: {
      nodes: sankeyNodes,
      links: [
        { source: 0, target: 1, value: viralVideos.length, lineStyle: { color: '#ef4444' } },
        { source: 0, target: 2, value: qualityVideos.length, lineStyle: { color: '#f59e0b' } },
        { source: 0, target: 3, value: normalVideos.length, lineStyle: { color: '#10b981' } },
        { source: 1, target: 4, value: viralTotals.likes },
        { source: 1, target: 5, value: viralTotals.collects },
        { source: 1, target: 6, value: viralTotals.comments },
        { source: 1, target: 7, value: viralTotals.shares },
        { source: 2, target: 4, value: qualityTotals.likes },
        { source: 2, target: 5, value: qualityTotals.collects },
        { source: 2, target: 6, value: qualityTotals.comments },
        { source: 2, target: 7, value: qualityTotals.shares },
        { source: 3, target: 4, value: normalTotals.likes },
        { source: 3, target: 5, value: normalTotals.collects },
        { source: 3, target: 6, value: normalTotals.comments },
        { source: 3, target: 7, value: normalTotals.shares },
      ].filter(link => link.value > 0),
    },
  };

  return {
    totalVideos,
    totalFans,
    totalLikes,
    totalCollects,
    totalComments,
    totalShares,
    avgEngagementRate,
    mostPopularVideo,
    engagementRates,
    topHashtags,
    optimalPostTime: {
      bestHours,
      hourlyEngagement,
    },
    fanEngagement: {
      activeFans,
      engagementScore: Math.round(engagementScore),
      viralPotential,
    },
    contentPerformance,
    viralContentFeatures,
    monthlyTrend,
    mediaTypeDistribution,
    postingFrequency,
    paretoAnalysis,
  };
};