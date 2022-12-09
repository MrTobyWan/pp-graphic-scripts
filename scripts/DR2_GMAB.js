var myDuckStart = 0;
var myDuckDuration = Schedule.Event.DurationFrames / 25;
var myDuckLevel = -20;

function ParseSidecarFile(channel) {
    // Get the filename from the TXID
    var sidecarPath_101 = "\\\\10.117.120.101\\Assets\\Media\\";
    var sidecarPath_201 = "\\\\10.117.120.201\\Assets\\Media\\";
    var sidecarName = Schedule.Now.CustomMetadata("AdditionalEventData", "TxEventId") + "_" + channel + ".mov.ppsc";

    var sidecarFileName_101 = sidecarPath_101 + sidecarName; //"TestFiles\\PPSC-FILE_WITH_DUCKING_PARAMETERS.ppsc";
    var sidecarFileName_201 = sidecarPath_201 + sidecarName; //"TestFiles\\PPSC-FILE_WITH_DUCKING_PARAMETERS.ppsc";

    if (FileExists(sidecarFileName_101)) {
        ReadDuckParameters(sidecarFileName_101);
    } else if (FileExists(sidecarFileName_201)) {
        ReadDuckParameters(sidecarFileName_201);
    }
}

function ReadDuckParameters(sidecarFileName) {
    const myXmlString = ReadFile(sidecarFileName);

    // Check that we have valid duck parameters in CustomMetadata, DuckingParameters.
    if (myXmlString.indexOf("CustomMetadata") != -1 && myXmlString.indexOf("DuckingParameters") != -1) {
        const myCustomMetadata = myXmlString.split("CustomMetadata");
        const myMappingProperties = myCustomMetadata[1].split("<MappingProperties");
        var myList = undefined;

        for (var i = 0; i < myMappingProperties.length; i++) {
            if (myMappingProperties[i].indexOf("DuckingParameters") != -1) {
                myList = myMappingProperties[i];
                break; // BREAK out of i loop
            }
        }

        if (myList !== undefined) {
            var myPosName_1 = myList.indexOf("DuckStart");
            var myPosName_2 = myList.indexOf("DuckDuration");
            var myPosName_3 = myList.indexOf("DuckLevel");

            if (myPosName_1 != -1 && myPosName_2 != -1 && myPosName_3 != -1) {
                var myPosValue_1 = myList.indexOf("Value", myPosName_1);
                var myPosValue_2 = myList.indexOf("Value", myPosName_2);
                var myPosValue_3 = myList.indexOf("Value", myPosName_3);

                if (myPosValue_1 != -1 && myPosValue_2 != -1 && myPosValue_3 != -1) {
                    myDuckStart = myList.substring(myPosValue_1).split('"')[1];
                    myDuckDuration = myList.substring(myPosValue_2).split('"')[1];
                    myDuckLevel = myList.substring(myPosValue_3).split('"')[1];
                }
            }
        }
    }
}

function FileExists(path) {
    return System.IO.File.Exists(path);
}

function ReadFile(path) {
    if (System.IO.File.Exists(path)) return System.IO.File.ReadAllText(path);
    return null;
}

ParseSidecarFile("DR2");
