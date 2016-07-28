var myPushNotification;

// result contains any message sent from the plugin call
function successHandler (result) {
   // alert('result = ' + result);

}
// result contains any error description text returned from the plugin call
function errorHandler (error) {
    //alert('error = ' + error);
}
function replaceHtml(el, html) {
    var oldEl = typeof el === "string" ? document.getElementById(el) : el;
    var newEl = oldEl.cloneNode(false);
    newEl.innerHTML = html;
    oldEl.parentNode.replaceChild(newEl, oldEl);
    return newEl;
};
function server_url()
{
    return "http://www.eylftools.com.au/MobileApp2015/lib.php";  //Stores the url of the notification server backend
}
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        if(device.platform=='android' ||device.platform=='Android')
            android_receivehandler();  //Getting badge counts of Android device from the server
        else
            receivehandler(); //Getting badge counts of iOS device from the server
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        try
        {
            if(window.plugins && window.plugins.pushNotification){
                myPushNotification = window.plugins.pushNotification;
            }else{
                window.plugins = {};
                window.plugins.pushNotification = new PushNotification();
            }

            if(typeof window.device === 'undefined' || typeof device === 'undefined'){
                alert('Device plugin not found');
            }else{

                //Android register
                if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
                    myPushNotification.register(
                        successHandler,
                        errorHandler,
                        {
                            "senderID":"177754782124",
                            "ecb":"onNotification"
                        });

                    //Blackberry
                }else if(device.platform == 'blackberry10'){
                    myPushNotification.register(
                        successHandler,
                        errorHandler,
                        {
                            invokeTargetId : "replace_with_invoke_target_id",
                            appId: "replace_with_app_id",
                            ppgUrl:"replace_with_ppg_url", //remove for BES pushes
                            ecb: "pushNotificationHandler",
                            simChangeCallback: replace_with_simChange_callback,
                            pushTransportReadyCallback: replace_with_pushTransportReady_callback,
                            launchApplicationOnPush: true
                        });

                    //iPhone - iPad
                }else{
                    myPushNotification.register(
                        tokenHandler,
                        errorHandler,
                        {
                            "badge":"true",
                            "sound":"true",
                            "alert":"true",
                            "ecb":"onNotificationAPN"
                        });
                }

            }//End device plugin check.

        }catch(e){
            alert("Plugin of PushNotify niet beschikbaar\n" + e.message);
        }
    }
};

