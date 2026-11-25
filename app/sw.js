/* অ্যাপের খোলস + অফলাইন কপি (offline.html) + ফন্ট ক্যাশ হয়। আসল তথ্য ফোনে এনক্রিপ্ট করা থাকে (localStorage «ito»), এখানে নয়। */
const C='ittihad-app-v5',FC='ittihad-fonts-v2';
const F=['./','index.html','offline.html','../config.js','icon-192.png','icon-512.png','maskable-192.png','maskable-512.png','manifest.json'];
const FONTS='https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Anek+Bangla:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Outfit:wght@500;600;700&family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap';
/* ফন্ট আগেই রেখে দেওয়া — যাতে প্রথমবার নেট ছাড়া খুললেও বাংলা/আরবি ঠিকঠাক দেখায় */
async function warmFonts(){try{const c=await caches.open(FC);const r=await fetch(FONTS,{mode:'cors'});if(!r.ok)return;const css=await r.clone().text();await c.put(FONTS,r);
 const urls=[...new Set((css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)||[]).map(x=>x.slice(4,-1)))];
 for(const u of urls){try{if(!(await c.match(u))){const fr=await fetch(u,{mode:'cors'});if(fr.ok)await c.put(u,fr)}}catch(e){}}}catch(e){}}
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x.indexOf('ittihad-app')===0).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));warmFonts()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);
 if(u.origin==='https://fonts.googleapis.com'||u.origin==='https://fonts.gstatic.com'){
  e.respondWith(caches.open(FC).then(c=>c.match(e.request.url).then(m=>m||fetch(e.request).then(r=>{if(r.ok||r.type==='opaque')c.put(e.request.url,r.clone());return r}))));return}
 if(u.origin!==location.origin)return;
 /* নিজের ফাইল: আগে নেট (নতুন সংস্করণ), না পেলে ক্যাশ; offline.html চাইলে সবসময় পাওয়া যায় */
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||(e.request.mode==='navigate'?caches.match('offline.html'):undefined))))});
