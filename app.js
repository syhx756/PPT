import {
  candidateViewportDistance,
  normalizedViewportDistance,
  preloadConcurrency,
  rankImageCandidates
} from "./assets/runtime/image-preload-policy.mjs?v=e34af59bc9d3";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (window.location.hash) {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}
window.scrollTo({ top: 0, left: 0, behavior: "auto" });
window.addEventListener("pageshow", () => {
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});

const projects = {
  shanhaitu: {
    code: "DKU / 001",
    title: "《山海图》系列 IP",
    type: "国风神话 × 科幻 × 探险",
    image: "assets/projects/shanhaitu-overview.webp?v=e34af59bc9d3",
    cycle: "单部3个月制作周期",
    producer: "当康文化",
    platform: "院线 / 流媒体",
    heat: "核心 IP 储备",
    summary: "以中国上古神话为根基，贯通神、人、AI 与信息文明。三部风格迥异的电影由神门、玄珠与终极核彼此勾连，构成跨越万年的原创世界观。",
    highlights: ["首发三部：绝地天通 / 终极 / 黄金帐", "神话、现实与近未来共享时间闭环", "极致国风与赛博仿生视觉并行", "20部系列故事宇宙，多线并发"]
  },
  jueditian: {
    code: "DKU / 002",
    title: "《绝地天通》",
    type: "上古神话 / 奇幻冒险",
    image: "assets/projects/jueditian-page16.webp?v=e34af59bc9d3",
    cycle: "先导片阶段",
    producer: "当康文化",
    platform: "院线 / 国际电影节",
    heat: "重点筹备",
    summary: "天地裂隙泄出浊气，万物异变。平凡陶匠学徒以烧陶之技凝聚众生微光，在各部族同伴的守护下炼鼎补天，完成一次属于凡人的创世壮举。",
    highlights: ["主题：凡人微光，亦能补天", "陶火、云鼎与山海异兽视觉体系", "以创造和协作回应末世灾变", "东方创世神话的当代重构"]
  },
  terminal: {
    code: "DKU / 003",
    title: "《终极》",
    type: "近未来科幻 / 无限流 / 惊悚冒险",
    image: "assets/projects/terminal-hd.webp?v=e34af59bc9d3",
    cycle: "概念开发阶段",
    producer: "当康文化",
    platform: "院线 / 流媒体",
    heat: "开发中",
    summary: "公元 2347 年，仿生人文明接管地球。底层仿生人灰烬进入异常副本，与人类数据残影渡共同闯关，逐步发现副本是为筛选同理心与好奇心而设。",
    highlights: ["仿生文明与人类信息文明对视", "怪谈副本与序列晋升机制", "冷色赛博与 1999 怀旧美学交错", "终极核触发文明重启"]
  },
  golden: {
    code: "DKU / 004",
    title: "《黄金帐》",
    type: "现代探险 / 历史悬疑 / 古今双魂",
    image: "assets/projects/golden-page31.webp?v=e34af59bc9d3",
    cycle: "世界观开发阶段",
    producer: "当康文化",
    platform: "院线 / 流媒体",
    heat: "系列储备",
    summary: "考古助理林曦因祖传羊皮卷与玉佩，与古代西域女王白苏茹形成一魂双体。古今两条时间线在昆仑悬圃重合，共同守护足以改写历史的神之门。",
    highlights: ["昆仑、楼兰与帕米尔实景奇观", "一魂双体共享感官与记忆", "古代政治线与现代科考线并进", "守护真相，而非占有力量"]
  },
  star: {
    code: "DKI / 005",
    title: "《星途璀璨》",
    type: "真人互动影像 / 电影级分支叙事",
    image: "assets/projects/star.webp?v=e34af59bc9d3",
    cycle: "互动剧开发阶段",
    producer: "当康文化",
    platform: "互动影游平台",
    heat: "重点项目",
    summary: "明星助理陈默在老板、当红花旦、狗仔与资本之间摇摆。一台微型相机既能毁掉明星，也能成为保护她的盾牌，玩家的每次选择都在重写名利场规则。",
    highlights: ["资本博弈与双线叙事", "2 条主干与 9 个关键分支", "多重隐藏结局", "打破第四面墙的终极反转"]
  },
  projection: {
    code: "DKU / 006",
    title: "《投影》",
    type: "国风赛博 / 轻喜科幻",
    image: "assets/projects/projection-hd.webp?v=e34af59bc9d3",
    cycle: "剧本开发阶段",
    producer: "当康文化",
    platform: "流媒体 / 文旅场景",
    heat: "原创储备",
    summary: "创世神话被转译为底层代码：仓颉字元是现实编辑器，术数与古琴是安全接口。摸鱼程序员与摆烂心理医生在世界漏洞中发现，人类早已生活在信息文明生成的舒适副本。",
    highlights: ["绝地天通的科幻化重构", "仓颉字元与青铜朋克视觉", "山海异兽的科学诠释", "当代职场议题包裹文明寓言"]
  },
  dongfang: {
    code: "DKS / 007",
    title: "《东方朔》",
    type: "历史轻喜 / 弹幕互动",
    image: "assets/projects/dongfang.webp?v=e34af59bc9d3",
    cycle: "方案开发阶段",
    producer: "当康文化",
    platform: "短剧平台 / 文旅场景",
    heat: "项目筹备",
    summary: "弹幕系统错误绑定两千多年前的东方朔。现代人围观他反抗繁文缛节、直击问题本源的朝堂日常，在历史底色与当代职场共鸣之间找到新的观看入口。",
    highlights: ["历史人物本色不被穿越设定改写", "弹幕成为剧情内现场解说", "反形式主义的当代共鸣", "兼顾历史传播与轻喜爽感"]
  },
  liaozhai: {
    code: "DKI / 008",
    title: "《聊斋诡事录》",
    type: "全息沉浸 / 狐族志异 / 情感冒险",
    image: "assets/projects/liaozhai.webp?v=e34af59bc9d3",
    cycle: "互动内容开发阶段",
    producer: "当康文化",
    platform: "沉浸娱乐 / 互动影游",
    heat: "项目储备",
    summary: "玩家进入狐族嫁女的全息世界，本想搅黄一场婚宴，却卷入圣君心魔与九曜锁的真相。古典志异、无厘头互动和人狐情感在一座狐仙居中逐层翻转。",
    highlights: ["观众魂穿进入志异故事", "狐族嫁女与机关宅邸", "阵营误解到共同破局", "虚拟物品照进现实的尾声"]
  }
};

