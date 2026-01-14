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
  