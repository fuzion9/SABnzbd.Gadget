// JavaScript Document
document.onreadystatechange = function(){  
    if(document.readyState=="complete"){
			SettingsManager.loadFile();
		    sabURL.value = SettingsManager.getValue("sabURL", "sabURL");
		    sabAPIKey.value = SettingsManager.getValue("sabAPIKey", "sabAPIKey");
		    idleRefresh.value = SettingsManager.getValue("idleRefresh", "idleRefresh", 10000);
		    activeRefresh.value = SettingsManager.getValue("activeRefresh", "activeRefresh", 2000);
			System.Gadget.document.parentWindow.stopTimer();
    }        
}

System.Gadget.onSettingsClosing = function(event){
    if (event.closeAction == event.Action.commit){
            SettingsManager.setValue("sabURL", "sabURL", sabURL.value);
            SettingsManager.setValue("sabAPIKey", "sabAPIKey", sabAPIKey.value);
            SettingsManager.setValue("idleRefresh", "idleRefresh", idleRefresh.value);
            SettingsManager.setValue("activeRefresh", "activeRefresh", activeRefresh.value);
			SettingsManager.saveFile();
			System.Gadget.document.parentWindow.setStatus("Saved Settings");
        	event.cancel = false;
    }
}