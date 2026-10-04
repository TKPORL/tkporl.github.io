/* ============================================================================
   Tsinho资源库 · 下载中心 — main.js
   - 邮箱反馈按钮：点击复制 Tsinhos@qq.com + 弹出「已复制」提示
     （真实浏览器里 mailto 仍会唤起写邮件；预览面板会拦截 mailto，
      复制 + 提示保证任何环境点了都有可见反应）
   ============================================================================ */
(function () {
  "use strict";

  var MAIL = "Tsinhos@qq.com";
  var mailBtn = document.getElementById("mailBtn");
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

  function copyMail() {
    var done = function () {
      showToast("邮箱已复制：" + MAIL);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(MAIL)
        .then(done)
        .catch(function () {
          fallbackCopy(MAIL, done);
        });
    } else {
      fallbackCopy(MAIL, done);
    }
  }

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
    } catch (e) {
      showToast(MAIL);
    }
    document.body.removeChild(ta);
  }

  if (mailBtn) {
    mailBtn.addEventListener("click", function () {
      // 复制邮箱作为可见反馈；同时保留 mailto，真实浏览器会打开写邮件
      copyMail();
    });
  }
})();
