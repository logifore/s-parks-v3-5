# S-parks V3.5 Prototype

S-parks V3.5 是基于 V3 修复和整理后的静态原型版本，重点补齐移动端竖屏可用性、结构可维护性和前端侧安全约束说明，同时继续保持纯前端演示定位。

## V3.5 重点

- 保留首页的粒子背景、毛玻璃视觉和黑灰深蓝的专业图库风格。
- 修复移动端竖屏下首页信息区、菜单浮层、详情页购买区和多种卡片网格的可用性问题。
- 继续沿用 `content / utils / renderers / router / app / particles` 分层，并收紧交互状态与响应式策略。
- 补齐首页、素材库、创作者社区、支持中心以及详情、上传、授权、会员、审核、搜索、收藏等核心原型页面。
- 当前仍为纯前端原型，不接真实登录、支付、上传、API 或数据库，避免泄露密钥或误传敏感信息。

## 文件结构

- `index.html`: 静态应用外壳、CSP、导航、脚本加载。
- `assets/css/styles.css`: 设计系统、粒子层级、页面布局、移动端响应式样式。
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

## 部署地址

- GitHub: `https://github.com/logifore/s-parks-v3`
- Vercel: `https://s-parks-v3.vercel.app`

## 本地预览

```bash
python3 -m http.server 8765
```

然后打开：

```text
http://127.0.0.1:8765/
```

## 安全说明

V3.5 仍是纯前端原型，不包含 API key、环境变量、后端接口或真实用户数据。

本次已经落实的前端侧安全措施：
- 保持严格 CSP，不新增内联脚本或无必要的外部连接能力。
- 页面动态文本继续统一经过 HTML 转义，避免把内容直接注入 DOM。
- 粒子动画在窄屏和减少动态偏好场景下降级，降低移动端交互干扰与性能压力。
- 不把凭据、用户隐私、真实授权数据或持久化状态引入当前原型。

正式商用前必须迁移到服务端实现的安全能力：
- 登录认证、会话管理、权限控制、上传校验。
- 支付、授权记录、下载权限和审计日志。
- 接口限流、风控、防刷、内容审核和异常监控。
- 敏感配置管理、密钥轮换、数据脱敏与最小权限访问。
