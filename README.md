# Preact 3D Cube

一个基于 Preact 的 3D 立方体可视化项目。

## 项目架构

### 技术栈

| 组件 | 名称 | 版本 | 描述 |
|------|------|------|------|
| 框架 | Preact | ^10.24.3 | 轻量级 React 替代方案 |
| 构建工具 | Vite | ^6.0.3 | 快速前端构建工具 |
| 语言 | TypeScript | 5.7.3 | 类型安全的 JavaScript |
| 动画库 | GSAP | ^3.12.5 | 高性能动画库 |

### 依赖版本

**生产依赖：**
- `gsap` - ^3.12.5
- `preact` - ^10.24.3

**开发依赖：**
- `@preact/preset-vite` - ^2.9.1
- `typescript` - 5.7.3
- `vite` - ^6.0.3

> **注意**: `components/ui/` 目录包含 shadcn/ui 组件文件，但项目未安装 tailwindcss 及相关依赖，这些组件可能未被使用或需要额外配置。

## 文件夹结构

```
├── components/           # UI 组件目录
│   ├── ui/              # shadcn/ui 组件库 (50+ components)
│   └── theme-provider.tsx
├── dist/                 # 构建输出目录
│   ├── assets/           # 编译后的资源文件
│   └── *.png/svg/html    # 静态资源文件
├── hooks/               # 自定义 Hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/                 # 工具函数
│   └── utils.ts
├── public/              # 静态资源（开发环境）
│   └── *.png/svg        # 图标和占位图片
├── src/                 # 源码目录
│   ├── components/
│   │   └── cube.tsx     # 3D 立方体组件
│   ├── app.tsx          # 应用入口组件
│   ├── index.css        # 全局样式
│   └── main.tsx         # 应用入口文件
├── .gitignore           # Git 忽略配置
├── index.html           # HTML 模板
├── package-lock.json    # npm 锁定文件
├── package.json         # 项目配置
├── pnpm-lock.yaml       # pnpm 锁定文件
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 配置
```

## 快速开始

### 安装依赖

```bash
npm install
# 或使用 pnpm
pnpm install
```

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 部署说明

### 部署路径

项目部署在 `/www/3-d` 目录下。

### Nginx 配置示例

创建或修改 Nginx 配置文件 `/etc/nginx/sites-available/3-d.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /www/3-d/dist;
    index index.html;

    # 单页应用路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|svg|jpg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/html text/css application/javascript image/svg+xml;
}
```

启用配置并重启 Nginx：

```bash
ln -s /etc/nginx/sites-available/3-d.conf /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### tmux 部署

**创建 tmux Session（用于构建和维护）：**

```bash
# 创建并进入 tmux session
tmux new-session -s 3d-cube -d

# 切换到部署目录
tmux send-keys -t 3d-cube 'cd /www/3-d' C-m

# 安装依赖并构建
tmux send-keys -t 3d-cube 'npm install && npm run build' C-m
```

**管理 tmux Session：**

```bash
# 查看所有 session
tmux list-sessions

# 连接到 session
tmux attach -t 3d-cube

# 退出 session（保留运行）
Ctrl + B, D

# 停止 session
tmux kill-session -t 3d-cube
```

**持续开发模式（如需）：**

```bash
# 在 tmux 中启动开发服务器
tmux send-keys -t 3d-cube 'npm run dev' C-m
```

### 生产环境部署流程

```bash
# 1. 进入部署目录
cd /www/3-d

# 2. 更新代码（如使用 Git）
git pull origin main

# 3. 安装依赖
npm install

# 4. 构建项目
npm run build

# 5. 重启 Nginx（如配置有变更）
systemctl reload nginx
```

## GitHub Pages 部署

### 启用 GitHub Actions

项目已配置 GitHub Actions CI/CD 工作流，每次推送到 `main` 分支时自动构建并部署到 GitHub Pages。

**配置步骤：**

1. 进入 GitHub 仓库设置页面
2. 点击左侧菜单的 **Pages** 选项
3. 在 **Source** 下拉菜单中选择 **GitHub Actions**
4. 点击 **Save** 保存配置

### 工作流文件

工作流配置位于 `.github/workflows/deploy.yml`，包含以下步骤：

- **Checkout**: 拉取最新代码
- **Set up Node.js**: 配置 Node.js 20 环境
- **Install dependencies**: 安装项目依赖
- **Build**: 构建生产版本
- **Deploy**: 部署到 GitHub Pages

### 访问地址

部署完成后，项目将在以下地址访问：

```
https://qipantanyi.github.io/3-d/
```

## 项目说明

- **3D 立方体组件**: `src/components/cube.tsx` 使用 GSAP 实现 3D 旋转动画
- **UI 组件**: `components/ui/` 目录包含 shadcn/ui 组件库文件（需额外配置 tailwindcss）
- **构建工具**: Vite 提供快速的开发体验和优化的生产构建
- **部署方式**: 推荐使用 Nginx 作为静态文件服务器，部署路径为 `/www/3-d`，或使用 GitHub Pages 进行 CI/CD 自动部署
