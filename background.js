// function getDomainFromUrl(url) {
// 	var host = "null";
// 	if (typeof url == "undefined" || null == url)
// 		url = window.location.href;
// 	var regex = /.*\:\/\/([^\/]*).*/;
// 	var match = url.match(regex);
// 	if (typeof match != "undefined" && null != match)
// 		host = match[1];
// 	return host;
// }


function checkForValidUrl(tabId, changeInfo, tab) {
	//if(getDomainFromUrl(tab.url).toLowerCase()=="tieba.baidu.com"){
	chrome.pageAction.show(tabId);
	//}
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

//var state="open";


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	//console.log(sender.tab ?  "from a content script:" + sender.tab.url : "from the extension");
	//sendResponse({state: state});

	switch (request.type) {
		case 'cookies_getAll': chrome.cookies.getAll(request.data, function (cookies) {
			console.log(cookies)
			console.log(JSON.stringify(cookies));
			sendResponse({ 'cookies': cookies, 'message': '成功' });
		}); break;
		case 'cookies_set': console.log(request.data); chrome.cookies.set(request.data); sendResponse({ 'message': '提交成功' }); break;
		case 'cookies_remove': console.log(request.data); chrome.cookies.remove(request.data); sendResponse({ 'message': '删除成功' }); break;

	}
	return true;
});



// const tab_log = function(json_args) {
//   var args = JSON.parse(unescape(json_args));
//   console[args[0]].apply(console, Array.prototype.slice.call(args, 1));
// }
//
// chrome.extension.onRequest.addListener(function(request) {
//   if (request.command !== 'sendToConsole')
//     return;
//   chrome.tabs.executeScript(request.tabId, {
//       code: "("+ tab_log + ")('" + request.args + "');",
//   });
// });

/* Keep track of the active tab in each window */
// var activeTabs = {};

// chrome.tabs.onActivated.addListener(function(details) {
// 	activeTabs[details.windowId] = details.tabId;
// });

// /* Clear the corresponding entry, whenever a window is closed */
// chrome.windows.onRemoved.addListener(function(winId) {
// 	delete(activeTabs[winId]);
// });

// /* Listen for web-requests and filter them */
// chrome.webRequest.onBeforeRequest.addListener(function(details) {
// 	if (details.tabId == -1) {
// 		console.log("Skipping request from non-tabbed context...");
// 		return;
// 	}

// 	var notInteresting = Object.keys(activeTabs).every(function(key) {
// 		if (activeTabs[key] == details.tabId) {
// 			/* We are interested in this request */
// 			console.log("Check this out:", details);
// 			return false;
// 		} else {
// 			return true;
// 		}
// 	});

// 	if (notInteresting) {
// 		/* We are not interested in this request */
// 		console.log("Just ignore this one:", details);
// 	}
// }, { urls: ["<all_urls>"] });

// /* Get the active tabs in all currently open windows */
// chrome.tabs.query({ active: true }, function(tabs) {
// 	tabs.forEach(function(tab) {
// 		activeTabs[tab.windowId] = tab.id;
// 	});
// 	console.log("activeTabs = ", activeTabs);
// });
//////////////////////////////
chrome.webRequest.onBeforeRequest.addListener(function (details) {
	//console.log(details)
	if (details.method == "GET" && details.type == "script") {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", details.url, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {

				var content = xhr.responseText
				if (new RegExp('^[^\\(\\)]+\\([^\\(\\)]+\\);?$').test(content)) {
					console.log(content)

				}
			}
		}
		xhr.send();
	}
}, { urls: ["<all_urls>"] })