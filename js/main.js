// Динамічне підключення header і footer
function loadPartial(id, url, callback) {
  console.log(`Loading partial: ${id} from ${url}`);
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text();
    })
    .then((html) => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = html;
        console.log(`Successfully loaded ${id}`);
        if (callback) callback();
      } else {
        console.error(`Element with id '${id}' not found`);
      }
    })
    .catch((error) => {
      console.error("Error loading partial:", error);
      console.log("Trying to load:", url);
      // Fallback for local development
      if (url.includes("header.html")) {
        console.log("Trying fallback for header...");
        const fallbackHeader = `
          <header class="site-header">
            <div class="container">
              <a href="./" class="logo">Obby Rescue</a>
              <nav class="main-nav">
                <ul>
                  <li><a href="./">Home</a></li>
                  <li><a href="./#how-to-play">How to Play</a></li>
                  <li><a href="./#gadgets">Gadgets & Tools</a></li>
                  <li><a href="obbyrescue-news.html">News & Updates</a></li>
                  <li><a href="obbyrescue-contacts.html">Contact HQ</a></li>
                  <li><a href="obbyrescue-disclaimer.html">Legal Info</a></li>
                </ul>
              </nav>
            </div>
          </header>
        `;
        const element = document.getElementById(id);
        if (element) {
          element.innerHTML = fallbackHeader;
          if (callback) callback();
        }
      }
    });
}

function createMobileMenu() {
  // Додаємо бургер-іконку
  const header = document.querySelector(".site-header .container");
  if (!header) {
    console.log("Header container not found");
    return;
  }
  if (document.getElementById("burger-btn")) {
    console.log("Burger button already exists");
    return; // вже додано
  }
  const burger = document.createElement("button");
  burger.className = "burger";
  burger.id = "burger-btn";
  burger.setAttribute("aria-label", "Open menu");
  burger.innerHTML = "<span></span><span></span><span></span>";
  header.appendChild(burger);

  // Додаємо модальне меню
  if (!document.getElementById("mobile-menu-modal")) {
    const modal = document.createElement("div");
    modal.className = "mobile-menu-modal";
    modal.id = "mobile-menu-modal";
    modal.innerHTML = `
      <div class="mobile-menu-content">
        <button class="close-modal" id="close-mobile-menu" aria-label="Close menu">&times;</button>
        <ul>
          <li><a href="./">Home</a></li>
          <li><a href="./#features">Features</a></li>
          <li><a href="./#how-to-play">How to Play</a></li>
          <li><a href="./#gadgets">Gadgets & Tools</a></li>
          <li><a href="./#bridge-construction">Rescue Missions</a></li>
          <li><a href="./#reviews">Reviews</a></li>
          <li><a href="obbyrescue-news.html">News & Updates</a></li>
          <li><a href="obbyrescue-contacts.html">Contact HQ</a></li>
          <li><a href="obbyrescue-disclaimer.html">Legal Info</a></li>
        </ul>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Логіка відкриття/закриття
  const modal = document.getElementById("mobile-menu-modal");
  const closeBtn = document.getElementById("close-mobile-menu");
  burger.addEventListener("click", function () {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  });
  closeBtn.addEventListener("click", function () {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  });
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      modal.classList.remove("active");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  });
  // Закриваємо меню при натисканні на будь-який пункт
  modal.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      modal.classList.remove("active");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    });
  });
}

function enableSmoothScrollAnchors() {
  function isIndexPage() {
    const path = location.pathname.replace(/\\/g, "/");
    return (
      path === "/" ||
      path.endsWith("/index.html") ||
      path === "/index.html" ||
      path === "" ||
      location.protocol === "file:"
    );
  }
  const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const hash = this.getAttribute("href");
      if (hash && hash.startsWith("#")) {
        const target = document.querySelector(hash);
        if (isIndexPage() && target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          // Закриваємо мобільне меню, якщо воно є
          const modal = document.getElementById("mobile-menu-modal");
          if (modal && modal.classList.contains("active")) {
            modal.classList.remove("active");
          }
        } else if (!target) {
          // Якщо не на index або елементу немає — перенаправляємо на головну з хешем
          e.preventDefault();
          window.location.href = "./" + hash;
        }
      }
    });
  });
}

// Головний файл ініціалізації
// Завантаження header/footer, мобільне меню, плавна прокрутка, рік у футері, cookie-banner

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, loading partials...");
  loadPartial("header", "components/header.html", function () {
    console.log("Header loaded, creating mobile menu...");
    createMobileMenu();
    enableSmoothScrollAnchors();
  });
  loadPartial("footer", "components/footer.html");
  // footer-year.js і cookie-banner.js самі підписані на DOMContentLoaded
});
