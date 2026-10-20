(() => {
  'use strict';
  const { profile, categories, entries } = window.PORTFOLIO;
  const main = document.querySelector('main');
  const scenery = document.querySelector('#scenery');
  const dialog = document.querySelector('#detail');
  const travel = document.querySelector('#travel');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL = url => { try { const u = new URL(url); return ['https:','http:','mailto:'].includes(u.protocol) ? escape(u.href) : ''; } catch { return ''; } };
  const categoryFor = id => categories.find(c => c.id === id);
  const routeLink = id => '#/work/' + id;
  const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
  let current = '', navigating = false, navigationToken = 0, focusReturn = null;
  let motion = !media.matches;
  const scrollPositions = new Map();
  const loaded = new Map();
  const imageFor = route => categories.some(c=>c.id===route) ? route : route==='work' ? 'tree' : route==='about' ? 'research' : route==='skills' ? 'tree' : 'home';
  function preload(scene) {
    if (!loaded.has(scene)) {
      const image = new Image(); image.src = 'assets/' + scene + '.png';
      loaded.set(scene, image.decode().catch(()=>{}));
    }
    return loaded.get(scene);
  }
  // Brand glyphs from Simple Icons (CC0), keyed by social label.
  const socialIcons = {"GitHub":"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12","LinkedIn":"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z","Hugging Face":"M1.4446 11.5059c0 1.1021.1673 2.1585.4847 3.1563-.0378-.0028-.0691-.0058-.1058-.0058-.4209 0-.8015.16-1.0704.4512-.3454.3737-.4984.8335-.4316 1.293a1.576 1.576 0 0 0 .2148.5978c-.2319.1864-.4018.4456-.4844.7578-.0646.2448-.131.7543.2149 1.2794a1.4552 1.4552 0 0 0-.0625.1055c-.208.3923-.2207.8372-.0371 1.25.2783.6258.9696 1.1175 2.3126 1.6467.8356.3292 1.5988.5411 1.6056.543 1.1046.2847 2.104.4277 2.969.4277 1.4173 0 2.4754-.3849 3.1525-1.1446 1.538.2651 2.791.1403 3.592.006.6773.7555 1.7332 1.1387 3.1467 1.1387.8649 0 1.8643-.143 2.969-.4278.0068-.0019.77-.2138 1.6056-.543 1.343-.5292 2.0343-1.0208 2.3126-1.6466.1836-.4129.171-.8577-.037-1.25a1.4685 1.4685 0 0 0-.0626-.1056c.346-.525.2795-1.0346.2149-1.2793-.0826-.3122-.2525-.5714-.4844-.7579.11-.1816.1831-.3788.2148-.5977.0669-.4595-.0862-.9193-.4316-1.293-.2688-.2913-.6495-.4513-1.0704-.4513-.0209 0-.0376.0008-.0588.0018.3162-.9966.4846-2.0518.4846-3.1523 0-5.807-4.7362-10.5144-10.5789-10.5144-5.8426 0-10.5788 4.7073-10.5788 10.5144Zm10.5788-9.4831c5.2727 0 9.5476 4.246 9.5476 9.483a9.4201 9.4201 0 0 1-.2696 2.2365c-.0039-.0047-.0079-.011-.0117-.0156-.274-.3255-.6679-.5059-1.1075-.5059-.352 0-.714.1155-1.0763.3438-.2403.1517-.5058.422-.7793.7598-.2534-.3492-.608-.5832-1.0137-.6465a1.5174 1.5174 0 0 0-.2344-.0176c-.9263 0-1.4828.7993-1.6935 1.5177-.1046.2426-.6065 1.3482-1.3614 2.0978-1.1681 1.1601-1.4458 2.3534-.8396 3.6382-.843.1029-1.5836.0927-2.365-.006.5906-1.212.3626-2.4388-.8426-3.6322-.755-.7496-1.2568-1.8552-1.3614-2.0978-.2107-.7184-.7673-1.5177-1.6935-1.5177-.078 0-.1568.0054-.2344.0176-.4057.0633-.7604.2973-1.0137.6465-.2735-.3379-.539-.6081-.7794-.7598-.3622-.2283-.7243-.3438-1.0762-.3438-.4266 0-.8094.171-1.0821.4786a9.4208 9.4208 0 0 1-.2598-2.1936c0-5.237 4.2749-9.483 9.5475-9.483zM8.6443 7.0036c-.4838.0043-.9503.2667-1.1934.7227-.3536.6633-.1006 1.4873.5645 1.84.351.1862.4883-.5261.836-.6485.3107-.1095.841.399 1.0078.086.3536-.6634.1025-1.4874-.5625-1.84a1.3659 1.3659 0 0 0-.6524-.1602Zm6.8403 0c-.2199-.002-.4426.05-.6504.1602-.665.3526-.9181 1.1766-.5645 1.84.1669.313.6971-.1955 1.0079-.086.3476.1224.4867.8347.838.6485.6649-.3527.916-1.1767.5624-1.84-.243-.456-.7096-.7184-1.1934-.7227Zm-9.7565 1.418a.8768.8768 0 0 0-.877.877c0 .4846.3925.877.877.877a.8768.8768 0 0 0 .877-.877.8768.8768 0 0 0-.877-.877zm12.6434 0c-.4845 0-.879.3925-.879.877 0 .4846.3945.877.879.877a.8768.8768 0 0 0 .877-.877.8768.8768 0 0 0-.877-.877zM8.7927 11.459c-.179-.003-.2793.1107-.2793.416 0 .8097.3874 2.125 1.4279 2.924.207-.7123 1.3453-1.2832 1.5079-1.2012.2315.1167.2191.4417.6074.7266.3884-.285.374-.6098.6056-.7266.1627-.082 1.3009.4889 1.5079 1.2012 1.0404-.799 1.4278-2.1144 1.4278-2.924 0-1.2212-1.583.6402-3.5413.6485-1.4686-.0061-2.7266-1.0558-3.2639-1.0645zM4.312 14.4768c.5792.365 1.6964 2.2751 2.1056 3.0177.1371.2488.371.3536.582.3536.4188 0 .7465-.4138.0391-.9395-1.0636-.791-.6914-2.0846-.1836-2.1642a.4302.4302 0 0 1 .0664-.004c.4616 0 .666.7892.666.7892s.5959 1.4898 1.6213 2.508c.942.9356 1.062 1.703.4961 2.6661-.0164-.004-.0159.0236-.1484.2149-.1853.2673-.4322.4688-.7188.6152-.5062.2269-1.1397.2696-1.7833.2696-1.037 0-2.1017-.1824-2.6975-.336-.0293-.0075-3.6505-.9567-3.1916-1.8224.0771-.1454.2033-.2031.3633-.2031.6463 0 1.823.9551 2.3283.9551.113 0 .196-.0865.2285-.2031.2249-.8045-3.2787-1.0522-2.9846-2.1642.0519-.1967.193-.2757.3907-.2754.854 0 2.7704 1.4923 3.172 1.4923.0307 0 .0525-.0085.0645-.0274.2012-.3227.1096-.5865-1.3087-1.4395-1.4182-.8533-2.4315-1.329-1.8653-1.9416.0651-.0707.1574-.1015.2695-.1015.8611.0002 2.8948 1.84 2.8948 1.84s.5487.5683.8809.5683c.0762 0 .1416-.0315.1855-.1054.2355-.3946-2.1858-2.2183-2.3224-2.971-.0926-.51.0641-.7676.3555-.7676-.0006.008.1701-.0285.4942.1759zm16.2257.5918c-.1366.7526-2.5579 2.5764-2.3224 2.9709.044.074.1092.1055.1855.1055.3321 0 .881-.5684.881-.5684s2.0336-1.8397 2.8947-1.84c.1121 0 .2044.0308.2695.1016.5662.6125-.447 1.0882-1.8653 1.9415-1.4183.853-1.51 1.1168-1.3087 1.4396.012.0188.0337.0273.0644.0273.4016 0 2.3181-1.4923 3.1721-1.4923.1977-.0002.3388.0787.3907.2754.294 1.112-3.2095 1.3597-2.9846 2.1642.0325.1166.1156.2032.2285.2032.5054 0 1.682-.9552 2.3283-.9552.16 0 .2862.0577.3633.2032.459.8656-3.1623 1.8149-3.1916 1.8224-.5958.1535-1.6605.336-2.6975.336-.6351 0-1.261-.0409-1.7638-.2599-.2949-.1472-.5488-.3516-.7383-.625-.0411-.0682-.1026-.1476-.1426-.205-.5726-.9679-.455-1.7371.4903-2.676 1.0254-1.0182 1.6212-2.508 1.6212-2.508s.2044-.7891.666-.7891a.4318.4318 0 0 1 .0665.0039c.5078.0796.88 1.3732-.1836 2.1642-.7074.5257-.3797.9395.039.9395.211 0 .445-.1047.5821-.3535.4092-.7426 1.5264-2.6527 2.1056-3.0178.5588-.3524.99-.1816.8497.5918z","Kaggle":"M5 1.5h3.4v12.2l6.3-6.9h4.3l-6.6 7 7.1 8.7h-4.3l-5.2-6.5-1.6 1.7v4.8H5z","Codeforces":"M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z","LeetCode":"M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"};
  function socials() { return (profile.email?`<a href="mailto:${escape(profile.email)}" aria-label="Email ${escape(profile.email)}" title="${escape(profile.email)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 2.3V17h16V7.3l-7.4 5.5a1 1 0 0 1-1.2 0zM5.7 7l6.3 4.7L18.3 7z"/></svg></a>`:'')+profile.socials.filter(s=>safeURL(s.url)).map(s=>{ const d=socialIcons[s.label]; return `<a href="${safeURL(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(s.label)}" title="${escape(s.label)}">${d?`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`:escape(s.label)+' ↗'}</a>`; }).join(''); }
  function dock(id='') {
    return `<nav class="category-dock" aria-label="Work categories">${categories.map(c=>`<a href="${routeLink(c.id)}" ${c.id===id?'aria-current="page"':''}>${escape(c.title)}</a>`).join('')}</nav><a class="back-tree" href="${id?'#/work':'#/home'}">← ${id?'Neural Tree':'Back home'}</a>`;
  }
  function homeSkills() {
    const index = buildSkillIndex(PORTFOLIO);
    const top = [...index.skills].sort((a,b)=>b.entries.length-a.entries.length).slice(0,8);
    if(!top.length) return '';
    return `<div class="section-label">Skills in practice</div><div class="home-skills">${top.map(s=>`<a href="#/skills" data-goto-skill="${escape(s.id)}" title="${s.entries.length} linked ${s.entries.length===1?'project':'projects'}">${escape(s.name)}<span>${s.entries.length}</span></a>`).join('')}<a class="home-skills-all" href="#/skills">All ${index.skills.length} skills →</a></div>`;
  }
  function home() {
    return `<div class="page home-page arrive"><section class="home-copy"><div class="eyebrow">Student · Researcher · Builder</div><h1>${escape(profile.name)}</h1><p class="tagline">${escape(profile.tagline)}</p><p class="lead">${escape(profile.bio)}</p>
    <dl class="profile-grid"><div><dt>Studying</dt><dd>${escape(profile.degree)}</dd></div><div><dt>Based in</dt><dd>${escape(profile.location)}</dd></div><div><dt>College</dt><dd>${escape(profile.college)}</dd></div><div><dt>Chapter</dt><dd>${escape(profile.age)}</dd></div></dl>
    <div class="actions"><a class="button primary" href="#/work">Explore my work ${arrow}</a><a class="button" href="#/about">A little about me</a></div><div class="socials">${socials()}</div>
    <div class="section-label">Selected highlights</div><div class="highlights">${profile.highlights.map(h=>`${h.entry?`<button type="button" class="highlight" data-entry="${escape(h.entry)}" aria-haspopup="dialog">`:`<a class="highlight" href="${routeLink(h.category)}">`}${h.logos?.length?`<span class="highlight-logos">${h.logos.map(l=>`<img src="${escape(l.src)}" alt="${escape(l.alt)}" width="30" height="30" loading="lazy">`).join('')}</span>`:`<span class="symbol" aria-hidden="true">${categoryFor(h.category)?.symbol||'✧'}</span>`}<div><strong>${escape(h.title)}</strong><small>${escape(h.subtitle)}</small></div>${h.entry?'</button>':'</a>'}`).join('')}</div>
    ${homeSkills()}<a class="home-map-entry" href="#/work"><span class="tree-icon" aria-hidden="true">⌘</span><div><strong>Enter the Neural Tree</strong><p>Six paths. A few ideas. Plenty left to explore.</p></div><span aria-hidden="true">→</span></a></section></div><div class="corner-note"><b>01 / HOME</b><span>STILL LEARNING. ALWAYS BUILDING.</span></div>`;
  }
  function map() {
    return `<section class="map-page"><div class="map-heading arrive"><div class="eyebrow">My work / The Neural Tree</div><h1>Follow a thought.</h1><p>Six paths through the things I do.</p></div>
    <div class="map-canvas"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${categories.map(c=>`<path class="route" data-path="${c.id}" d="${c.path}"/><path class="route-hit" data-route="${c.id}" d="${c.path}"/>`).join('')}</svg><button class="map-core core-link" data-core aria-label="Explore skills at the center of the Neural Tree"><span>Skills <b>↗</b></span></button>${categories.map(c=>`<a class="map-node" href="${routeLink(c.id)}" data-node="${c.id}" style="--x:${c.x}%;--y:${c.y}%"><span class="node-index">${c.number}</span><strong>${escape(c.title)}</strong><span class="node-arrow" aria-hidden="true">↗</span><small>${escape(c.place)}</small></a>`).join('')}</div>
    <p class="map-help"><span>Choose a path.</span> See where it leads.</p>${dock()}</section>`;
  }
  const resultBadge = entry => `<span class="result${entry.medal?' medal-'+escape(entry.medal):''}">${escape(entry.result)}</span>`;
  function card(entry, category, index) {
    return `<button class="work-card" data-entry="${escape(entry.id)}" aria-label="${escape(category.action+': '+entry.title+' · '+(entry.status==='ongoing'?'ongoing':'past work')+' '+(index+1))}">${entry.org||entry.result?`<span class="org-head"><span class="org-logo">${entry.logo?`<img src="${escape(entry.logo)}" alt="" width="44" height="44" loading="lazy">`:`<span class="org-symbol" aria-hidden="true">${category.symbol}</span>`}${entry.partnerLogo?`<img class="partner-logo" src="${escape(entry.partnerLogo.src)}" alt="${escape(entry.partnerLogo.alt)}" title="${escape(entry.partnerLogo.alt)}" width="22" height="22" loading="lazy">`:''}</span><span><h3>${escape(entry.title)}</h3>${entry.org?`<span class="org-name"><b>${escape(entry.org)}</b>${entry.unit?' · '+escape(entry.unit):''}</span>`:''}${entry.result?resultBadge(entry):''}</span></span><span class="entry-meta"><span class="serial">${category.number}.${String(index+1).padStart(2,'0')}</span><span>${escape(entry.date)}</span>${entry.status==='ongoing'?'<span class="status">IN PROGRESS</span>':''}</span>`:`<span class="entry-meta"><span class="serial">${category.number}.${String(index+1).padStart(2,'0')}</span><span>${escape(entry.date)}</span>${entry.status==='ongoing'?'<span class="status">IN PROGRESS</span>':''}</span><h3>${escape(entry.title)}</h3><p>${escape(entry.summary)}</p>`}<div class="tags">${(entry.skillIds||[]).map(id=>PORTFOLIO.skills?.find(s=>s.id===id)).filter(Boolean).map(s=>`<span class="tag skill-tag">${escape(s.name)}</span>`).join('')}${entry.tags.map(t=>`<span class="tag">${escape(t)}</span>`).join('')}</div><div class="card-bottom"><span>${escape(category.action)}</span>${arrow}</div></button>`;
  }
  function destination(category) {
    const list = entries.filter(e=>e.category===category.id);
    const ongoing = list.filter(e=>e.status==='ongoing');
    const past = list.filter(e=>e.status==='past');
    const section = (items, status, title) => `<section class="work-section ${status}-section" id="${status}" aria-labelledby="${status}-heading"><h2 class="section-heading" id="${status}-heading"><span class="status-dot" aria-hidden="true"></span>${title}<span class="count">${String(items.length).padStart(2,'0')} ${items.length===1?'entry':'entries'}</span></h2><div class="${status==='past'?'past-list':'ongoing-list'}">${items.length?items.map((e,i)=>card(e,category,i)).join(''):'<p class="empty-state">Nothing here yet. Another chapter is on its way.</p>'}</div></section>`;
    return `<div class="page destination destination-${category.id} arrive"><header class="page-heading"><div class="breadcrumb"><a href="#/work">My work</a><span>/</span>${escape(category.title)}</div><div class="place">${category.number} / ${escape(category.place)}</div><h1>${escape(category.title)}</h1><p>${escape(category.description)}</p><nav class="section-jump" aria-label="Page sections"><a href="#ongoing" data-scroll="ongoing">Ongoing ↓</a><a href="#past" data-scroll="past">Past work ↓</a></nav></header><div class="work-content">${section(ongoing,'ongoing','Ongoing')}${section(past,'past','Past work')}</div></div>${dock(category.id)}`;
  }
  let selectedDomain='backend', selectedSkill='', skillQuery='';
  const skillIndex = () => window.buildSkillIndex(PORTFOLIO);
  function radar(index) {
    const n=index.domains.length, maximum=Math.max(1,...index.domains.map(d=>d.entries.length));
    const point=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [250+Math.cos(a)*r,250+Math.sin(a)*r];};
    const points=r=>index.domains.map((_,i)=>point(i,r).join(',')).join(' ');
    return `<svg viewBox="0 0 500 500" class="skill-radar" role="img" aria-labelledby="radar-title radar-desc"><title id="radar-title">Work connections by skill category</title><desc id="radar-desc">Each axis counts distinct work entries using skills in that category. Scale: zero to ${maximum} linked entries. ${index.domains.map(d=>d.name+': '+d.entries.length).join('. ')}. Select categories using the buttons below.</desc><defs><radialGradient id="radar-fill"><stop stop-color="#ffe39b" stop-opacity=".35"/><stop offset="1" stop-color="#7beafa" stop-opacity=".18"/></radialGradient></defs><circle cx="250" cy="250" r="202" class="radar-orbit"/>${[.25,.5,.75,1].map(r=>`<polygon points="${points(r*150)}" class="radar-grid"/>`).join('')}${index.domains.map((d,i)=>{const p=point(i,150),l=point(i,191);return `<line x1="250" y1="250" x2="${p[0]}" y2="${p[1]}" class="radar-axis"/><text data-domain="${escape(d.id)}" x="${l[0]}" y="${l[1]}" text-anchor="middle" dominant-baseline="middle" class="${d.id===selectedDomain?'selected':''}">${escape(d.name)}</text>`;}).join('')}<polygon class="radar-shape" points="${index.domains.map((d,i)=>point(i,150*d.entries.length/maximum).join(',')).join(' ')}"/>${index.domains.map((d,i)=>{const p=point(i,150*d.entries.length/maximum);return `<circle cx="${p[0]}" cy="${p[1]}" r="${d.id===selectedDomain?6:3}" class="radar-point"/>`;}).join('')}<circle cx="250" cy="250" r="23" class="radar-center"/><path d="M250 236l10 14-10 14-10-14z" fill="#ffe39b"/></svg><p class="radar-caption">0–${maximum} linked work entries per axis <span>Project usage, not an expertise score.</span></p>`;
  }
  function toolsSection(index) {
    return `<section class="tools-section" id="tools" aria-labelledby="tools-title"><header class="tools-heading"><div><div class="eyebrow">The workbench</div><h2 id="tools-title">Tools I use</h2><p>The tools behind the work, connected to the skills they support.</p></div><span>${index.tools.length} tools</span></header><div class="tool-grid">${index.tools.map(tool=>`<article class="tool-card"><h3>${escape(tool.name)}</h3><div class="tool-skill-links">${tool.skills.map(s=>`<button data-tool-skill="${escape(s.id)}">${escape(s.name)} ↗</button>`).join('')||'<span class="placeholder-note">No skill connection recorded yet.</span>'}</div><details><summary>${tool.entries.length} linked work entries</summary><div class="tool-work">${tool.entries.map(e=>`<button data-entry="${escape(e.id)}"><span>${escape(categoryFor(e.category).title)} · ${e.status==='ongoing'?'Ongoing':'Past work'}</span><strong>${escape(e.title)} ↗</strong></button>`).join('')}</div></details></article>`).join('')||'<p class="empty-state">No tools linked to work yet.</p>'}</div></section>`;
  }
  function entryTools(entry) {
    const tools=(PORTFOLIO.tools||[]).filter(t=>(entry.toolIds||[]).includes(t.id));
    return tools.length?`<section class="entry-tools" aria-label="Tools used"><h3>Tools used</h3><div class="tags">${tools.map(t=>`<span class="tag tool-tag">${escape(t.name)}</span>`).join('')}</div></section>`:'';
  }

  function skillsPage() {
    const index=skillIndex();
    if(!index.domains.some(d=>d.id===selectedDomain))selectedDomain=index.domains[0]?.id||'';
    return `<div class="page skills-page arrive"><div class="breadcrumb"><a href="#/work">Neural Tree</a><span>/</span>The core</div><header class="skills-heading"><div><div class="eyebrow">Connected through making</div><h1>Skills, in practice.</h1><p>Follow a skill back to the work behind it.</p></div><div class="skills-total"><strong>${index.skills.length}</strong><span>CONNECTED SKILLS</span></div></header>${PORTFOLIO.skillsDemo?'<p class="demo-banner"><span>DEMO DATA</span> Example skills and connections. Replace these with your own work.</p>':''}<div class="skill-workbench"><section class="radar-console" aria-label="Skill category overview"><div class="console-label"><span>NEURAL CORE / SKILL MAP</span><i>● CONNECTED</i></div><div id="radar-view">${radar(index)}</div><div class="domain-controls" aria-label="Skill categories">${index.domains.map(d=>`<button data-domain="${escape(d.id)}" aria-pressed="${d.id===selectedDomain}">${escape(d.name)}<span>${d.skills.length}</span></button>`).join('')}</div></section><section class="skill-panel" aria-label="Skills and connected work"><div class="skill-search"><label for="skill-search">Find a skill</label><input id="skill-search" type="search" placeholder="Search all categories…" value="${escape(skillQuery)}" autocomplete="off"></div><div id="skills-panel-body">${skillsPanel(index)}</div></section></div>${toolsSection(index)}<a class="button" href="#/work">← Return to the Neural Tree</a></div>`;
  }
  function skillsPanel(index) {
    const domain=index.domains.find(d=>d.id===selectedDomain);
    const list=skillQuery.trim()?index.skills.filter(s=>(s.name+' '+index.domains.find(d=>d.id===s.category)?.name).toLowerCase().includes(skillQuery.trim().toLowerCase())):(domain?.skills||[]);
    if(!list.some(s=>s.id===selectedSkill))selectedSkill=list[0]?.id||'';
    const active=list.find(s=>s.id===selectedSkill);
    const linked=active?.entries||[];
    return `<div class="skill-panel-heading"><h2>${skillQuery.trim()?'Search results':escape(domain?.name||'Skills')}</h2><span aria-live="polite">${list.length} ${list.length===1?'skill':'skills'}</span></div><div class="skill-options">${list.map(s=>`<button data-skill="${escape(s.id)}" aria-pressed="${s.id===selectedSkill}">${escape(s.name)} <span>${s.entries.length}</span></button>`).join('')||'<p class="empty-state">No connected skills found.</p>'}</div>${active?`<div class="evidence-heading"><div><div class="eyebrow">${escape(index.domains.find(d=>d.id===active.category)?.name)}</div><h3>${escape(active.name)}</h3></div><span>${linked.length} work ${linked.length===1?'entry':'entries'}</span></div><p class="evidence-summary">${linked.filter(e=>e.status==='ongoing').length} ongoing · ${linked.filter(e=>e.status==='past').length} past</p><p class="skill-tool-context">Tools used with this skill: ${index.tools.filter(t=>t.skills.some(s=>s.id===active.id)).map(t=>escape(t.name)).join(', ')||'None recorded yet'}. <a href="#tools" data-scroll="tools">View tools ↓</a></p><div class="skill-evidence">${linked.map(e=>`<button data-entry="${escape(e.id)}" class="evidence-card"><span class="evidence-path">${escape(categoryFor(e.category).title)} <i>${e.status==='ongoing'?'Ongoing':'Past work'}</i></span><strong>${escape(e.title)}</strong><span>${escape(e.date)} <b aria-hidden="true">↗</b></span></button>`).join('')}</div>`:''}`;
  }
  function updateSkillsPanel() {
    const index=skillIndex();
    document.querySelector('#skills-panel-body').innerHTML=skillsPanel(index);
    document.querySelector('#radar-view').innerHTML=radar(index);
    document.querySelectorAll('button[data-domain]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.domain===selectedDomain&&!skillQuery.trim())));
  }
  function selectDomain(id) {
    selectedDomain=id;selectedSkill='';skillQuery='';
    document.querySelector('#skill-search').value='';updateSkillsPanel();
  }
  document.addEventListener('input',event=>{if(event.target.id==='skill-search'){skillQuery=event.target.value;updateSkillsPanel();}});

  function about() {
    return `<div class="page arrive"><section class="story-page"><div class="eyebrow">Behind the projects</div><h1>A little about me.</h1>${[].concat(profile.about).map(t=>`<p class="lead">${escape(t)}</p>`).join('')}<div class="story-panel"><div class="eyebrow">The chapters so far</div><h2 style="margin-top:15px">My journey</h2><div class="journey">${profile.journey.map(j=>`<article><time>${escape(j.date)}</time><h3>${escape(j.title)}</h3><p>${escape(j.description)}</p></article>`).join('')}</div></div><div class="actions"><a class="button primary" href="#/work">Explore my work ${arrow}</a><a class="button" href="#/skills">See my skills ↗</a></div></section></div>`;
  }
  function parseRoute() {
    let parts = location.hash.replace(/^#\/?/,'').split('/');
    if (parts[0]==='work') return parts[1] && categoryFor(parts[1]) ? parts[1] : 'work';
    if (['home','about','skills'].includes(parts[0])) return parts[0];
    if (categoryFor(parts[0])) return parts[0];
    return 'home';
  }
  function render(route, restore=false) {
    if(dialog.open) dialog.close();
    document.body.classList.remove('modal-open');
    current = route;
    const cat = categoryFor(route);
    document.body.dataset.page = route;
    document.title = `${cat?.title || {home:'A world of ideas',work:'The Neural Tree',skills:'Skills',about:'About'}[route]} · ${profile.name}`;
    main.innerHTML = cat ? destination(cat) : route==='work' ? map() : route==='skills' ? skillsPage() : route==='about' ? about() : home();
    scenery.style.backgroundImage = `url("assets/${imageFor(route)}.png")`;
    scenery.style.transformOrigin = 'center'; scenery.style.transform = '';
    document.querySelectorAll('[data-nav]').forEach(a => { if(a.dataset.nav===(cat?'work':route)) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    window.scrollTo({top:restore?(scrollPositions.get(route)||0):0,behavior:'instant'});
    document.querySelector('#announcement').textContent = `${cat?.title || route} page`;
    wireMap();
  }
  async function navigate(route, restore=false) {
    if (route===current) { ++navigationToken; navigating=false; travel.classList.remove('active'); scenery.style.transform=''; return; }
    const token = ++navigationToken;
    scrollPositions.set(current,window.scrollY);
    const category = categoryFor(route) || (route==='skills'?{x:53,y:46,place:'Inside the Neural Tree'}:null);
    const travelFromMap = current==='work' && category;
    navigating = true;
    document.querySelector('#travel-label').textContent = category ? category.place : route==='work'?'Returning to the Neural Tree':'A new perspective';
    if (motion) {
      if(travelFromMap) {
        scenery.style.transformOrigin = `${category.x}% ${category.y}%`;
        scenery.style.transform = 'scale(1.65)';
        document.querySelector(`[data-path="${route}"]`)?.classList.add('active');
      }
      travel.style.setProperty('--tx',`${category?.x||50}%`);travel.style.setProperty('--ty',`${category?.y||50}%`);
      travel.classList.add('active');
    }
    await Promise.all([preload(imageFor(route)),new Promise(resolve=>setTimeout(resolve,motion?650:0))]);
    if(token!==navigationToken) return;
    render(route,restore);
    main.focus({preventScroll:true});
    travel.classList.remove('active');
    navigating = false;
  }
  function highlightRoute(id,active) { document.querySelector(`[data-path="${id}"]`)?.classList.toggle('active',active); }
  function wireMap() {
    document.querySelectorAll('[data-node],[data-route]').forEach(el=>{
      const id = el.dataset.node || el.dataset.route;
      el.addEventListener('pointerenter',()=>{highlightRoute(id,true);preload(id);});
      el.addEventListener('pointerleave',()=>highlightRoute(id,false));
      el.addEventListener('focus',()=>{highlightRoute(id,true);preload(id);});
      el.addEventListener('blur',()=>highlightRoute(id,false));
    });
  }
  const leadDetails = ['Outcome','Result','Results','Impact','Findings'];
  function detailList(entry, lead) { const items=Object.entries(entry.details).filter(([k])=>leadDetails.includes(k)===lead); return items.length?`<dl class="${lead?'detail-lead':''}">${items.map(([label,value])=>`<dt>${escape(label)}</dt><dd>${escape(value)}</dd>`).join('')}</dl>`:''; }
  function openEntry(id, trigger) {
    const entry = entries.find(e=>e.id===id); if(!entry)return;
    const cat = categoryFor(entry.category);
    focusReturn = trigger;
    document.querySelector('#detail-body').innerHTML = `<div class="eyebrow">${escape(cat.title)} / ${entry.status==='ongoing'?'Ongoing':'Past work'}</div><h2 id="detail-title">${escape(entry.title)}</h2>${entry.result?`<div class="detail-result">${resultBadge(entry)}</div>`:''}${entry.org?`<div class="detail-org">${entry.logo?`<img src="${escape(entry.logo)}" alt="" width="28" height="28">`:''}${entry.partnerLogo?`<img src="${escape(entry.partnerLogo.src)}" alt="${escape(entry.partnerLogo.alt)}" title="${escape(entry.partnerLogo.alt)}" width="28" height="28">`:''}<span><b>${escape(entry.org)}</b>${entry.unit?' · '+escape(entry.unit):''}</span></div>`:''}<div class="entry-meta">${escape(entry.date)}</div><p class="detail-summary">${escape(entry.summary)}</p><div class="tags">${(entry.skillIds||[]).map(id=>PORTFOLIO.skills?.find(s=>s.id===id)).filter(Boolean).map(s=>`<span class="tag skill-tag">${escape(s.name)}</span>`).join('')}${entry.tags.map(t=>`<span class="tag">${escape(t)}</span>`).join('')}</div>${entryTools(entry)}${detailList(entry,true)}${entry.links.length?`<div class="detail-links">${entry.links.filter(l=>safeURL(l.url)).map(l=>`<a class="button" href="${safeURL(l.url)}" target="_blank" rel="noopener noreferrer">${escape(l.label)} ↗</a>`).join('')}</div>`:''}${entry.gallery?.length?`<div class="detail-gallery">${entry.gallery.map(g=>`<figure${g.fit==='contain'?' class="fit-contain"':''}><a href="${escape(g.src)}" target="_blank" rel="noopener"><img src="${escape(g.src)}" alt="${escape(g.alt||g.caption||'')}" loading="lazy"></a>${g.caption?`<figcaption>${escape(g.caption)}</figcaption>`:''}</figure>`).join('')}</div>`:''}${detailList(entry,false)}<p class="detail-footer">${escape(cat.place)} / ${entry.status==='ongoing'?'Notes from a work in progress':'A chapter from the archive'}</p>`;
    dialog.showModal();dialog.scrollTop=0;document.body.classList.add('modal-open');
  }
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-core]')) { location.hash='#/skills'; return; }
    if(event.target.closest('.skip-link')) { event.preventDefault(); main.focus(); return; }
    const toolSkill=event.target.closest('[data-tool-skill]');
    if(toolSkill){
      const skill=skillIndex().skills.find(s=>s.id===toolSkill.dataset.toolSkill);
      if(skill){selectDomain(skill.category);selectedSkill=skill.id;updateSkillsPanel();document.querySelector('.skill-panel').scrollIntoView({behavior:motion?'smooth':'instant'});document.querySelector('#skill-search').focus({preventScroll:true});}
      return;
    }
    const goto = event.target.closest('[data-goto-skill]');
    if(goto){ const sk=(PORTFOLIO.skills||[]).find(s=>s.id===goto.dataset.gotoSkill); if(sk){ selectedSkill=sk.id; selectedDomain=sk.category; skillQuery=''; } }
    const domain = event.target.closest('[data-domain]');
    if(domain) { selectDomain(domain.dataset.domain); return; }
    const skill = event.target.closest('[data-skill]');
    if(skill) { selectedSkill=skill.dataset.skill; updateSkillsPanel(); [...document.querySelectorAll('[data-skill]')].find(b=>b.dataset.skill===selectedSkill)?.focus({preventScroll:true}); return; }
    const entry = event.target.closest('[data-entry]');
    if(entry){openEntry(entry.dataset.entry,entry);return;}
    const scroll = event.target.closest('[data-scroll]');
    if(scroll){event.preventDefault();document.getElementById(scroll.dataset.scroll)?.scrollIntoView({behavior:motion?'smooth':'instant'});return;}
    const path = event.target.closest('[data-route]');
    if(path){location.hash=routeLink(path.dataset.route);return;}
    const link = event.target.closest('a[href^="#/"]');
    if(link && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button===0){
      scrollPositions.set(current,window.scrollY);
      if(link.hash===location.hash){event.preventDefault();window.scrollTo({top:0,behavior:motion?'smooth':'instant'});}
    }
  });
  document.querySelector('.close-detail').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog && e.clientX<dialog.getBoundingClientRect().left)dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');focusReturn?.focus({preventScroll:true});});
  function updateMotion() {
    document.body.classList.toggle('motion-off',!motion);
    if(!motion){scenery.style.removeProperty('--mx');scenery.style.removeProperty('--my');}
  }
  media.addEventListener('change',()=>{motion=!media.matches;updateMotion();});
  let pointerFrame = 0;
  window.addEventListener('pointermove',e=>{
    if(!motion || navigating || current==='work' || e.pointerType==='touch' || innerWidth<761 || pointerFrame)return;
    pointerFrame=requestAnimationFrame(()=>{scenery.style.setProperty('--mx',`${(e.clientX/innerWidth-.5)*-9}px`);scenery.style.setProperty('--my',`${(e.clientY/innerHeight-.5)*-6}px`);pointerFrame=0;});
  },{passive:true});
  for(let i=0;i<15;i++) {const fly=document.createElement('i');fly.className='firefly';fly.style.cssText=`--x:${7+(i*29)%88}%;--y:${32+(i*17)%64}%;--duration:${5+i%5}s;--delay:-${i*.7}s`;document.querySelector('#fireflies').append(fly);}
  addEventListener('hashchange',()=>navigate(parseRoute(),true));
  updateMotion();render(parseRoute());{ const header=document.querySelector('.site-header'); const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>8); window.addEventListener('scroll',onScroll,{passive:true}); onScroll(); }
  preload(imageFor(current));
  // The map is the next likely stop; other destinations load on hover or navigation.
  setTimeout(()=>preload('tree'),1200);
})();
