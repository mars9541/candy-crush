function loadScript(src, progressCallback, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var result = xhr.response;
        var script = document.createElement('script');
        if (result) {
            script.innerHTML = result;
        }
        else {
            script.src = src;
        }
        script.async = false;
        script.defer = false;
        document.head.appendChild(script);
        if (callback) callback();
    };
    xhr.onerror = callback;
    xhr.onprogress = progressCallback || null;
    xhr.open('get', src);
    xhr.responseType = 'text';
    xhr.send();
}

function addScriptTag(src) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.defer = false;
    document.head.appendChild(script);
}

var loadProgress = document.getElementById('loadProgress');
loadScript('lib/phaser.js', function (e) {
    if (e.lengthComputable) {
        loadProgress.value = e.loaded;
        loadProgress.max = e.total;
    }
    else {
        loadProgress.value = e.loaded;
        loadProgress.max = 3169095;
    }
}, function (e) {
    if (e) {
        loading.innerText = 'Unable to load Phaser.js';
        return;
    }
    loading.innerText = 'Loading my program';
    var srcs = [
      'js/Load.js',
      'js/model/Board.js',
      'js/model/Shape.js',
      'js/model/Swap.js',
      'js/model/Match.js',
      'js/model/Debug.js',
      'js/GameScreen.js',
      'js/Ball.js',
      'js/TouchDetector.js',
      'js/applefools/AppleFools.js',
      'js/applefools/MainMenu.js',
      'js/Boot.js'
    ];
    for (var i = 0; i < srcs.length; i++) {
        addScriptTag(srcs[i]);
    }
});

// To punish IE user
Object.assign = Object.assign || function (target, sources) {
    var to = Object(target);
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        if (source != null) {
            for (var k in source) {
                if (source.hasOwnProperty(k)) {
                    to[k] = source[k];
                }
            }
        }
    }
    return to;
};