const team = [
  { name: "胡洪霜", group: "producer", role: "制片人", detail: "操盘多部S级微短剧及网剧，具备丰富的一线拍片与商务对接经验", photo: "huhongshuang" },
  { name: "胡亚绮", group: "producer", role: "制片人", detail: "14年影视投资与制片经验，深刻洞察观众喜好与商业回报", photo: "huyiqi" },
  { name: "庞哲", group: "director", role: "总导演", detail: "青年编导、内容策划总监，擅长以内容为锚叙事，以创意之翼破界", photo: "pangzhe" },
  { name: "Vinny", group: "director", role: "导演", detail: "青年导演、艺术学硕士，用影像完成有温度的叙事，让传统持续被阅读", photo: "vinny" },
  { name: "张铭源", group: "art", role: "主程序开发", detail: "计算机视觉硕士，6年游戏开发与影视技术编程经验", photo: "zhangmingyuan" },
  { name: "陈辉", group: "director", role: "导演", detail: "11年导演从业经验，横竖屏双栖，多部作品分账破千万", photo: "chenhui" },
  { name: "胡不归", group: "writer", role: "主编", detail: "深耕实景演绎、话剧编导与文旅短剧，擅长将文化元素融入剧情", photo: "hubugui" },
  { name: "王馨笠", group: "writer", role: "总编", detail: "作品横跨实景剧场、短剧、动漫三大领域，擅长多元题材落地", photo: "wangxinli" },
  { name: "何康", group: "art", role: "执行美术", detail: "舞台设计专业，12年影视与综艺空间设计及场景落地经验", photo: "hekang" },
  { name: "刘忠昭", group: "art", role: "美术指导", detail: "影视动画专业，拥有大型文旅影视城与热门综艺实景项目经验", photo: "liuzhongzhao" },
  { name: "李沐川", group: "director", role: "导演", detail: "12年行业经验，擅长把抽象概念转化为具象镜头，风格统一、节奏硬朗", photo: "limuchuan" },
  { name: "李航", group: "director", role: "动画导演", detail: "10年动画与影视导演经验，兼具技术审美与商业视角", photo: "lihang" },
  { name: "任一帆", group: "director", role: "执行导演", detail: "8年分镜与预演经验，完成5000+镜头打板，群像调度稳定", photo: "renyifan" },
  { name: "宋存轩", group: "director", role: "编剧/导演", detail: "深耕话剧创作与影视文学改编，情感细腻、文本扎实", photo: "songcunxuan" },
  { name: "田田", group: "director", role: "导演", detail: "专注电影质感与人文底蕴，作品兼具作者表达与创新意识", photo: "tiantian" },
  { name: "张霖", group: "writer", role: "编剧", detail: "专注高概念、强冲突的短剧与互动剧，深谙短视频用户爽点", photo: "zhanglin" },
  { name: "王冬冬", group: "writer", role: "编剧", detail: "深耕悬疑、奇幻类大世界观剧本，擅长严密的故事布局", photo: "wangdongdong" },
  { name: "卢瑞丰", group: "art", role: "美术指导", detail: "具备丰富的影视与实景项目场景绘制经验，精细把控画面视觉", photo: "lurifeng" },
  { name: "李保栋", group: "art", role: "置景师", detail: "40余年实景搭建与管理经验，长期参与头部电影美术制作", photo: "libaodong" },
  { name: "舒连宝", group: "art", role: "置景组长", detail: "从业25年+，擅长大型古装与奇幻场景的实景搭设", photo: "shulianbao" },
  { name: "袁天琪", group: "art", role: "概念设计师", detail: "深耕电影、游戏概念设计与气氛图绘制，专注国风视觉开发", photo: "yuantianqi" },
  { name: "苏迪克", group: "art", role: "AI视觉技术", detail: "专注AIGC在影视美术、场景生成与动画辅助领域的落地应用", photo: "sudike" },
  { name: "王凯", group: "director", role: "摄影指导 / 导演 / 制片人", detail: "长期活跃于浙江影视制作一线，兼具摄影指导、导演与制片视角，擅长全流程统筹和商业影像创作", photo: "wangkai" },
  { name: "熊子莹", group: "other", role: "编导", detail: "主导文旅实景项目及大型活动，具备从统筹到落地的全链条能力", photo: "xiongziying" },
  { name: "白慧艳", group: "other", role: "剪辑师", detail: "3年信息流广告与短视频剪辑经验，熟练使用各类AI剪辑工具", photo: "baihuiyan" },
  { name: "张诗坤", group: "other", role: "摄影师", detail: "3年拍摄剪辑经验，擅长画面构图、现场布光与光影塑造", photo: "zhangshikun" }
];

