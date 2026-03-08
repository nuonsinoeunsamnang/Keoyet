(function () {
  "use strict";

  var searchInput = document.getElementById("tender-search");
  var typeFilter = document.getElementById("tender-type-filter");
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

  function filterCards() {
    var q = normalize(searchInput ? searchInput.value : "");
    var typeValue = typeFilter ? (typeFilter.value || "").toLowerCase() : "";

    cards.forEach(function (card) {
      var searchable = (card.getAttribute("data-searchable") || "").toLowerCase();
      var cardType = (card.getAttribute("data-tender-type") || "").toLowerCase();

      var matchesSearch = q === "" || searchable.indexOf(q) !== -1;
      var matchesType = typeValue === "" || cardType === typeValue;

      card.classList.toggle("hidden", !(matchesSearch && matchesType));
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterCards);
    searchInput.addEventListener("search", filterCards);
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", filterCards);
  }
})();
