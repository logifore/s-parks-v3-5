# S-parks V2 Prototype

S-parks V2 是基于 Stitch 初版导出和 `用于codex的代码预览.docx` 需求文档整理出的第二版静态 Web 原型。

## V2 重点

- 恢复首页的电影感粒子背景、毛玻璃主标题框和浮动关键词层。
- 保留第一版的黑灰、深蓝、毛玻璃、克制专业图库风格。
- 将脚本拆分为可维护模块，避免所有逻辑堆在一个文件里。
- 增加第一版必须出现的功能页原型入口：素材详情、上传发布、登录注册、购买授权、积分会员、审核后台、搜索结果、收藏夹。
- 当前不接真实登录、支付、上传、API 或数据库，避免泄露密钥或误传敏感信息。

## 文件结构

- `index.html`: 静态应用外壳、CSP、导航、脚本加载。
- `assets/css/styles.css`: 设计系统、粒子层级、页面布局、响应式样式。
- `assets/js/content.js`: 页面内容、素材数据和功能流程配置。
- `assets/js/utils.js`: HTML 转义、图标、图片和通用页面壳工具。
- `assets/js/renderers.js`: 各页面渲染器。
- `assets/js/router.js`: Hash 路由和标题映射。
- `assets/js/particles.js`: WebGL 粒子背景和 Canvas fallback。
- `assets/js/app.js`: 初始化入口、导航、搜索、事件绑定。
- `LEGAL_NOTES.md`: 商用、素材和安全注意事项。

## 路由

- `#home`: 首页 / 发现
- `#assets`: 素材库
- `#community`: 创作者社区
- `#support`: 支持中心
- `#detail`: 素材详情页原型
- `#upload`: 上传发布页原型
- `#auth`: 登录注册页原型
- `#licensing`: 购买授权页原型
- `#membership`: 积分会员页原型
- `#admin`: 审核后台页原型
- `#search`: 搜索结果页原型
- `#collections`: 收藏夹 / 项目夹原型

## 本地预览

```bash
python3 -m http.server 8765
```

然后打开：

```text
http://127.0.0.1:8765/
```

## 安全说明

V2 仍是纯前端原型，不包含 API key、环境变量、后端接口或真实用户数据。正式商用前，登录、上传、支付、授权和审核必须迁移到服务端实现，并加入认证、鉴权、输入校验、限流、日志和风控。