const groupLabels = { producer: "PRODUCTION", director: "DIRECTING", writer: "WRITING", art: "ART & AI", other: "CRAFT" };
const groupNames = { producer: "制片团队", director: "导演团队", writer: "编剧团队", art: "美术与 AI 团队", other: "摄制与后期团队" };
const groupProfiles = {
  producer: "负责项目评估、资源统筹与制作管理，将创作目标落实为可执行的周期、预算和交付标准。",
  director: "参与叙事视听化、镜头调度与现场或生成式影像执行，确保作品风格、表演和节奏统一。",
  writer: "围绕世界观、人物关系与情绪节奏推进原创开发和 IP 改编，建立可持续的内容结构。",
  art: "负责视觉概念、场景资产、角色一致性与 AI 工程管线，把风格设定转化为稳定的生产素材。",
  other: "覆盖编导、摄影、剪辑与执行美术等关键环节，连接创意方案、现场制作和最终成片。"
};
const groupTags = {
  producer: ["项目统筹", "制作管理", "资源协同"],
  director: ["视听叙事", "镜头调度", "风格把控"],
  writer: ["原创开发", "IP 改编", "结构设计"],
  art: ["视觉开发", "资产生产", "AI 管线"],
  other: ["现场执行", "后期制作", "内容交付"]
};
const projectModal = document.querySelector("#projectModal");
const modalTitle = document.querySelector("#modalTitle");
const modalType = document.querySelector("#modalType");
const modalSummary = document.querySelector("#modalSummary");
const modalHighlights = document.querySelector("#modalHighlights");
const modalImage = document.querySelector("#modalImage");
const modalVisual = document.querySelector("#modalVisual");
const modalCode = document.querySelector("#modalCode");
const modalCycle = document.querySelector("#modalCycle");
const modalProducer = document.querySelector("#modalProducer");
const modalPlatform = document.querySelector("#modalPlatform");
const modalHeat = document.querySelector("#modalHeat");
const teamModal = document.querySelector("#teamModal");
const teamModalVisual = document.querySelector("#teamModalVisual");
const teamModalGroup = document.querySelector("#teamModalGroup");
const teamModalTitle = document.querySelector("#teamModalTitle");
const teamModalRole = document.querySelector("#teamModalRole");
const teamModalSummary = document.querySelector("#teamModalSummary");
const teamModalTags = document.querySelector("#teamModalTags");
function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.7 } });
  else window.setTimeout(refreshIcons, 60);
}

