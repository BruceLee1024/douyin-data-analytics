# 抖音博主数据分析平台

一个功能强大的抖音博主数据分析工具，提供全面的数据可视化和深度分析功能。

## 🌟 主要功能

### 📊 核心分析模块
- **总体统计**：视频总数、总粉丝数、总点赞、收藏、评论、分享
- **互动率分析**：平均互动率计算和趋势展示
- **热门视频识别**：自动识别最受欢迎的视频内容

### 📈 数据可视化
- **月度趋势图**：展示每月发布量和互动数据变化
- **媒体类型分布**：分析不同内容类型的表现
- **词云分析**：提取高频关键词和热门话题
- **最佳发布时间**：基于数据推荐最佳发布时段

### 🎯 高级分析
- **粉丝互动分析**：评估粉丝活跃度和病毒传播潜力
- **内容表现分析**：按点赞量分层的视频表现对比
- **标签分析**：识别最有效的标签组合
- **病毒内容特征**：标题长度、emoji使用、@提及策略优化

### 📊 80/20原则分析
- **帕累托分析**：识别贡献80%互动的20%视频
- **桑基图可视化**：清晰展示视频分层与互动贡献关系
- **分层策略**：爆款(前10%)、优质(20%)、普通(70%)视频分析

### 📅 发布频率分析
- **月度发布统计**：每月发布量统计和趋势
- **周度发布统计**：每周发布量分析
- **平均发布频率**：计算月均/周均发布量

## 🚀 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **图表库**：ECharts + Chart.js
- **数据处理**：XLSX解析Excel文件
- **日期处理**：date-fns
- **部署**：GitHub Pages

## 🛠️ 本地开发

### 环境要求
- Node.js 18+
- npm或yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 🚀 部署到GitHub Pages

### 方法1：GitHub Actions自动部署（推荐）
1. **创建GitHub仓库**
   - 在GitHub上创建新仓库，命名为`douyin-data-analytics`

2. **推送代码到GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/douyin-data-analytics.git
   git branch -M main
   git push -u origin main
   ```

3. **启用GitHub Pages**
   - 进入仓库Settings → Pages
   - 选择Source为"GitHub Actions"

4. **自动部署**
   - 每次推送到main分支都会自动部署
   - 访问地址：https://yourusername.github.io/douyin-data-analytics/

### 方法2：手动部署
1. **构建项目**
   ```bash
   npm run build
   ```

2. **安装gh-pages**
   ```bash
   npm install -g gh-pages
   ```

3. **部署**
   ```bash
   npm run deploy
   ```

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── DataAnalytics.tsx      # 主数据分析组件
│   ├── ParetoAnalysis.tsx     # 80/20分析组件
│   ├── ViralContentAnalysis.tsx # 病毒内容分析
│   └── ...
├── utils/               # 工具函数
│   └── dataProcessor.ts       # 数据处理核心
├── types/               # TypeScript类型定义
└── ...
```

## 📊 使用说明

1. **上传数据**：点击上传区域选择Excel格式的抖音数据文件
2. **查看分析**：系统自动处理数据并展示各项分析结果
3. **深度分析**：探索不同维度的数据洞察
4. **导出分享**：截图或记录关键分析结果

## 🎯 数据格式要求

Excel文件应包含以下列：
- 视频标题
- 发布时间
- 点赞数
- 收藏数
- 评论数
- 分享数
- 粉丝数
- 视频类型等

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License - 详见LICENSE文件

## 🙋‍♂️ 联系方式

如有问题或建议，请通过GitHub Issues联系。