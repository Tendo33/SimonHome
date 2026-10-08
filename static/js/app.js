export function ensureToast(document) {
  let toast = document.getElementById("toast-notification");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-atomic", "true");
    toast.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' +
      "<span></span>";
    document.body.appendChild(toast);
  }

  if (!toast.querySelector("span")) {
    toast.innerHTML += "<span></span>";
  }

  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.setAttribute("aria-atomic", "true");

  return toast;
}

export function showToast(document, message) {
  const toast = ensureToast(document);
  const label = toast.querySelector("span");

  if (label) {
    label.textContent = message;
  }

  toast.classList.add("show");

  if (toast.hideTimeoutId) {
    clearTimeout(toast.hideTimeoutId);
  }

  toast.hideTimeoutId = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);

  return toast;
}

export function createPopupController({
  document,
  dialog,
  panel,
  image,
  closeButton
}) {
  let lastTrigger = null;

  function isActive() {
    return dialog.classList.contains("active");
  }

  function focusDialog() {
    if (typeof dialog.focus === "function") {
      dialog.focus();
    }
  }

  function close() {
    image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    dialog.classList.remove("active");
    panel.classList.remove("active");
    dialog.hidden = true;
    dialog.removeAttribute("tabindex");

    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  }

  function open(imageUrl, trigger) {
    lastTrigger = trigger || document.activeElement;
    image.src = imageUrl;
    dialog.hidden = false;
    dialog.tabIndex = -1;
    dialog.classList.add("active");
    panel.classList.add("active");
    focusDialog();
  }

  function onDialogClick(event) {
    if (event.target === dialog) {
      close();
    }
  }

  function trapFocus(event) {
    if (!isActive() || event.key !== "Tab") {
      return;
    }

    const focusTargets = [dialog, closeButton].filter(Boolean);
    const currentIndex = focusTargets.indexOf(document.activeElement);
    const lastIndex = focusTargets.length - 1;

    event.preventDefault();

    if (event.shiftKey) {
      const nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
      focusTargets[nextIndex].focus();
      return;
    }

    const nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    focusTargets[nextIndex].focus();
  }

  dialog.addEventListener("click", onDialogClick);
  panel.addEventListener("click", (event) => event.stopPropagation());

  if (closeButton) {
    closeButton.addEventListener("click", close);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isActive()) {
      close();
    } else {
      trapFocus(event);
    }
  });

  return { open, close };
}

export function bindActionButtons(root, { onCopyEmail, onPreviewImage }) {
  root.querySelectorAll("[data-copy-email]").forEach((button) => {
    if (button.dataset.boundCopy === "true") {
      return;
    }

    button.dataset.boundCopy = "true";
    button.addEventListener("click", () => {
      onCopyEmail(button.dataset.copyEmail, button);
    });
  });

  root.querySelectorAll("[data-preview-image]").forEach((button) => {
    if (button.dataset.boundPreview === "true") {
      return;
    }

    button.dataset.boundPreview = "true";
    button.addEventListener("click", () => {
      onPreviewImage(button.dataset.previewImage, button);
    });
  });
}

function fallbackCopyText(document, text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(textArea);
  return copied;
}

async function copyEmail(document, navigatorImpl, email) {
  if (!email) {
    return;
  }

  try {
    if (navigatorImpl.clipboard?.writeText) {
      await navigatorImpl.clipboard.writeText(email);
      showToast(document, "Email copied to clipboard!");
      return;
    }

    const copied = fallbackCopyText(document, email);
    showToast(document, copied ? "Email copied to clipboard!" : "Failed to copy email.");
  } catch (error) {
    const copied = fallbackCopyText(document, email);
    showToast(document, copied ? "Email copied to clipboard!" : "Failed to copy email.");
  }
}

