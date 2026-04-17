import { readFileSync } from "node:fs";
import { existsSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  bindActionButtons,
  createPopupController,
  ensureToast
} from "../static/js/app.js";

function createShell() {
  document.body.innerHTML = `
    <section>
      <div class="projectList">
        <a class="projectItem site-card" href="https://example.com/site">Site</a>
      </div>
      <div class="projectList">
        <a class="projectItem project-card" href="https://example.com/project">Project</a>
      </div>
      <div class="projectList">
        <a class="projectItem project-card" href="https://example.com/plugin">Plugin</a>
      </div>
    </section>
    <button type="button" data-copy-email="hello@example.com">copy</button>
    <button type="button" data-preview-image="/preview.png">preview</button>
    <div class="tc" role="dialog" aria-modal="true" aria-label="Image preview" hidden>
      <div class="tc-main">
        <button type="button" class="tc-close">Close</button>
        <img
          class="tc-img"
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
          alt="Preview image"
        />
      </div>
    </div>
  `;
}

function readIndexHtml() {
  return readFileSync(path.join(process.cwd(), "index.html"), "utf8");
}

function parseIndexDocument() {
  return new DOMParser().parseFromString(readIndexHtml(), "text/html");
}

function withHiddenHomeContent(run) {
  const contentPath = path.join(process.cwd(), "static/data/home-content.json");
  const backupPath = `${contentPath}.bak`;
  const hasContentFile = existsSync(contentPath);

  if (hasContentFile) {
    renameSync(contentPath, backupPath);
  }

  try {
    return run();
  } finally {
    if (hasContentFile && existsSync(backupPath)) {
      renameSync(backupPath, contentPath);
    }
  }
}

describe("homepage smoke behavior", () => {
  beforeEach(() => {
    createShell();
  });

  it("keeps sites, projects, and plugins cards directly in index.html", () => {
    const indexDocument = parseIndexDocument();

    expect(indexDocument.querySelectorAll("#sites-list .projectItem.site-card")).not.toHaveLength(0);
    expect(indexDocument.querySelectorAll("#projects-list .projectItem.project-card")).not.toHaveLength(0);
    expect(indexDocument.querySelectorAll("#plugins-list .projectItem.project-card")).not.toHaveLength(0);
    expect(indexDocument.querySelector("#sites-list h3")?.textContent).toBe("Simon's Blog");
    expect(indexDocument.querySelector("#projects-list h3")?.textContent).toBe("Markio");
    expect(indexDocument.querySelector("#plugins-list h3")?.textContent).toBe("zhihu2md");
  });

  it("creates a polite live-region toast container", () => {
    const toast = ensureToast(document);

    expect(toast.id).toBe("toast-notification");
    expect(toast.getAttribute("role")).toBe("status");
    expect(toast.getAttribute("aria-live")).toBe("polite");
    expect(toast.querySelector("span")?.textContent).toBe("");
  });

  it("opens and closes the image popup while restoring focus", () => {
    const trigger = document.querySelector("[data-preview-image]");
    const dialog = document.querySelector(".tc");
    const popup = createPopupController({
      document,
      dialog,
      closeButton: document.querySelector(".tc-close"),
      image: document.querySelector(".tc-img"),
      panel: document.querySelector(".tc-main")
    });

    trigger.focus();
    popup.open("/preview.png", trigger);

    expect(dialog.classList.contains("active")).toBe(true);
    expect(dialog.hidden).toBe(false);
    expect(document.activeElement).toBe(dialog);

    popup.close();

    expect(dialog.classList.contains("active")).toBe(false);
    expect(dialog.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it("binds copy and preview actions through data attributes instead of inline handlers", () => {
    const onCopyEmail = vi.fn();
    const onPreviewImage = vi.fn();

    bindActionButtons(document, {
      onCopyEmail,
      onPreviewImage
    });

    document.querySelector("[data-copy-email]").click();
    document.querySelector("[data-preview-image]").click();

    expect(onCopyEmail).toHaveBeenCalledWith("hello@example.com", expect.any(HTMLButtonElement));
    expect(onPreviewImage).toHaveBeenCalledWith("/preview.png", expect.any(HTMLButtonElement));
  });

  it("keeps the preloaded background asset in sync with the CSS background image URL", () => {
    const indexHtml = readIndexHtml();
    const rootCss = readFileSync(path.join(process.cwd(), "static/css/root.css"), "utf8");

    const preloadHref = indexHtml.match(
      /<link rel="preload" href="([^"]+background\.webp[^"]*)" as="image" \/>/
    )?.[1];
    const cssBackground = rootCss.match(/--main-bg-color:\s*url\(([^)]+background\.webp[^)]*)\);/)?.[1];

    expect(preloadHref).toBe("./static/img/optimized/background.webp?v=1.1.0");
    expect(cssBackground).toBe("../img/optimized/background.webp?v=1.1.0");
  });

  it("allows link validation to pass even when home-content.json is absent", () => {
    const result = withHiddenHomeContent(() =>
      spawnSync("node", ["scripts/validate-links.mjs"], {
        cwd: process.cwd(),
        encoding: "utf8"
      })
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Link validation passed.");
  });
});
