/* শুধু অ্যাপের খোলস ক্যাশ হয় (আসল কনটেন্ট সবসময় সার্ভার থেকে) */
const C='ittihad-admin-v1',F=['./','index.html','../config.js','icon-192.png','icon-512.png','manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x.indexOf('ittihad-admin')===0).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin)return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)))});
