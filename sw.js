var CACHENAME = 'shapeclear';
var VERSION = 'v0.7af';
var myPath = location.origin + location.pathname;
myPath = myPath.match(/(.*\/)/)[1];

self.addEventListener('fetch', function(event) {
    if (event.request) {
        var url = event.request.url;
        if (url.startsWith(myPath + 'cache/')) {
            cacheSettings(url.substring(myPath.length + 6), event);
        }
        else {
            event.respondWith(fromCache(event.request, event));
        }
    }
});

function cacheSettings(url, event) {
    if (url === 'delete') {
        event.waitUntil(preLoad());
        event.respondWith(new Response('ok'));
        console.log('cache cleared');
    }
    else {
        event.respondWith(noPage()); // need to get a promise
    }
}

addEventListener('install', function (event) {
    event.waitUntil(preLoad());
    skipWaiting();
});

addEventListener('activate', function (event) {
    event.waitUntil(clients.claim());
});

// with help from https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html
function preLoad() {
    var mustDownload = [
      'js/swLoader.js',
      'js/GameLoader.js',
      'js/alertbox.js',
      'css/fullscreen.css',
      'css/alertbox.css',
      'game.html',
      'index.html',
      '',
      '404.html',
      'config.html'
    ];
    for (var i = 0; i < mustDownload.length; i++) {
        mustDownload[i] = myPath + mustDownload[i];
    }
    var c, names = [], must = new Set(mustDownload);
    return caches.open(CACHENAME).then(function (cache) {
        c = cache;
        return c.keys().then(function (keys) {
            names = keys;
            return cache.addAll(mustDownload);
        });
    }).then(function () {
        names.forEach(function (name) {
            if (!must.has(name.url)) {
                console.log("delete " + name.url);
                c['delete'](name);
            }
        });
        console.log('preloaded');
    })['catch'](function (x) {
        console.log(x);
    });
}

function fromCache(req, event) {
    var nocache = false;
    var c;
    return caches.open(CACHENAME).then(function (cache) {
        c = cache;
        return c.match(req, {ignoreSearch: true}).then(function (result) {
            if (result) {
                // update cache
                if (event) event.waitUntil(updateCache(req, cache));
                return result;
            }
            nocache = true;
            return Promise.reject("cache miss");
        });
    })['catch'](function (x) {
        if (!nocache) {
            console.log(x);
        }
        return fetch(req);
    }).then(function (result) {
        // add to cache
        if (nocache && event && result.ok) {
            event.waitUntil(c.put(req, result.clone()));
        }
        return result;
    })['catch'](noPage);
}

function updateCache(req, cache) {
    return fetch(req).then(function (result) {
        if (result.ok) {
            return cache.put(req, result);
        }
    })['catch'](function (x) {
        console.log(x);
    });
}

function noPage() {
    return caches.match('404.html').then(function (result) {
        if (result) return new Response(result.body, {status: 404});
        return new Response(
          '<!DOCTYPE html><html><head>\n' +
          '<meta charset="UTF-8">\n' +
          '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
          '<title>File not found</title></head>\n' +
          '<body><h1>File not found</h1></body></html>'
        , {status: 404, headers: {'Content-Type': 'text/html'}}
        );
    });
}