const imagePreloadRegistry = new Map();
const activePreloadImages = new Map();
let imagePreloadOrder = 0;
let activeImageLoads = 0;
let imageWorkQueued = false;
let imageIdleHandle = 0;
let imageIdleUsesCallback = false;
let imagePreloadObserver = null;
let imageResizeTimer = 0;
let pageLoadComplete = document.readyState === "complete";

const currentViewport = () => ({
  width: Math.max(window.innerWidth, 1),
  height: Math.max(window.innerHeight, 1)
});

const candidateKey = source => new URL(source, document.baseURI).href;

function setElementSource(image, candidate, priority) {
  image.fetchPriority = priority;
  image.src = candidate.source;
  image.removeAttribute("data-src");
}

function registerImageCandidate(source, { image = null, anchor = image } = {}) {
  if (!source) return null;
  const key = candidateKey(source);
  let candidate = imagePreloadRegistry.get(key);
  if (!candidate) {
    candidate = {
      url: key,
      source,
      order: imagePreloadOrder++,
      state: "pending",
      anchors: new Set(),
      elements: new Set()
    };
    imagePreloadRegistry.set(key, candidate);
  }

  if (anchor) candidate.anchors.add(anchor);
  if (image) {
    candidate.elements.add(image);
    image.dataset.preloadKey = key;
    if (candidate.state === "loaded" || candidate.state === "error") {
      setElementSource(image, candidate, "low");
    } else {
      imagePreloadObserver?.observe(image);
    }
  }
  return candidate;
}

function registerDeferredImages(root = document) {
  root.querySelectorAll("img[data-src]").forEach(image => {
    registerImageCandidate(image.dataset.src, { image });
  });
  scheduleImageWork();
}

function registerTeamOriginals(root = document) {
  root.querySelectorAll(".team-card[data-member-index]").forEach(card => {
    const member = team[Number(card.dataset.memberIndex)];
    if (member?.photo) registerImageCandidate(`assets/team/${member.photo}.webp?v=e34af59bc9d3`, { anchor: card });
  });
  scheduleImageWork();
}

function registerProjectOriginals() {
  for (const [key, project] of Object.entries(projects)) {
    const anchors = document.querySelectorAll(`[data-project="${key}"]`);
    if (anchors.length) anchors.forEach(anchor => registerImageCandidate(project.image, { anchor }));
    else registerImageCandidate(project.image);
  }
  scheduleImageWork();
}

function rankedImageWork(states) {
  const viewport = currentViewport();
  return rankImageCandidates(
    [...imagePreloadRegistry.values()].filter(candidate => states.has(candidate.state)),
    viewport
  ).map(candidate => ({
    candidate,
    distance: candidateViewportDistance(candidate, viewport)
  }));
}

function loadImageCandidate(candidate, priority) {
  if (candidate.state !== "pending") return;
  candidate.state = "loading";
  activeImageLoads += 1;

  for (const image of candidate.elements) {
    if (image.isConnected) setElementSource(image, candidate, priority);
  }

  const loader = new Image();
  loader.fetchPriority = priority;
  loader.decoding = "async";
  activePreloadImages.set(candidate.url, loader);

  const finish = event => {
    if (candidate.state !== "loading") return;
    candidate.state = event.type === "load" ? "loaded" : "error";
    activeImageLoads = Math.max(activeImageLoads - 1, 0);
    activePreloadImages.delete(candidate.url);
    scheduleImageWork();
  };
  loader.addEventListener("load", finish, { once: true });
  loader.addEventListener("error", finish, { once: true });
  loader.src = candidate.source;
}

