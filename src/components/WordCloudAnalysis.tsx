import React, { useMemo } from 'react';
import { DouyinData } from '../types';

interface WordCloudAnalysisProps {
  data: DouyinData[];
  title: string;
  height?: number;
}

interface WordFrequency {
  text: string;
  value: number;
}

const WordCloudAnalysis: React.FC<WordCloudAnalysisProps> = ({ data, title, height = 350 }) => {
  const wordFrequency = useMemo(() => {
    const textContent = data.map(item => item.videoDescription).join(' ');
    
    // 使用改进的中文分词算法
    const words = advancedChineseSegmentation(textContent);
    
    const wordCount: { [key: string]: number } = {};
    
    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      if (lowerWord.length > 1 && !stopWords.includes(lowerWord)) {
        wordCount[lowerWord] = (wordCount[lowerWord] || 0) + 1;
      }
    });
    
    return Object.entries(wordCount)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50);
  }, [data]);

  const maxValue = Math.max(...wordFrequency.map(word => word.value), 1);

  const getFontSize = (value: number) => {
    const minSize = 12;
    const maxSize = 48;
    return minSize + (value / maxValue) * (maxSize - minSize);
  };

  const getColor = (index: number) => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];
    return colors[index % colors.length];
  };

  if (wordFrequency.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">暂无数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div 
        className="flex flex-wrap items-center justify-center gap-2 p-4"
        style={{ height: `${height}px`, overflow: 'hidden' }}
      >
        {wordFrequency.map((word, index) => (
          <span
            key={word.text}
            className="inline-block px-2 py-1 rounded cursor-default transition-transform hover:scale-110"
            style={{
              fontSize: `${getFontSize(word.value)}px`,
              color: getColor(index),
              fontWeight: word.value > maxValue * 0.7 ? 'bold' : 'normal'
            }}
            title={`${word.text}: ${word.value}次`}
          >
            {word.text}
          </span>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>共分析 {data.length} 个视频描述，提取 {wordFrequency.length} 个关键词</p>
      </div>
    </div>
  );
};

// 改进的中文分词函数
const advancedChineseSegmentation = (text: string): string[] => {
  // 移除特殊字符，保留中文、英文、数字
  const cleanText = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ');
  
  const words: string[] = [];
  
  // 1. 基于常见中文词汇模式的分词
  const patterns = [
    // 2-4字词汇
    /[\u4e00-\u9fa5]{2,4}/g,
    // 英文单词
    /[a-zA-Z]{2,}/g,
    // 数字组合
    /\d{2,}/g,
    // 中英文混合
    /[\u4e00-\u9fa5]+[a-zA-Z0-9]+|[a-zA-Z0-9]+[\u4e00-\u9fa5]+/g
  ];
  
  patterns.forEach(pattern => {
    const matches = cleanText.match(pattern);
    if (matches) {
      words.push(...matches);
    }
  });
  
  // 2. 滑动窗口法处理未匹配的字符
  const remaining = cleanText.replace(/[\u4e00-\u9fa5]{2,4}|[a-zA-Z]{2,}|\d{2,}|[\u4e00-\u9fa5]+[a-zA-Z0-9]+|[a-zA-Z0-9]+[\u4e00-\u9fa5]+/g, ' ');
  const chineseChars = remaining.match(/[\u4e00-\u9fa5]{2,}/g);
  if (chineseChars) {
    chineseChars.forEach(str => {
      // 2-3字滑动窗口
      for (let i = 0; i < str.length - 1; i++) {
        if (i + 2 <= str.length) {
          words.push(str.substring(i, i + 2));
        }
        if (i + 3 <= str.length) {
          words.push(str.substring(i, i + 3));
        }
      }
    });
  }
  
  return words;
};

// 扩展停用词列表
const stopWords = [
  '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '我们', '他', '来', '个', '那', '能', '对', '现在', '已经', '可以', '就是', '这个', '那个', '真的', '特别', '非常', '感觉', '觉得', '因为', '所以', '但是', '然后', '其实', '可能', '应该', '还是', '不是', '但是', '如果', '那么', '这样', '那样', '什么', '怎么', '为什么', '怎么样', '怎么办', '如何', '什么', '时候', '地方', '时候', '时候', '时候', '时候', '时候'
];

export default WordCloudAnalysis;