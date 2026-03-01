---
layout: default
title: Submit Tender Documents
form_provider: tally
form_url: "https://tally.so/embed/xXpE2k?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&source=website"
---

<div class="submit-page">
  <div class="wrap">
    <h1 class="page-title">{{ page.title }}</h1>
    <p class="page-intro">Use this page to upload tender documents for publishing. This is for procurement officers who have tender packages (ITB, RFP, BOQ, etc.) and want them added to the Keoyet Tenders site.</p>

    {% assign form_url_effective = page.form_url | strip %}
    {% if form_url_effective == "" or form_url_effective == "<INSERT_FORM_URL_HERE>" %}
    <div class="callout callout-warning">
      <p><strong>Form not configured.</strong> Set <code>form_url</code> in the front matter of <code>submit.md</code> to your Tally or Google Form embed URL.</p>
    </div>
    {% else %}
    <div class="form-embed">
      {% if page.form_provider == "tally" %}
      <iframe data-tally-src="{{ page.form_url }}" loading="lazy" width="100%" height="667" frameborder="0" marginheight="0" marginwidth="0" title="Submit Tender Documents (Keoyet)"></iframe>
      <script>
        (function(){var d=document,w="https://tally.so/widgets/embed.js",v=function(){if(typeof Tally!=="undefined")Tally.loadEmbeds();else d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach(function(e){e.src=e.dataset.tallySrc});};if(typeof Tally!=="undefined")v();else if(!d.querySelector('script[src="'+w+'"]')){var s=d.createElement("script");s.src=w;s.onload=v;s.onerror=v;d.body.appendChild(s)}})();
      </script>
      {% else %}
      <iframe title="Submit tender documents form" src="{{ page.form_url }}" frameborder="0" allowfullscreen allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      {% endif %}
    </div>
    {% endif %}
  </div>
</div>