function cancelIdleImageWork() {
  if (!imageIdleHandle) return;
  if (imageIdleUsesCallback && "cancelIdleCallback" in window) window.cancelIdleCallback(imageIdleHandle);
  else window.clearTimeout(imageIdleHandle);
  imageIdleHandle = 0;
}

function runIdleImageWork(deadline = null) {
  imageIdleHandle = 0;
  const unfinished = rankedImageWork(new Set(["pending", "loading"]));
  if (unfinished.some(({ distance }) => distance <= 1)) {
    scheduleImageWork();
    return;
  }

  const concurrency = preloadConcurrency(navigator.connection);
  const pending = unfinished.filter(({ candidate }) => candidate.state === "pending");
  let started = 0;
  while (activeImageLoads < concurrency && pending.length) {
    if (started > 0 && deadline && !deadline.didTimeout && deadline.timeRemaining() < 4) break;
    loadImageCandidate(pending.shift().candidate, "low");
    started += 1;
  }
}

function scheduleIdleImageWork() {
  if (imageIdleHandle || !pageLoadComplete) return;
  if ("requestIdleCallback" in window) {
    imageIdleUsesCallback = true;
    imageIdleHandle = window.requestIdleCallback(runIdleImageWork, { timeout: 1200 });
  } else {
    imageIdleUsesCallback = false;
    imageIdleHandle = window.setTimeout(() => runIdleImageWork(), 120);
  }
}

function runImmediateImageWork() {
  imageWorkQueued = false;
  const unfinished = rankedImageWork(new Set(["pending", "loading"]));
  const nearby = unfinished.filter(({ distance }) => distance <= 1);

  if (nearby.length) {
    cancelIdleImageWork();
    const concurrency = preloadConcurrency(navigator.connection);
    const pending = nearby.filter(({ candidate }) => candidate.state === "pending");
    while (activeImageLoads < concurrency && pending.length) {
      loadImageCandidate(pending.shift().candidate, "high");
    }
    return;
  }

  if (unfinished.some(({ candidate }) => candidate.state === "pending")) scheduleIdleImageWork();
}

function scheduleImageWork() {
  if (imageWorkQueued) return;
  imageWorkQueued = true;
  const enqueue = window.queueMicrotask || (callback => Promise.resolve().then(callback));
  enqueue(runImmediateImageWork);
}

function rebuildImagePreloadObserver() {
  imagePreloadObserver?.disconnect();
  imagePreloadObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
        const viewport = currentViewport();
        if (entries.some(entry => entry.isIntersecting
          && normalizedViewportDistance(entry.boundingClientRect, viewport) <= 1)) scheduleImageWork();
      }, { rootMargin: `${window.innerHeight}px ${window.innerWidth}px` })
    : null;

  if (imagePreloadObserver) {
    for (const candidate of imagePreloadRegistry.values()) {
      if (candidate.state !== "pending") continue;
      for (const image of candidate.elements) {
        if (image.isConnected && image.dataset.src) imagePreloadObserver.observe(image);
      }
    }
  }
  scheduleImageWork();
}

function observeDeferredImages(root = document) {
  registerDeferredImages(root);
}

rebuildImagePreloadObserver();
window.addEventListener("resize", () => {
  window.clearTimeout(imageResizeTimer);
  imageResizeTimer = window.setTimeout(rebuildImagePreloadObserver, 120);
}, { passive: true });
if (navigator.connection?.addEventListener) navigator.connection.addEventListener("change", scheduleImageWork);
if (!pageLoadComplete) {
  window.addEventListener("load", () => {
    pageLoadComplete = true;
    scheduleImageWork();
  }, { once: true });
}

function openProject(key, fromScene = false) {
  const item = projects[key] || projects.shanhaitu;
  modalCode.textContent = item.code;
  modalTitle.textContent = item.title;
  modalType.textContent = item.type;
  modalSummary.textContent = item.summary;
  modalImage.src = item.image;
  modalImage.alt = `${item.title} 项目视觉`;
  modalVisual.style.setProperty("--modal-art", `url("${item.image}")`);
  modalImage.onload = () => modalVisual.classList.toggle("portrait", modalImage.naturalHeight > modalImage.naturalWidth);
  modalCycle.textContent = item.cycle;
  modalProducer.textContent = item.producer;
  modalPlatform.textContent = item.platform;
  modalHeat.textContent = item.heat;
  modalHighlights.innerHTML = item.highlights.map(value => `<span>${value}</span>`).join("");
  projectModal.dataset.fromScene = String(fromScene);
  projectModal.showModal();
  document.body.classList.add("modal-open");
}

