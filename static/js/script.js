/**
 * SimonHome - Main Script
 * Copyright © 2025 simonsun.cc
 */

console.log(
  "%cCopyright \u00A9 " + new Date().getFullYear() + " simonsun.cc",
  "background-color:rgb(6, 113, 245); color: white; font-size: 24px; font-weight: bold; padding: 10px;"
);

/* ===== Project Card Press Effect (Event Delegation) ===== */
(function () {
  var lists = document.querySelectorAll(".projectList");
  lists.forEach(function (list) {
    function getCard(event) {
      return event.target.closest(".projectItem");
    }
    list.addEventListener("mousedown", function (e) {
      var card = getCard(e);
      if (card) card.classList.add("pressed");
    });
    list.addEventListener("mouseup", function (e) {
      var card = getCard(e);
      if (card) card.classList.remove("pressed");
    });
    list.addEventListener("mouseleave", function () {
      var active = list.querySelector(".projectItem.pressed");
      if (active) active.classList.remove("pressed");
    });
    list.addEventListener("touchstart", function (e) {
      var card = getCard(e);
      if (card) card.classList.add("pressed");
    }, { passive: true });
    list.addEventListener("touchend", function (e) {
      var card = getCard(e);
      if (card) card.classList.remove("pressed");
    });
    list.addEventListener("touchcancel", function (e) {
      var card = getCard(e);
      if (card) card.classList.remove("pressed");
    });
  });
})();

/* ===== Image Popup ===== */
/* ===== Image Popup ===== */
window.pop = function (imageURL) {
  console.log("[Popup] pop called with:", imageURL);

// Ensure tc element exists
  var tcElement = document.querySelector(".tc");
  if (!tcElement) {
    tcElement = document.createElement("div");
    tcElement.className = "tc";
    document.body.appendChild(tcElement);
  }

  // Ensure tc-main element exists
  var tcMainElement = document.querySelector(".tc-main");
  if (!tcMainElement) {
    tcMainElement = document.createElement("div");
    tcMainElement.className = "tc-main";
    tcElement.appendChild(tcMainElement);
  }

  // Ensure tc-img element exists
  var tcImgElement = tcMainElement.querySelector(".tc-img");
  if (!tcImgElement) {
    tcImgElement = document.createElement("img");
    tcImgElement.className = "tc-img";
    tcMainElement.appendChild(tcImgElement);
  }

  // Add click event listener to close popup (idempotent)
  if (!tcElement.dataset.hasListener) {
    tcElement.addEventListener("click", function (event) {
      if (event.target === tcElement) {
        window.pop(); // Close popup
      }
    });
    tcElement.dataset.hasListener = "true";
  }

  // Prevent click propagation from main content (idempotent)
  if (!tcMainElement.dataset.hasListener) {
    tcMainElement.addEventListener("click", function (event) {
      event.stopPropagation();
    });
    tcMainElement.dataset.hasListener = "true";
  }

  if (imageURL) {
  // Preload image
    var img = new Image();
    img.onload = function () {
      console.log("[Popup] Image loaded successfully");
      tcImgElement.src = imageURL;
      tcElement.classList.add("active");
      tcMainElement.classList.add("active");
      tcElement.focus();
    };
    img.onerror = function () {
      console.error("[Popup] Failed to load image:", imageURL);
    };
    img.src = imageURL;
  } else {
    // Close popup
    console.log("[Popup] Closing popup");
    tcElement.classList.remove("active");
    tcMainElement.classList.remove("active");
  }
};

// Auto-bind for data-popup (to keep current HTML working without changes if desired, 
// though manual onclick is more robust for some scenarios)
document.addEventListener("click", function (event) {
  var trigger = event.target.closest("[data-popup]");
  if (trigger) {
    event.preventDefault();
    window.pop(trigger.getAttribute("data-popup"));
  }
});

/* ===== Theme Storage (localStorage) ===== */
function getTheme() {
  try {
    var saved = localStorage.getItem("themeState");
    if (saved) return saved;
  } catch (e) {
    // localStorage unavailable
  }
  // Auto-detect from OS preference on first visit
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "Dark";
  }
  return "Light";
}

function saveTheme(theme) {
  try {
    localStorage.setItem("themeState", theme);
  } catch (e) {
    // localStorage unavailable, silently fail
  }
}

/* ===== Mobile Menu ===== */
(function () {
  var menuBtn = document.querySelector(".mobile-menu-btn");
  var sidebar = document.querySelector(".simon-left");
  var overlay = document.querySelector(".mobile-overlay");

  if (!menuBtn || !sidebar || !overlay) return;

  function openMenu() {
    menuBtn.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  menuBtn.addEventListener("click", function () {
    if (sidebar.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener("click", closeMenu);

  // Close mobile menu with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && sidebar.classList.contains("active")) {
      closeMenu();
    }
  });

  // Close menu on resize to desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 800 && sidebar.classList.contains("active")) {
      closeMenu();
    }
  });
})();

/* ===== Theme Toggle ===== */
document.addEventListener("DOMContentLoaded", function () {
  var html = document.querySelector("html");
  var tanChiShe = document.getElementById("tanChiShe");
  var checkbox = document.getElementById("myonoffswitch");
  var themeState = getTheme();

  function changeTheme(theme) {
    html.dataset.theme = theme;
    saveTheme(theme);
    themeState = theme;

    // Update snake animation image
    if (tanChiShe) {
      tanChiShe.src =
        "https://raw.githubusercontent.com/Tendo33/Tendo33/output/github-snake" +
        (theme === "Dark" ? "-dark" : "") +
        ".svg";
    }

    // Update theme-color meta tag
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "Dark" ? "#0a0a0f" : "#4a7dbd");
    }
  }

  if (checkbox) {
    checkbox.addEventListener("change", function () {
      changeTheme(themeState === "Dark" ? "Light" : "Dark");
    });

    // Sync checkbox state with saved theme
    if (themeState === "Dark") {
      checkbox.checked = false;
    }
  }

  changeTheme(themeState);
});

/* ===== Dynamic Copyright Year ===== */
var yearEl = document.getElementById("copyright-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ===== Loading Screen ===== */
var pageLoading = document.querySelector("#simon-loading");
window.addEventListener("load", function () {
  if (pageLoading) {
    setTimeout(function () {
      pageLoading.style.opacity = "0";
      // Remove from DOM after fade-out completes
      pageLoading.addEventListener("transitionend", function () {
        pageLoading.classList.add("hidden");
      }, { once: true });
    }, 100);
  }
});
