/**
 * Shiva Hari Gundeti — Personal Site
 * Vanilla JS: theme toggle, active-page nav highlighting, reveal-on-scroll,
 * tagline rotator, back-to-top. Multi-page site, no build step, no dependencies.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------
   * 1. Theme (light/dark) toggle with localStorage persistence
   * --------------------------------------------------------- */
  var root = document.documentElement;
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function getStoredTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (e) {
      return null;
    }
  }

  function setTheme(theme) {
    if (theme !== "light" && theme !== "dark") return;
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) { /* ignore */ }
    var toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) toggleBtn.setAttribute("aria-checked", String(theme === "dark"));
  }

  function initTheme() {
    var stored = getStoredTheme();
    var theme = stored || (prefersDark.matches ? "dark" : "light");
    setTheme(theme);
  }

  initTheme();

  document.addEventListener("DOMContentLoaded", function () {
    var toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) {
      toggleBtn.setAttribute("role", "switch");
      toggleBtn.addEventListener("click", function () {
        var isDark = root.getAttribute("data-theme") === "dark";
        setTheme(isDark ? "light" : "dark");
      });
    }
  });

  prefersDark.addEventListener("change", function (e) {
    if (!getStoredTheme()) setTheme(e.matches ? "dark" : "light");
  });

  /* ---------------------------------------------------------
   * 2. Sticky nav shadow on scroll
   * --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.getElementById("siteNav");
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  });

  /* ---------------------------------------------------------
   * 3. Active-page nav highlighting (multi-page site)
   *    Each page already hardcodes aria-current/is-active on the
   *    matching link, but this keeps things correct if pages are
   *    copied/renamed without updating markup.
   * --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".nav-links a, .footer-nav a")
    );
    if (!links.length) return;

    var path = window.location.pathname.split("/").pop() || "index.html";

    links.forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("/").pop();
      var isCurrent = href === path || (path === "" && href === "index.html");
      link.classList.toggle("is-active", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  });

  /* ---------------------------------------------------------
   * 4. Reveal-on-scroll animations
   * --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!revealEls.length) return;

    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  });

  /* ---------------------------------------------------------
   * 5. Tagline rotator (replaces old typed.js dependency)
   * --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var el = document.getElementById("tagline");
    if (!el) return;
    var raw = el.getAttribute("data-roles") || "";
    var roles = raw.split("|").map(function (s) { return s.trim(); }).filter(Boolean);
    if (roles.length < 2) return;

    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    var textSpan = el.querySelector(".tagline-text");
    if (!textSpan) return;

    var idx = 0;
    setInterval(function () {
      idx = (idx + 1) % roles.length;
      textSpan.style.opacity = "0";
      setTimeout(function () {
        textSpan.textContent = roles[idx];
        textSpan.style.opacity = "1";
      }, 220);
    }, 2600);
  });

  /* ---------------------------------------------------------
   * 6. Back-to-top button
   * --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    function onScroll() {
      btn.classList.toggle("is-visible", window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    onScroll();
  });
})();
