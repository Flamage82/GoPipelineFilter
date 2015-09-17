function getStorageValue(key, callback) {
    chrome.storage.sync.get(key, function(values) {
        callback(values[key]);
    });
}

function setStorageValue(key, value) {
    var object = {};
    object[key] = value;
    chrome.storage.sync.set(object);
}

(function() { 
    window.addEventListener("message", function(event) {
        if (event.source != window) {
            return;
        }

        if (event.data.type && (event.data.type == "getStorageValue")) {
            getStorageValue(event.data.key, function(value) {
                window.postMessage({ type: "retrievedStorageValue", key: event.data.key, value: value }, "*");
            })
        }

        if (event.data.type && (event.data.type == "setStorageValue")) {
            setStorageValue(event.data.key, event.data.value);
        }
    });

    var script = document.createElement('script'); 
    script.type = 'text/javascript'; 
    script.src = chrome.extension.getURL('script_embed.js'); 
    document.body.appendChild(script); 
})(); 