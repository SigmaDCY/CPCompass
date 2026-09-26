# CP Compass

## 引言

在 OI 界，自动的代码管理软件已有很多，但要么是只支持 Codeforces，要么就是疯狂爬取 OJ 数据。众所周知，这样的行为在洛谷[会被封禁](https://www.luogu.com.cn/discuss/1337298)。

但这样的软件在考前复习时颇有价值，因此我做了这个项目：CP Compass。

信竞有“空间换时间”，而 CP Compass 就是“便利换安全”。它无法一键同步所有提交，而是需要你一个一个打开提交记录，然后 CP Compass 会自动从网页 HTML 中获取代码。不可否认，这很麻烦，但这完全不会对 OJ 服务器造成任何额外的负担。

针对上面的帖子，我进行了“超级高难度”自查：

- **有没有安装看起来很智能，实际上只会疯狂发送请求的弱智插件**：本插件不会主动发起请求，而是被动等待用户打开提交记录获取代码。
- **你所使用的插件，代码质量是不是甚至还不如豆包**：这是我手写的。
- **有没有在不知名网站上使用所谓的“查分神器”“效率工具”“对战平台”或其他“神秘功能”**：GitHub 不是不知名网站。
- **有没有把账号、Cookie 等敏感信息慷慨地赠送给陌生第三方**：本插件只需 OJ 用户名（用于防止打开他人提交记录时也获取代码），无需账号密码与 Cookie。
- **有没有制造大量异常访问，同时坚信服务器理应无条件包容你的所有操作**：如果用户的手速比机器还快，那确实很异常了。

综上，本插件应该是十分安全的。

## 简介

去中心化的 OJ 代码收集助手。通过浏览器插件端侧拦截 + Cloudflare Serverless 后端的架构，帮助 OIer 们自动管理自己在各大 OJ（目前仅支持 Codeforces 和洛谷）上的评测代码，完美规避了传统服务端爬虫导致的 IP 封禁和账号风控问题。

## 核心特性

- **去中心化架构**：流量完全分散在用户真实的浏览器中，对 OJ 平台而言就是正常的用户浏览行为（本质上也确实是），零风控风险。
- **隐私优先**：插件仅在评测详情页激活，且**只会收集用户自己的提交**（通过配置的用户名进行校验），绝不触碰他人的代码或用户的 Cookie。
- **零成本部署**：后端完全基于 Cloudflare Workers 和 D1 数据库的免费套餐，无需购买服务器。
- **去重机制**：数据库层面对 `submissionId` 添加了 `UNIQUE` 约束，配合 `INSERT OR IGNORE`，防止网络波动导致的重复录入。
- **安全鉴权**：基于 Token 的请求头校验，保护你的后端接口不被恶意刷入垃圾数据。

## 架构图解

```text
[浏览器插件] 
   ├── content.js: 从网页 html 里提取代码并校验用户名
   └── background.js: 接收数据，携带 Token 发送 HTTP POST 请求
           │
           ▼
[Cloudflare Worker] 校验 Token
           │
           ▼
[Cloudflare D1 数据库] 存储提交记录 (去重)
```

## 部署指南

本项目分为服务端和客户端（插件）两部分，需分别部署。

### 1. 部署服务端

前置准备：安装 [Node.js](https://nodejs.org/) 和 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)，并注册 [Cloudflare 账号](https://dash.cloudflare.com/)（注册后右上角头像 > language 可以切换语言）。

1. 克隆本仓库，进入 `server` 目录：

    ```bash
    git clone https://github.com/SigmaDCY/CPCompass.git
    cd CPCompass/server
    ```

2. 运行自动化部署脚本：

    ```bash
    npm install
    npm run setup
    ```

    脚本会引导你创建云端 D1 数据库，并生成 `wrangler.toml` 配置文件。

3. 部署 Worker 到云端：

    ```bash
    npx wrangler deploy
    ```

    部署完成后，终端会输出你的云端服务地址，形如 `https://cp-compass-server.xxx.workers.dev`。请记下这个地址。

4. 初始化云端数据库表结构：

    ```bash
    npx wrangler d1 execute cp-compass-db --remote --file=schema.sql
    ```

5. 配置安全密钥：
    打开 [Cloudflare 仪表盘](https://dash.cloudflare.com/)，找到“计算”中的“Workers 和 Pages”，点击 `cp-compass-server`，在上方选择“设置”，找到“变量和机密”，点击“+”号。类型选“机密”，名称填 `API_TOKEN`，值设置一个你自己的密码。（后期若要修改密码，直接在这里修改即可）。

### 2. 配置客户端 (浏览器插件)

1. 打开 Chrome / Edge 浏览器，进入扩展程序管理页 (`chrome://extensions/`)。
2. 开启右上角的**开发者模式**。
3. 点击**加载已解压的扩展程序**，选择本项目根目录下的 `extension` 文件夹。
4. 点击浏览器右上角的插件图标，在弹出的设置页面中填写：
    - **服务端 URL**：刚才部署 Worker 得到的网址（例如 `https://cp-compass-server.xxx.workers.dev`，**注意：开头要有 `http(s)://`，末尾不要加 `/`**）。
    - **API Token**：你在 Cloudflare 仪表盘中设置的密码。
    - **Codeforces 用户名**：你的 CF 用户名（用于过滤，只收集自己的代码）。
    - **洛谷用户名**：你的洛谷用户名（用于过滤，只收集自己的代码）。

配置完成后，随便打开一个你自己的 Codeforces 或洛谷评测记录页面，代码就会静默同步到你的云端数据库啦！

### 3. 绑定域名以提高访问速度（可选）

虽是可选，但对于无法稳定访问 `workers.dev` 域号的用户来说几乎是必选。

1. 在 [DNSHE](https://my.dnshe.com/) (或任何一个域名注册服务) 中注册一个新域名。
2. 在 [Cloudflare 仪表盘](https://dash.cloudflare.com/) 中选择“网站 > 添加网站 > 连接域名”，输入注册的域名，继续，选择 Free 计划。确认后，记下 Cloudflare 提供的两个名称服务器。
3. 在域名注册服务中找到域名的“DNS 服务器”选项，分别修改为刚才记下的 Cloudflare 名称服务器。
4. 在 Cloudflare 仪表盘中点击“完成，检查名称服务器”。至此你的域名已由 Cloudflare 托管。
5. 回到 `cp-compass-server` 的设置页，点击“触发事件 > 自定义域名 > 添加自定义域名”，选择刚刚托管的域名，填入你想要的子域名（如 `api` 或直接留空），点击添加。
6. 在浏览器插件 Popup 中把“服务端 URL”改为自定义的域名（如 `https://api.yourdomain.com`）。
7. 记得每一年续期域名。

## 查看收集的代码

你可以通过 Cloudflare 仪表盘进入你的 D1 数据库（存储和数据库 > D1 SQL 数据库 > `cp-compass-db`），点击右上角的“探索数据”，在左侧选择 `submissions` 表，即可查看收集到的代码。

## 隐私与安全声明

- 本插件**不收集任何敏感信息**（不读取 Cookie、不获取密码）。
- 插件仅在特定的评测详情页（包含 `/submission/` 或 `/record/` 的 URL）激活。
- 提取的代码数据**仅发送至用户自己配置的后端地址**，不经过任何第三方服务器。

## 开源协议

本项目采用 [BSD-3-Clause License](LICENSE) 开源协议。