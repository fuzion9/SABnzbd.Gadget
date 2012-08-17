var debug=0;
var refreshRate="Unknown";
var idleRefreshRate=10000;
var activeRefreshRate=2000;
var queueLayer="";
var currentSlots = -1;
var sabConnectionError=0;
var sabURL ="";
var sabAPIKey="";
var timer;
var	doProcessOK=0;


document.onreadystatechange = function(){    
    if(document.readyState=="complete"){
		queueLayer = $('#queue').html();
        System.Gadget.settingsUI = "settings.html";
        System.Gadget.onSettingsClosed = settingsClosed;
		startUp();
    }        
}


function startUp(){
		SettingsManager.loadFile();
		loadSettings();
		if (sabConnectionError){
			$('#queue').html(sabConnectionError)
		} else {
			resetQueueLayer();
			getQueue();
		}
}


function getQueue(){
	if (doProcessOK){
		var urlg="http://" + sabURL + "/sabnzbd/api?mode=queue&output=json&apikey=" + sabAPIKey;
		$.ajax({
				url: urlg,
				dataType: 'jsonp',
				success: apiSuccess,
				error:jaxError
			});
	}
}

function resetQueueLayer(){
	$('#queue').html(queueLayer);
}

function apiSuccess(data) {
	if (data.queue != null && data.queue != "undefined"){
		if (data.queue.speed=="0  "){ data.queue.speed="0 KB/s"; } else { data.queue.speed=data.queue.speed + "/s"; }
		if (data.queue.status=="Paused") data.queue.speed="<span style='color:yellow'>" + data.queue.speed + "</span>";
		if (data.queue.status=="Idle"){ refreshRate=idleRefreshRate; } else { refreshRate=activeRefreshRate; }
		$('#speed').html(data.queue.speed);
		setStatus(data.queue.status);
		
		if (data.queue.slots){
			if (currentSlots!=data.queue.slots.length){
				resetQueueLayer();
				currentSlots=data.queue.slots.length
			}
			for (x in data.queue.slots){
				percent=data.queue.slots[x].percentage
				size = data.queue.slots[x].size
				updateProgress("p" + x, percent, percent + "% of " + size, data.queue.slots[x].filename.substring(0,28));
			}
		} 
	} else { 
		setStatus("Connection Error");
		$('#queue').html("<br><br><center>SAB Server responded with bad data.<br><br>Check API Key</center>");
		return;
	}

timer=setTimeout('getQueue()', refreshRate);
}


function jaxError(e, t, text){
	setStatus("Com Error");
	$('#queue').html("<br><br><br><center>Check your server settings and API key<br><br></center>");
}

function settingsClosed(event){
	startUp();
}

function updateProgress(bar, val, barText, filename){
	if ($( "#" + bar ).length > 0){
		$( "#" + bar + "_container" ).show();
		$( "#" + bar ).progressbar({ value: val });	
		$( "#" + bar ).progressbar( 'value',  val );	
		$( "#" + bar + "_text" ).html( barText );	
		$( "#" + bar + "_filename" ).html( filename );	
	}
}

function setStatus(status){
		$('#status').html(status);
}

function loadSettings(){
	setStatus("Loading Settings");
	sabURL = SettingsManager.getValue("sabURL", "sabURL");
	queueLayer = queueLayer.replace("sabURL", sabURL);
	sabAPIKey = SettingsManager.getValue("sabAPIKey", "sabAPIKey");
	idleRefresh = SettingsManager.getValue("idleRefresh", "idleRefresh", 10000);
	activeRefresh = SettingsManager.getValue("activeRefresh", "activeRefresh", 2000);
    if(sabURL == ""){ sabConnectionError="<br><br><br><center>SAB Server<br>Not Configured</center>"; } else { sabConnectionError=0; }
	setStatus("Settings Loaded");
	doProcessOK=1;
}

function stopTimer(){
	doProcessOK=0;
	clearTimeout(timer);
}