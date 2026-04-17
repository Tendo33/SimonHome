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

function setupLoadingState(windowObj, document) {
  const pageLoading = document.querySelector("#simon-loading");

  windowObj.addEventListener("load", () => {
    if (!pageLoading) {
      return;
    }

    windowObj.setTimeout(() => {
      pageLoading.style.opacity = "0";
      pageLoading.addEventListener(
        "transitionend",
        () => {
          pageLoading.classList.add("hidden");
        },
        { once: true }
      );
    }, 100);
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
  setupLoadingState(windowObj, documentObj);

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
}
