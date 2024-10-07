
const staticCacheName = 'farhan-static';
const dynamicCache = 'farhan-dynamic';
const assets = [
  'index.html',
  'images/title.png',
  'styles/style.css',
  'styles/responsive.css',
  'app.js',
  'images/hero.svg',
  'images/Logo_Unand_PTNBH.png',
  'offline.html'
];

self.addEventListener('install', evt =>{
  //console.log('service worker has been installed');
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  )
})

self.addEventListener('activate', evt =>{
  //console.log('service worker has been activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      // console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete())
      )
    })
  )
})
//CONTOH COMMIT KE GITHUB
self.addEventListener('fetch', evt =>{
  //console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCache).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;

        })
      });
    }).catch(() => caches.match('offline.html'))
  );
});
