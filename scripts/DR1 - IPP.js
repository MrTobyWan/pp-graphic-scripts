var grpImageToggler = ppFindObject("grpImageToggler");
var grpHenvisning = ppFindObject("grpHenvisning");
var grpTxt = ppFindObject("grpTxt");
var grpLogos = ppFindObject("grpLogos");

var txtTitle = ppFindObject("txtTitle");
var txtTime = ppFindObject("txtTime");
var txtCountdown = ppFindObject("txtCountdown");

var channelField = ppFindFieldMarkerByFieldID(3);
var channel = channelField.fieldMarker_FieldDataUnformatted.split("\\").pop();
const defaultChannel = "DR1_sekundaer.png";

var imageOn = ppFindFieldMarkerByFieldID(200).fieldMarker_FieldData == "true" ? true : false;
var countdownOn = ppFindFieldMarkerByFieldID(300).fieldMarker_FieldData == "true" ? true : false;
var repeatOn = ppFindFieldMarkerByFieldID(400).fieldMarker_FieldData == "true" ? true : false;
var interval = Number(ppFindFieldMarkerByFieldID(410).fieldMarker_FieldData);
var loopDuration = Number(ppFindFieldMarkerByFieldID(420).fieldMarker_FieldData);

var kfPauseLEFT = ppFindObject("kfPauseLEFT");
var kfPauseRIGHT = ppFindObject("kfPauseRIGHT");
var kfStartInterval = ppFindObject("kfStartInterval");
var kfLoopDurationTrigger = ppFindObject("kfLoopDurationTrigger");
var kfIntervalTrigger = ppFindObject("kfIntervalTrigger");

// Show the countdown text if it's active
txtTime.hidden = countdownOn;
txtCountdown.hidden = !countdownOn;

// Trigger animations repeatedly or only once
if (repeatOn) {
    kfStartInterval.time = 0;
    kfPauseLEFT.startTime = 0;
    kfPauseRIGHT.startTime = 0;
    kfLoopDurationTrigger.time = loopDuration;
    kfIntervalTrigger.time = interval;
} else {
    kfStartInterval.time = 0.08;
    kfPauseLEFT.startTime = 1;
    kfPauseRIGHT.startTime = 1;
}

//Change timing of triggers to adjust to cross promotion or images
//First declaring the defaults (No cross promos or images used)

var kfAnimOut = ppFindObject("kfAnimOut");
kfAnimOut.time = 2;

var kfTextIn = ppFindObject("kfTextIn");
kfTextIn.time = 0.8;

var kfPauseLogoIn = ppFindObject("kfPauseLogoIn");
kfPauseLogoIn.startTime = 0.8;

var kfJumpLogoOut = ppFindObject("kfJumpLogoOut");
kfJumpLogoOut.destinationTime = 2.88;

const selectionHenvisning = ["DRTV_sekundaer.png", "DRDK_sekundaer.png", "NEWS_sekundaer.png"];

//Rules that determine which type of IPP we are dealing with. Appropriate keyframes are moved
//around to account for the different animations used, and different groups are hidden or shown
//to minimize rendering power for the specific use case.
var type;

