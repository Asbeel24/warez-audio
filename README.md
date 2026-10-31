# 插件官网

浏览和购买插件的网站。Next.js 15（App Router），部署在 Vercel。

## 本地运行

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 上线前检查
```

## 要改内容，改这几个文件

| 文件 | 内容 |
|---|---|
| `lib/site.ts` | 品牌名、标语、作者、客服邮箱、社交链接 |
| `lib/products.ts` | 插件目录：名字、状态（免费 / 在售 / 开发中）、价格、图片、下载链接 |
| `lib/content.ts` | SPIKE MIX HUB 三个模式和旋钮说明、预设列表、UDG 试听音频 |
| `public/media/` | 图片、视频、试听音频 |

- 插件从“开发中”改成可以买：把 `status` 改成 `"on-sale"`，填上 `price`。
- UDG 安装包：把 `downloads.mac` / `downloads.win` 填成下载地址。留空时按钮会提示“正在上传”。

## 页面

| 路径 | 内容 |
|---|---|
| `/` | 首页：可以玩的 SPIKE MIX HUB 面板、插件列表、三个模式、UDG 试听、影片 |
| `/plugins` | 全部插件 |
| `/plugins/spike-mix-hub` | Pro 版（开发中）：面板、模式详解、预设、规格、上线提醒 |
| `/plugins/udg` | 免费版：试听对比、信号链、下载 |
| `/plugins/hardick` | 在售（资料待补，现在是占位页） |
| `/cart` → `/checkout` → `/checkout/success` | 购物车和结算流程 |
| `/support` | 安装、Mac 隔离、授权、退款等常见问题 |

## 购买流程和支付

1. 购物车存在浏览器里（`components/cart.tsx`），每个插件一份授权。
2. 结算页把邮箱、称呼、支付方式和插件列表发到 `POST /api/checkout`。
3. 服务端按 `lib/products.ts` 重新算价格（不信任浏览器传来的价格），生成订单号，然后调用 `lib/payments.ts` 里的 `createPayment()`。
4. `createPayment()` 返回 `paymentUrl` 时，浏览器直接跳到支付页；现在返回 `null`，所以停在“订单已创建（测试）”页面，不会扣款。

接支付时只需要：在 `createPayment()` 里调用支付平台创建收款，返回它的收款页地址；再加一个接收支付回调的接口（例如 `app/api/payment/webhook/route.ts`），确认付款后生成序列号并发邮件。订单目前没有保存，接支付时一起加数据库。

上线提醒表单发到 `POST /api/waitlist`，目前只记日志，之后接邮件列表或数据库。

## 部署到 Vercel

1. 在 vercel.com 用 GitHub 登录，New Project，选这个仓库。
2. 框架会自动识别为 Next.js，不用改设置，点 Deploy。
3. 之后每次推送到 main 都会自动重新部署，其他分支会生成预览链接。

国内访问：`*.vercel.app` 在国内经常打不开，正式上线需要买一个自己的域名，在 Vercel 项目的 Settings → Domains 里绑定。

## 设计说明

- 深色、干净，绿色只用在重点上，和插件界面的荧光绿一致。
- 字体全部自托管（Inter Tight、JetBrains Mono、插件屏幕用的 Pixeloid Sans），不依赖 Google Fonts，国内也能正常加载。
- 动效只有滚动淡入、插件屏幕动画和按钮过渡；系统开启“减少动态效果”时会关掉。
- 首页的 SPIKE MIX HUB 面板是用插件原始底图（`panel.webp`）加 SVG 和 Canvas 在网页里重画的，坐标取自插件源码，可以拖旋钮、切模式、点 BYPASS、换预设。

作者：D4nN9、Yibing He

## 本地预览（不需要服务器）

`npm run preview:build` 会生成 `preview/` 文件夹：整站的静态副本，结算和上线提醒在浏览器里模拟，不连服务器。
把文件夹拷到 Mac 上，双击 `打开预览.command`（第一次可能要右键 → 打开），浏览器会打开 http://localhost:4173 。