// Android and Amazon Fire OS onNotification
function onNotification(e) {

    switch( e.event )
    {

        case 'registered':
           // alert( "registered");

            if ( e.regid.length > 0 )
            {
                //Register our device

                window.localStorage['regID']= e.regid; //Stores the Google Registration ID for later use

                var url=server_url()+'?mode=newreg&&regid='+ e.regid+'&&uuid='+device.uuid;
                $.post(url,
                    {

                    }, function(res){
                        //alert("Your device is successfully registered!")
                    });
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                //console.log("regID = " + e.regid);
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if ( e.foreground )
            {
              //  alert('<li>--INLINE NOTIFICATION--' + '</li>');

                // on Android soundname is outside the payload.
                // On Amazon FireOS all custom attributes are contained within payload
                cordova.plugins.notification.badge.increase();
                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.
               // var my_media = new Media("./ringtone.mp3");
                //my_media.play();
            }
            else
            {  // otherwise we were launched because the user touched a notification in the notification tray.
                if ( e.coldstart )
                {
                    cordova.plugins.notification.badge.clear();
                  //  alert('<li>--COLDSTART NOTIFICATION--' + '</li>');
                }
                else
                {
                    cordova.plugins.notification.badge.increase();
                    //alert('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
            }
            android_receivehandler();

            /*alert('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            //Only works for GCM
            alert('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            //Only works on Amazon Fire OS
            alert('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');*/
            break;

        case 'error':
            alert('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
            alert('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}

// iOS Notification Receive Handler
function receivehandler()
{

    var url=server_url()+'?mode=getbadge&&token='+window.localStorage['token'];
    $.post(url,
    {

    }, function(res){

        var badges=res.split(",");
        if(badges[0]!='0' && badges[0] && badges[0]!='NULL' && badges[0]!='null')
        {
            document.getElementById('badge_observation').innerHTML=badges[0];
            document.getElementById("badge_observation").setAttribute("style","visibility:visible");
        }
        else
            document.getElementById("badge_observation").setAttribute("style","visibility:hidden");
        if(badges[1]!='0' && badges[1] && badges[1]!='NULL' && badges[1]!='null')
        {
            document.getElementById('badge_experiences').innerHTML=badges[1];
            document.getElementById("badge_experiences").setAttribute("style","visibility:visible");
        }
        else
            document.getElementById("badge_experiences").setAttribute("style","visibility:hidden");
        if(badges[2]!='0' && badges[2] && badges[2]!='NULL' && badges[2]!='null')
        {
            document.getElementById('badge_news').innerHTML=badges[2];
            document.getElementById("badge_news").setAttribute("style","visibility:visible");
        }
        else
            document.getElementById("badge_news").setAttribute("style","visibility:hidden");

    });
}
// Android GCM Notification Receive Handler
function android_receivehandler()
{
    var url=server_url()+'?mode=androidgetbadge&&token='+window.localStorage['regID'];
    //Sending badge count get request on Notification Server
    $.post(url,
        {

        }, function(res){
            var badges=res.split(",");
            //Shows the badge counts on menus, if count is 0 it hides the badge count
            document.getElementById("badge_observation").setAttribute("style","visibility:hidden");
            document.getElementById("badge_experiences").setAttribute("style","visibility:hidden");
            document.getElementById("badge_news").setAttribute("style","visibility:hidden");
            if(badges[0]!='0' && badges[0].length>0 && badges[0]!='undefined')
            {
                document.getElementById('badge_observation').innerHTML=badges[0];
                document.getElementById("badge_observation").setAttribute("style","visibility:visible");
            }
            if(badges[1]!='0' && badges[1].length>0 && badges[1]!='undefined')
            {
                document.getElementById('badge_experiences').innerHTML=badges[1];
                document.getElementById("badge_experiences").setAttribute("style","visibility:visible");
            }
            if(badges[2]!='0' && badges[2].length>0 && badges[2]!='undefined')
            {
                document.getElementById('badge_news').innerHTML=badges[2];
                document.getElementById("badge_news").setAttribute("style","visibility:visible");
            }
        });
}
document.addEventListener("resume", function(){
    if(device.platform=='android' ||device.platform=='Android')
        android_receivehandler();
    else
        receivehandler();
    //Invokes the notification handlers on resume event
});
//iOS Notification receive event
function onNotificationAPN (event) {
    navigator.notification.alert(event.alert, receivehandler, "Notification","OK");
  //  myApp.alert(event.alert,"Notification");
    if ( event.alert )
    {
        navigator.notification.alert(event.alert);
    }

    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge )
    {
        myPushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }

}

// BlackBerry10

function pushNotificationHandler(pushpayload) {
    var contentType = pushpayload.headers["Content-Type"],
        id = pushpayload.id,
        data = pushpayload.data;//blob

    // If an acknowledgement of the push is required (that is, the push was sent as a confirmed push
    // - which is equivalent terminology to the push being sent with application level reliability),
    // then you must either accept the push or reject the push
    if (pushpayload.isAcknowledgeRequired) {
        // In our sample, we always accept the push, but situations might arise where an application
        // might want to reject the push (for example, after looking at the headers that came with the push
        // or the data of the push, we might decide that the push received did not match what we expected
        // and so we might want to reject it)
        pushpayload.acknowledge(true);
    }
}

function tokenHandler(result){
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.

    window.localStorage["token"]=result; //Stores the device Token to localStorage for later use

    var url=server_url()+'?mode=newtoken&&token='+result;
    $.post(url,
        {

        }, function(res){

        });
    //This stores the device token on the deviceTokens table of caspio database
}

//When HTML document is finished loading. Jquery should be available
function documentReady(){

}

app.initialize();