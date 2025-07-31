# 部署到GitHub Pages指南

## 快速部署步骤

### 1. 准备工作
- 确保你有GitHub账号
- 本地已安装Node.js 18+

### 2. 创建GitHub仓库
1. 访问 https://github.com/new
2. 仓库名称填写：`douyin-data-analytics`
3. 设置为Public
4. 不要初始化README（因为本地已有）

### 3. 配置项目
✅ 已自动配置为BruceLee1024的用户名：

**package.json**
```json
"homepage": "https://brucelee1024.github.io/douyin-data-analytics"
```

**vite.config.ts**
```ts
base: '/douyin-data-analytics/'
```

### 4. 推送到GitHub
```bash
# 添加远程仓库（已配置为BruceLee1024）
git remote add origin https://github.com/BruceLee1024/douyin-data-analytics.git

# 推送代码
git branch -M main
git push -u origin main
```

### 5. 启用GitHub Pages
1. 进入你的仓库页面
2. 点击 Settings → Pages
3. 在"Build and deployment"部分，选择"GitHub Actions"
4. 系统会自动开始部署

### 6. 访问你的应用
部署完成后，访问：
```
https://你的用户名.github.io/douyin-data-analytics
```

## 部署状态检查
- 在Actions标签页查看部署进度
- 绿色✅表示部署成功
- 红色❌表示需要检查错误

## 更新部署
每次推送到main分支都会自动重新部署：
```bash
git add .
git commit -m "更新功能描述"
git push origin main
```

## 故障排除

### 如果页面空白
1. 检查浏览器控制台是否有错误
2. 确认vite.config.ts中的base路径正确
3. 确认package.json中的homepage正确

### 如果部署失败
1. 检查Actions日志
2. 确保所有依赖正确安装
3. 本地运行`npm run build`确保构建成功

## 手动部署备用方案
如果GitHub Actions有问题，可以使用手动部署：

```bash
npm install -g gh-pages
npm run deploy
```

这会将dist文件夹直接部署到gh-pages分支。