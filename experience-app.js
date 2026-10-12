(() => {
  "use strict";
  const dialog = document.querySelector(".artifact-dialog");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let studio = null,
    index = 0,
    zoom = 1,
    loadId = 0;
  const buttons = (root) => [...root.querySelectorAll("[data-artifact]")];
  const announce = (text) => {
    dialog.querySelector("[data-inspector-status]").textContent = text;
  };
  function applyZoom() {
    const image = dialog.querySelector("[data-inspector-image]");
    image.style.width = `${zoom * 100}%`;
    image.classList.toggle("is-zoomed", zoom > 1);
    dialog.querySelector("[data-zoom-level]").textContent =
      `${Math.round(zoom * 100)}%`;
    dialog
      .querySelector('[data-zoom="out"]')
      .setAttribute("aria-disabled", String(zoom <= 1));
    dialog
      .querySelector('[data-zoom="in"]')
      .setAttribute("aria-disabled", String(zoom >= 3));
  }
  function renderInspector() {
    const items = buttons(studio),
      item = items[index];
    const image = dialog.querySelector("[data-inspector-image]");
    image.src = new URL(item.dataset.src, document.baseURI).href;
    image.alt = item.dataset.alt;
    dialog.querySelector("#artifact-dialog-title").textContent =
      item.querySelector("span").textContent;
    dialog.querySelector("[data-inspector-caption]").textContent =
      item.dataset.caption;
    dialog.querySelector("[data-inspector-count]").textContent =
      `${index + 1} / ${items.length}`;

    zoom = 1;
    applyZoom();
    dialog.querySelector(".inspector-viewport").scrollTo(0, 0);
    announce(`${item.dataset.alt}. Image ${index + 1} of ${items.length}.`);
  }
  async function selectArtifact(root, button) {
    const id = ++loadId;
    const image = root.querySelector("[data-studio-image]");
    root.setAttribute("aria-busy", "true");
    buttons(root).forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
    const preload = new Image();
    preload.src = new URL(button.dataset.src, document.baseURI).href;
    try {
      await preload.decode();
    } catch {}
    if (id !== loadId || !root.isConnected) return;
    image.src = preload.src;
    image.alt = button.dataset.alt;
    root
      .querySelector("[data-inspect]")
      .setAttribute("aria-label", `Inspect image: ${button.dataset.alt}`);
    root.querySelector("[data-artifact-title]").textContent =
      button.querySelector("span").textContent;
    root.querySelector("[data-artifact-caption]").textContent =
      button.dataset.caption;
    root.querySelector("[data-artifact-count]").textContent =
      `${String(Number(button.dataset.artifact) + 1).padStart(2, "0")} / ${String(buttons(root).length).padStart(2, "0")}`;
    root.setAttribute("aria-busy", "false");
    root.querySelector("[data-artifact-status]").textContent =
      `${button.dataset.alt}. ${button.dataset.caption}`;
    if (!reducedMotion.matches)
      image.animate(
        [
          {
            opacity: 0.1,
            transform:
              "perspective(1000px) translateY(20px) rotateY(-8deg) scale(.93)",
          },
          {
            opacity: 1,
            transform: "perspective(1000px) translateY(0) rotateY(0) scale(1)",
          },
        ],
        { duration: 500, easing: "cubic-bezier(.16,1,.3,1)" },
      );
  }
  function focusSection(target) {
    if (!target) return;
    const heading = target.querySelector("h2,h3") || target;
    heading.tabIndex = -1;
    target.scrollIntoView({
      block: "start",
      behavior: reducedMotion.matches ? "instant" : "smooth",
    });
    heading.focus({ preventScroll: true });
  }
  document.addEventListener("click", (event) => {
    const button = event.target.closest(
      "[data-artifact],[data-inspect],[data-read-story],[data-inspector-close],[data-inspector-step],[data-zoom],[data-resume-jump]",
    );
    if (!button) return;
    if (button.hasAttribute("data-artifact"))
      selectArtifact(button.closest("[data-studio]"), button);
    if (button.hasAttribute("data-inspect")) {
      studio = button.closest("[data-studio]");
      index = Number(
        studio.querySelector('[data-artifact][aria-pressed="true"]').dataset
          .artifact,
      );
      renderInspector();
      dialog.showModal();
      dialog.querySelector("[data-inspector-close]").focus();
    }
    if (button.hasAttribute("data-inspector-close")) dialog.close();
    if (button.hasAttribute("data-inspector-step")) {
      index =
        (index +
          Number(button.dataset.inspectorStep) +
          buttons(studio).length) %
        buttons(studio).length;
      renderInspector();
    }
    if (button.hasAttribute("data-zoom")) {
      zoom =
        button.dataset.zoom === "reset"
          ? 1
          : Math.max(
              1,
              Math.min(3, zoom + (button.dataset.zoom === "in" ? 0.5 : -0.5)),
            );
      applyZoom();
      announce(
        `Image zoom ${Math.round(zoom * 100)} percent. Scroll the image to inspect details.`,
      );
    }
    if (button.hasAttribute("data-read-story"))
      focusSection(
        button.closest(".case-article").querySelector(".case-overview"),
      );
    if (button.hasAttribute("data-resume-jump")) {
      event.preventDefault();
      focusSection(document.getElementById(button.dataset.resumeJump));
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  // Focus restores to the image's Inspect button after both Escape and Close.
  dialog.addEventListener("close", () => {
    studio?.querySelector("[data-inspect]")?.focus({ preventScroll: true });
  });
  // Let native controls and the image scroll region keep ordinary keyboard behavior.
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") event.stopPropagation();
  });
})();
