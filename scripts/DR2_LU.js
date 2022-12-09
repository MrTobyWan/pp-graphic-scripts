var myNightloop = [];
var myLength = 0;

function ParseJSONForChannel() {
    // Read the start time of the next broadcast day
    const myFilename301 = "\\\\10.117.120.254\\Datasource\\DR2_nightloop.json";
    const myFilename201 = "\\\\10.117.120.201\\Datasource\\DR2_nightloop.json";
    const myFilename101 = "\\\\10.117.120.101\\Datasource\\DR2_nightloop.json";

    if (FileExists(myFilename301)) {
        myNightloop = JSON.parse(ReadFile(myFilename301));
        myLength = myNightloop.length;
    } else if (FileExists(myFilename201)) {
        myNightloop = JSON.parse(ReadFile(myFilename201));
        myLength = myNightloop.length;
    } else if (FileExists(myFilename101)) {
        myNightloop = JSON.parse(ReadFile(myFilename101));
        myLength = myNightloop.length;
    } else {
        return;
    }

    // Ensure that there are exactly 50 objects in the array
    for (var i = 0; i < 50; i++) {
        if (i < myLength) {
            myNightloop[i].production = "\\\\localhost\\Assets\\Images\\" + myNightloop[i].production + ".png"; //Point all references to images to the relevant StreamMaster
        } else {
            var myItem = {};
            myItem.title = "";
            myItem.production = "";
            myItem.timeAnnounced = "";
            myItem.timeStart = "";

            myNightloop.push(myItem);
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

ParseJSONForChannel();
