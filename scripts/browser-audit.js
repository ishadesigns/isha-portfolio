// This script is copied only into a locally instrumented dist, never the production build.
(() => {
  if (new URLSearchParams(location.search).get("audit") !== "1") return;
  const params = new URLSearchParams(location.search);
  if (params.get("text") === "200") {
    const textScale = document.createElement("style");
    textScale.textContent = "html{font-size:200%}";
    document.head.append(textScale);
  }
  if (params.get("spacing") === "1") {
    const spacing = document.createElement("style");
    spacing.textContent =
      "*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}";
    document.head.append(spacing);
  }
  const contrastMode = params.get("contrast");
  if (contrastMode === "dark" || contrastMode === "light") {
    const backdrop = contrastMode === "dark" ? "#000" : "#fff";
    const style = document.createElement("style");
    style.textContent = `.environment-room,.environment-vignette{display:none!important}.spatial-environment{background:${backdrop}!important}`;
    document.head.append(style);
  }
  const output = document.createElement("script");
  output.type = "application/json";
  output.id = "audit-results";
  output.dataset.status = "pending";
  document.body.append(output);
  let timer,
    running = false;
  async function audit() {
    if (running) {
      schedule();
      return;
    }
    running = true;
    output.dataset.status = "running";
    try {
      await document.fonts.ready;
      await Promise.all(
        document
          .getAnimations()
          .filter(
            (animation) =>
              animation.effect?.getComputedTiming().iterations !== Infinity,
          )
          .map((animation) => animation.finished.catch(() => {})),
      );
      const result = await axe.run(document, {
        runOnly: {
          type: "tag",
          values: [
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "wcag22aa",
            "best-practice",
          ],
        },
      });
      const summarize = (rule) => ({
        id: rule.id,
        impact: rule.impact,
        help: rule.help,
        nodes: rule.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
          html: node.html,
          checks: [...node.any, ...node.all, ...node.none].map((check) => ({
            id: check.id,
            message: check.message,
            data: check.data,
          })),
        })),
      });
      output.textContent = JSON.stringify({
        axeVersion: result.testEngine.version,
        contrastMode: contrastMode || "room",
        view: document.documentElement.dataset.view,
        viewport: { width: innerWidth, height: innerHeight },
        violations: result.violations.map(summarize),
        incomplete: result.incomplete.map(summarize),
        passedRuleCount: result.passes.length,
      });
      output.dataset.auditView = document.documentElement.dataset.view;
      output.dataset.status = "complete";
    } catch (error) {
      output.textContent = JSON.stringify({ error: String(error) });
      output.dataset.status = "error";
    } finally {
      running = false;
    }
  }
  function schedule() {
    clearTimeout(timer);
    output.dataset.status = "pending";
    timer = setTimeout(audit, 800);
  }
  new MutationObserver(schedule).observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: [
      "hidden",
      "aria-busy",
      "aria-pressed",
      "aria-expanded",
      "open",
      "data-view",
    ],
  });
  window.addEventListener("resize", schedule);
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
})();
