var totalDl
var monthDl
var weekDl
var dayDl
var spaceLeft
var statusString
var script
var history_content
var maxLength=30

document.onreadystatechange = function(){
	SettingsManager.loadFile();
	loadSettings();
	getHistory();
}

function getHistory(){
	var urlg="http://" + sabURL + "/sabnzbd/api?mode=history&output=json&limit=6&apikey=" + sabAPIKey;
	$.ajax({
		url: urlg,
		scriptCharset: "utf-8",
		dataType: 'jsonp',
		success: apiSuccess,
		error: jaxError
	});
}

function formatFail(text){
		image="<img src='images/fail.png' height='12' align='bottom'>";
		return "<a href='http://" + sabURL + "'><span style='color:brown; text-decoration:none'>" + text + "</span></a>";
}

function apiSuccess(data){
//	$( '#debug' ).val(dump(data));
	history_content=""
	totalDl=data.history.total_size
	monthDl=data.history.month_size
	weekDl=data.history.week_size
	dayDl=data.history.day_size
	spaceLeft = data.history.diskspace1 + "GB"
	statusString = "Overall: " + totalDl + " || Month: " + monthDl + " || Week: " + weekDl + " || Today: " + dayDl
	$( '#status' ).html(statusString);
	for (x in data.history.slots){
		if (data.history.slots[x].nzb_name.length>maxLength){
			name=data.history.slots[x].nzb_name.substring(0,maxLength) + "...";
		} else {
			name=data.history.slots[x].nzb_name
		}
		size = data.history.slots[x].size
		if (data.history.slots[x].script_line.indexOf("failed") != (-1)){ 
			fail = formatFail("Script Fail");
		} else if (data.history.slots[x].fail_message.indexOf("ile join") != (-1)){ 
			fail = formatFail("Join Fail");
		} else if (data.history.slots[x].fail_message.indexOf("failed") != (-1)){ 
			fail = formatFail("Unknown Failure");
		} else { 
			fail="<center>--</center>"; 
			image="<img src='images/pass.png' height='12' align='bottom'>";
		}




		history_content+="<table id='history_container'>"
			history_content+="<tr>"
			history_content+="<td id='history_status'>" + image + "</td>";
			history_content+="<td id='history_title'>" + name + "</td>";
			history_content+="<td id='history_atts'>" + size + "</td>";
			history_content+="<td id='history_script'>" + fail + "</td>";
			history_content+="</tr>"		
		history_content+="</table>"		
	}
	$( '#history' ).html(history_content);


}

function jaxError(data){
	$('#status').val("Error");
}

function loadSettings(){
	sabURL = SettingsManager.getValue("sabURL", "sabURL");
	sabAPIKey = SettingsManager.getValue("sabAPIKey", "sabAPIKey");
	idleRefresh = SettingsManager.getValue("idleRefresh", "idleRefresh", 10000);
	activeRefresh = SettingsManager.getValue("activeRefresh", "activeRefresh", 2000);
}


function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}