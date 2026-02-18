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
      document.querySelector('#video h2').textContent = data.video.title;
      document.querySelector('#video p').textContent = data.video.helpText;
      document.querySelector('#contact h2').textContent = data.contact.title;
      document.querySelector('#contact p').textContent = data.contact.helpText;
  
      // CONTACT LINKS
      const emailLink = document.querySelector('#contact-email');
      emailLink.href = `mailto:${data.contact.email}`;
      emailLink.textContent = data.contact.email;
  
    } catch (err) {
      console.error("Error mapping JSON:", err);
    }
  }
  
  document.addEventListener('DOMContentLoaded', loadEPKData);
  
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
  