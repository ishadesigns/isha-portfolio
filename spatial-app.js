(() => {
  "use strict";
  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [
    ...scope.querySelectorAll(selector),
  ];
  const windows = new Map(
    $$("[data-window]").map((panel) => [panel.dataset.window, panel]),
  );
  const base = new URL(document.body.dataset.base, document.baseURI);
  const caseNames = {
    bmw: "BMW × Apple Vision Pro",
    chemistry: "Chemistry on Myntra",
    bloom: "Bloom",
  };
  const caseCache = new Map();
  let activeView = "home";
  let activeCase = "";
  let requestId = 0;
  let routedURL = "";
  const windowNames = {
    home: "Welcome",
    work: "Selected work",
    about: "About Isha",
    resume: "Résumé",
    playground: "Playground",
    contact: "Let’s connect",
    case: "Case study",
  };
  let toastTimer;
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  let reduceMotion = motionPreference.matches;
  function followMotionPreference() {
    reduceMotion = motionPreference.matches;
    root.classList.toggle("reduce-motion", reduceMotion);
  }
  followMotionPreference();
  motionPreference.addEventListener("change", followMotionPreference);

  function toast(message) {
    clearTimeout(toastTimer);
    const element = $(".space-toast");
    element.textContent = message;
    element.classList.add("visible");
    toastTimer = setTimeout(() => element.classList.remove("visible"), 2600);
  }
  function announce(message) {
    $("#navigation-status").textContent = message;
  }
  function primaryHeading(container, level) {
    const oldHeading = container.querySelector("h1,h2");
    if (!oldHeading || oldHeading.tagName === `H${level}`) return oldHeading;
    const heading = document.createElement(`h${level}`);
    [...oldHeading.attributes].forEach((attribute) =>
      heading.setAttribute(attribute.name, attribute.value),
    );
    heading.append(...oldHeading.childNodes);
    oldHeading.replaceWith(heading);
    return heading;
  }
  function closePlacements(restoreFocus = false) {
    const trigger = document.querySelector(
      '.window-arrange[aria-expanded="true"]',
    );
    $$(".window-placement").forEach((menu) => {
      menu.hidden = true;
    });
    $$(".window-arrange").forEach((button) =>
      button.setAttribute("aria-expanded", "false"),
    );
    if (restoreFocus) trigger?.focus({ preventScroll: true });
  }
  function showWindow(view, { focus = true } = {}) {
    closePlacements();
    activeView = view;
    windows.forEach((panel, id) => {
      panel.hidden = id !== view;
      primaryHeading($(".spatial-scroll", panel), id === view ? 1 : 2);
    });
    primaryHeading($(".space-idle"), view === "idle" ? 1 : 2);
    $$("[data-home-orbit]").forEach((el) => {
      el.hidden = view !== "home";
    });
    $(".space-idle").hidden = view !== "idle";
    root.dataset.view = view;
    $$("[data-app]").forEach((link) => {
      const selected = link.dataset.app === (view === "case" ? "work" : view);
      if (selected) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.title =
      view === "home"
        ? "Isha"
        : `${view === "case" ? windowNames.case : view === "idle" ? "Your space" : windowNames[view]} — Isha`;
    if (focus && windows.has(view)) {
      const content = $(".spatial-scroll", windows.get(view));
      content.scrollTop = 0;
      if (innerHeight <= 540) window.scrollTo(0, 0);
      content.focus({ preventScroll: true });
      if (innerHeight <= 540)
        windows
          .get(view)
          .scrollIntoView({ block: "start", behavior: "instant" });
      announce(
        `${view === "case" ? windowNames.case : windowNames[view]} window opened.`,
      );
    } else if (focus && view === "idle") {
      $(".space-idle a").focus({ preventScroll: true });
      announce("Welcome window closed. The navigation dock is available.");
    }
  }
  function updateHash(hash) {
    if (location.hash !== hash) history.pushState({ spatial: hash }, "", hash);
    routedURL = location.href;
  }
  function openWindow(view, push = true, focus = true) {
    if (!windows.has(view) && view !== "idle") view = "home";
    requestId++;
    activeCase = "";
    if (push) updateHash(view === "idle" ? "#space" : `#${view}`);
    showWindow(view, { focus });
  }
  function normalizeArticle(article, pageURL) {
    $$("[src]", article).forEach((el) =>
      el.setAttribute("src", new URL(el.getAttribute("src"), pageURL).href),
    );
    $$("a[href]", article).forEach((el) =>
      el.setAttribute("href", new URL(el.getAttribute("href"), pageURL).href),
    );
    $$("[data-src]", article).forEach(
      (el) => (el.dataset.src = new URL(el.dataset.src, pageURL).href),
    );
    $(".back-link", article)?.setAttribute("data-open", "work");
    return article.outerHTML;
  }
  const seededArticle = $(".panel-case .case-article");
  if (seededArticle && caseNames[document.body.dataset.initialCase])
    caseCache.set(
      document.body.dataset.initialCase,
      normalizeArticle(seededArticle, location.href),
    );

  function animateLaunch(panel, source) {
    if (reduceMotion || !source) return;
    panel.getAnimations().forEach((animation) => animation.cancel());
    const target = panel.getBoundingClientRect();
    const dx = Math.max(
      -innerWidth * 0.4,
      Math.min(
        innerWidth * 0.4,
        source.x + source.width / 2 - target.x - target.width / 2,
      ),
    );
    const dy = Math.max(
      -innerHeight * 0.4,
      Math.min(
        innerHeight * 0.4,
        source.y + source.height / 2 - target.y - target.height / 2,
      ),
    );
    const baseTransform = innerHeight <= 540 ? "" : "translate(-50%, -50%)";
    panel.animate(
      [
        {
          transform: `${baseTransform} translate(${dx}px,${dy}px) scale(.72) rotateY(-5deg)`,
          opacity: 0,
          filter: "blur(5px)",
        },
        {
          transform: `${baseTransform} translate(0,0) scale(1) rotateY(0)`,
          opacity: 1,
          filter: "blur(0)",
        },
      ],
      { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" },
    );
  }
  async function openCase(slug, push = true, focus = true, source = null) {
    if (!caseNames[slug]) return openWindow("work", push, focus);
    const id = ++requestId;
    activeCase = slug;
    const casePanel = windows.get("case");
    const content = $(".spatial-scroll", casePanel);
    windowNames.case = caseNames[slug];
    $(".window-grip", casePanel).setAttribute(
      "aria-label",
      `Move ${caseNames[slug]} window`,
    );
    $(".window-arrange", casePanel).setAttribute(
      "aria-label",
      `Arrange ${caseNames[slug]} window`,
    );
    $(".window-dismiss", casePanel).setAttribute(
      "aria-label",
      `Close ${caseNames[slug]} window`,
    );
    $(".window-expand", casePanel).setAttribute(
      "aria-label",
      `${casePanel.classList.contains("is-expanded") ? "Restore" : "Expand"} ${caseNames[slug]} window`,
    );
    $(".window-handle", casePanel).setAttribute(
      "aria-label",
      `Move ${caseNames[slug]} window using handle`,
    );
    $(".window-placement", casePanel).setAttribute(
      "aria-label",
      `Position ${caseNames[slug]} window`,
    );
    $$("[data-move]", casePanel).forEach((button) =>
      button.setAttribute(
        "aria-label",
        button.dataset.move === "center"
          ? `Center ${caseNames[slug]} window`
          : `Move ${caseNames[slug]} window ${button.dataset.move}`,
      ),
    );
    content.setAttribute("aria-label", `${caseNames[slug]} content`);
    content.setAttribute("aria-busy", "true");
    const pageURL = new URL(`projects/${slug}/`, base);
    $(".window-grip>span", casePanel).textContent = caseNames[slug];
    casePanel.setAttribute("aria-label", `${caseNames[slug]} window`);
    if (push) updateHash(`#case-${slug}`);
    showWindow("case", { focus });
    animateLaunch(casePanel, source);
    content.innerHTML =
      '<div class="case-loading"><p>Opening case study…</p></div>';
    content.scrollTop = 0;
    try {
      if (!caseCache.has(slug)) {
        const response = await fetch(pageURL.href);
        if (!response.ok) throw new Error("Case study unavailable");
        const doc = new DOMParser().parseFromString(
          await response.text(),
          "text/html",
        );
        const article = $(".case-article", doc);
        if (!article) throw new Error("Missing case study");
        caseCache.set(slug, normalizeArticle(article, pageURL));
      }
      if (id !== requestId || activeView !== "case") return;
      content.innerHTML = caseCache.get(slug);
      content.scrollTop = 0;
      content.setAttribute("aria-busy", "false");
      const heading = primaryHeading(content, 1);
      if (focus && heading) {
        heading.tabIndex = -1;
        if (innerHeight <= 540) window.scrollTo(0, 0);
        heading.focus({ preventScroll: innerHeight > 540 });
        announce(`${caseNames[slug]} case study loaded.`);
      }
    } catch {
      if (id !== requestId || activeView !== "case") return;
      content.setAttribute("aria-busy", "false");
      announce(
        `${caseNames[slug]} could not load. A direct page link is available.`,
      );
      content.innerHTML = `<div class="case-error"><h2>Let’s take another look.</h2><p>The story couldn’t load. Try opening its direct page.</p><a class="space-button" href="${pageURL.href}">Open full case study ↗</a></div>`;
    }
  }
  function route(focus = true) {
    if (routedURL === location.href) return;
    routedURL = location.href;
    const hash = location.hash.slice(1);
    if (hash.startsWith("case-")) return openCase(hash.slice(5), false, focus);
    if (!hash && document.body.dataset.initialCase)
      return openCase(document.body.dataset.initialCase, false, focus);
    openWindow(
      hash === "space"
        ? "idle"
        : windows.has(hash) && hash !== "case"
          ? hash
          : "home",
      false,
      focus,
    );
  }
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-open], a[data-case]");
    if (
      !link ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    e.preventDefault();
    if (link.dataset.case)
      openCase(link.dataset.case, true, true, link.getBoundingClientRect());
    else openWindow(link.dataset.open);
  });
  // Native links still work without this enhancement, including direct case-study pages.
  root.classList.add("spatial-ready");
  route(false);
  window.addEventListener("popstate", () => route());
  window.addEventListener("hashchange", () => route());
  $(".skip-link").addEventListener("click", (e) => {
    e.preventDefault();
    const target = windows.has(activeView)
      ? $(".spatial-scroll", windows.get(activeView))
      : $(".space-idle a");
    target?.focus({ preventScroll: innerHeight > 540 });
    if (innerHeight <= 540)
      target?.scrollIntoView({ block: "start", behavior: "instant" });
  });

  function dismissWindow() {
    openWindow(
      activeView === "home" ? "idle" : activeView === "case" ? "work" : "home",
    );
  }
  $$(".window-dismiss").forEach((button) =>
    button.addEventListener("click", dismissWindow),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if ($(".artifact-dialog[open]")) return;
      e.preventDefault();
      if ($('.window-arrange[aria-expanded="true"]')) {
        closePlacements(true);
        return;
      }
      if (activeView === "idle") openWindow("home");
      else dismissWindow();
    }
  });
  $$(".window-arrange").forEach((button) =>
    button.addEventListener("click", () => {
      const opening = button.getAttribute("aria-expanded") !== "true";
      closePlacements();
      if (opening) {
        button.setAttribute("aria-expanded", "true");
        const menu = document.getElementById(
          button.getAttribute("aria-controls"),
        );
        menu.hidden = false;
        $("button", menu).focus({ preventScroll: true });
      }
    }),
  );
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".window-arrange,.window-placement"))
      closePlacements();
  });
  $$(".window-expand").forEach((button) =>
    button.addEventListener("click", () => {
      const panel = button.closest("[data-window]");
      const expanded = panel.classList.toggle("is-expanded");
      panel.style.setProperty("--drag-x", "0px");
      panel.style.setProperty("--drag-y", "0px");
      button.setAttribute("aria-pressed", String(expanded));
      button.setAttribute(
        "aria-label",
        `${expanded ? "Restore" : "Expand"} ${windowNames[panel.dataset.window]} window`,
      );
    }),
  );
  function recenter() {
    windows.forEach((panel) => {
      panel.style.setProperty("--drag-x", "0px");
      panel.style.setProperty("--drag-y", "0px");
      panel.classList.remove("is-expanded");
      const expand = $(".window-expand", panel);
      expand.setAttribute("aria-pressed", "false");
      expand.setAttribute(
        "aria-label",
        `Expand ${windowNames[panel.dataset.window]} window`,
      );
    });
    toast("Windows recentered");
  }
  $(".space-recenter").addEventListener("click", recenter);

  // Drag only the title or grab handle: scrolling and selecting case-study text stay natural.
  const panelPositions = (panel) => ({
    x: parseFloat(panel.style.getPropertyValue("--drag-x")) || 0,
    y: parseFloat(panel.style.getPropertyValue("--drag-y")) || 0,
  });
  function constrainMove(panel, x, y, origin, rect) {
    const safeTop =
        parseFloat(root.style.getPropertyValue("--space-top")) || 78,
      safeBottom =
        innerHeight -
        (parseFloat(root.style.getPropertyValue("--space-bottom")) || 115);
    const minX = origin.x + 16 - rect.left,
      maxX = origin.x + innerWidth - 16 - rect.right;
    const minY = origin.y + safeTop - rect.top,
      maxY = origin.y + safeBottom - rect.bottom;
    const clamp = (n, a, b) =>
      Math.min(Math.max(n, Math.min(a, b)), Math.max(a, b));
    panel.style.setProperty("--drag-x", `${clamp(x, minX, maxX)}px`);
    panel.style.setProperty("--drag-y", `${clamp(y, minY, maxY)}px`);
  }
  $$("[data-move]").forEach((button) =>
    button.addEventListener("click", () => {
      const panel = button.closest("[data-window]");
      const direction = button.dataset.move;
      if (direction === "center") {
        panel.style.setProperty("--drag-x", "0px");
        panel.style.setProperty("--drag-y", "0px");
      } else {
        const origin = panelPositions(panel);
        const x =
          origin.x +
          (direction === "left" ? -40 : direction === "right" ? 40 : 0);
        const y =
          origin.y + (direction === "up" ? -40 : direction === "down" ? 40 : 0);
        constrainMove(panel, x, y, origin, panel.getBoundingClientRect());
      }
      announce(
        `${windowNames[panel.dataset.window]} window ${direction === "center" ? "centered" : "moved " + direction}.`,
      );
    }),
  );
  $$("[data-drag]").forEach((handle) => {
    const panel = handle.closest("[data-window]");
    let drag = null;
    handle.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || innerWidth <= 780 || innerHeight <= 540) return;
      e.preventDefault();
      drag = {
        pointer: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        origin: panelPositions(panel),
        rect: panel.getBoundingClientRect(),
      };
      panel.classList.add("is-dragging");
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", (e) => {
      if (!drag || drag.pointer !== e.pointerId) return;
      constrainMove(
        panel,
        drag.origin.x + e.clientX - drag.startX,
        drag.origin.y + e.clientY - drag.startY,
        drag.origin,
        drag.rect,
      );
    });
    const stopDrag = () => {
      drag = null;
      panel.classList.remove("is-dragging");
    };
    handle.addEventListener("pointerup", stopDrag);
    handle.addEventListener("pointercancel", stopDrag);
    handle.addEventListener("lostpointercapture", stopDrag);
    handle.addEventListener("keydown", (e) => {
      if (
        innerWidth <= 780 ||
        innerHeight <= 540 ||
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
      )
        return;
      e.preventDefault();
      const origin = panelPositions(panel),
        amount = e.shiftKey ? 40 : 16;
      const x =
        origin.x +
        (e.key === "ArrowLeft" ? -amount : e.key === "ArrowRight" ? amount : 0);
      const y =
        origin.y +
        (e.key === "ArrowUp" ? -amount : e.key === "ArrowDown" ? amount : 0);
      constrainMove(panel, x, y, origin, panel.getBoundingClientRect());
    });
  });
  function updateMoveControls() {
    $$("[data-drag]").forEach((handle) => {
      handle.disabled = innerWidth <= 780 || innerHeight <= 540;
    });
  }
  updateMoveControls();
  // Text preferences and wrapping can change navigation height without a viewport resize.
  // Keep the reading window outside those occupied areas.
  function updateAvailableSpace() {
    const header = $(".space-status").getBoundingClientRect();
    const dock = $(".spatial-dock").getBoundingClientRect();
    root.style.setProperty("--space-top", `${Math.ceil(header.height) + 12}px`);
    root.style.setProperty(
      "--space-bottom",
      `${Math.ceil(innerHeight - dock.top) + (innerWidth <= 780 ? 16 : 56)}px`,
    );
  }
  if ("ResizeObserver" in window) {
    const chromeSize = new ResizeObserver(updateAvailableSpace);
    chromeSize.observe($(".space-status"));
    chromeSize.observe($(".spatial-dock"));
  }
  updateAvailableSpace();
  let resizeFrame;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      updateMoveControls();
      updateAvailableSpace();
      windows.forEach((panel) => {
        panel.style.setProperty("--drag-x", "0px");
        panel.style.setProperty("--drag-y", "0px");
      });
    });
  });
  let lookFrame;
  document.addEventListener(
    "pointermove",
    (e) => {
      if (
        reduceMotion ||
        e.pointerType !== "mouse" ||
        innerWidth <= 780 ||
        e.target.closest(".is-dragging")
      )
        return;
      const x = (e.clientX / innerWidth) * 2 - 1,
        y = (e.clientY / innerHeight) * 2 - 1;
      cancelAnimationFrame(lookFrame);
      lookFrame = requestAnimationFrame(() => {
        root.style.setProperty("--look-x", x.toFixed(3));
        root.style.setProperty("--look-y", y.toFixed(3));
      });
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () => {
    cancelAnimationFrame(lookFrame);
    root.style.setProperty("--look-x", "0");
    root.style.setProperty("--look-y", "0");
  });

  const cards = $$(".space-project");
  $$("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      $$("[data-filter]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === button)),
      );
      cards.forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
      });
      $(".space-projects").classList.toggle("filtered", filter !== "all");
      const count = cards.filter((card) => !card.hidden).length;
      $(".filter-status").textContent =
        `Showing ${count} ${filter === "all" ? "" : filter + " "}project${count === 1 ? "" : "s"}`;
    }),
  );
  const lab = $(".spatial-material"),
    pane = $(".material-pane");
  const materials = { sage: "#91b4a2", blue: "#92b5d1", rose: "#d1a1a2" };
  $$("[data-material]").forEach((button) =>
    button.addEventListener("click", () => {
      lab.style.setProperty("--material", materials[button.dataset.material]);
      $$("[data-material]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === button)),
      );
    }),
  );
  lab.addEventListener("pointermove", (e) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const r = lab.getBoundingClientRect();
    pane.style.transform = `rotateY(${((e.clientX - r.left) / r.width - 0.5) * 32}deg) rotateX(${((e.clientY - r.top) / r.height - 0.5) * -24}deg) rotate(-4deg)`;
  });
  lab.addEventListener("pointerleave", () => {
    pane.style.transform = "";
  });
  $("[data-copy-email]").addEventListener("click", async (e) => {
    const email = e.currentTarget.dataset.copyEmail;
    try {
      await navigator.clipboard.writeText(email);
      toast("Email address copied");
    } catch {
      toast("Email: " + email);
    }
  });
})();
