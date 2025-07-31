import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onDataUpload: (data: any[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('请上传Excel文件 (.xlsx 或 .xls)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (data.length < 2) {
        throw new Error('Excel文件数据不足');
      }

      onDataUpload(data as any[]);
    } catch (err) {
      setError('文件解析失败，请检查Excel格式');
      console.error('File parsing error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onDataUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
        } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          ) : (
            <FileSpreadsheet className="h-12 w-12 text-blue-500" />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isLoading ? '正在解析文件...' : '上传抖音数据Excel文件'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              拖拽文件到此处或点击选择文件
            </p>
          </div>

          <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            选择文件
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
              disabled={isLoading}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Excel格式要求：</h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>第一行为表头，数据从第二行开始</p>
          <p>列顺序：达人UID | 抖音号 | 达人昵称 | 达人链接 | 粉丝数 | 达人简介 | 视频ID | 视频链接 | 媒体类型 | 视频描述 | 点赞数 | 收藏数 | 评论数 | 分享数 | 发布时间</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;