function setupProjectCardPress(document) {
  document.querySelectorAll(".projectList").forEach((list) => {
    const getCard = (event) => event.target.closest(".projectItem");

    list.addEventListener("mousedown", (event) => {
      const card = getCard(event);
      if (card) {
        card.classList.add("pressed");
      }
    });

    list.addEventListener("mouseup", (event) => {
      const card = getCard(event);
      if (card) {
        card.classList.remove("pressed");
      }
    });

    list.addEventListener("mouseleave", () => {
      list.querySelector(".projectItem.pressed")?.classList.remove("pressed");
    });

    list.addEventListener(
      "touchstart",
      (event) => {
        const card = getCard(event);
        if (card) {
          card.classList.add("pressed");
        }
      },
      { passive: true }
    );

    list.addEventListener("touchend", (event) => {
      const card = getCard(event);
      if (card) {
        card.classList.remove("pressed");
      }
    });

    list.addEventListener("touchcancel", (event) => {
      const card = getCard(event);
      if (card) {
        card.classList.remove("pressed");
      }
    });
  });
}

function getTheme(windowObj) {
  try {
    const saved = windowObj.localStorage.getItem("themeState");
    if (saved) {
      return saved;
    }
  } catch (error) {
    // Ignore storage access errors.
  }

  if (windowObj.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "Dark";
  }

  return "Light";
}

function saveTheme(windowObj, theme) {
  try {
    windowObj.localStorage.setItem("themeState", theme);
  } catch (error) {
    // Ignore storage access errors.
  }
}

function setupTheme(windowObj, document) {
  const html = document.documentElement;
  const tanChiShe = document.getElementById("tanChiShe");
  const checkbox = document.getElementById("myonoffswitch");
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    html.dataset.theme = theme;
    saveTheme(windowObj, theme);

    if (tanChiShe) {
      tanChiShe.src =
        "https://raw.githubusercontent.com/Tendo33/Tendo33/output/github-snake" +
        (theme === "Dark" ? "-dark" : "") +
        ".svg";
    }

    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "Dark" ? "#0a0a0f" : "#4a7dbd");
    }

    if (checkbox) {
      checkbox.checked = theme !== "Dark";
    }
  }

  applyTheme(getTheme(windowObj));

  checkbox?.addEventListener("change", () => {
    applyTheme(checkbox.checked ? "Light" : "Dark");
  });
}

function setupMobileMenu(windowObj, document) {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const sidebar = document.querySelector(".simon-left");
  const overlay = document.querySelector(".mobile-overlay");

  if (!menuBtn || !sidebar || !overlay) {
    return;
  }

  function syncAccessibility() {
    if (windowObj.innerWidth > 800) {
      sidebar.removeAttribute("aria-hidden");
      overlay.setAttribute("aria-hidden", "true");
      return;
    }

    sidebar.setAttribute("aria-hidden", sidebar.classList.contains("active") ? "false" : "true");
    overlay.setAttribute("aria-hidden", overlay.classList.contains("active") ? "false" : "true");
  }

  function openMenu() {
    menuBtn.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    syncAccessibility();
  }

  function closeMenu() {
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    syncAccessibility();
  }

  menuBtn.addEventListener("click", () => {
    if (sidebar.classList.contains("active")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar.classList.contains("active")) {
      closeMenu();
    }
  });

  windowObj.addEventListener("resize", () => {
    if (windowObj.innerWidth > 800 && sidebar.classList.contains("active")) {
      closeMenu();
      return;
    }

    syncAccessibility();
  });

  syncAccessibility();
}

