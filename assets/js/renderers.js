"use strict";

window.SparksRenderers = ((utils) => {
  const { escapeHtml, icon, image, pageShell, stat } = utils;
  const content = window.SPARKS_CONTENT;
  const hrefFor = (route, value) => window.SparksRouter.hrefFor(route, value);
  const DEFAULT_ASSET = content.assets.items[0];
  const DEFAULT_CREATOR_ID = content.community.people[0];
  const DEFAULT_PROJECT_ID = "short-drama-a";

  const sceneVariants = {
    day: {
      label: "日景",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD50KCrw5wVryhxpMfaEmggeX1cBZMU1s4VdF3pI0A_dOPNgoxKioXnbicvkC6UBrZjxYK0oeq91HB8HHcJWYRE5JX42wXpEzTVGYvjemArJ5kmbP3vp7LsDrTV6ktJC4M808uvOO7Esv5oSsWPFnApB8kF2uvMRizXsHn9nAtgS1A1oI9hUBmSu879hX12I-1pXgwg9pT3_kwNxxvKm3o--GzuMKek95P8-VXlktSglX1znYPlJehDqi8cs-V41eHbyUehNo5fwCc4",
      note: "高可读日景，适合建立空间结构和角色走位。"
    },
    dusk: {
      label: "黄昏",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7903EgQexH-toZ4gGQjOCuBJNX4p301odfJoiKFhAHnMV-m8GNiGcqhBxKWhTyqH3GmKfehnEY_aezQPLiVzeiN-rr6i2XsqkKXpAbhOg6Vwq0A_6OdxfU5lh5nXFu0q_Xbdngbp_DQJxGAKNDwh9kB85FvpE05rKhlOQz1Ahlk4s6Qf4ECPgxkCtun-WC7D7WM5l421sZKYImigRdPBI6CON1c-fZgc4FTgTvLg6qhUri2hPmkVTaJ9Qk0Ir8RdBcnx8ta9T6fah",
      note: "暖色叙事氛围，适合情绪段落和过场镜头。"
    },
    night: {
      label: "夜景",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdH6WyohXnESBdFJDLR6riqwabx1rze5pixbieeJ_Bf23L_wQJ7l8dS5IO-J_p9ZV27-fHokgkr5AYMv8HXTAzmHNeVpJpeBwVQ8beVxzrtTQwE7PDJy7PAFH-HOGicr9gd0Fg8LnQCNgdAJ98LSHaEvJ3sVKZ8h_sAsMAi1yJr_j86MVBahKXce_kFxxhLTbdu15iVb1LhNTbmm6uFisLrJdVeFpr7-0Xc1IQU7cM5qXBbPJv6oCZSs7jbotmvDyyba4JELTIs_FG",
      note: "强反差夜景，适合悬疑、动作和霓虹风格。"
    }
  };

  const reviewItems = [
    { id: "SP-2048", title: "武士三视图", owner: "LogiFore", risk: "版权声明完整", status: "待审核" },
    { id: "SP-2049", title: "日落河边场景组", owner: "LogiFore", risk: "需补充模型来源", status: "复核" },
    { id: "SP-2050", title: "汉人服装造型", owner: "Aria Jin", risk: "标签不足", status: "待补充" }
  ];

  function getAssetById(assetId) {
    return content.assets.items.find((item) => item.id === assetId) || DEFAULT_ASSET;
  }

  function getCreatorById(creatorId) {
    return content.creators[creatorId] || content.creators[DEFAULT_CREATOR_ID];
  }

  function getProjectById(projects, projectId) {
    return projects[projectId] || projects[DEFAULT_PROJECT_ID];
  }

  function isAssetCollected(state, assetId) {
    return Object.values(state.projects || {}).some((project) => project.assets.some((entry) => entry.assetId === assetId));
  }

  function assetCard(asset, options = {}) {
    const wide = options.wide ? " wide" : "";
    return `
      <a class="image-card asset-card${wide}" href="${escapeHtml(hrefFor("detail", asset.id))}" data-action="open-detail" data-asset="${escapeHtml(asset.id)}">
        ${image(asset.image, asset.name, "card-image")}
        <div class="asset-meta glass-panel">
          <div>
            <span>${escapeHtml(asset.category)}</span>
            <h3>${escapeHtml(asset.name)}</h3>
            <p>${escapeHtml(asset.meta)} · ${escapeHtml(asset.price)}</p>
          </div>
          ${icon("open_in_new")}
        </div>
      </a>
    `;
  }

  function creatorCard(creator, compact = false) {
    return `
      <article class="glass-panel community-card profile-card ${compact ? "compact-profile" : ""}">
        ${image(creator.image, creator.name, "avatar large-avatar")}
        <div>
          <span>${escapeHtml(creator.role)}</span>
          <h2>${escapeHtml(creator.name)}</h2>
          <p>${escapeHtml(creator.status)}</p>
        </div>
        <div class="stats-row">
          ${stat("上传", creator.stats.uploads)}
          ${stat("收益", creator.stats.revenue)}
        </div>
        <a class="button button-ghost compact" href="${escapeHtml(hrefFor("creator", creator.id || creator.name.toLowerCase().replaceAll(" ", "-")))}" data-action="open-creator" data-creator="${escapeHtml(creator.id || creator.name.toLowerCase().replaceAll(" ", "-"))}">查看主页</a>
      </article>
    `;
  }

  function renderHome(appContent) {
    const { home, secondaryNav } = appContent;
    const keywords = home.eyebrow.split(" ").map((word) => `<span>${escapeHtml(word)}</span>`).join("");
    const actions = home.actions.map((action) => `
      <a class="button ${action.style === "primary" ? "button-primary" : "button-ghost"}" href="#${escapeHtml(action.route)}">
        ${escapeHtml(action.label)}${action.icon ? icon(action.icon) : ""}
      </a>
    `).join("");

    return `
      <section class="home-hero">
        <div class="keyword-field" aria-hidden="true">${keywords}</div>
        <div class="hero-copy glass-hero">
          <span class="eyebrow">AIGC CREATOR COMMUNITY</span>
          <h1>${escapeHtml(home.title)} <em>${escapeHtml(home.accent)}</em></h1>
          <p>${escapeHtml(home.intro)}</p>
          <div class="hero-actions">${actions}</div>
        </div>
        <a class="scroll-cue" href="#assets">探索更多</a>
      </section>

      <section class="section-band value-band">
        ${home.valueCards.map((item) => `
          <article class="glass-panel value-card">
            <h2>${escapeHtml(item.title)}</h2>
            <p>${escapeHtml(item.text)}</p>
          </article>
        `).join("")}
      </section>

      <section class="section-band feature-band">
        <div class="section-title">
          <span class="eyebrow">第一版功能地图</span>
          <h2>先把闭环摆出来，再逐层加深</h2>
          <p>v3 开始把入口页升级成真正的独立产品页，而不只是单点功能占位。</p>
        </div>
        <div class="feature-grid">
          ${secondaryNav.map((item) => `
            <a class="glass-panel feature-card" href="#${escapeHtml(item.route)}">
              ${icon(item.icon)}
              <strong>${escapeHtml(item.label)}</strong>
              <span>进入原型</span>
            </a>
          `).join("")}
        </div>
      </section>

      <section class="section-band">
        <div class="section-title">
          <span class="eyebrow">推荐</span>
          <h2>创作者推荐</h2>
          <a href="#community">查看全部 ${icon("arrow_right_alt")}</a>
        </div>
        <div class="creator-feature-grid">
          ${home.creators.map((creatorRef) => `
            <a class="image-card creator-card" href="${escapeHtml(hrefFor("creator", creatorRef.id))}" data-action="open-creator" data-creator="${escapeHtml(creatorRef.id)}">
              ${image(creatorRef.image, creatorRef.name, "card-image")}
              <div class="card-overlay">
                <span>${escapeHtml(creatorRef.role)}</span>
                <h3>${escapeHtml(creatorRef.name)}</h3>
                <p>${escapeHtml(creatorRef.bio)}</p>
              </div>
            </a>
          `).join("")}
        </div>
      </section>

      <section class="section-band low-band">
        <div class="section-title">
          <span class="eyebrow">社区</span>
          <h2>热门素材</h2>
        </div>
        <div class="bento-grid">
          ${home.trending.map((item, index) => `
            <a class="image-card trend-card trend-${index + 1}" href="${escapeHtml(hrefFor("detail", item.id))}" data-action="open-detail" data-asset="${escapeHtml(item.id)}">
              ${image(item.image, item.name, "card-image")}
              <div class="card-overlay">
                <h3>${escapeHtml(item.name)}</h3>
                <p>${escapeHtml(item.meta)}</p>
              </div>
            </a>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderAssetBrowser(appContent, state, includeShell) {
    const { assets } = appContent;
    const selected = state.selectedCategory || "全部";
    const query = state.query.trim().toLowerCase();
    const matches = assets.items.filter((asset) => {
      const target = `${asset.name} ${asset.meta} ${asset.category} ${asset.creator}`.toLowerCase();
      const categoryMatch = selected === "全部" || asset.category === selected;
      return categoryMatch && (!query || target.includes(query));
    });

    const filters = ["全部", ...assets.filters];
    const body = `
      <div class="control-bar" role="region" aria-label="素材筛选">
        <div class="segmented-control" aria-label="素材分类">
          ${filters.map((filter) => `<button class="${filter === selected ? "active" : ""}" type="button" data-action="filter-category" data-category="${escapeHtml(filter)}">${escapeHtml(filter)}</button>`).join("")}
        </div>
        <a class="button button-primary compact" href="#search">${icon("tune")} 高级筛选</a>
      </div>
      <div class="chips" aria-label="筛选维度">
        ${assets.facets.map((filter) => `<span>${escapeHtml(filter)}</span>`).join("")}
      </div>
      <div class="result-line">找到 <strong>${matches.length}</strong> 个素材${query ? ` · 关键词：${escapeHtml(state.query)}` : ""}</div>
      <div class="asset-grid">
        ${matches.map((asset, index) => assetCard(asset, { wide: index === 0 })).join("") || `<article class="empty-state glass-panel"><h2>没有匹配素材</h2><p>换一个关键词或分类试试。</p></article>`}
      </div>
      <section class="scene-strip">
        <div class="section-title">
          <span class="eyebrow">场景素材</span>
          <h2>时间切换会成为场景页的核心交互</h2>
          <p>你提出的日 / 夜 / 黄昏一键切换，已经在素材详情页做成可操作原型。</p>
        </div>
        <div class="scene-grid">
          ${assets.scenes.map((scene) => `<article class="glass-panel scene-card"><h3>${escapeHtml(scene.name)}</h3><p>${escapeHtml(scene.meta)}</p></article>`).join("")}
        </div>
      </section>
    `;

    if (!includeShell) return body;
    return pageShell("Assets", assets.title, assets.subtitle, body, "assets-page");
  }

  function renderAssets(appContent, state) {
    return renderAssetBrowser(appContent, state, true);
  }

  function renderCommunity(appContent) {
    const { community, creators } = appContent;
    const body = `
      <div class="community-grid">
        ${community.people.map((id) => {
          const person = creators[id];
          return `
            <article class="glass-panel community-card profile-card">
              ${image(person.image, person.name, "avatar large-avatar")}
              <div>
                <span>${escapeHtml(person.role)}</span>
                <h2>${escapeHtml(person.name)}</h2>
                <p>${escapeHtml(person.status)}</p>
              </div>
              <div class="stats-row">
                ${stat("上传", person.stats.uploads)}
                ${stat("收益", person.stats.revenue)}
              </div>
              <a class="button button-ghost compact" href="${escapeHtml(hrefFor("creator", id))}" data-action="open-creator" data-creator="${escapeHtml(id)}">查看主页</a>
            </article>
          `;
        }).join("")}
      </div>
    `;
    return pageShell("Community", community.title, community.subtitle, body, "community-page");
  }

  function renderSupport(appContent) {
    const { support } = appContent;
    const body = `
      <form class="support-search" role="search">
        ${icon("search")}
        <input type="search" placeholder="搜索问题..." aria-label="搜索问题">
        <button class="button button-primary compact" type="submit">搜索</button>
      </form>
      <div class="support-grid">
        ${support.categories.map((category) => `
          <a class="glass-panel support-card" href="#support">
            <span class="support-icon">${icon(category.icon)}</span>
            <h2>${escapeHtml(category.title)}</h2>
            <p>${escapeHtml(category.text)}</p>
            <strong>查看详情 ${icon("arrow_forward")}</strong>
          </a>
        `).join("")}
      </div>
      <section class="faq-section">
        <div class="section-title">
          <span class="eyebrow">FAQ</span>
          <h2>热门问题</h2>
        </div>
        <div class="faq-list">
          ${support.faq.map((item, index) => `
            <details class="glass-panel faq-item" ${index === 0 ? "open" : ""}>
              <summary>${escapeHtml(item.question)} ${icon("expand_more")}</summary>
              <p>${escapeHtml(item.answer)}</p>
            </details>
          `).join("")}
        </div>
      </section>
    `;
    return pageShell("Support", support.title, support.subtitle, body, "support-page");
  }

  function renderDetail(appContent, state) {
    const assetId = state.detailAssetId || DEFAULT_ASSET.id;
    const asset = getAssetById(assetId);
    const detail = appContent.details[asset.id];
    const creator = getCreatorById(detail.creatorId);
    const currentTime = state.sceneTime || "day";
    const variant = sceneVariants[currentTime] || sceneVariants.day;
    const previewLabel = asset.id === "river-dusk-suite" ? variant.label : "主视图";
    const collected = isAssetCollected(state, asset.id);
    const body = `
      <div class="detail-layout">
        <article class="image-card detail-preview">
          ${image(asset.id === "river-dusk-suite" ? variant.image : asset.image, `${detail.title} ${previewLabel}`, "card-image")}
          <div class="card-overlay"><h2>${escapeHtml(detail.price)}</h2><p>${escapeHtml(asset.id === "river-dusk-suite" ? variant.note : detail.subtitle)}</p></div>
        </article>
        <aside class="glass-panel detail-panel">
          <div class="chips">${detail.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          ${asset.id === "river-dusk-suite" ? `
            <div class="time-switch" aria-label="场景时间切换">
              ${Object.entries(sceneVariants).map(([key, item]) => `<button class="${key === currentTime ? "active" : ""}" type="button" data-action="set-scene-time" data-time="${key}">${escapeHtml(item.label)}</button>`).join("")}
            </div>
          ` : ""}
          <div class="inline-profile glass-panel">
            ${image(creator.image, creator.name, "avatar")}
            <div>
              <span>${escapeHtml(creator.role)}</span>
              <h3>${escapeHtml(creator.name)}</h3>
            </div>
            <a class="button button-ghost compact" href="${escapeHtml(hrefFor("creator", detail.creatorId))}" data-action="open-creator" data-creator="${escapeHtml(detail.creatorId)}">查看主页</a>
          </div>
          <h2>Prompt</h2>
          <p class="prompt-box">${escapeHtml(detail.prompt)}</p>
          <div class="detail-stats">
            ${detail.stats.map((item) => `<article class="glass-panel metric-panel compact-metric"><span class="eyebrow">${escapeHtml(item.label)}</span><h3>${escapeHtml(item.value)}</h3></article>`).join("")}
          </div>
          <div class="glass-panel info-block compact-info">
            <span class="eyebrow">使用建议</span>
            <div class="info-list">${detail.notes.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>
          </div>
          <div class="hero-actions left-actions">
            <a class="button button-primary" href="${escapeHtml(hrefFor("licensing", asset.id))}">购买授权</a>
            <button class="button button-ghost" type="button" data-action="collect-asset">${collected ? "已收藏" : "收藏到项目夹"}</button>
          </div>
        </aside>
      </div>
      <div class="panel-grid">
        ${detail.panels.map((panel) => `<article class="glass-panel scene-card"><h3>${escapeHtml(panel)}</h3><p>未来这里接入多图组预览、下载权限和版权记录。</p></article>`).join("")}
      </div>
      <section class="scene-strip">
        <div class="section-title">
          <span class="eyebrow">相似素材</span>
          <h2>继续完善当前镜头组</h2>
        </div>
        <div class="asset-grid">
          ${detail.similar.map((id, index) => assetCard(getAssetById(id), { wide: index === 0 })).join("")}
        </div>
      </section>
    `;
    return pageShell("素材详情", detail.title, detail.subtitle, body, "detail-page");
  }

  function renderCreator(appContent, state) {
    const creatorId = state.activeCreatorId || DEFAULT_CREATOR_ID;
    const creator = getCreatorById(creatorId);
    const body = `
      <section class="creator-hero image-card">
        ${image(creator.cover, creator.name, "card-image")}
        <div class="creator-hero-overlay">
          ${image(creator.image, creator.name, "avatar hero-avatar")}
          <div class="creator-hero-copy">
            <span class="eyebrow">${escapeHtml(creator.role)}</span>
            <h2>${escapeHtml(creator.name)}</h2>
            <p>${escapeHtml(creator.bio)}</p>
          </div>
          <div class="hero-actions left-actions">
            <a class="button button-primary" href="#upload">进入上传发布</a>
            <a class="button button-ghost" href="#collections">查看项目夹</a>
          </div>
        </div>
      </section>
      <div class="creator-dashboard">
        <article class="glass-panel metric-panel">
          <span class="eyebrow">签约状态</span>
          <h3>${escapeHtml(creator.status)}</h3>
          <p>适合展示创作者身份、审核进度与合作可信度。</p>
        </article>
        ${Object.entries(creator.stats).map(([label, value]) => `<article class="glass-panel metric-panel"><span class="eyebrow">${escapeHtml(label)}</span><h3>${escapeHtml(value)}</h3><p>持续沉淀作品与收益表现。</p></article>`).join("")}
      </div>
      <div class="dual-grid">
        <article class="glass-panel info-block">
          <span class="eyebrow">已上传素材包</span>
          <div class="info-list">${creator.packs.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>
        </article>
        <article class="glass-panel info-block">
          <span class="eyebrow">共同创作好友</span>
          <div class="info-list">${creator.friends.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>
        </article>
      </div>
      <div class="dual-grid">
        <article class="glass-panel info-block">
          <span class="eyebrow">重点方向</span>
          <div class="chips">${creator.focus.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        </article>
        <article class="glass-panel info-block">
          <span class="eyebrow">收益概览</span>
          <p>当前更像创作者工作台首页，后续可继续扩展月度图表、授权走势和项目分账模块。</p>
        </article>
      </div>
      <div class="dual-grid">
        <article class="glass-panel info-block">
          <span class="eyebrow">近期里程碑</span>
          <div class="info-list">${creator.milestones.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>
        </article>
        <article class="glass-panel info-block">
          <span class="eyebrow">当前工作区</span>
          <div class="info-list">${creator.workspace.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>
        </article>
      </div>
      <section class="scene-strip">
        <div class="section-title">
          <span class="eyebrow">作品</span>
          <h2>${escapeHtml(creator.name)} 的精选素材</h2>
        </div>
        <div class="asset-grid">
          ${creator.assets.map((id, index) => assetCard(getAssetById(id), { wide: index === 0 })).join("")}
        </div>
      </section>
    `;
    return pageShell("创作者主页", "创作者主页", "把社区列表进一步升级为真正可承载上传、收益和作品资产的创作者页面。", body, "creator-page");
  }

  function renderUpload(appContent, state) {
    const upload = appContent.flows.upload;
    const index = state.uploadStep || 0;
    const current = upload.steps[index];
    const body = `
      <div class="upload-shell">
        <aside class="glass-panel upload-sidebar">
          ${upload.steps.map((step, stepIndex) => `
            <button class="upload-step ${stepIndex === index ? "active" : ""}" type="button" data-action="go-upload-step" data-step="${stepIndex}">
              <span>${String(stepIndex + 1).padStart(2, "0")}</span>
              <strong>${escapeHtml(step.label)}</strong>
            </button>
          `).join("")}
        </aside>
        <section class="glass-panel upload-stage">
          <span class="eyebrow">当前步骤</span>
          <h2>${escapeHtml(current.label)}</h2>
          <p>当前状态：${escapeHtml(state.uploadStatus || "草稿未提交")}。这一页保留了专业工具式流程感，但不会上传任何文件。</p>
          <div class="form-grid upload-form-grid">
            ${current.fields.map((field) => `<label class="glass-panel form-field"><span>${escapeHtml(field)}</span><input type="text" placeholder="原型占位，不会提交真实数据"></label>`).join("")}
          </div>
          <div class="upload-preview-grid">
            ${upload.sidecards.map((card) => `<article class="glass-panel upload-sidecard"><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.text)}</p></article>`).join("")}
          </div>
          <div class="workflow-actions">
            <button class="button button-ghost" type="button" data-action="prev-upload-step">上一步</button>
            <button class="button button-primary" type="button" data-action="${index === upload.steps.length - 1 ? "submit-upload" : "next-upload-step"}">${index === upload.steps.length - 1 ? "提交审核" : "下一步"}</button>
          </div>
        </section>
      </div>
      <div class="notice-panel glass-panel"><strong>安全说明</strong><p>当前没有后端接口，也不会上传文件或发送任何个人信息。正式开发时需要服务端校验、鉴权、限流和审核日志。</p></div>
    `;
    return pageShell("上传发布", upload.title, upload.subtitle, body, "upload-page");
  }

  function renderAuth(appContent, state) {
    const auth = appContent.flows.auth;
    const signedIn = state.signedIn;
    const body = `
      <div class="auth-grid">
        <article class="glass-panel auth-card"><h2>${signedIn ? "已进入原型账户" : "登录"}</h2><input placeholder="邮箱"><input placeholder="密码" type="password"><button class="button button-primary" type="button" data-action="mock-login">${signedIn ? "已登录" : "进入原型"}</button></article>
        <article class="glass-panel auth-card"><h2>注册路径</h2>${auth.steps.map((step) => `<p>${icon("check_circle")} ${escapeHtml(step)}</p>`).join("")}</article>
      </div>
    `;
    return pageShell("登录注册", auth.title, auth.subtitle, body, "auth-page");
  }

  function renderLicensing(appContent, state) {
    const flow = appContent.flows.licensing;
    const currentAssetId = state.detailAssetId || DEFAULT_ASSET.id;
    const currentAsset = appContent.details[currentAssetId];
    const purchased = state.downloadRecords.some((record) => record.assetId === currentAssetId);
    const body = `
      ${timeline(flow.steps, purchased ? 4 : 2)}
      <div class="license-stage">
        <div class="license-card glass-panel">
          <span>当前素材</span>
          <h2>${escapeHtml(currentAsset.title)}</h2>
          <p>${escapeHtml(currentAsset.price)} · 购买后自动写入下载中心。</p>
        </div>
        <div class="license-card glass-panel">
          <span>账户积分</span>
          <h2>${escapeHtml(state.pointsBalance.toLocaleString("zh-CN"))} 积分</h2>
          <p>${purchased ? "已生成授权记录，可进入下载阶段。" : "确认购买后将自动生成模拟授权记录。"}</p>
          <div class="hero-actions left-actions">
            <button class="button button-primary" type="button" data-action="buy-license">${purchased ? "已购买" : "确认购买授权"}</button>
            ${purchased ? `<a class="button button-ghost" href="#downloads">前往下载中心</a>` : ""}
          </div>
        </div>
      </div>
    `;
    return pageShell("购买授权", flow.title, flow.subtitle, body, "licensing-page");
  }

  function renderDownloads(appContent, state) {
    const downloadSummary = state.downloadSummary || appContent.downloads.summary;
    const downloadRecords = state.downloadRecords || appContent.downloads.records;
    const downloadActivity = state.downloadActivity || appContent.downloads.activity;
    const downloadQueue = state.downloadQueue || appContent.downloads.queue;
    const body = `
      <div class="creator-dashboard">
        ${downloadSummary.map((item) => `
          <article class="glass-panel metric-panel">
            <span class="eyebrow">${escapeHtml(item.label)}</span>
            <h3>${escapeHtml(item.value)}</h3>
            <p>围绕授权与下载形成更清楚的账户状态反馈。</p>
          </article>
        `).join("")}
      </div>
      <div class="downloads-grid">
        <article class="glass-panel downloads-panel">
          <span class="eyebrow">授权记录</span>
          ${downloadRecords.map((record) => {
            const asset = getAssetById(record.assetId);
            return `
              <div class="record-row">
                <div>
                  <strong>${escapeHtml(record.id)}</strong>
                  <h3>${escapeHtml(asset.name)}</h3>
                  <p>${escapeHtml(record.scope)} · ${escapeHtml(record.updated)}</p>
                </div>
                <div class="record-side">
                  <span>${escapeHtml(record.status)}</span>
                  <em>${escapeHtml(record.points)}</em>
                </div>
              </div>
            `;
          }).join("")}
        </article>
        <article class="glass-panel downloads-panel">
          <span class="eyebrow">最近活动</span>
          <div class="info-list">${downloadActivity.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>
          <div class="download-queue">
            ${downloadQueue.map((item) => `<article class="glass-panel queue-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join("")}
          </div>
        </article>
      </div>
      <section class="scene-strip">
        <div class="section-title">
          <span class="eyebrow">最近下载</span>
          <h2>把已购素材重新组织成可继续工作的资产区</h2>
        </div>
        <div class="asset-grid">
          ${downloadRecords.map((record, index) => assetCard(getAssetById(record.assetId), { wide: index === 0 })).join("")}
        </div>
      </section>
    `;
    return pageShell("下载中心", appContent.downloads.title, appContent.downloads.subtitle, body, "downloads-page");
  }

  function renderMembership(appContent, state) {
    const flow = appContent.flows.membership;
    const selected = state.selectedPlan || "Trial";
    const body = `<div class="pricing-grid">${flow.tiers.map((tier) => `<article class="glass-panel price-card ${selected === tier.name ? "selected" : ""}"><span>${escapeHtml(tier.name)}</span><h2>${escapeHtml(tier.points)}</h2><p>${escapeHtml(tier.note)}</p><button class="button ${selected === tier.name ? "button-primary" : "button-ghost"} compact" type="button" data-action="select-plan" data-plan="${escapeHtml(tier.name)}">${selected === tier.name ? "当前方案" : "选择方案"}</button></article>`).join("")}</div>`;
    return pageShell("积分会员", flow.title, flow.subtitle, body, "membership-page");
  }

  function renderAdmin(appContent, state) {
    const flow = appContent.flows.admin;
    const body = `
      <div class="admin-grid">${flow.queue.map((item) => `<article class="glass-panel admin-card"><h2>${escapeHtml(item)}</h2><p>点击进入审核列表，正式版需接权限系统。</p></article>`).join("")}</div>
      <div class="review-table glass-panel">
        ${reviewItems.map((item) => {
          const decision = state.reviewDecisions[item.id] || item.status;
          return `<article class="review-row"><div><span>${escapeHtml(item.id)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.owner)} · ${escapeHtml(item.risk)}</p></div><strong>${escapeHtml(decision)}</strong><div><button class="button button-ghost compact" type="button" data-action="review-approve" data-id="${escapeHtml(item.id)}">通过</button><button class="button button-ghost compact" type="button" data-action="review-reject" data-id="${escapeHtml(item.id)}">驳回</button></div></article>`;
        }).join("")}
      </div>
    `;
    return pageShell("审核后台", flow.title, flow.subtitle, body, "admin-page");
  }

  function renderSearch(appContent, state) {
    const flow = appContent.flows.search;
    const query = state.query || "角色 三视图 场景";
    const body = `
      <div class="search-summary glass-panel"><span>当前搜索</span><strong>${escapeHtml(query)}</strong></div>
      ${renderAssetBrowser(appContent, state, false)}
    `;
    return pageShell("搜索结果", flow.title, flow.subtitle, body, "search-page");
  }

  function renderCollections(appContent, state) {
    const projects = Object.entries(state.projects || appContent.projects);
    const count = state.collectionCount || 0;
    const pendingCount = state.pendingPurchaseCount || 0;
    const body = `
      <div class="creator-dashboard">
        <article class="glass-panel metric-panel">
          <span class="eyebrow">项目夹总数</span>
          <h3>${projects.length} 个</h3>
          <p>把收藏从素材堆积升级成真正的创作工作区。</p>
        </article>
        <article class="glass-panel metric-panel">
          <span class="eyebrow">已收藏素材</span>
          <h3>${count} 个</h3>
          <p>跨角色、场景、服装和道具统一管理。</p>
        </article>
        <article class="glass-panel metric-panel">
          <span class="eyebrow">待购买项</span>
          <h3>${pendingCount} 个</h3>
          <p>优先补齐正在推进的项目缺口。</p>
        </article>
      </div>
      <div class="collection-grid">${projects.map(([id, project], index) => `<article class="glass-panel collection-card">${icon("folder")}
      <h2>${escapeHtml(project.name)}</h2><div class="chips"><span>${escapeHtml(project.stage)}</span><span>${escapeHtml(project.owner)}</span></div><p>${index === 0 && count ? `已收藏 ${count} 个素材，包含武士角色三视图。` : escapeHtml(project.summary)}</p><div class="collection-meta">${project.stats.map((item) => `<span>${escapeHtml(item.value)}</span>`).join("")}</div><a class="button button-ghost compact" href="${escapeHtml(hrefFor("project", id))}" data-action="open-project" data-project="${escapeHtml(id)}">查看详情</a></article>`).join("")}</div>
    `;
    return pageShell("收藏夹", appContent.flows.collections.title, appContent.flows.collections.subtitle, body, "collections-page");
  }

  function renderProject(appContent, state) {
    const projects = state.projects || appContent.projects;
    const projectId = state.activeProjectId || DEFAULT_PROJECT_ID;
    const project = getProjectById(projects, projectId);
    const body = `
      <div class="project-shell">
        <article class="glass-panel project-summary">
          <span class="eyebrow">项目简介</span>
          <h2>${escapeHtml(project.name)}</h2>
          <div class="chips">
            <span>${escapeHtml(project.stage)}</span>
            <span>${escapeHtml(project.owner)}</span>
          </div>
          <p>${escapeHtml(project.summary)}</p>
          <div class="notice-panel glass-panel project-note"><strong>当前缺口</strong><p>${escapeHtml(project.note)}</p></div>
        </article>
        <article class="glass-panel project-summary">
          <span class="eyebrow">Prompt 备注</span>
          <div class="info-list">${project.prompts.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</div>
        </article>
      </div>
      <div class="creator-dashboard">
        ${project.stats.map((item) => `
          <article class="glass-panel metric-panel">
            <span class="eyebrow">${escapeHtml(item.label)}</span>
            <h3>${escapeHtml(item.value)}</h3>
            <p>帮助用户快速判断项目夹当前的补齐进度。</p>
          </article>
        `).join("")}
      </div>
      <div class="project-assets">
        ${project.assets.map((entry) => {
          const asset = getAssetById(entry.assetId);
          return `
            <article class="glass-panel project-asset-row">
              <div class="project-asset-copy">
                <span>${escapeHtml(entry.state)}</span>
                <h3>${escapeHtml(asset.name)}</h3>
                <p>${escapeHtml(asset.meta)} · ${escapeHtml(asset.price)}</p>
              </div>
              <div class="hero-actions left-actions">
                <a class="button button-ghost compact" href="${escapeHtml(hrefFor("detail", asset.id))}" data-action="open-detail" data-asset="${escapeHtml(asset.id)}">查看素材</a>
                ${entry.state === "待购买" ? `<a class="button button-primary compact" href="${escapeHtml(hrefFor("detail", asset.id))}" data-action="open-detail" data-asset="${escapeHtml(asset.id)}">继续补齐</a>` : ""}
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
    return pageShell("项目夹详情", "项目夹详情", "把收藏夹升级成真正可承载素材、购买状态和创作备注的项目工作区。", body, "project-page");
  }

  function timeline(steps, active = 1) {
    return `<div class="timeline">${steps.map((step, index) => `<article class="glass-panel timeline-step ${index < active ? "active" : ""}"><span>${String(index + 1).padStart(2, "0")}</span><h2>${escapeHtml(step)}</h2></article>`).join("")}</div>`;
  }

  const renderers = {
    home: renderHome,
    assets: renderAssets,
    community: renderCommunity,
    support: renderSupport,
    detail: renderDetail,
    creator: renderCreator,
    upload: renderUpload,
    auth: renderAuth,
    licensing: renderLicensing,
    downloads: renderDownloads,
    membership: renderMembership,
    admin: renderAdmin,
    search: renderSearch,
    collections: renderCollections,
    project: renderProject
  };

  return { renderers };
})(window.SparksUtils);
