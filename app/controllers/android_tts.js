var tts = require('jp.isisredirect.tts');
function clearPicker(picker) {
	Ti.API.info(JSON.stringify(picker));
	alert("picker.columns.length = " + picker.columns.length);
	for (var i = 0, l = picker.columns.length; i < l; ++i) {
		var _col = picker.columns[0];
		if(_col)　{
			var len = _col.rowCount;
			for( var x = len - 1; x >= 0; x-- ) {
			　　　var _row = _col.rows[x];
			　　　_col.removeRow(_row);
			}
			//picker.reloadColumn(_col);
		}
	}
}
// step 1 obtain list of TTS Engines installed in Android device 
var engines = tts.getEngines();
var pickerdata = [];
var lastselectedpackagename = null; 
for (var key in engines) {
	if (lastselectedpackagename == null) {
		lastselectedpackagename = engines[key];
	}
	pickerdata.push(Ti.UI.createPickerRow({title:key, packagename:engines[key]}));
}
$.enginespicker.add(pickerdata);
$.enginespicker.selectionIndicator = true;
$.enginespicker.addEventListener('change', function(e) {
	alert("enginespicker");
	Ti.API.debug("enginespicker change");
	clearPicker($.voicespicker);
	lastselectedpackagename = e.row.packagename;
	tts.checkTTS(e.row.packagename);
});
// step 5 select language and speak
$.voicespicker.addEventListener('change', function(e) {
	Ti.API.debug("$.voicespicker change /tts.isInitialized:" + tts.isInitialized);
	if (tts.isInitialized) {
		alert("initialized");
		var newlang = e.row.title;//.replace(/\-/g, "_").toLowerCase();
		Ti.API.debug("voicespicker change:" + newlang);
		tts.setLanguage(newlang);
	}else{
		alert("not initialized");
	}
});
// step 6 select language and speak
$.speakbutton.addEventListener('click', function(e) {
	alert("speak button clicked");
	tts.speak("こんにちは　Hello", "Hello");		
});
// appendix: open TTS Setting Preferrence 
$.settingbutton.addEventListener('click', function(e) {
	alert("settingbutton");
	tts.showTTSSettings();
});
$.android_tts.addEventListener('postlayout',function(e){
	// step 2 send checkTTS message to obtain voice list by package name of TTS Engine asynchronously
	tts.checkTTS(lastselectedpackagename);
	
	// step 3 reveive TTS_CHKOK event with voice list and send message to create instance of TTS Engine
	tts.addEventListener(tts.TTS_CHKOK, function(e) {
		alert("tts.TTS_CHKOK");
		Ti.API.debug(tts.TTS_CHKOK + "voices :" + e.voices);
		clearPicker($.voicespicker);
		var pickerdata = [];
		for (var i = 0, l = e.voices.length; i < l; ++i) {
			pickerdata.push(Ti.UI.createPickerRow({title:e.voices[i], packagename:lastselectedpackagename}));
		}
		$.voicespicker.add(pickerdata);
		$.voicespicker.selectionIndicator = true;
		
		tts.initTTS(lastselectedpackagename);
	});
	
	// step 4 receive TTS_INITOK event that means TTS Engine is initialized ready to speak.
	tts.addEventListener(tts.TTS_INITOK, function(e) {
		alert("tts.TTS_INITOK");
		Ti.API.debug("tts engine is initialized");
		$.speakbutton.enabled = true;

		var lang = tts.getLanguage().toString();
		lang = lang.replace(/_/g, "-").toLowerCase();
		var rows = $.voicespicker.children[0].rows;
		var f = -1;

		alert(rows.length);
		for (var i = 0, l = rows.length; i < l; ++i) {
			var checklang = rows[i]["title"];
			Ti.API.info(checklang);
			checklang = checklang.replace(/_/g, "-").toLowerCase();
			if (checklang == lang) {
				f = i;
				break;
			}
		}
		if (0 <= f) {
			$.voicespicker.setSelectedRow(0, f);
		}
	}); 
	
	// step 7 receve TTS_UTTERANCE_COMPLETE to do something optionally
	tts.addEventListener(tts.TTS_UTTERANCE_COMPLETE, function(e) {
		alert("utterance complete");
		if (e.utteranceid == "Hello") {
			tts.speak("よの なか　world");
		}
	}); 
	
	// appendix: error handler
	tts.addEventListener(tts.TTS_ERROR, function(e) {
		alert('Starting Error');
	});
	
	// appendix: Android OS start to navigate user for installation of TTS Engine on Market place 
	tts.addEventListener(tts.TTS_INSTALL_START, function(e) {
		alert('Starting TTS');
	});
});
