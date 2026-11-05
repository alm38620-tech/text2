/* ============================================================
   بكسل أرينا — السلوكيات المشتركة
   قائمة الجوال + كشف العناصر عند التمرير + نموذج واتساب
   ============================================================ */

(function () {
  "use strict";

  /* ---------- قائمة الجوال ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
      }
    });
  }

  /* ---------- كشف العناصر عند التمرير ---------- */
  const revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length) {
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );

      revealItems.forEach((item) => observer.observe(item));
    }
  }

  /* ---------- نموذج الحجز عبر واتساب ---------- */
  const form = document.querySelector("[data-wa-form]");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const service = String(data.get("service") || "").trim();
      const message = String(data.get("message") || "").trim();

      const lines = [
        "مرحبًا بكسل أرينا 👋",
        "أرغب في حجز جلسة:",
        `الاسم: ${name}`,
        `الجوال: ${phone}`,
        `الخدمة: ${service}`,
      ];

      if (message) lines.push(`ملاحظات: ${message}`);

      const number = form.dataset.wa || "966551234567";
      const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;

      const status = form.querySelector(".form-status");
      if (status) {
        status.textContent = "تم تجهيز رسالتك — يُفتح واتساب الآن لإتمام الحجز.";
      }

      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  /* ---------- سنة التذييل ---------- */
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
