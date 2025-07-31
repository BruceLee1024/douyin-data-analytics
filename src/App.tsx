import React, { useState } from 'react';
import { BarChart3, Upload, TrendingUp, Sparkles } from 'lucide-react';
import FileUpload from './components/FileUpload';
import DataAnalytics from './components/DataAnalytics';
import { DouyinData } from './types';
import { parseExcelData } from './utils/dataProcessor';

function App() {
  const [data, setData] = useState<DouyinData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDataUpload = async (rawData: any[]) => {
    setIsAnalyzing(true);
    try {
      const parsedData = parseExcelData(rawData);
      setData(parsedData);
      
      // 模拟分析处理时间
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Data processing error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetData = () => {
    setData([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* 头部导航 */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  抖音数据分析平台
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  专业的博主作品数据分析工具
                </p>
              </div>
            </div>
            {data.length > 0 && (
              <button
                onClick={resetData}
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                重新上传
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data.length === 0 ? (
          <div className="space-y-8">
            {/* 欢迎区域 */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  智能数据分析平台
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  上传您的抖音博主数据Excel文件，获得全面的数据分析报告和美观的可视化图表
                </p>
              </div>
            </div>

            {/* 功能特色 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  多维度分析
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  从播放量、点赞数、评论数等多个维度深入分析作品表现
                </p>
              </div>

              <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  动态图表
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  精美的动态图表展示，让数据可视化更加直观和专业
                </p>
              </div>

              <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  智能洞察
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  自动识别热门内容和最佳发布时间，提供数据驱动的建议
                </p>
              </div>
            </div>

            {/* 文件上传 */}
            <FileUpload onDataUpload={handleDataUpload} />
          </div>
        ) : (
          <div className="space-y-8">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  正在分析数据...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  请稍候，我们正在为您生成详细的分析报告
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    数据分析报告
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    基于 {data.length} 个作品的综合分析结果
                  </p>
                </div>
                <DataAnalytics data={data} />
              </>
            )}
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">
              © 2025 抖音数据分析平台. 专业的创作者数据分析工具
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;