function updateCopyrightYear(document) {
  const yearEl = document.getElementById("copyright-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

/* Hide the loading dot once the page and its fonts are ready, instead of
   waiting for window "load" (which also waits on GitHub/skillicons images). */
function setupLoadingState(windowObj, document) {
  const pageLoading = document.querySelector("#simon-loading");

  return new Promise((resolve) => {
    if (!pageLoading) {
      resolve();
      return;
    }

    let done = false;
    const hide = () => {
      if (done) {
        return;
      }

      done = true;
      pageLoading.style.opacity = "0";
      pageLoading.addEventListener("transitionend", () => pageLoading.classList.add("hidden"), { once: true });
      // Fallback in case transitionend never fires (e.g. reduced motion).
      windowObj.setTimeout(() => pageLoading.classList.add("hidden"), 700);
      resolve();
    };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fontsReady, new Promise((r) => windowObj.setTimeout(r, 1200))]).then(() =>
      windowObj.setTimeout(hide, 80)
    );
  });
}

function prefersReducedMotion(windowObj) {
  return Boolean(windowObj.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
}

function hasFinePointer(windowObj) {
  return Boolean(windowObj.matchMedia?.("(hover: hover) and (pointer: fine)").matches);
}

/* ===== Card spotlight: feed pointer position to every card in the hovered list ===== */
function setupCardSpotlight(windowObj, document) {
  if (!hasFinePointer(windowObj)) {
    return;
  }

  // Only the card under the pointer is updated, so each frame restyles one element.
  document.querySelectorAll(".projectItem").forEach((card) => {
    let frame = 0;
    let lastEvent = null;

    const paint = () => {
      frame = 0;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${lastEvent.clientX - rect.left}px`);
      card.style.setProperty("--my", `${lastEvent.clientY - rect.top}px`);
    };

    card.addEventListener("pointermove", (event) => {
      lastEvent = event;
      if (!frame) {
        frame = windowObj.requestAnimationFrame(paint);
      }
    });
  });
}

/* ===== Background parallax: the blurred backdrop drifts with the pointer ===== */
function setupParallax(windowObj, document) {
  if (!hasFinePointer(windowObj) || prefersReducedMotion(windowObj)) {
    return;
  }

  // Write `translate` straight onto the layer: a custom property on <html>
  // would restyle the whole document on every pointer move.
  const backdrop = document.querySelector(".simon-filter");
  let frame = 0;
  let x = 0;
  let y = 0;

  windowObj.addEventListener(
    "pointermove",
    (event) => {
      x = (event.clientX / windowObj.innerWidth - 0.5) * -24;
      y = (event.clientY / windowObj.innerHeight - 0.5) * -16;

      if (!frame) {
        frame = windowObj.requestAnimationFrame(() => {
          frame = 0;
          if (backdrop) {
            backdrop.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
          }
        });
      }
    },
    { passive: true }
  );
}

/* ===== Sidebar tags pop in one after another (index drives the CSS delay) ===== */
function setupSidebarStagger(document) {
  document.querySelectorAll(".left-tag-item").forEach((tag, index) => {
    tag.style.setProperty("--i", String(index));
  });
}

/* ===== Sections rise in as they scroll into view ===== */
function setupScrollReveal(windowObj, document) {
  const sections = document.querySelectorAll(".scroll-rise");

  sections.forEach((section) => {
    section.querySelectorAll(".projectItem").forEach((card, index) => {
      card.style.setProperty("--i", String(index));
    });
  });

  if (!("IntersectionObserver" in windowObj) || prefersReducedMotion(windowObj)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new windowObj.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ===== Typewriter: text stays in the DOM (and layout) the whole time; chars are revealed one by one ===== */
export function prepareTypewriter(document, element) {
  const chars = [];
  const walker = document.createTreeWalker(element, 4 /* NodeFilter.SHOW_TEXT */);
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    const text = node.textContent;
    if (!text.trim()) {
      return;
    }

    const fragment = document.createDocumentFragment();
    // Keep leading/trailing whitespace as plain text so it is not "typed".
    const [, lead, body, trail] = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
    fragment.append(lead);

    Array.from(body).forEach((char) => {
      const span = document.createElement("span");
      span.className = "tw-char tw-pending";
      span.textContent = char;
      fragment.append(span);
      chars.push(span);
    });

    fragment.append(trail);
    node.replaceWith(fragment);
  });

  return chars;
}

function setupTypewriter(windowObj, document, startAfter) {
  const lines = Array.from(document.querySelectorAll("[data-typewriter]"));

  if (!lines.length || prefersReducedMotion(windowObj)) {
    return;
  }

  const queue = lines.map((line) => ({ line, chars: prepareTypewriter(document, line) }));
  const caret = document.createElement("span");
  caret.className = "tw-caret";
  caret.setAttribute("aria-hidden", "true");

  startAfter.then(() => {
    let lineIndex = 0;
    let charIndex = 0;

    const step = () => {
      const current = queue[lineIndex];

      if (!current) {
        // Leave the caret blinking at the end of the last line.
        return;
      }

      const char = current.chars[charIndex];

      if (!char) {
        lineIndex += 1;
        charIndex = 0;
        windowObj.setTimeout(step, 260);
        return;
      }

      char.classList.remove("tw-pending");
      char.after(caret);
      charIndex += 1;
      windowObj.setTimeout(step, char.textContent === " " ? 30 : 55);
    };

    windowObj.setTimeout(step, 350);
  });
}

/* ===== Launcher (⌘K / "/") ===== */

function describeHref(href) {
  try {
    const url = new URL(href);
    return url.hostname === "github.com" ? url.pathname.replace(/^\/|\/$/g, "") : url.hostname;
  } catch (error) {
    return "";
  }
}

export function collectLauncherItems(root) {
  return Array.from(root.querySelectorAll(".projectList")).flatMap((list) => {
    const group = list.closest("section")?.querySelector(".title span")?.textContent.trim() ?? "";

    return Array.from(list.querySelectorAll("a.projectItem")).map((card) => ({
      group,
      title: card.querySelector("h3")?.textContent.trim() ?? "",
      desc: card.querySelector("p")?.textContent.trim() ?? "",
      host: describeHref(card.getAttribute("href")),
      href: card.getAttribute("href"),
      icon: card.querySelector("img")?.getAttribute("src") ?? ""
    }));
  });
}

export function filterLauncherItems(items, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (!terms.length) {
    return items;
  }

  const rank = (item) => {
    const title = item.title.toLowerCase();
    if (title.startsWith(terms[0])) return 0;
    if (title.includes(terms[0])) return 1;
    return 2;
  };

  return items
    .filter((item) => {
      const haystack = `${item.title} ${item.desc} ${item.host} ${item.group}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    })
    .map((item, index) => ({ item, index, score: rank(item) }))
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map(({ item }) => item);
}

function isEditableTarget(target) {
  return Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
}

function setupLauncher(windowObj, document) {
  const dialog = document.getElementById("launcher");
  const triggers = document.querySelectorAll(".launcher-trigger");

  if (!dialog || typeof dialog.showModal !== "function") {
    triggers.forEach((trigger) => (trigger.hidden = true));
    document.querySelector(".footer-hint")?.setAttribute("hidden", "");
    return;
  }

  const input = dialog.querySelector(".launcher-input");
  const list = dialog.querySelector(".launcher-results");
  const items = collectLauncherItems(document);
  let results = items;
  let activeIndex = 0;

  function setActive(index) {
    const options = list.querySelectorAll(".launcher-option");
    if (!options.length) {
      input.removeAttribute("aria-activedescendant");
      return;
    }

    activeIndex = (index + options.length) % options.length;
    options.forEach((option, i) => option.setAttribute("aria-selected", String(i === activeIndex)));

    const active = options[activeIndex];
    input.setAttribute("aria-activedescendant", active.id);
    active.scrollIntoView?.({ block: "nearest" });
  }

  function render() {
    results = filterLauncherItems(items, input.value);
    list.replaceChildren();

    if (!results.length) {
      const empty = document.createElement("li");
      empty.className = "launcher-empty";
      empty.setAttribute("role", "presentation");
      empty.textContent = `没找到「${input.value.trim()}」，可能还在脑子里没做出来 🤔`;
      list.append(empty);
      setActive(0);
      return;
    }

    let currentGroup = null;
    results.forEach((item, index) => {
      if (item.group !== currentGroup) {
        currentGroup = item.group;
        const heading = document.createElement("li");
        heading.className = "launcher-group";
        heading.setAttribute("role", "presentation");
        heading.textContent = item.group;
        list.append(heading);
      }

      const option = document.createElement("li");
      option.className = "launcher-option";
      option.id = `launcher-option-${index}`;
      option.setAttribute("role", "option");
      option.dataset.index = String(index);

      const icon = document.createElement("img");
      icon.src = item.icon;
      icon.alt = "";

      const text = document.createElement("span");
      text.className = "launcher-option-text";
      const title = document.createElement("span");
      title.className = "launcher-option-title";
      title.textContent = item.title;
      const desc = document.createElement("span");
      desc.className = "launcher-option-desc";
      desc.textContent = item.desc;
      text.append(title, desc);

      const host = document.createElement("span");
      host.className = "launcher-option-host";
      host.textContent = item.host;

      option.append(icon, text, host);
      list.append(option);
    });

    setActive(0);
  }

  function openItem(item) {
    if (!item) {
      return;
    }

    windowObj.open(item.href, "_blank", "noopener,noreferrer");
    dialog.close();
  }

  function open() {
    if (dialog.open) {
      return;
    }

    input.value = "";
    render();
    dialog.showModal();
    input.focus();
  }

  input.addEventListener("input", render);

  input.addEventListener("keydown", (event) => {
    if (event.isComposing) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(activeIndex - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      openItem(results[activeIndex]);
    }
  });

  list.addEventListener("click", (event) => {
    const option = event.target.closest(".launcher-option");
    if (option) {
      openItem(results[Number(option.dataset.index)]);
    }
  });

  list.addEventListener("mousemove", (event) => {
    const option = event.target.closest(".launcher-option");
    if (option && Number(option.dataset.index) !== activeIndex) {
      setActive(Number(option.dataset.index));
    }
  });

  // Clicking the backdrop lands on the <dialog> element itself.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  triggers.forEach((trigger) => trigger.addEventListener("click", open));

  document.addEventListener("keydown", (event) => {
    if (document.querySelector(".tc.active")) {
      return;
    }

    const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
    const isSlash = event.key === "/" && !event.metaKey && !event.ctrlKey && !isEditableTarget(event.target);

    if (isShortcut) {
      event.preventDefault();
      dialog.open ? dialog.close() : open();
    } else if (isSlash && !dialog.open) {
      event.preventDefault();
      open();
    }
  });
}

export async function initHomePage({
  windowObj = window,
  documentObj = document,
  navigatorImpl = window.navigator
} = {}) {
  updateCopyrightYear(documentObj);
  setupTheme(windowObj, documentObj);
  setupMobileMenu(windowObj, documentObj);
  const loaded = setupLoadingState(windowObj, documentObj);
  setupSidebarStagger(documentObj);
  setupScrollReveal(windowObj, documentObj);
  setupTypewriter(windowObj, documentObj, loaded);

  const popup = createPopupController({
    document: documentObj,
    dialog: documentObj.querySelector(".tc"),
    panel: documentObj.querySelector(".tc-main"),
    image: documentObj.querySelector(".tc-img"),
    closeButton: documentObj.querySelector(".tc-close")
  });

  bindActionButtons(documentObj, {
    onCopyEmail: (email) => copyEmail(documentObj, navigatorImpl, email),
    onPreviewImage: (imageUrl, trigger) => popup.open(imageUrl, trigger)
  });

  setupProjectCardPress(documentObj);
  setupCardSpotlight(windowObj, documentObj);
  setupParallax(windowObj, documentObj);
  setupLauncher(windowObj, documentObj);
}
