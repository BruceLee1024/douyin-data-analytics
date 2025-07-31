import React from 'react';
import { Heart, MessageCircle, Share, Bookmark, ExternalLink } from 'lucide-react';
import { DouyinData } from '../types';

interface PopularVideoCardProps {
  video: DouyinData;
  rank: number;
}

const PopularVideoCard: React.FC<PopularVideoCardProps> = ({ video, rank }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const totalEngagements = video.likeCount + video.collectCount + video.commentCount + video.shareCount;
  const engagementRate = video.fansCount > 0 
    ? (totalEngagements / video.fansCount * 100).toFixed(1)
    : '0';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
            rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : rank === 3 ? 'bg-amber-600' : 'bg-blue-500'
          }`}>
            {rank}
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
              {video.mediaType}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">粉丝互动率</div>
          <div className="text-lg font-bold text-green-500">{engagementRate}%</div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 line-clamp-2">
        {video.videoDescription}
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-red-500" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">点赞数</div>
            <div className="font-bold text-gray-900 dark:text-white">{formatNumber(video.likeCount)}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Bookmark className="h-5 w-5 text-yellow-500" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">收藏数</div>
            <div className="font-bold text-gray-900 dark:text-white">{formatNumber(video.collectCount)}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-green-500" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">评论数</div>
            <div className="font-bold text-gray-900 dark:text-white">{formatNumber(video.commentCount)}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Share className="h-5 w-5 text-purple-500" />
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">分享数</div>
            <div className="font-bold text-gray-900 dark:text-white">{formatNumber(video.shareCount)}</div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>@{video.creatorName}</span>
          <span>粉丝: {formatNumber(video.fansCount)}</span>
        </div>
      </div>
    </div>
  );
};

export default PopularVideoCard;