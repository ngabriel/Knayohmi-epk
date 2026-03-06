const bios = {
    short: {
      filename: "Knayohmi-Short-Bio.txt",
      url: "bio/bio-short.txt"
    },
    long: {
      filename: "Knayohmi-Long-Bio.txt",
      url: "bio/bio-long.txt"
    },
    full: {
      filename: "Knayohmi-Full-Bio.txt",
      url: "bio/bio-full.txt"
    }
  };
  const PRESS_PHOTOS = [
    "press-photos/press1.jpg",
    "press-photos/press2.jpg",
    "press-photos/press3.jpg",
    "press-photos/press4.jpg",
    "press-photos/press5.jpg"
  ];
 
   async function loadEPKData() {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
  
      // HEADER & HERO
      document.querySelector('.brand-name').textContent = data.header.artistName;
      document.querySelector('.brand-tag').textContent = data.header.artistTag;
      document.querySelector('.hero h2').textContent = data.hero.title;
      document.querySelector('.lead').textContent = data.hero.lead;
  
  
      // PRESS SECTION
      document.querySelector('#press h2').textContent = data.press.sectionTitle;
      // Update Residency Title & List
      document.querySelector('#press .card:nth-child(1) h3').textContent = data.press.residencyTitle;
      document.getElementById('residency-list').innerHTML = 
        data.press.residencies.map(res => `<li>${res}</li>`).join('');
      
      // Update Appearances Title & List
      document.querySelector('#press .card:nth-child(2) h3').textContent = data.press.appearancesTitle;
      document.getElementById('appearances-list').innerHTML = 
        data.press.appearances.map(app => `<li>${app}</li>`).join('');
  
      // VIDEO & CONTACT TITLES
      renderVideoSection(data);
      // CONTACT LINKS
      const emailLink = document.querySelector('#contact-email');
      emailLink.href = `mailto:${data.contact.email}`;
      emailLink.textContent = data.contact.email;
  
    } catch (err) {
      console.error("Error mapping JSON:", err);
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadEPKData);
  
  
  const bioTextEl = document.getElementById("bioText");
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const downloadBtn = document.getElementById("downloadBioBtn");
  
  let currentBioKey = "short";
  
  async function loadBio(key){
    currentBioKey = key;
  
    // update tab UI
    tabs.forEach(t => {
      const active = t.dataset.bio === key;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
  
    // load bio from txt file
    const res = await fetch(bios[key].url, { cache: "no-store" });
    const text = await res.text();
    bioTextEl.textContent = text;
  }
  
    function renderVideoSection(data) {
      const video = data.video;
      if (!video) return;
    
      const titleEl = document.getElementById("video-title");
      const helpEl = document.getElementById("video-help");
      const contentEl = document.getElementById("video-content");
    
      if (!contentEl) return;
    
      titleEl.textContent = video.title || "Video";
      helpEl.textContent = video.helpText || "";
    
      if (video.type === "single") {
        const single = video.singleVideo;
        if (!single || !single.id) {
          contentEl.innerHTML = `<p>Video not available.</p>`;
          return;
        }
    
        const embedUrl = `https://www.youtube.com/embed/${single.id}`;
        const watchUrl = `https://youtu.be/${single.id}`;
    
        contentEl.innerHTML = `
          <article class="card">
            <div class="video-embed">
              <iframe
                width="560"
                height="315"
                src="${embedUrl}"
                title="${single.title || 'YouTube video player'}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen>
              </iframe>
            </div>
    
            <div class="stack" style="margin-top:12px;">
              <a class="btn btn-ghost" href="${watchUrl}" target="_blank" rel="noreferrer">
                Watch on YouTube
              </a>
            </div>
          </article>
        `;
      }
    
      if (video.type === "multiple") {
        contentEl.innerHTML = `
          <article class="card">
            <div class="yt-carousel">
              <button class="carousel-btn" type="button" data-dir="-1" aria-label="Previous videos">⟵</button>
    
              <div class="carousel-viewport">
                <div class="carousel-track" id="ytTrack"></div>
              </div>
    
              <button class="carousel-btn" type="button" data-dir="1" aria-label="Next videos">⟶</button>
            </div>
          </article>
        `;
    
        initYouTubeCarousel(video.videos || []);
      }
    }

  function downloadTextFile(filename, text){
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  }
  
  tabs.forEach(tab => {
    tab.addEventListener("click", () => loadBio(tab.dataset.bio));
  });
  
  downloadBtn.addEventListener("click", () => {
    const filename = bios[currentBioKey].filename;
    const text = bioTextEl.textContent || "";
    downloadTextFile(filename, text);
  });
  
  // footer year
  document.getElementById("year").textContent = new Date().getFullYear();
  
  // init
  loadBio("short").catch(() => {
    bioTextEl.textContent = "Add your bio text files in /bio and reload.";
  });

  function initYouTubeCarousel(videos) {
    const track = document.getElementById("ytTrack");
    if (!track) return;
  
    track.innerHTML = "";
  
    videos.forEach(v => {
      const a = document.createElement("a");
      a.className = "yt-thumb";
      a.href = `https://youtu.be/${v.id}`;
      a.dataset.ytid = v.id;
  
      a.innerHTML = `
        <img loading="lazy" decoding="async"
             src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg"
             alt="${v.title}">
        <div class="cap">${v.title}</div>
      `;
  
      track.appendChild(a);
    });
  
    const carousel = track.closest(".yt-carousel");
    if (!carousel) return;
  
    const btnPrev = carousel.querySelector('.carousel-btn[data-dir="-1"]');
    const btnNext = carousel.querySelector('.carousel-btn[data-dir="1"]');
    const viewport = carousel.querySelector(".carousel-viewport");
  
    if (!btnPrev || !btnNext || !viewport) return;
  
    let index = 0;
  
    function itemsPerView() {
      const w = window.innerWidth;
      if (w <= 520) return 1;
      if (w <= 820) return 2;
      return 3;
    }
  
    function maxIndex() {
      return Math.max(0, track.children.length - itemsPerView());
    }
  
    function stepPx() {
      const first = track.querySelector(".yt-thumb");
      if (!first) return 0;
      const gap = parseFloat(getComputedStyle(track).gap || "0");
      return first.getBoundingClientRect().width + gap;
    }
  
    function update() {
      const max = maxIndex();
      index = Math.min(Math.max(index, 0), max);
      track.style.transform = `translateX(${-index * stepPx()}px)`;
      btnPrev.disabled = (index === 0);
      btnNext.disabled = (index === max);
    }
  
    btnPrev.addEventListener("click", () => {
      index--;
      update();
    });
  
    btnNext.addEventListener("click", () => {
      index++;
      update();
    });
  
    window.addEventListener("resize", update);
  
    const modal = document.getElementById("ytModal");
    const closeBtn = document.getElementById("ytClose");
    const wrap = document.getElementById("ytPlayerWrap");
  
    function openModal(id) {
      wrap.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${id}?autoplay=1"
          title="YouTube video player"
          frameborder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen></iframe>
      `;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    }
  
    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      wrap.innerHTML = "";
    }
  
    track.addEventListener("click", (e) => {
      const a = e.target.closest("a.yt-thumb");
      if (!a) return;
      e.preventDefault();
      openModal(a.dataset.ytid);
    });
  
    closeBtn?.addEventListener("click", closeModal);
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  
    viewport.addEventListener("wheel", (e) => {
      if (!e.shiftKey) return;
      e.preventDefault();
      index += (e.deltaY > 0 ? 1 : -1);
      update();
    }, { passive: false });
  
    update();
  }
  