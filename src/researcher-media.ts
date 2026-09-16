interface ResearcherPortraitRecord {
  url: string;
  source: string;
  credit: string;
  position?: string;
  license?: { label: string; url: string };
}

// These remote images are linked from the named official profiles, checked
// 2026-09-16. Source attribution is not a claim of an unrestricted reuse license.
const ResearcherMedia = (() => {
  const records: Record<string, ResearcherPortraitRecord> = {
    "christof-koch": {
      url: "https://cdn.prod.website-files.com/69a0ca6ef8ecfacbc1d10e9b/69c594c04cfa36e91a0f3b7a_christof_koch_web-new.jpeg",
      source: "https://alleninstitute.org/person/christof-koch",
      credit: "Allen Institute"
    },
    "gyorgy-buzsaki": {
      url: "https://med.nyu.edu/dti-physician-photo/faculty/b/buzsag01/buzsag01-hero.jpg",
      source: "https://med.nyu.edu/faculty/gyorgy-buzsaki",
      credit: "NYU Grossman School of Medicine",
      position: "74% 35%"
    },
    "michael-miller": {
      url: "https://www.bme.jhu.edu/wp-content/uploads/2019/10/Michael-Miller-600x600.jpg",
      source: "https://www.bme.jhu.edu/people/faculty/michael-i-miller/",
      credit: "Johns Hopkins Biomedical Engineering"
    },
    "alim-louis-benabid": {
      url: "https://academie-sciences.fr/sites/default/files/Benabid.jpg",
      source: "https://academie-sciences.fr/alim-louis-benabid",
      credit: "Académie des sciences"
    },
    "jeff-lichtman": {
      url: "https://dmg5c1valy4me.cloudfront.net/wp-content/uploads/2016/07/29214231/lichtman_jeff.034light_mco-300x300.jpg",
      source: "https://www.mcb.harvard.edu/directory/jeff-lichtman/",
      credit: "Harvard Molecular & Cellular Biology"
    },
    "andrew-schwartz": {
      url: "https://www.cnup.pitt.edu/sites/default/files/styles/person_image/public/person-img/andrew.jpg?h=66c0dfaa&itok=PXx7VZLb",
      source: "https://www.cnup.pitt.edu/people/andrew-b-schwartz-phd",
      credit: "University of Pittsburgh"
    },
    "david-tank": {
      url: "https://pni.princeton.edu/sites/g/files/toruqf321/files/styles/3x4_750w_1000h/public/2023-08/20180508_david_tank.jpg?h=3698e87c&itok=tRX6zQVO",
      source: "https://pni.princeton.edu/people/david-tank",
      credit: "Princeton Neuroscience Institute"
    },
    "behnaam-aazhang": {
      url: "https://profiles.rice.edu/sites/g/files/bxs3881/files/2020-07/behnaam_aazhang_600.jpg",
      source: "https://profiles.rice.edu/faculty/behnaam-aazhang",
      credit: "Rice University"
    },
    "winfried-denk": {
      url: "https://www.bi.mpg.de/1941717/original-1638878901.jpg?t=ZXlKM2FXUjBhQ0k2TVRRd0xDSm9aV2xuYUhRaU9qRTRNQ3dpWm1sMElqb2lZM0p2Y0NJc0ltWnBiR1ZmWlhoMFpXNXphVzl1SWpvaWFuQm5JaXdpYjJKcVgybGtJam94T1RReE56RTNmUT09LS1mMzJjOGU2NTc0MTUwOWM0YTNiYWVjMzBjMjg0MWZlNzZiMGRmYjZj",
      source: "https://www.bi.mpg.de/denk",
      credit: "Max Planck Institute for Biological Intelligence"
    },
    "john-donoghue": {
      url: "https://vivo.brown.edu/profile-images/186/59/jdonoghu.jpg",
      source: "https://vivo.brown.edu/display/jdonoghu",
      credit: "Brown University"
    },
    "rafael-yuste": {
      url: "https://biology.columbia.edu/sites/biology.columbia.edu/files/styles/custom_crop_directory/public/content/pics/profiles/Yuste%20photo%20resized.jpg.webp?itok=_-Ell2XI",
      source: "https://biology.columbia.edu/content/rafael-yuste",
      credit: "Columbia University"
    },
    "lan-luan": {
      url: "https://profiles.rice.edu/sites/g/files/bxs3881/files/2024-05/7e6ec80dfd87f017b160318c43f8f0bc.jpg",
      source: "https://profiles.rice.edu/faculty/lan-luan",
      credit: "Rice University"
    },
    "chong-xie": {
      url: "https://profiles.rice.edu/sites/g/files/bxs3881/files/2021-08/chong_xie_600%20%282%29.jpg",
      source: "https://profiles.rice.edu/faculty/chong-xie",
      credit: "Rice University"
    },
    "polina-anikeeva": {
      url: "https://mcgovern.mit.edu/wp-content/uploads/2019/01/researcherlandingpage-polina_570x570.jpg",
      source: "https://mcgovern.mit.edu/researchers/",
      credit: "MIT McGovern Institute"
    },
    "stephanie-lacour": {
      url: "https://www.epfl.ch/about/vice-presidencies/wp-content/uploads/2024/12/Stephanie-Lacour-c-Nicolas-Righetti-Lundi13-300x300.jpg",
      source: "https://www.epfl.ch/about/vice-presidencies/fr/vice-presidence-pour-le-soutien-aux-initiatives-strategiques-vps/",
      credit: "2024 EPFL / Nicolas Righetti – Lundi 13",
      license: { label: "CC BY-SA 4.0", url: "https://creativecommons.org/licenses/by-sa/4.0/" }
    },
    "karl-deisseroth": {
      url: "https://profiles.stanford.edu/proxy/api/cap/profiles/6080/resources/profilephoto/350x350.1753730174811.jpg",
      source: "https://profiles.stanford.edu/karl-deisseroth",
      credit: "Stanford University"
    },
    "leigh-hochberg": {
      url: "https://vivo.brown.edu/profile-images/235/75/hochberg.jpg",
      source: "https://vivo.brown.edu/display/lhochber",
      credit: "Brown University"
    },
    "jaimie-henderson": {
      url: "https://profiles.stanford.edu/proxy/api/cap/profiles/6330/resources/profilephoto/350x350.1751302180914.jpg",
      source: "https://profiles.stanford.edu/jaimie-henderson",
      credit: "Stanford University"
    },
    "frank-willett": {
      url: "https://profiles.stanford.edu/proxy/api/cap/profiles/173773/resources/profilephoto/350x350.1737621414000.jpg",
      source: "https://profiles.stanford.edu/francis-willett",
      credit: "Stanford University"
    }
  };
  const bound = new WeakSet<HTMLImageElement>();
  const escape = (value: string) => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));
  const initialLetters = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return [parts[0], parts.length > 1 ? parts[parts.length - 1] : ""].filter(Boolean).map(part => Array.from(part)[0]).join("").toLocaleUpperCase();
  };
  function record(id: string): ResearcherPortraitRecord | undefined {
    return Object.prototype.hasOwnProperty.call(records, id) ? records[id] : undefined;
  }
  function portrait(id: string, name: string, className = ""): string {
    const item = record(id);
    return `<span class="researcher-media ${escape(className)}${item ? "" : " is-fallback"}" data-researcher-media="${escape(id)}"><span class="researcher-media-initials" aria-hidden="true">${escape(initialLetters(name))}</span>${item ? `<img src="${escape(item.url)}" alt="Portrait of ${escape(name)}" loading="lazy" decoding="async" width="350" height="350" referrerpolicy="no-referrer" style="object-position:${escape(item.position || "50% 35%")}">` : ""}</span>`;
  }
  // Keep the source link separate so roster buttons never contain another control.
  function credit(id: string): string {
    const item = record(id);
    if (!item) return "";
    return `<span class="researcher-media-credit"><a href="${escape(item.source)}" target="_blank" rel="noopener noreferrer">Photo: ${escape(item.credit)} ↗</a>${item.license ? ` · <a href="${escape(item.license.url)}" target="_blank" rel="noopener noreferrer">${escape(item.license.label)}</a>` : ""}</span>`;
  }
  function bind(root: ParentNode = document): void {
    root.querySelectorAll<HTMLImageElement>("[data-researcher-media] img").forEach(img => {
      if (bound.has(img)) return;
      bound.add(img);
      const fallback = () => {
        img.hidden = true;
        img.style.display = "none";
        img.parentElement?.classList.add("is-fallback");
        img.parentElement?.classList.remove("has-photo");
      };
      const ready = () => {
        img.parentElement?.classList.add("has-photo");
        img.parentElement?.classList.remove("is-fallback");
      };
      img.addEventListener("error", fallback, { once: true });
      img.addEventListener("load", ready, { once: true });
      if (img.complete) img.naturalWidth ? ready() : fallback();
    });
  }
  return { portrait, credit, record, bind };
})();