if (selectionHenvisning.indexOf(channel) != -1 && imageOn) {
    type = "Henvisning";

    grpImageToggler.hidden = true;
    grpTxt.hidden = true;
    grpHenvisning.hidden = false;

    if (channel != "DRDK_sekundaer.png") {
        kfTextIn.time += 0.8;
        kfAnimOut.time -= 0.36;
        kfPauseLogoIn.startTime += 1.36;
        kfJumpLogoOut.destinationTime -= 0.68;
    }
} else if (channel != defaultChannel && imageOn) {
    type = "CrossPromoWithImage";

    grpImageToggler.hidden = false;
    grpTxt.hidden = false;
    grpHenvisning.hidden = true;

    kfTextIn.time += 0.4;
    kfAnimOut.time -= 0.21;
    kfPauseLogoIn.startTime += 1.36;
    kfJumpLogoOut.destinationTime -= 0.68;
} else if (channel == defaultChannel && imageOn) {
    type = "StandardWithImage";

    grpImageToggler.hidden = false;
    grpTxt.hidden = false;
    grpHenvisning.hidden = true;

    kfAnimOut.time += 0.48;
    kfTextIn.time += 0.4;
} else if (channel != defaultChannel && channel != "DRDK_sekundaer.png" && !imageOn) {
    type = "CrossPromo";

    grpImageToggler.hidden = true;
    grpTxt.hidden = false;
    grpHenvisning.hidden = true;

    kfTextIn.time += 0.8;
    kfAnimOut.time -= 0.21;
    kfPauseLogoIn.startTime += 1.36;
    kfJumpLogoOut.destinationTime -= 0.68;
} else {
    type = "Standard";

    grpImageToggler.hidden = true;
    grpTxt.hidden = false;
    grpHenvisning.hidden = true;
}

//The new type of IPP requires a bit of set up to determine how high the white box
//should be. The height is determined by the length of the string from "txtTitle"
if (type == "Henvisning") {
    //Declare objects and keyframes to be controlled when preparing a "Henvisning"
    var KF_greyBoxIN = ppFindObject("KF_greyBoxIN");
    var KF_whiteBoxIN = ppFindObject("KF_whiteBoxIN");
    var KF_whiteBoxOUT = ppFindObject("KF_whiteBoxOUT");
    var whiteBox = ppFindObject("whiteBox");
    var greyBox = ppFindObject("greyBox");
    var txtHenvisning = ppFindObject("txtHenvisning");
    var txtHenvisningMeasurement = ppFindObject("txtHenvisningMeasurement");
    var txtPlatform = ppFindObject("txtPlatform");
    var width = txtHenvisningMeasurement.textExtents.max.x;

    if (channel == "DRTV_sekundaer.png") {
        txtPlatform.cell.string = "DRTV";
    } else {
        txtPlatform.cell.string = "DR.DK";
    }

    //Check the current width of the txtTitle field to make the white box scale accordingly
    ppLog(width);
    if (width <= 2.4945) {
        //One line values
        whiteBox.height = 0.418;
        KF_whiteBoxIN.keyValue = 378;
        KF_whiteBoxOUT.keyValue = 378;
        greyBox.height = 0.418;
        KF_greyBoxIN.keyValue = 378;
    } else if (width > 2.4945 && width <= 4.95) {
        //two lines
        whiteBox.height = 0.537;
        KF_whiteBoxIN.keyValue = 410;
        KF_whiteBoxOUT.keyValue = 410;
        greyBox.height = 0.537;
        KF_greyBoxIN.keyValue = 410;
    } else {
        //three lines
        whiteBox.height = 0.659;
        KF_whiteBoxIN.keyValue = 443;
        KF_whiteBoxOUT.keyValue = 443;
        greyBox.height = 0.659;
        KF_greyBoxIN.keyValue = 443;
    }
}

// Change timing offset in relation to out-animation in frames
var pageDuration = ppFindFieldMarkerByFieldID(100);
var timingOffset = 50;
var kfPageEnd = ppFindObject("kfPageEnd");

kfPageEnd.time = ((pageDuration.fieldMarker_FieldData - timingOffset) * 40) / 1000; // Calculate keyframe position from page duration minus timingOffset - converted to seconds

//Function to change alignment for all objects based on logo position
var KF_ImageOffsetIN = ppFindObject("KF_ImageOffsetIN");
var KF_ImageOffsetOUT = ppFindObject("KF_ImageOffsetOUT");
var KF_WipeOffsetIN = ppFindObject("KF_WipeOffsetIN");
var gradientWipeOutLEFT = ppFindObject("gradientWipeOutLEFT");
var gradientWipeOutRIGHT = ppFindObject("gradientWipeOutRIGHT");

var isRightAligned = false;

