(function () {
  "use strict";

  var searchInput = document.getElementById("tender-search");
  var tenderList = document.getElementById("tender-list");
  var cards = tenderList ? tenderList.querySelectorAll(".tender-card") : [];
  var dataEl = document.getElementById("tender-search-data");
  var data = [];

  if (!searchInput || !tenderList || !dataEl) return;

  try {
    data = JSON.parse(dataEl.textContent || "[]");
  } catch (e) {
    return;
  }

  function normalize(s) {
    return (s || "").toLowerCase().trim();
  }

  function filterCards(query) {
    var q = normalize(query);
    if (q === "") {
      cards.forEach(function (card) {
        card.classList.remove("hidden");
      });
      return;
    }
    cards.forEach(function (card, i) {
      var searchable = (card.getAttribute("data-searchable") || "").toLowerCase();
      var show = searchable.indexOf(q) !== -1;
      card.classList.toggle("hidden", !show);
    });
  }

  searchInput.addEventListener("input", function () {
    filterCards(searchInput.value);
  });

  searchInput.addEventListener("search", function () {
    filterCards(searchInput.value);
  });
})();