function closeProject() {
  projectModal.close();
  document.body.classList.remove("modal-open");
}

function openTeam(index) {
  const member = team[index];
  if (!member) return;
  teamModalGroup.textContent = groupLabels[member.group];
  teamModalTitle.textContent = member.name;
  teamModalRole.textContent = `${member.role} / ${groupNames[member.group]}`;
  teamModalSummary.textContent = `${member.detail}。${groupProfiles[member.group]}`;
  teamModalTags.innerHTML = [member.role, ...groupTags[member.group]].map(value => `<span>${value}</span>`).join("");
  teamModalVisual.classList.toggle("no-photo", !member.photo);
  teamModalVisual.style.removeProperty("--team-photo-ratio");
  teamModalVisual.innerHTML = member.photo
    ? `<img src="assets/team/${member.photo}.webp?v=e34af59bc9d3" alt="${member.name}团队资料">`
    : `<strong aria-hidden="true">${member.name.slice(0, 1)}</strong><small>${groupLabels[member.group]}</small>`;
  if (member.photo) {
    const image = teamModalVisual.querySelector("img");
    const applyNaturalRatio = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;
      teamModalVisual.style.setProperty("--team-photo-ratio", `${image.naturalWidth} / ${image.naturalHeight}`);
    };
    if (image.complete) applyNaturalRatio();
    else image.addEventListener("load", applyNaturalRatio, { once: true });
  }
  teamModal.showModal();
  document.body.classList.add("modal-open");
}

function closeTeam() {
  teamModal.close();
  document.body.classList.remove("modal-open");
}

function renderTeam(filter = "all") {
  const rail = document.querySelector("#teamRail");
  const entries = filter === "all" ? team : team.filter(member => member.group === filter);
  rail.innerHTML = entries.map((member, index) => {
    const memberIndex = team.indexOf(member);
    const visual = member.photo
          ? `<img data-src="assets/team/thumbs/${member.photo}.webp?v=e34af59bc9d3" alt="${member.name}团队资料" loading="lazy" decoding="async">`
      : `<strong aria-hidden="true">${member.name.slice(0, 1)}</strong>`;
    return `<button class="team-card" type="button" data-member-index="${memberIndex}" aria-label="查看${member.name}详情">
      <span class="team-photo ${member.photo ? "" : "no-photo"}">${visual}<span class="team-role-index">${String(index + 1).padStart(2, "0")}</span></span>
      <span class="team-copy"><small>${groupLabels[member.group]}</small><h3>${member.name}</h3><p>${member.role}｜${member.detail}</p><i data-lucide="arrow-up-right"></i></span>
    </button>`;
  }).join("");
  observeDeferredImages(rail);
  registerTeamOriginals(rail);
  rail.scrollTo({ left: 0, behavior: "auto" });
  window.setTimeout(refreshIcons, 0);
}

