/* ============================================================================
   Tsinho 资源库 · 集合站 — main.js
   1) 导航滚动后加毛玻璃底
   2) 卡片滚动进入（逐张错开）
   3) 资源卡暂未配链接时，点击给「即将上线」提示
   4) 邮箱按钮：复制地址 + 提示
   ============================================================================ */
(function () {
  "use strict";

  var MAIL = "Tsinhos@qq.com";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. 导航滚动状态 ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 2. 卡片入场 ---------- */
  var revealTargets = document.querySelectorAll(".res, .dl, .link-row");
  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
  });

  if (reduce || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var siblings = Array.prototype.slice.call(el.parentNode.children);
          var idx = siblings.indexOf(el);
          el.style.setProperty("--rd", Math.min(idx, 8) * 0.055 + "s");
          el.classList.add("in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    revealTargets.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- 3. 提示条 ---------- */
  var toast = document.getElementById("toast");
  var timer = null;

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  /* 资源卡：href 为空或 # 时，提示尚未开放；带 data-modal 的交给弹窗 */
  document.querySelectorAll(".res").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (card.hasAttribute("data-modal")) return;
      var href = card.getAttribute("href");
      if (!href || href === "#") {
        e.preventDefault();
        var name = card.getAttribute("data-name") || "该分类";
        showToast(name + " · 即将上线");
      }
    });
  });

  /* ---------- 3.5 网盘教程弹窗 ---------- */
  var modal = document.getElementById("netdiskModal");
  var netdiskCard = document.getElementById("netdiskCard");
  var lastFocus = null;

  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    var x = modal.querySelector(".modal-x");
    if (x) x.focus();
  }

  function closeModal() {
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (netdiskCard) {
    netdiskCard.addEventListener("click", function (e) {
      e.preventDefault();
      openModal();
    });
  }

  if (modal) {
    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    /* 点教程条目后自动收起弹窗 */
    modal.querySelectorAll(".modal-item, .modal-main").forEach(function (link) {
      link.addEventListener("click", function () {
        setTimeout(closeModal, 120);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ---------- 4. 邮箱复制 ---------- */
  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (err) {
      showToast(MAIL);
    }
    document.body.removeChild(ta);
  }

  function copyMail() {
    var done = function () {
      showToast("邮箱已复制：" + MAIL);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(MAIL).then(done).catch(function () {
        fallbackCopy(MAIL, done);
      });
    } else {
      fallbackCopy(MAIL, done);
    }
  }

  var mailBtn = document.getElementById("mailBtn");
  if (mailBtn) {
    mailBtn.addEventListener("click", function () {
      copyMail();
    });
  }

  var mailRow = document.getElementById("mailRow");
  if (mailRow) {
    mailRow.addEventListener("click", function () {
      copyMail();
    });
  }
})();
