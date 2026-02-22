(function () {
  var STORAGE_KEY = "tender-lang";
  var article = document.getElementById("tender-detail");
  if (!article) return;

  function getStored() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "km") return stored;
    } catch (e) {}
    return "en";
  }

  function setLang(lang) {
    if (lang !== "en" && lang !== "km") return;
    article.setAttribute("data-tender-lang", lang);
    document.documentElement.setAttribute("lang", lang === "km" ? "km" : "en");
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    var btns = article.querySelectorAll(".tender-lang-btn");
    btns.forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  var initial = getStored();
  setLang(initial);

  article.addEventListener("click", function (e) {
    var btn = e.target.closest(".tender-lang-btn");
    if (!btn) return;
    var lang = btn.getAttribute("data-lang");
    if (lang) setLang(lang);
  });
})();
