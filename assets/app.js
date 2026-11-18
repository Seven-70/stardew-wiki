(function () {
  var PAGES = [
    { id: "start",  num: "01", file: "入门与基础.html",     title: "入门与基础",   desc: "农场类型 · 操作 · 体力 · 时间" },
    { id: "crops",  num: "02", file: "种植与作物.html",     title: "种植与作物",   desc: "作物表 · 肥料 · 洒水器 · 温室" },
    { id: "fish",   num: "03", file: "钓鱼.html",           title: "钓鱼",         desc: "钓法 · 鱼竿 · 鱼饵 · 传说鱼" },
    { id: "mine",   num: "04", file: "矿洞与战斗.html",     title: "矿洞与战斗",   desc: "矿井 · 骷髅洞穴 · 武器 · 戒指" },
    { id: "cc",     num: "05", file: "社区中心与献祭.html", title: "社区中心与献祭", desc: "六大房间 · 奖励 · Joja 路线" },
    { id: "npc",    num: "06", file: "村民与好感.html",     title: "村民与好感",   desc: "好感机制 · 生日 · 喜好 · 结婚" },
    { id: "build",  num: "07", file: "建造与农场.html",     title: "建造与农场",   desc: "罗宾建筑 · 房屋 · 工具 · 动物" },
    { id: "cook",   num: "08", file: "烹饪与制作.html",     title: "烹饪与制作",   desc: "料理 · 工匠设备 · 常用配方" },
    { id: "fest",   num: "09", file: "节日与活动.html",     title: "节日与活动",   desc: "四季节日 · 1.6 新节日" },
    { id: "island", num: "10", file: "姜岛.html",           title: "姜岛",         desc: "解锁 · 金核桃 · 火山地牢" },
    { id: "v16",    num: "11", file: "新版内容.html",       title: "1.6 新内容",   desc: "精通 · 书籍 · 浣熊 · 饰品" },
    { id: "sys",    num: "12", file: "系统与数值.html",     title: "系统与数值",   desc: "生命 · 能量 · 时间 · 技能" },
    { id: "shop",   num: "13", file: "商店与周历.html",     title: "商店与周历",   desc: "周轮换 · 商人 · 电视" },
    { id: "quest",  num: "14", file: "主线任务.html",       title: "主线任务",     desc: "剧情任务链 · 55 条速查" },
    { id: "faq",    num: "15", file: "常见问题.html",       title: "常见问题",     desc: "高频疑问集中解答" }
  ];

  var root = document.body.getAttribute("data-root") || "";
  var cur = document.body.getAttribute("data-page") || "";

  /* ---------- 侧栏导航 ---------- */
  var nav = document.getElementById("sitenav");
  if (nav) {
    var html = "";
    for (var i = 0; i < PAGES.length; i++) {
      var p = PAGES[i];
      html += '<a class="' + (p.id === cur ? "on" : "") + '" href="' + root + "pages/" + p.file + '">' +
        '<span class="num">' + p.num + "</span><span>" + p.title + "</span></a>";
    }
    nav.innerHTML = html;
  }

  /* ---------- 本页目录 ---------- */
  var toc = document.getElementById("toc");
  var heads = document.querySelectorAll("main h2");
  if (toc && heads.length) {
    var th = "";
    for (var j = 0; j < heads.length; j++) {
      var h = heads[j];
      if (!h.id) h.id = "sec-" + (j + 1);
      th += '<a href="#' + h.id + '">' + h.textContent + "</a>";
    }
    toc.innerHTML = th;
    var links = toc.querySelectorAll("a");
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          for (var k = 0; k < links.length; k++) {
            links[k].classList.toggle("on", links[k].getAttribute("href") === "#" + e.target.id);
          }
        }
      });
    }, { rootMargin: "-80px 0px -70% 0px" });
    for (var m = 0; m < heads.length; m++) obs.observe(heads[m]);
  }

  /* ---------- 搜索 ---------- */
  var q = document.getElementById("q");
  var clear = document.getElementById("clear");
  var hit = document.getElementById("hit");
  var total = 0;
  var items = [];
  if (q) {
    items = [].slice.call(document.querySelectorAll("[data-s]"));
    total = items.length;
    var blocks = [].slice.call(document.querySelectorAll("section.blk"));
    var empty = document.getElementById("empty");
    if (!empty) {
      empty = document.createElement("div");
      empty.id = "empty";
      empty.className = "empty";
      empty.textContent = "没有匹配的条目，换个关键词试试。";
      var anchor = document.querySelector("main .phead, main .hero") || document.querySelector("main");
      anchor.parentNode.insertBefore(empty, anchor.nextSibling);
    }

    var apply = function () {
      var raw = q.value.trim().toLowerCase();
      var kw = raw.split(/\s+/).filter(Boolean);
      var shown = 0;
      items.forEach(function (el) {
        var t = (el.textContent + " " + (el.getAttribute("data-s") || "")).toLowerCase();
        var ok = kw.every(function (w) { return t.indexOf(w) !== -1; });
        el.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      blocks.forEach(function (b) {
        var inner = b.querySelectorAll("[data-s]");
        if (!inner.length) return;
        var any = [].some.call(inner, function (x) { return x.style.display !== "none"; });
        b.style.display = any ? "" : "none";
      });
      if (hit) hit.textContent = shown;
      if (clear) clear.style.display = raw ? "block" : "none";
      if (empty) empty.style.display = (shown === 0 && total > 0) ? "block" : "none";
    };

    q.addEventListener("input", apply);
    if (clear) clear.addEventListener("click", function () { q.value = ""; apply(); q.focus(); });
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); q.focus(); q.select(); }
      if (e.key === "/" && document.activeElement !== q) { e.preventDefault(); q.focus(); }
      if (e.key === "Escape" && document.activeElement === q) { q.value = ""; apply(); q.blur(); }
    });
    apply();
  }

  /* ---------- 移动端菜单 ---------- */
  var mb = document.getElementById("menubtn");
  var side = document.querySelector("aside.side");
  if (mb && side) {
    mb.addEventListener("click", function () {
      side.classList.toggle("open");
      mb.setAttribute("aria-expanded", side.classList.contains("open") ? "true" : "false");
    });
  }

  /* ---------- 返回顶部 ---------- */
  var top = document.getElementById("top");
  if (top) {
    window.addEventListener("scroll", function () {
      top.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }
})();
