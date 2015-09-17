(function() {
    window.addEventListener("message", function(event) {
        if (event.source != window) {
            return;
        }

        if (event.data.type && (event.data.type == "getStorageValues")) {
            chrome.storage.sync.get(null, function(values) {
                window.postMessage({ type: "retrievedStorageValues", values: values }, "*");
            });
        }

        if (event.data.type && (event.data.type == "setStorageValue")) {
            var object = {};
            object[event.data.key] = event.data.value;
            chrome.storage.sync.set(object);
        }
    });

    var script = document.createElement('script'); 
    script.type = 'text/javascript'; 
    script.src = chrome.extension.getURL('script_embed.js'); 
    document.body.appendChild(script); 
})();