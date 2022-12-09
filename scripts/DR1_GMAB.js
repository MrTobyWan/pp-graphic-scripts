var myDuckStart = 0;
var myDuckDuration = Schedule.Event.DurationFrames / 25;
var myDuckLevel = -20;

function ParseSidecarFile(channel) {
    // Get the filename from the TXID
    var sidecarPath_101 = "\\\\10.117.120.101\\Assets\\Media\\";
    var sidecarPath_201 = "\\\\10.117.120.201\\Assets\\Media\\";
    var sidecarName = Schedule.Now.CustomMetadata("AdditionalEventData", "TxEventId") + "_" + channel + ".mov.json";

    var sidecarFileName_101 = sidecarPath_101 + sidecarName; //sidecarPath + sidecarName;
    var sidecarFileName_201 = sidecarPath_201 + sidecarName; //sidecarPath + sidecarName;

    if (FileExists(sidecarFileName_101)) {
        ReadDuckParameters(sidecarFileName_101);
    } else if (FileExists(sidecarFileName_201)) {
        ReadDuckParameters(sidecarFileName_201);
    }
}

function ReadDuckParameters(sidecarFileName) {
    const parsedParameters = JSON.parse(ReadFile(sidecarFileName));

    myDuckStart = parsedParameters.metadata.ducking.inTimeSeconds;
    myDuckDuration = parsedParameters.metadata.ducking.durationSeconds;
    myDuckLevel = parsedParameters.metadata.ducking.levelDb;
}

function FileExists(path) {
    return System.IO.File.Exists(path);
}

function ReadFile(path) {
    if (System.IO.File.Exists(path)) return System.IO.File.ReadAllText(path);
    return null;
}

ParseSidecarFile("DR1");
