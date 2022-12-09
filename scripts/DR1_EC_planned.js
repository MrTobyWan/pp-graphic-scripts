var myEC;

//default values for ducking parameters
var myDuckOffset = 0.2;
var myDuckLevel = -20;
var myDuckDuration = 0;

var customDuckOffset = Schedule.Event.CustomMetadata("AdditionalSecondaryData", "DuckStart");
var customDuckLevel = Schedule.Event.CustomMetadata("AdditionalSecondaryData", "DuckLevel");
var customDuckDuration = Schedule.Event.CustomMetadata("AdditionalSecondaryData", "DuckDuration");

function ParseJSONForChannel(channel) {
    // Calculate the filename from the AdditionalSecondaryData custom metadata
    var ecPath = "\\\\10.117.120.254\\Speaker\\EndCredits\\" + channel + "\\";
    var ecName = Schedule.Event.CustomMetadata("AdditionalSecondaryData", "SpeakerEndCreditName");

    // Append .json if this is missing (it should be)
    if (ecName.substr(ecName.length - 5).toLowerCase() != ".json") {
        ecName += ".json";
    }

    var ecFilename = ecPath + ecName;

    if (FileExists(ecFilename)) {
        myEC = JSON.parse(ReadFile(ecFilename));

        if (myEC.liveSpeak == true) {
            myEC.audioFile = "Content\\Media\\DRX\\Audio\\Blank_Audio.wav"; // Silence
        } else {
            myDuckDuration = myEC.audioFileDuration;
        }

        for (var i = 0; i < 5; i++) {
            if (i < myEC.list.length) {
                // Fill out any parameters needed by fields which can be missing from the JSON
                if (myEC.list[i].image == undefined) myEC.list[i].image = "";
                myEC.list[i].image = myEC.list[i].image + ".png";

                if (myEC.list[i].clock == undefined) myEC.list[i].clock = "";

                myEC.list[i].ippChannel = "Content\\Images\\DRX\\IPP\\" + myEC.list[i].ippChannel + "_sekundaer.png";
            } else {
                // Create empty item for the list array, and push it onto EC.list
                var myItem = {};
                myItem.ippChannel = "";
                myItem.title = "";
                myItem.time = "";
                myItem.image = "";
                myItem.clock = "";

                myEC.list.push(myItem);
            }
        }
    }
}

function ValidJSONData() {
    return !(parsedJSON === undefined);
}

function FileExists(path) {
    return System.IO.File.Exists(path);
}

function ReadFile(path) {
    if (System.IO.File.Exists(path)) return System.IO.File.ReadAllText(path);
    return null;
}

ParseJSONForChannel("DR1");

//Checking for ducing parameters override in 'AdditionalSecondaryData'.
//If override has been entered in the event, the page should use these parameters instead.
if (customDuckOffset > 0.2) {
    myDuckOffset = customDuckOffset;
}
if (customDuckLevel != 0) {
    myDuckLevel = customDuckLevel;
}
if (customDuckDuration >= 2) {
    myDuckDuration = customDuckDuration;
}
