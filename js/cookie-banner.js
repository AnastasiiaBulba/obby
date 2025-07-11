// Логіка банера cookies
document.addEventListener("DOMContentLoaded", function () {
  var banner = document.getElementById("cookie-banner");
  if (!banner) return;

  // Перевіряємо чи користувач вже прийняв куки
  if (!localStorage.getItem("cookieConsent")) {
    // Показуємо банер з анімацією
    banner.style.display = "flex";
    setTimeout(() => {
      banner.classList.add("show");
    }, 100);
  }

  var acceptBtn = banner.querySelector(".cookie-banner__accept");
  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem("cookieConsent", "accepted");
      banner.classList.remove("show");
      setTimeout(() => {
        banner.style.display = "none";
      }, 300);
    });
  }
});
