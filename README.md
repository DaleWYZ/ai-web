# AI产品导航网站

这是一个展示和导航各类AI产品的网站，采用现代化的bento布局风格设计。

## 功能特点

- 展示各类AI产品信息（视频、语言、翻译、图片、编码等）
- 美观的bento风格卡片布局
- 实时搜索功能
- 响应式设计，支持各种设备
- 分类展示，便于浏览

## 技术栈

- Next.js 14
- React 18
- Tailwind CSS
- Heroicons

## 开始使用

1. 安装依赖：
```bash
npm install
```

2. 运行开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

4. 运行生产版本：
```bash
npm run start
```

## 项目结构

```
.
├── src/
│   ├── app/
│   │   ├── page.js          # 主页面组件
│   │   ├── layout.js        # 布局组件
│   │   └── globals.css      # 全局样式
│   └── ...
├── public/
│   └── data/
│       └── ai_products.json # AI产品数据
├── package.json
├── tailwind.config.js
└── README.md
```

## 数据更新

AI产品数据存储在 `public/data/ai_products.json` 文件中，可以通过运行爬虫程序更新数据：

```bash
python scraper/ai_products_scraper.py
```

## 贡献

欢迎提交 Pull Request 来添加新的AI产品或改进网站功能。

## 许可

MIT 