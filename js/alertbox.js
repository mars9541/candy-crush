function errorHandler(msg, source, lineno, colno, err) {
    window.onerror = null;
    document.getElementById('alert').style.visibility = 'visible';
    var des =
      'Shape Clear has encountered an error' + '\n' +
      msg + '\n';
    if (msg.match(/script error/i)) {
        des += 'see Browser Console for more information';
    }
    else {
        des +=
          'source: ' + source + '\n' +
          'position: ' + lineno + ',' + colno + '\n' +
          'stack trace: \n' + err.stack;
    }
    document.getElementById('description').innerText = des;
}

function closeErrorBox() {
    document.getElementById('alert').style.visibility = 'hidden';
    window.onerror = errorHandler;
}

// Add error handler
window.onerror = errorHandler;
document.getElementById('close').addEventListener('click', closeErrorBox);

var promptCallback = null;
function promptBox(message, defaultValue, callback) {
    var box = document.getElementById('prompt');
    var msg = document.getElementById('promptMessage')
    var input = document.getElementById('promptInput');
    if (typeof message == 'undefined') {
        message = '';
    }
    msg.innerText = message;
    if (typeof defaultValue == 'undefined') {
        defaultValue = '';
    }
    if (!callback) {
        callback = function (result) {
            console.log(result);
        };
    }
    input.value = defaultValue;
    box.style.visibility = 'visible';
    promptCallback = function (ok) {
        box.style.visibility = 'hidden';
        promptCallback = null;
        if (ok) {
            callback(input.value);
        }
        else {
            callback(null);
        }
    };
}
