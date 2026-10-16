const V='reban-v9', LIBS=['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js','https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(V).then(c=>Promise.all(['./','index.html',...LIBS].map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return; const u=new URL(r.url);
  if(u.hostname.endsWith('supabase.co')) return;
  const isLib=LIBS.includes(r.url), same=u.origin===location.origin;
  if(!isLib&&!same) return;
  if(isLib){ e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{ const cp=x.clone(); caches.open(V).then(c=>c.put(r,cp)); return x; }))); return; }
  e.respondWith(fetch(r).then(x=>{ const cp=x.clone(); caches.open(V).then(c=>c.put(r,cp)); return x; }).catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||caches.match('index.html'))));
});