//Function that has all the paremeters for changing the placement of objects in the scene if the logo is on the right side of the screen
function ppOnEvent_changeAlignment(s_alignment) {
    if (s_alignment == "R") {
        isRightAligned = true;
        txtTitle.cell.html = '<p style="text-align:right;">' + txtTitle.cell.string;
        txtTime.cell.html = '<p style="text-align:right;">' + txtTime.cell.string;
        txtCountdown.cell.html = '<p style="text-align:right;">' + txtCountdown.cell.string;
        grpImageToggler.position.x = 9.451851844787598;
        grpLogos.offset.x = 11.851851463317871;
        grpHenvisning.offset.x = 8.592592239379883;
        KF_ImageOffsetIN.keyValue = 285;
        KF_ImageOffsetOUT.keyValue = 285;
        KF_WipeOffsetIN.keyValue = 285;
        gradientWipeOutLEFT.front.hidden = true;
        gradientWipeOutRIGHT.front.hidden = false;
    } else {
        txtTitle.cell.html = '<p style="text-align:left;">' + txtTitle.cell.string;
        txtTime.cell.html = '<p style="text-align:left;">' + txtTime.cell.string;
        txtCountdown.cell.html = '<p style="text-align:left;">' + txtCountdown.cell.string;
        grpImageToggler.position.x = 0;
        grpLogos.offset.x = 0;
        grpHenvisning.offset.x = 0;
        KF_ImageOffsetIN.keyValue = -285;
        KF_ImageOffsetOUT.keyValue = -285;
        KF_WipeOffsetIN.keyValue = -285;
        gradientWipeOutLEFT.front.hidden = false;
        gradientWipeOutRIGHT.front.hidden = true;
    }
    setTextOffset();
}

//Checks for offsets of the grpTxt and
function setTextOffset() {
    if (txtTitle.cell.string == "") {
        grpTxt.offset.y = 0.14814814925193787; //Moving TIME-object up to align to the center of the logo if TITLE is blank
    }
    if (txtTime.cell.string == "") {
        grpTxt.offset.y = -0.14814814925193787; //Moving TITLE-object down to align to the center of the logo if TIME is blank
    }

    if (type == "CrossPromoWithImage" || type == "StandardWithImage") {
        grpTxt.offset.x = isRightAligned ? -1.9500000476837158 : 1.9500000476837158;
    }
    //	DR Koncern temporarily disabled while I figure out how to implement this into the new animations

    //	else if (channel.fieldMarker_FieldData == "DR") {
    //		grpTxt.offset.x = isRightAligned ? -0.39259257912635803 : 0.39259257912635803;
    //		grpImageToggler.hidden = true;
    //	}
    else {
        grpTxt.offset.x = 0;
    }
    startTimelines(type);
}

//Start the correct timelines after succesful script execution
function startTimelines(typeOfIPP) {
    ppSendNamedTrigger("Trigger");
    ppSendNamedTrigger("LogoInOut");

    if (type == "Henvisning") {
        ppSendNamedTrigger("Reference");
        if (channel != "DRDK_sekundaer.png") {
            ppSendNamedTrigger("CrossPromo");
        }
    } else if (type == "CrossPromoWithImage") {
        ppSendNamedTrigger("CrossPromo");
        ppSendNamedTrigger("Text");
        ppSendNamedTrigger("ImageInOut");
        ppSendNamedTrigger("Gradient");
    } else if (type == "StandardWithImage") {
        ppSendNamedTrigger("Text");
        ppSendNamedTrigger("ImageInOut");
        ppSendNamedTrigger("Gradient");
    } else if (type == "CrossPromo") {
        ppSendNamedTrigger("CrossPromo");
        ppSendNamedTrigger("Text");
    } else {
        ppSendNamedTrigger("Text");
    }
}

// Only run the full set up script once and then just restart timelines afterwards
var firstTime = true;

function ppOnEvent_Restart() {
    if (firstTime) {
        ppSendNamedTrigger("PLAY");
        firstTime = false;
    } else {
        startTimelines(type);
        ppSendNamedTrigger("restartDuration");
    }
    ppLog("New animation triggered");
}

function ppOnUpdate() {}