function initAutoRail(rail, cardSelector) {
  let edgeSpeed = 0;
  let direction = 1;
  let visible = false;
  let interacting = false;
  let hoveredCard = null;
  let dragPointerId = null;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let dragMoved = false;
  let suppressClick = false;
  let lastFrame = 0;
  let animationFrame = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  rail.addEventListener("pointermove", event => {
    if (event.pointerId === dragPointerId) {
      const distance = event.clientX - dragStartX;
      if (!dragMoved && Math.abs(distance) > 10) {
        dragMoved = true;
        rail.classList.add("is-dragging");
        rail.setPointerCapture(event.pointerId);
      }
      if (dragMoved) {
        event.preventDefault();
        rail.scrollLeft = dragStartScroll - distance;
      }
      return;
    }
    const bounds = rail.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / Math.max(bounds.width, 1);
    const nextHoveredCard = event.target.closest(cardSelector);
    if (nextHoveredCard !== hoveredCard) {
      hoveredCard?.classList.remove("is-hovered");
      hoveredCard = nextHoveredCard;
      hoveredCard?.classList.add("is-hovered");
      rail.classList.toggle("card-hovering", Boolean(hoveredCard));
    }
    const edgeZone = 0.18;
    if (ratio < edgeZone) edgeSpeed = -0.9 - (1 - ratio / edgeZone) * 5.2;
    else if (ratio > 1 - edgeZone) edgeSpeed = 0.9 + ((ratio - (1 - edgeZone)) / edgeZone) * 5.2;
    else edgeSpeed = 0;
  });
  rail.addEventListener("pointerleave", () => {
    edgeSpeed = 0;
    if (dragPointerId === null) interacting = false;
    hoveredCard?.classList.remove("is-hovered");
    hoveredCard = null;
    rail.classList.remove("card-hovering");
  });
  rail.addEventListener("pointerdown", event => {
    interacting = true;
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartScroll = rail.scrollLeft;
    dragMoved = false;
    edgeSpeed = 0;
    hoveredCard?.classList.remove("is-hovered");
    hoveredCard = null;
    rail.classList.remove("card-hovering");
  });
  const finishMouseDrag = event => {
    if (event.pointerId !== dragPointerId) return;
    const pointerId = dragPointerId;
    dragPointerId = null;
    interacting = false;
    rail.classList.remove("is-dragging");
    if (rail.hasPointerCapture(pointerId)) rail.releasePointerCapture(pointerId);
    if (dragMoved) {
      suppressClick = true;
      window.setTimeout(() => { suppressClick = false; }, 0);
    }
  };
  rail.addEventListener("pointerup", event => {
    if (event.pointerType === "mouse") finishMouseDrag(event);
    else interacting = false;
  });
  rail.addEventListener("pointercancel", event => {
    if (event.pointerType === "mouse") finishMouseDrag(event);
    else interacting = false;
  });
  rail.addEventListener("lostpointercapture", event => finishMouseDrag(event));
  rail.addEventListener("click", event => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);
  window.addEventListener("pointerup", event => {
    if (event.pointerType === "mouse") finishMouseDrag(event);
    else interacting = false;
  });

  const animateRail = now => {
    const frameScale = Math.min((now - lastFrame) / 16.67, 2.4);
    lastFrame = now;
    const maxScroll = Math.max(rail.scrollWidth - rail.clientWidth, 0);
    if (!reduceMotion && visible && maxScroll > 0 && !interacting && !document.body.classList.contains("modal-open")) {
      if (edgeSpeed === 0) {
        if (rail.scrollLeft >= maxScroll - 1) direction = -1;
        else if (rail.scrollLeft <= 1) direction = 1;
      }
      const speed = edgeSpeed || direction * 0.42;
      rail.scrollLeft = Math.min(Math.max(rail.scrollLeft + speed * frameScale, 0), maxScroll);
    }
    animationFrame = visible ? window.requestAnimationFrame(animateRail) : 0;
  };
  const startAnimation = () => {
    if (animationFrame || reduceMotion) return;
    lastFrame = performance.now();
    animationFrame = window.requestAnimationFrame(animateRail);
  };
  const stopAnimation = () => {
    if (!animationFrame) return;
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (visible) startAnimation();
    if (!visible) stopAnimation();
  }, { threshold: 0.08 });
  observer.observe(rail);
}

