const C='opaline-v1',A=['./','index.html','app.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.oninstall=e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()};
self.onactivate=e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))));
self.onfetch=e=>{const u=new URL(e.request.url);if(u.origin!==location.origin)return;
e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))};
