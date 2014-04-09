if (OS_IOS) {
	var win = Alloy.createController('iphone_speech').getView();
	win.open();
} else {
	var win = Alloy.createController('android_tts').getView();
	win.open();
}