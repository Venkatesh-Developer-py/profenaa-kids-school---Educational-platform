/* ===== RECENT INITIATIVES =====
   Either keep this as its own file (loaded in index.html)
   or paste it at the end of index.js and remove the <script>. */
(function () {
  // Add more initiatives or images here; everything else adapts automatically.
  const recentInitiatives = [
    {
      title: "Annual Day Celebration",
      description: "A joyful Annual Day celebration where our young learners showcased their talents, creativity, confidence and memorable performances with great enthusiasm.",
      date: "September 2026",
      location: "Profenaa International Kids School, Pollachi",
      images: ["assets/new/Home-card-1.jpeg", "assets/new/Home-card-2.jpeg", "assets/new/Home-card-3.jpeg"]
    },
    {
      title: "Creative Kids Activity Program",
      description: "Hands-on art, music and play sessions that help children express ideas and build confidence.",
      date: "September 2026",
      location: "Profenaa International Kids School, Pollachi",
      images: ["assets/new/Home-card-4.jpeg", "assets/new/Home-card-2.jpeg"]
    },
    {
      title: "Parent Interaction Session",
      description: "An open session where parents meet our teachers and learn how to support learning at home.",
      date: "September 2026",
      location: "Profenaa International Kids School, Pollachi",
      images: ["assets/new/Home-card-3.jpeg"]
    }
  ];

  const $ = (id) => document.getElementById(id);
  const card = $("rcCard");
  if (!card || !recentInitiatives.length) return;
  const slides = $("rcSlides"), dots = $("rcDots"), tabs = $("rcTabs"), info = $("rcInfo");
  let ini = 0, img = 0;

  // Only touches the image state: classes on slides + active dot
  function setPositions() {
    const n = recentInitiatives[ini].images.length;
    slides.querySelectorAll(".rc-slide").forEach((el, i) => {
      let c = "";
      if (i === img) c = "is-active";
      else if (n > 1) {
        if (i === (img + 1) % n) c = "is-next";
        else if (n > 2 && i === (img - 1 + n) % n) c = "is-prev";
      }
      el.className = "rc-slide " + c;
    });
    dots.querySelectorAll(".rc-dot").forEach((d, i) => d.classList.toggle("active", i === img));
  }

  function goImage(i) {
    const n = recentInitiatives[ini].images.length;
    img = (i + n) % n;
    setPositions(); // title/description/date/location are NOT touched
  }

  function renderInitiative(idx) {
    ini = idx; img = 0;
    const d = recentInitiatives[idx], n = d.images.length;
    card.classList.toggle("is-single", n < 2);

    slides.innerHTML = "";
    d.images.forEach((src, i) => {
      const s = document.createElement("div");
      s.className = "rc-slide";
      const im = new Image();
      im.src = src; im.alt = d.title + " - photo " + (i + 1); im.loading = "lazy";
      im.onerror = () => im.remove(); // keeps the dark gradient if a file is missing
      s.appendChild(im); slides.appendChild(s);
    });

    dots.innerHTML = "";
    if (n > 1) d.images.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "rc-dot"; b.setAttribute("aria-label", "Show image " + (i + 1));
      b.addEventListener("click", () => goImage(i));
      dots.appendChild(b);
    });

    $("rcTitle").textContent = d.title;
    $("rcDesc").textContent = d.description;
    $("rcDate").textContent = "\uD83D\uDCC5 " + d.date;
    $("rcLoc").textContent = "\uD83D\uDCCD " + d.location;
    info.classList.remove("is-in"); void info.offsetWidth; info.classList.add("is-in");

    tabs.querySelectorAll(".rc-tab").forEach((t, i) => t.classList.toggle("active", i === idx));
    setPositions();
  }

  // Initiative switcher (only appears when there is more than one initiative)
  if (recentInitiatives.length > 1) {
    recentInitiatives.forEach((_, i) => {
      const t = document.createElement("button");
      t.type = "button"; t.className = "rc-tab";
      t.textContent = String(i + 1).padStart(2, "0");
      t.setAttribute("aria-label", "Show initiative " + (i + 1));
      t.addEventListener("click", () => renderInitiative(i));
      tabs.appendChild(t);
    });
  }

  $("rcPrev").addEventListener("click", () => goImage(img - 1));
  $("rcNext").addEventListener("click", () => goImage(img + 1));
  renderInitiative(0);

  // Desktop: inside the hero. Tablet/mobile: moved below it.
  const hero = $("hero"), slot = $("rcSlot"), mq = window.matchMedia("(max-width:1200px)");
  function place() { (mq.matches && slot ? slot : hero).appendChild(card); }
  place();
  mq.addEventListener ? mq.addEventListener("change", place) : mq.addListener(place);
})();