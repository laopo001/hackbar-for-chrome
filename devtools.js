// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// chrome.devtools.panels.create("Panel", "icon.png", "panel.html", function(panel){});
chrome.devtools.panels.create(
    'HackBar',
    null, // No icon path
    'Panel/index.html',
    function(panel){

        chrome.devtools.network.onRequestFinished.addListener(
            function(request) {

                var div = document.createElement("div");
                var text = document.createTextNode(JSON.stringify(request));
                div.appendChild(text);
                document.body.appendChild(div);

            });
    }
);
// var backgroundPageConnection = chrome.runtime.connect({
//     name: "devtools-page"
// });
//
// backgroundPageConnection.postMessage({
//     name: 'init',
//     tabId: chrome.devtools.inspectedWindow.tabId
// });


// chrome.experimental.devtools.console.addMessage(
//     chrome.experimental.devtools.console.Severity.Warning,
//     "Large image: " + '123123');
//
// chrome.devtools.network.onRequestFinished.addListener(function(req) {
//     // Displayed sample TCP connection time here
//     console.log(req.timings.connect);
// });
//
//
// chrome.devtools.network.onRequestFinished.addListener(
//     function(request) {
//
//       chrome.experimental.devtools.console.addMessage(
//           chrome.experimental.devtools.console.Severity.Warning,
//           "Large image: " + request.request.url);
//     });
//
//
// chrome.devtools.network.getHAR(function(result) {
//   var entries = result.entries;
//
//     Console.warn('result',result);
//
//
//
//   chrome.devtools.network.onRequestFinished.addListener(function (x) {
//     console.log(x);
//   });
// });
