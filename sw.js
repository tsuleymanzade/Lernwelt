/* Programm kommt immer frisch aus dem Netz (Updates automatisch), offline aus dem Cache.
   Lernstände liegen in localStorage/IndexedDB und werden vom Update NIE angefasst. */
const C="lernwelt-2.3",A="lernwelt-audio",F=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png","spiele.html"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("lernwelt-")&&x!==C&&x!==A).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method==="GET"&&u.origin===location.origin&&/\/audio\/[0-9a-f]{8}\.mp3$/.test(u.pathname)){e.respondWith(caches.open(A).then(c=>c.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}))));return}
if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
e.respondWith(fetch(e.request,{cache:"no-cache"}).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
