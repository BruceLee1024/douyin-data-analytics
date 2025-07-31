export interface DouyinData {
  creatorUID: string;
  douyinNumber: string;
  creatorName: string;
  creatorLink: string;
  fansCount: number;
  creatorBio: string;
  videoID: string;
  videoLink: string;
  mediaType: string;
  videoDescription: string;
  likeCount: number;
  collectCount: number;
  commentCount: number;
  shareCount: number;
  publishTime: string;
}

export interface AnalysisResult {
  totalVideos: number;
  totalFans: number;
  totalLikes: number;
  totalCollects: number;
  totalComments: number;
  totalShares: number;
  avgEngagementRate: number;
  mostPopularVideo: DouyinData;

  // 新增互动率分析
  engagementRates: {
    likeRate: number;
    commentRate: number;
    shareRate: number;
    collectRate: number;
  };

  // 热门话题标签分析
  topHashtags: { tag: string; count: number; avgLikes: number }[];

  // 发布时间优化分析
  optimalPostTime: {
    bestHours: string[];
    hourlyEngagement: { hour: string; engagement: number }[];
  };

  // 粉丝参与度分析
  fanEngagement: {
    activeFans: number;
    engagementScore: number;
    viralPotential: string;
  };

  // 内容表现趋势
  contentPerformance: {
    avgLikesPerVideo: number;
    avgCommentsPerVideo: number;
    avgSharesPerVideo: number;
    topPerformingContent: string[];
  };

  // 爆款内容特征分析
  viralContentFeatures: {
    titleLengthAnalysis: {
      short: { count: number; avgLikes: number; avgEngagement: number };
      medium: { count: number; avgLikes: number; avgEngagement: number };
      long: { count: number; avgLikes: number; avgEngagement: number };
    };
    emojiUsage: {
      noEmoji: { count: number; avgLikes: number; avgEngagement: number };
      withEmoji: { count: number; avgLikes: number; avgEngagement: number };
      highEmoji: { count: number; avgLikes: number; avgEngagement: number };
    };
    mentionStrategy: {
      noMention: { count: number; avgLikes: number; avgEngagement: number };
      userMention: { count: number; avgLikes: number; avgEngagement: number };
      officialMention: { count: number; avgLikes: number; avgEngagement: number };
    };
  };

  monthlyTrend: { month: string; likes: number; comments: number; videos: number }[];
  mediaTypeDistribution: { [key: string]: number };
  
  // 发布频率分析
  postingFrequency: {
    monthly: { month: string; count: number }[];
    weekly: { week: string; count: number }[];
    avgPerMonth: number;
    avgPerWeek: number;
  };

  // 80/20原则分析
  paretoAnalysis: {
    top20Videos: {
      videos: DouyinData[];
      totalLikes: number;
      totalCollects: number;
      totalComments: number;
      totalShares: number;
      percentage: {
        likes: number;
        collects: number;
        comments: number;
        shares: number;
      };
    };
    sankeyData: {
      nodes: { name: string }[];
      links: { source: number; target: number; value: number }[];
    };
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}