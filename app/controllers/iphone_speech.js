'use strict';
var args = arguments[0] || {};
var utterance = require('bencoding.utterance');
var speech = utterance.createSpeech();

speech.addEventListener('started', function(d) {
	Ti.API.info(JSON.stringify(d));
});
speech.addEventListener('completed', function(d) {
	Ti.API.info(JSON.stringify(d));
});
speech.addEventListener('paused', function(d) {
	Ti.API.info(JSON.stringify(d));
});
speech.addEventListener('canceled', function(d) {
	Ti.API.info(JSON.stringify(d));
});
speech.addEventListener('continued', function(d) {
	Ti.API.info(JSON.stringify(d));
});

var inputText = Ti.UI.createTextArea({
	value : "こんにちは",
	backgroundColor : "#999",
	top : 60,
	bottom : 60,
	width : Ti.UI.FILL,
	borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
});
$.iphone_speech.add(inputText);

var playButton = Ti.UI.createButton({
	bottom : 10,
	title : "Play",
	left : 10,
	width : 50,
	height : 50
});
$.iphone_speech.add(playButton);

playButton.addEventListener('click', function() {

	if (speech.isSpeaking) {
		Ti.API.info("already speaking");
	}

	speech.startSpeaking({
		text : inputText.value
	});
});

var pauseButton = Ti.UI.createButton({
	bottom : 10,
	title : "Pause",
	left : 60,
	width : 50,
	height : 50
});
$.iphone_speech.add(pauseButton);

pauseButton.addEventListener('click', function() {

	if (!speech.isSpeaking) {
		Ti.API.info("Nothing to pause, press play first");
		return;
	}
	speech.pauseSpeaking();
});

var continueButton = Ti.UI.createButton({
	bottom : 10,
	title : "Continue",
	left : 110,
	width : 80,
	height : 50
});
$.iphone_speech.add(continueButton);

continueButton.addEventListener('click', function() {

	if (speech.isSpeaking) {
		Ti.API.info("Already speaking, nothing to continue");
		return;
	}
	speech.continueSpeaking();
});

var stopButton = Ti.UI.createButton({
	bottom : 10,
	title : "Stop",
	left : 190,
	width : 50,
	height : 50
});
$.iphone_speech.add(stopButton);

stopButton.addEventListener('click', function() {

	if (!speech.isSpeaking) {
		Ti.API.info("nothing to stop, press play first");
		return;
	}
	speech.stopSpeaking();
});

$.iphone_speech.addEventListener('open', function() {
	if (!utterance.isSupported()) {
		alert("sorry you need iOS7 or greater");
	}
});
$.iphone_speech.open();