function initUI() {
  refreshIcons();
  observeDeferredImages();
  renderTeam();
  registerProjectOriginals();

  const clock = document.querySelector("#clock");
  const updateClock = () => {
    clock.textContent = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
  };
  updateClock();
  window.setInterval(updateClock, 1000);

  const loadWeather = () => fetch("https://api.open-meteo.com/v1/forecast?latitude=30.27&longitude=120.15&current=temperature_2m&timezone=Asia%2FShanghai")
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => { document.querySelector("#weather").textContent = `杭州 · ${Math.round(data.current.temperature_2m)}°C`; })
    .catch(() => {});
  if ("requestIdleCallback" in window) window.requestIdleCallback(loadWeather, { timeout: 2000 });
  else window.setTimeout(loadWeather, 400);

  const heroCube = document.querySelector("#heroCube");
  const cubeDock = document.querySelector("#cubeDock");
  const home = document.querySelector("#home");
  const scrollToSection = selector => document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });

  heroCube.addEventListener("click", () => scrollToSection("#cases"));
  cubeDock.addEventListener("click", () => scrollToSection("#home"));
  home.addEventListener("pointermove", event => {
    const homeBounds = home.getBoundingClientRect();
    const cubeBounds = heroCube.getBoundingClientRect();
    home.classList.add("is-lit");
    heroCube.classList.add("is-lit");
    home.style.setProperty("--pointer-x", `${event.clientX - homeBounds.left}px`);
    home.style.setProperty("--pointer-y", `${event.clientY - homeBounds.top}px`);
    heroCube.style.setProperty("--pointer-x", `${event.clientX - cubeBounds.left}px`);
    heroCube.style.setProperty("--pointer-y", `${event.clientY - cubeBounds.top}px`);
  });
  const clearHeroLight = () => {
    home.classList.remove("is-lit");
    heroCube.classList.remove("is-lit");
    home.style.setProperty("--pointer-x", "58%");
    home.style.setProperty("--pointer-y", "46%");
    heroCube.style.setProperty("--pointer-x", "52%");
    heroCube.style.setProperty("--pointer-y", "46%");
  };
  home.addEventListener("pointerleave", clearHeroLight);
  home.addEventListener("pointerout", event => {
    if (event.relatedTarget && home.contains(event.relatedTarget)) return;
    clearHeroLight();
  });
  document.addEventListener("pointermove", event => {
    if (!home.contains(event.target)) clearHeroLight();
  }, { passive: true });
  const cubeDockObserver = new IntersectionObserver(entries => {
    const homeVisible = entries.some(entry => entry.isIntersecting);
    cubeDock.classList.toggle("is-visible", !homeVisible);
    cubeDock.setAttribute("aria-hidden", String(homeVisible));
    cubeDock.tabIndex = homeVisible ? -1 : 0;
  }, { threshold: 0 });
  cubeDockObserver.observe(home);

  document.querySelectorAll("[data-project]").forEach(button => {
    button.addEventListener("click", () => openProject(button.dataset.project));
  });
  document.querySelector("#modalClose").addEventListener("click", closeProject);
  projectModal.addEventListener("click", event => { if (event.target === projectModal) closeProject(); });
  projectModal.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
  });
  document.querySelector("#modalAction").addEventListener("click", () => {
    closeProject();
    document.querySelector("#universe").scrollIntoView({ behavior: "smooth" });
  });

  document.querySelector("#teamModalClose").addEventListener("click", closeTeam);
  teamModal.addEventListener("click", event => { if (event.target === teamModal) closeTeam(); });
  teamModal.addEventListener("close", () => document.body.classList.remove("modal-open"));

  const contactModal = document.querySelector("#contactModal");
  const closeContact = () => { contactModal.close(); document.body.classList.remove("modal-open"); };
  document.querySelector("#contactButton").addEventListener("click", () => { contactModal.showModal(); document.body.classList.add("modal-open"); });
  document.querySelector("#contactClose").addEventListener("click", closeContact);
  document.querySelector("#contactConfirm").addEventListener("click", closeContact);
  contactModal.addEventListener("click", event => { if (event.target === contactModal) closeContact(); });
  contactModal.addEventListener("close", () => document.body.classList.remove("modal-open"));

  const rail = document.querySelector("#teamRail");
  rail.addEventListener("click", event => {
    const card = event.target.closest(".team-card");
    if (card) openTeam(Number(card.dataset.memberIndex));
  });
  initAutoRail(rail, ".team-card");
  document.querySelectorAll(".case-track").forEach(track => initAutoRail(track, ".case-card"));
  document.querySelectorAll(".segmented button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".segmented button").forEach(item => { item.classList.toggle("active", item === button); item.setAttribute("aria-selected", String(item === button)); });
      renderTeam(button.dataset.filter);
    });
  });

  const sidebar = document.querySelector("#sidebar");
  const menu = document.querySelector("#mobileMenu");
  const setMenuState = open => {
    sidebar.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
  };
  menu.addEventListener("click", () => setMenuState(!sidebar.classList.contains("open")));
  document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", () => setMenuState(false)));

  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.12 });
  reveals.forEach(item => revealObserver.observe(item));

  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  }), { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => sectionObserver.observe(section));

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (teamModal.open) closeTeam();
    else if (projectModal.open) closeProject();
    else if (contactModal.open) closeContact();
  });
}

initUI();
