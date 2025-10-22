/**
 * qtail sw.js by @LateDreamXD
 */
const cacheName = 'qtail-v3.1';
const shellFiles = [
	'/',
	'/index.html',
	'/qtail.webmanifest',
	'/favicon.png'
];

self.addEventListener('install', (event) => {
	console.log('[ServiceWorker] Install');

	event.waitUntil(
		caches.open(cacheName)
			.then((cache) => {
				console.log('[ServiceWorker] Caching app shell');
				cache.addAll(shellFiles);
			})
	);
});

self.addEventListener('activate', (event) => {
	console.log('[ServiceWorker] Activate');

	event.waitUntil(
		caches.keys()
			.then((keys) => Promise.all(keys.map((key) => {
				if (key !== cacheName) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}))
		)
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request)
			.then((response) => {
				// if (response) {
				// 	console.log('[ServiceWorker] Serving from cache', event.request.url);
				// 	return response;
				// }

				console.log(`[ServiceWorker] Fetching ${event.request.url} from network`);
				return fetch(event.request).then((response) => {
					caches.open(cacheName)
						.then(async(cache) => {
							const cacheResponse = await fetch(event.request.url);
							// 太草了 不知道为什么非得用await而不能用then 不然的话响应体总是undefined
							cache.put(event.request, cacheResponse.clone());
							// cache.put(event.request.url, response.clone());
							// TypeError: Failed to execute 'clone' on 'Response': Response body is already used
						});
					console.log(`[ServiceWorker] Fetched ${event.request.url} from network and cached`);
					return response;
				});
			})
			.catch(() => {
				console.log(`[ServiceWorker] Network request failed. Serving ${event.request.url} from cache`);
				return caches.match(event.request);
			})
	);
});