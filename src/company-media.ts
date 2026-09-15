// Shared visual storytelling for the Ideas notebook and organization profiles.
// Product photographs and videos retain their original host, credit, and source.
const NeuroMedia = (() => {
  const e = hubUtils.escapeHtml;
  const safe = hubUtils.sourceHref;
  const companyUrl = (id: string) => '#ideas/moores-law-bci?section=companies&company=' + encodeURIComponent(id);
  const themes: Record<string, string> = {neuralink:'#84d8ec',blackrock:'#d7b57a',precision:'#beadfa',paradromics:'#8edac7',synchron:'#8ebcf9',bisc:'#f5ba96'};
  const tone = (c: any) => themes[c.id] || '#84d8ec';
  const dots = (cols:number,rows:number,x:number,y:number,gap:number,r=3) => Array.from({length:cols*rows},(_,i)=>`<circle cx="${x+(i%cols)*gap}" cy="${y+Math.floor(i/cols)*gap}" r="${r}"/>`).join('');
  function diagram(c: any) {
    let art='';
    if(c.id==='neuralink') {
      art='<circle cx="95" cy="104" r="43" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="95" cy="104" r="31" fill="currentColor" opacity=".1"/>';
      art+=Array.from({length:8},(_,i)=>`<path d="M 135 ${85+i*5} C 192 ${85+i*5} 187 ${35+i*20} 244 ${35+i*20} H 355" fill="none" stroke="currentColor" opacity=".6"/>${[0,1,2,3].map(j=>`<circle cx="${266+j*25}" cy="${35+i*20}" r="3" fill="currentColor"/>`).join('')}`).join('');
    } else if(c.id==='blackrock') {
      art=[76,247].map(x=>`<path d="M ${x-14} 146 l 64 34 70 -38 -64 -33 Z" fill="currentColor" opacity=".14"/>`+Array.from({length:16},(_,i)=>{const a=x+(i%4)*17+Math.floor(i/4)*9,b=110+Math.floor(i/4)*12-(i%4)*7;return `<path d="M ${a} ${b+26} v -36" stroke="currentColor" stroke-width="2.5"/><circle cx="${a}" cy="${b-10}" r="3" fill="currentColor"/>`;}).join('')).join('');
      art+='<path d="M 200 105 h 25 m -8 -7 8 7 -8 7" fill="none" stroke="currentColor"/>';
    } else if(c.id==='precision') {
      art='<path d="M 36 141 Q 102 56 208 99 T 385 76" stroke="currentColor" fill="none" opacity=".3" stroke-width="35"/>';
      art+=[0,1,2,3].map(i=>`<g transform="translate(${54+i*85} ${70+(i%2)*24}) rotate(-10)"><rect width="66" height="65" rx="8" fill="currentColor" opacity=".1"/><rect width="66" height="65" rx="8" fill="none" stroke="currentColor"/>${dots(4,4,15,15,12,2)}</g>`).join('');
    } else if(c.id==='paradromics') {
      art='<rect x="63" y="42" width="125" height="125" rx="18" fill="currentColor" opacity=".1"/><rect x="63" y="42" width="125" height="125" rx="18" fill="none" stroke="currentColor"/>'+dots(8,8,81,61,13,2.4)+'<path d="M 212 103 h 28 m -8 -7 8 7 -8 7" fill="none" stroke="currentColor"/><rect x="267" y="55" width="105" height="105" rx="15" fill="none" stroke="currentColor" opacity=".55" stroke-dasharray="5 6"/><path d="M 319 92 v 28 m -14 -14 h 28" stroke="currentColor" opacity=".7" stroke-width="2"/>';
    } else if(c.id==='synchron') {
      art='<path d="M 24 166 C 95 165 79 68 184 62 S 295 117 391 43" fill="none" stroke="currentColor" opacity=".11" stroke-width="45"/><path d="M 24 166 C 95 165 79 68 184 62 S 295 117 391 43" fill="none" stroke="currentColor" opacity=".55" stroke-width="1.5"/>';
      art+=Array.from({length:8},(_,i)=>`<ellipse cx="${148+i*13}" cy="${63+(i>3?(i-3)*2:0)}" rx="5" ry="15" fill="none" stroke="currentColor"/><circle cx="${148+i*13}" cy="${48+(i>3?(i-3)*2:0)}" r="2.5" fill="currentColor"/><circle cx="${148+i*13}" cy="${78+(i>3?(i-3)*2:0)}" r="2.5" fill="currentColor"/>`).join('');
    } else {
      art='<rect x="63" y="30" width="151" height="151" rx="12" fill="currentColor" opacity=".08"/><g fill="currentColor" opacity=".3">'+dots(12,12,78,45,11,2)+'</g><g fill="currentColor">'+dots(4,4,100,67,22,3)+'</g>'+Array.from({length:4},(_,i)=>`<path d="M 220 ${75+i*21} H ${255+i*8} V ${74+i*21} H 357" fill="none" stroke="currentColor"/><circle cx="363" cy="${74+i*21}" r="5" fill="currentColor"/>`).join('');
    }
    return `<svg class="nv-diagram" viewBox="0 0 420 210" aria-hidden="true" focusable="false" style="color:${tone(c)}">${art}</svg>`;
  }
  function image(c: any, compact=false) {
    const media=c.media?.image;
    return `<div class="nv-photo ${compact?'nv-photo-small':''}" style="--nv-accent:${tone(c)}"><div class="nv-image-fallback" aria-hidden="true">${diagram(c)}<span>Interface concept</span></div>${media?`<img src="${safe(media.url)}" alt="${compact?'':e(media.alt)}" loading="${compact?'lazy':'eager'}" decoding="async" data-neuro-image style="object-position:${e(media.position||'50% 50%')}">`:''}</div>`;
  }
  function photo(c:any) {
    const m=c.media?.image;
    return `<figure class="nv-device-photo">${m?.kind==='video-preview'?player(c):image(c)}${m?`<figcaption><span>${e(m.caption)}</span><a href="${safe(m.source)}" target="_blank" rel="noopener noreferrer">${m.kind==='video-preview'?'Watch on YouTube':e(m.credit)} ↗</a></figcaption>`:''}</figure>`;
  }
  function player(c:any) {
    const v=c.media?.video;
    if(!v || !/^[\w-]{11}$/.test(v.id||''))return '';
    return `<div class="nv-video-frame"><button class="nv-video-poster" type="button" data-neuro-video="${v.id}" data-video-title="${e(v.title)}" aria-label="Play ${e(v.title)}"><img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" decoding="async"><span class="nv-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 5 11 7-11 7Z"/></svg></span><span class="nv-play-label">Play video <span aria-hidden="true">↗</span></span></button></div>`;
  }
  function video(c:any) {
    const v=c.media?.video;
    if(!v || !/^[\w-]{11}$/.test(v.id||''))return '';
    return `<section class="nv-watch"><div class="nv-section-label"><span>WATCH THE TECHNOLOGY</span><span>${e(v.channel)}</span></div>${player(c)}<h3>${e(v.title)}</h3><p>${e(v.description)}</p><a class="nv-source-link" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></section>`;
  }
  function watchNotes(c:any) {
    const v=c.media?.video;
    if(!v)return '';
    return `<section class="nv-watch-notes"><div class="nv-section-label"><span>INSIDE THE VIDEO</span><span>${e(v.channel)}</span></div><h3>${e(v.title)}</h3><p>${e(v.description)}</p><h4>As you watch, look for</h4><ul>${(v.focus||[]).map((f:string)=>`<li>${e(f)}</li>`).join('')}</ul><a class="nv-source-link" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></section>`;
  }
  function mechanism(c:any) {
    const v=c.visual;
    return `<section class="nv-mechanism"><div class="nv-section-label"><span>HOW IT SCALES</span><span>Concept · not to scale</span></div><div class="nv-diagram-stage" style="--nv-accent:${tone(c)}">${diagram(c)}</div><h3>${e(v?.title||c.mechanism)}</h3><p>${e(v?.description||c.thought)}</p><div class="nv-mechanism-steps">${(v?.steps||[]).map((s:string,i:number)=>`<span><b>${String(i+1).padStart(2,'0')}</b>${e(s)}</span>`).join('')}</div></section>`;
  }
  function gallery() {
    const companies=neuroIdeasData.companies;
    return `<section class="nv-gallery"><div class="section-heading"><div><span class="eyebrow">MEET THE INTERFACES</span><h2>Six approaches. Different tradeoffs.</h2></div><a href="${companyUrl('neuralink')}">Explore the visual guide ↗</a></div><div class="nv-gallery-grid">${companies.map((c:any)=>`<a class="nv-gallery-card" href="${companyUrl(c.id)}">${image(c,true)}<span><strong>${e(c.visual?.name||c.name)}</strong><small>${e(c.visual?.route||c.mechanism)}</small></span><i aria-hidden="true">↗</i></a>`).join('')}</div></section>`;
  }
  function profile(c:any) {
    return `<section class="nv-profile-media" aria-label="${e(c.name)} images and video"><div class="nv-profile-top">${photo(c)}${c.media?.image?.kind==='photo'?video(c):mechanism(c)}</div><div class="nv-profile-context"><strong>${e(c.media?.video?.title||'Video context')}</strong><p>${e(c.media?.video?.description||'')}</p></div><a class="nv-profile-cta" href="${companyUrl(c.id)}">${e(c.visual?.title||c.headline)} <span>Explore the visual count guide ↗</span></a></section>`;
  }
  function bind(container:HTMLElement) {
    container.querySelectorAll<HTMLImageElement>('[data-neuro-image]').forEach(img=>{
      const failed=()=>{img.hidden=true;img.parentElement?.classList.add('nv-image-unavailable');};
      img.addEventListener('error',failed,{once:true});
      if(img.complete && img.naturalWidth===0)failed();
    });
    container.querySelectorAll<HTMLButtonElement>('[data-neuro-video]').forEach(button=>button.addEventListener('click',()=>{
      const id=button.dataset.neuroVideo||'';
      if(!/^[\w-]{11}$/.test(id))return;
      const frame=document.createElement('iframe');
      frame.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';
      frame.title=button.dataset.videoTitle||'Technology video';
      frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen=true;
      frame.referrerPolicy='strict-origin-when-cross-origin';
      const host=button.parentElement!;
      host.nextElementSibling?.classList.contains('nv-player-status')&&host.nextElementSibling.remove();
      button.replaceWith(frame);frame.focus();
      // A client-blocked frame can remain about:blank. Keep the preview and a
      // direct link usable in that case; never alter browser blocking settings.
      window.setTimeout(()=>{
        if(!frame.isConnected)return;
        let blank=false;
        try{blank=frame.contentDocument?.URL==='about:blank';}catch(_){return;}
        if(!blank)return;
        const hadFocus=document.activeElement===frame;
        frame.replaceWith(button);
        const status=document.createElement('p');status.className='nv-player-status';status.setAttribute('role','status');
        status.innerHTML='The embedded player did not load. <a href="https://www.youtube.com/watch?v='+id+'" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>';
        host.insertAdjacentElement('afterend',status);
        if(hadFocus)button.focus();
      },8000);
    }));
  }
  return {diagram,image,photo,video,watchNotes,mechanism,gallery,profile,bind,tone};
})();
