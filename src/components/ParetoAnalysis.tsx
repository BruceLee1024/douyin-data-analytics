import React from 'react';
import { format } from 'date-fns';
import { AnalysisResult } from '../types';
import ReactECharts from 'echarts-for-react';

interface ParetoAnalysisProps {
  analysis: AnalysisResult;
}

export const ParetoAnalysis: React.FC<ParetoAnalysisProps> = ({ analysis }) => {
  const { paretoAnalysis, postingFrequency } = analysis;
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-CN').format(Math.round(num));
  };

  const top20VideoCount = Math.ceil(analysis.totalVideos * 0.2);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">80/20原则分析</h2>
      
      {/* 发布频率统计 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">发布频率统计</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{formatNumber(postingFrequency.avgPerMonth)}</div>
            <div className="text-sm text-gray-600">月均发布</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatNumber(postingFrequency.avgPerWeek)}</div>
            <div className="text-sm text-gray-600">周均发布</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{formatNumber(analysis.totalVideos)}</div>
            <div className="text-sm text-gray-600">总视频数</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{top20VideoCount}</div>
            <div className="text-sm text-gray-600">Top 20%视频</div>
          </div>
        </div>
      </div>

      {/* 80/20贡献分析 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">贡献度分析</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-lg font-bold text-red-600">
              {paretoAnalysis.top20Videos.percentage.likes.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">点赞贡献</div>
            <div className="text-xs text-gray-500">
              {formatNumber(paretoAnalysis.top20Videos.totalLikes)} / {formatNumber(analysis.totalLikes)}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-lg font-bold text-yellow-600">
              {paretoAnalysis.top20Videos.percentage.collects.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">收藏贡献</div>
            <div className="text-xs text-gray-500">
              {formatNumber(paretoAnalysis.top20Videos.totalCollects)} / {formatNumber(analysis.totalCollects)}
            </div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-lg font-bold text-indigo-600">
              {paretoAnalysis.top20Videos.percentage.comments.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">评论贡献</div>
            <div className="text-xs text-gray-500">
              {formatNumber(paretoAnalysis.top20Videos.totalComments)} / {formatNumber(analysis.totalComments)}
            </div>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <div className="text-lg font-bold text-teal-600">
              {paretoAnalysis.top20Videos.percentage.shares.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">分享贡献</div>
            <div className="text-xs text-gray-500">
              {formatNumber(paretoAnalysis.top20Videos.totalShares)} / {formatNumber(analysis.totalShares)}
            </div>
          </div>
        </div>
      </div>

      {/* 月度发布趋势 */}
      {postingFrequency.monthly.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">月度发布趋势</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">月份</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">发布数量</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {postingFrequency.monthly.slice(-6).map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.month}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 桑基图可视化 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">80/20原则桑基图</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ReactECharts
            option={{
              title: {
                text: '视频分层互动贡献分析',
                left: 'center',
                textStyle: {
                  fontSize: 16,
                  fontWeight: 'bold'
                },
                subtext: '按互动总量分层：爆款(前10%) | 优质(20%) | 普通(70%)',
                subtextStyle: {
                  fontSize: 12,
                  color: '#666'
                }
              },
              tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                formatter: function(params: any) {
                  if (params.dataType === 'edge') {
                    const percentage = ((params.data.value / params.data.target) * 100).toFixed(1);
                    return `${params.data.source} → ${params.data.target}<br/>
                           贡献值: ${params.data.value.toLocaleString()}<br/>
                           占比: ${percentage}%`;
                  }
                  return `${params.name}<br/>${params.value?.toLocaleString() || ''}`;
                }
              },
              series: [
                {
                  type: 'sankey',
                  layout: 'none',
                  emphasis: {
                    focus: 'adjacency'
                  },
                  data: paretoAnalysis.sankeyData.nodes,
                  links: paretoAnalysis.sankeyData.links,
                  lineStyle: {
                    color: 'source',
                    curveness: 0.5,
                    opacity: 0.6
                  },
                  itemStyle: {
                    borderWidth: 1,
                    borderColor: '#aaa'
                  },
                  label: {
                    position: 'right',
                    fontSize: 12,
                    color: '#333'
                  }
                }
              ]
            }}
            style={{ height: '500px', width: '100%' }}
          />
        </div>
      </div>

      {/* Top 20% 视频列表 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Top 20% 贡献视频</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {paretoAnalysis.top20Videos.videos.slice(0, 10).map((video, index) => (
            <div key={video.videoID} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    #{index + 1} {video.videoDescription.substring(0, 50)}...
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(video.publishTime), 'yyyy-MM-dd')}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-semibold text-blue-600">
                    {formatNumber(video.likeCount)} 点赞
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatNumber(video.commentCount)} 评论
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};