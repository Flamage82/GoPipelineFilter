var pipelines = {}

jQuery('#pipelines_selector').css('max-height', 'none');
jQuery('#pipelines_selector_pipelines').css('max-height', jQuery(window).height() * 0.8);

var element = jQuery(document.createElement('div'));
element.append('Collapse All');
element.css('float', 'right');
element.css('font-size', '18px');
element.css('margin-top', '4px');
element.css('margin-right', '20px');
element.click(collapseAll);
jQuery('.page_header').append(element);

var element = jQuery(document.createElement('div'));
element.append('Expand All');
element.css('float', 'right');
element.css('font-size', '18px');
element.css('margin-top', '4px');
element.css('margin-right', '20px');
element.click(expandAll);
jQuery('.page_header').append(element);

function toggle(event) {
    var item = jQuery(event.target).parent();
    var isVisible = jQuery('div', item).is(':visible');
    jQuery('h2', item).text(function(index, text) {
        var pipelineName = text.substring(2);
        if (isVisible) {
		    collapse(item);
		} else {
			expand(item);
		}
    });
};

function toggleFilter(event) {
    var item = jQuery(event.target).parent();
    var isVisible = jQuery('div', item).is(':visible');
    if (isVisible) {
        item.children('div').hide();
        jQuery(event.target).text('+');
    }
    else
    {
    	item.children('div').show();
        jQuery(event.target).text('−');
    }
};

function getStorageValue(key) {
    if (pipelines[key] === undefined) {
        pipelines[key] = true;
    }
    return pipelines[key];
}

function setStorageValue(key, value) {
    if (value !== pipelines[key]) {
        pipelines[key] = value;
        window.postMessage({ type: "setStorageValue", key: key, value: value }, "*");
    }
}

function collapse(item) {
    item.children('div').hide();
    jQuery('h2', item).text(function(index, text) {
        var pipelineName = text.substring(2);
        setStorageValue(pipelineName, true);
        return '+ ' + pipelineName; 
    });
};

function expand(item) {
    item.children('div').show();
    jQuery('h2', item).text(function(index, text) {
        var pipelineName = text.substring(2);
        setStorageValue(pipelineName, false);
        return '− ' + pipelineName; 
    });
};

function collapseAll(event) {
    jQuery('.content_wrapper_inner').each(function() {
        collapse(jQuery(this));
    });
};

function expandAll(event) {
    jQuery('.content_wrapper_inner').each(function() {
        expand(jQuery(this));
    });
};

function addCollapsingGroups() {
	jQuery('.content_wrapper_inner > h2').css('cursor', 'pointer');
	jQuery('.selector_group > span.label').css('cursor', 'pointer');

    jQuery('#pipeline_groups_container > div').each(function() {
        var pipelineName = jQuery(this).attr('id');
        pipelineName = pipelineName.substring(15, pipelineName.length - 6);
        
        var header = jQuery('h2', this);
        if (!jQuery(this).is("[collapsible]")) {
            header.text(function(index, text) { return '− ' + text; });
            header.css('-webkit-user-select', 'none');
            jQuery(this).attr("collapsible", "");
            header.click(toggle);
        }
        
        var result = getStorageValue(pipelineName, function(value) {
            if (value) {
                collapse(header.parent());
            }
        });
        if (result) {
            collapse(header.parent());
        }
    });
    
    jQuery('#pipelines_selector_pipelines > div').each(function() {
        var element = jQuery(document.createElement('span'));
        element.addClass('label');
        element.css('vertical-align', 'top');
        element.css('-webkit-user-select', 'none');
        element.append('+');
        element.click(toggleFilter);
        
        if (!jQuery(this).is("[collapsible]")) {
            jQuery(this).prepend(element);
            jQuery(this).children('div').hide();
            jQuery(this).attr("collapsible", "");
        }
    });
}

window.addEventListener("message", function(event) {
    if (event.source != window) {
        return;
    }

    if (!event.data.type) {
        return;
    }

    if (event.data.type === "init") {
        window.postMessage({ type: "getStorageValues" }, "*");
    }

    if (event.data.type === "retrievedStorageValues") {
        for (var value in event.data.values) {
            pipelines[value] = event.data.values[value];
        }
    	
        addCollapsingGroups();
    }
});

jQuery(document).bind("dashboard-refresh-completed", function(e, notModified) {
	addCollapsingGroups();
});

window.postMessage({ type: "getStorageValues" }, "*");