"use strict";

(() => {
  const content = window.SPARKS_CONTENT;
  const router = window.SparksRouter;
  const particles = window.SparksParticles;
  const { escapeHtml } = window.SparksUtils;
  const assetIds = new Set(content.assets.items.map((item) => item.id));
  const creatorIds = new Set(Object.keys(content.creators));
  const projectIds = new Set(Object.keys(content.projects));
  const DEFAULT_ASSET_ID = content.assets.items[0].id;
  const DEFAULT_CREATOR_ID = content.community.people[0];
  const DEFAULT_PROJECT_ID = "short-drama-a";

  function cloneValue(value) {
    if (typeof structuredClone === "function") return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function cloneProjects() {
    return cloneValue(content.projects);
  }

  function cloneDownloadRecords() {
    return cloneValue(content.downloads.records);
  }

  function cloneDownloadActivity() {
    return [...content.downloads.activity];
  }

  function cloneDownloadQueue() {
    return cloneValue(content.downloads.queue);
  }

  function getAssetById(assetId) {
    return content.assets.items.find((item) => item.id === assetId) || content.assets.items[0];
  }

  function isKnownAsset(assetId) {
    return assetIds.has(assetId);
  }

  function isKnownCreator(creatorId) {
    return creatorIds.has(creatorId);
  }

  function isKnownProject(projectId) {
    return projectIds.has(projectId);
  }

  function isAssetCollected(assetId) {
    return Object.values(state.projects).some((project) => project.assets.some((entry) => entry.assetId === assetId));
  }

  function countPendingPurchases() {
    const pending = new Set();
    Object.values(state.projects).forEach((project) => {
      project.assets.forEach((entry) => {
        if (entry.state !== "已购") pending.add(entry.assetId);
      });
    });
    return pending.size;
  }

  const state = {
    route: router.routeFromHash(),
    query: "",
    menuOpen: false,
    selectedCategory: "全部",
    sceneTime: "day",
    collectionCount: 0,
    uploadStatus: "草稿未提交",
    uploadStep: 0,
    signedIn: false,
    licensePurchased: false,
    selectedPlan: "Trial",
    reviewDecisions: {},
    detailAssetId: DEFAULT_ASSET_ID,
    activeCreatorId: DEFAULT_CREATOR_ID,
    activeProjectId: DEFAULT_PROJECT_ID,
    projects: cloneProjects(),
    downloadRecords: cloneDownloadRecords(),
    downloadActivity: cloneDownloadActivity(),
    downloadQueue: cloneDownloadQueue(),
    pointsBalance: 10000,
    downloadSummary: [],
    pendingPurchaseCount: 0
  };

  function recomputeCollectionCount() {
    const unique = new Set();
    Object.values(state.projects).forEach((project) => {
      project.assets.forEach((entry) => unique.add(entry.assetId));
    });
    state.collectionCount = unique.size;
  }

  function recomputeProjectStats(projectId) {
    const project = state.projects[projectId];
    if (!project) return;
    const total = Math.max(project.assets.length + (projectId === "wishlist" ? 0 : 3), project.assets.length);
    const purchased = project.assets.filter((entry) => entry.state === "已购").length;
    const missing = project.assets.filter((entry) => entry.state !== "已购").map((entry) => {
      return getAssetById(entry.assetId).name;
    });
    project.stats = [
      { label: "已收集素材", value: `${project.assets.length} / ${total}` },
      { label: "已购完成度", value: `${Math.round((purchased / Math.max(project.assets.length, 1)) * 100)}%` },
      { label: "待补缺口", value: missing.length ? missing.slice(0, 2).join(" + ") : "已补齐" }
    ];
  }

  function recomputeAllProjectStats() {
    Object.keys(state.projects).forEach(recomputeProjectStats);
  }

  function recomputeDownloadSummary() {
    const downloadable = state.downloadRecords.filter((record) => record.status === "可下载").length;
    state.downloadSummary = [
      { label: "可下载素材", value: `${downloadable} 个` },
      { label: "本周授权", value: `${state.downloadRecords.length} 条` },
      { label: "剩余积分", value: `${state.pointsBalance.toLocaleString("zh-CN")} 积分` }
    ];
  }

  function recomputePendingPurchaseCount() {
    state.pendingPurchaseCount = countPendingPurchases();
  }

  function recomputeProjectDerivedState() {
    recomputeAllProjectStats();
    recomputeCollectionCount();
    recomputePendingPurchaseCount();
  }

  function recomputeDownloadDerivedState() {
    recomputeDownloadSummary();
    recomputePendingPurchaseCount();
  }

  function syncRouteState() {
    state.route = router.routeFromHash();
    const params = router.paramsFromHash();

    if (state.route === "detail" || state.route === "licensing") {
      state.detailAssetId = isKnownAsset(params.asset) ? params.asset : DEFAULT_ASSET_ID;
    }

    if (state.route === "creator") {
      state.activeCreatorId = isKnownCreator(params.creator) ? params.creator : DEFAULT_CREATOR_ID;
    }

    if (state.route === "project") {
      state.activeProjectId = isKnownProject(params.project) ? params.project : DEFAULT_PROJECT_ID;
    }
  }

  recomputeProjectDerivedState();
  recomputeDownloadSummary();

  const app = document.getElementById("app");
  const header = document.querySelector(".site-header");
  const nav = document.querySelector("[data-site-nav]");
  const menuButton = document.querySelector("[data-menu-button]");
  const searchInput = document.getElementById("site-search");

  function setMenuOpen(open) {
    state.menuOpen = Boolean(open);
    document.body.dataset.menuOpen = String(state.menuOpen);
  }

  function closeMenu() {
    if (!state.menuOpen) return;
    setMenuOpen(false);
    updateChrome();
  }

  function renderNav() {
    nav.innerHTML = content.nav.map((item) => `<a href="#${escapeHtml(item.route)}" data-route="${escapeHtml(item.route)}">${escapeHtml(item.label)}</a>`).join("");
  }

  function render(focusMain = false) {
    syncRouteState();
    setMenuOpen(false);
    app.innerHTML = router.renderRoute(state.route, state);
    document.title = `S-parks | ${router.navLabel(state.route)}`;
    updateChrome();
    if (focusMain) app.focus({ preventScroll: true });
  }

  function rerender(message) {
    app.innerHTML = router.renderRoute(state.route, state);
    updateChrome();
    if (message) showToast(message);
  }

  function updateChrome() {
    nav.querySelectorAll("a[data-route]").forEach((link) => {
      const active = link.dataset.route === state.route;
      link.classList.toggle("active", active);
      link.setAttribute("aria-current", active ? "page" : "false");
    });
    nav.classList.toggle("open", state.menuOpen);
    menuButton.setAttribute("aria-expanded", String(state.menuOpen));
    menuButton.setAttribute("aria-label", state.menuOpen ? "关闭导航" : "打开导航");
    nav.setAttribute("aria-hidden", String(!state.menuOpen && window.innerWidth <= 920));
    header.dataset.elevated = String(window.scrollY > 8);
  }

  function showToast(message) {
    const old = document.querySelector(".toast");
    if (old) old.remove();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.append(toast);
    window.setTimeout(() => toast.remove(), 2200);
  }

  function goToRoute(route, value = "") {
    const nextHash = router.hrefFor(route, value);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    } else {
      rerender();
    }
  }

  function handleAction(target) {
    const action = target.dataset.action;
    if (!action) return;

    if (action === "filter-category") {
      state.selectedCategory = target.dataset.category || "全部";
      rerender(`已筛选：${state.selectedCategory}`);
      return;
    }

    if (action === "set-scene-time") {
      state.sceneTime = target.dataset.time || "day";
      rerender("已切换场景时间");
      return;
    }

    if (action === "open-detail") {
      state.detailAssetId = isKnownAsset(target.dataset.asset) ? target.dataset.asset : DEFAULT_ASSET_ID;
      goToRoute("detail", state.detailAssetId);
      return;
    }

    if (action === "open-creator") {
      state.activeCreatorId = isKnownCreator(target.dataset.creator) ? target.dataset.creator : DEFAULT_CREATOR_ID;
      goToRoute("creator", state.activeCreatorId);
      return;
    }

    if (action === "open-project") {
      state.activeProjectId = isKnownProject(target.dataset.project) ? target.dataset.project : DEFAULT_PROJECT_ID;
      goToRoute("project", state.activeProjectId);
      return;
    }

    if (action === "collect-asset") {
      state.activeProjectId = DEFAULT_PROJECT_ID;
      const project = state.projects[state.activeProjectId];
      const assetId = state.detailAssetId;
      const exists = project.assets.some((entry) => entry.assetId === assetId);
      if (!exists) {
        project.assets.unshift({ assetId, state: state.downloadRecords.some((record) => record.assetId === assetId) ? "已购" : "待购买" });
        project.prompts.unshift(`新增素材《${getAssetById(assetId).name}》待继续整理用途说明。`);
        recomputeProjectStats(state.activeProjectId);
        recomputeCollectionCount();
        recomputePendingPurchaseCount();
        rerender("已加入短剧项目 A");
        return;
      }
      rerender("已加入短剧项目 A");
      return;
    }

    if (action === "go-upload-step") {
      state.uploadStep = Number(target.dataset.step || 0);
      rerender();
      return;
    }

    if (action === "next-upload-step") {
      state.uploadStep = Math.min(state.uploadStep + 1, content.flows.upload.steps.length - 1);
      rerender("继续完善上传信息");
      return;
    }

    if (action === "prev-upload-step") {
      state.uploadStep = Math.max(state.uploadStep - 1, 0);
      rerender();
      return;
    }

    if (action === "submit-upload") {
      state.uploadStatus = "已提交审核 · 等待平台复核";
      rerender("素材已进入模拟审核队列");
      return;
    }

    if (action === "save-draft") {
      state.uploadStatus = "草稿已保存到本地原型";
      rerender("草稿已保存");
      return;
    }

    if (action === "mock-login") {
      state.signedIn = true;
      rerender("已进入原型账户状态");
      return;
    }

    if (action === "buy-license") {
      const assetId = state.detailAssetId;
      const detail = content.details[assetId];
      const alreadyPurchased = state.downloadRecords.some((record) => record.assetId === assetId);
      if (!alreadyPurchased) {
        const numericPrice = Number.parseInt(detail.price, 10) || 0;
        state.pointsBalance = Math.max(0, state.pointsBalance - numericPrice);
        state.downloadRecords.unshift({
          id: `LIC-${Date.now()}`,
          assetId,
          status: "可下载",
          points: `-${numericPrice}`,
          scope: "单项目商用",
          updated: "刚刚生成"
        });
        state.downloadActivity.unshift(`生成《${detail.title}》授权记录`);
        if (state.downloadQueue.length) {
          state.downloadQueue[0] = { title: "待打包下载", text: `《${detail.title}》已加入待打包下载队列。` };
        }
        Object.values(state.projects).forEach((project) => {
          project.assets.forEach((entry) => {
            if (entry.assetId === assetId) entry.state = "已购";
          });
        });
        recomputeProjectDerivedState();
        recomputeDownloadDerivedState();
      }
      state.licensePurchased = true;
      rerender(alreadyPurchased ? "该素材已存在授权记录" : "已生成模拟授权记录");
      return;
    }

    if (action === "select-plan") {
      state.selectedPlan = target.dataset.plan || "Trial";
      rerender(`已选择 ${state.selectedPlan}`);
      return;
    }

    if (action === "review-approve" || action === "review-reject") {
      const id = target.dataset.id;
      state.reviewDecisions[id] = action === "review-approve" ? "已通过" : "已驳回";
      rerender(`${id} ${state.reviewDecisions[id]}`);
    }
  }

  function bindEvents() {
    window.addEventListener("hashchange", () => render(true));
    window.addEventListener("scroll", updateChrome, { passive: true });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 920) {
        setMenuOpen(false);
      }
      updateChrome();
    }, { passive: true });

    menuButton.addEventListener("click", () => {
      setMenuOpen(!state.menuOpen);
      updateChrome();
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a[data-route]")) closeMenu();
    });

    searchInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      state.selectedCategory = "全部";
      if (state.route !== "search") {
        window.location.hash = "search";
      } else {
        rerender();
      }
    });

    document.addEventListener("click", (event) => {
      if (!state.menuOpen || window.innerWidth > 920) return;
      const insideMenu = event.target.closest("[data-site-nav], [data-menu-button]");
      if (!insideMenu) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    app.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (target) handleAction(target);
    });

    app.addEventListener("submit", (event) => event.preventDefault());
  }

  renderNav();
  bindEvents();
  particles.init(document.getElementById("particle-canvas"));
  render(false);
})();
