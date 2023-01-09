var indexLimit = 7;
var times = [];
var titles = [];
var interval = 1000 * 60 * 5;

var days = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
var months = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];

// Get the date as a string to display in the header of the graphic
var nowScheduledDate = new Date(Schedule.Now.StartDateTime);
var nowFormattedDate = days[nowScheduledDate.getDay()] + ' ' + nowScheduledDate.getDate() + '. ' + months[nowScheduledDate.getMonth()];

//TODO - filter out any events that are not from nowScheduledDate
function findTimesAndTitles() {
	for (var i = 0; i < indexLimit; i++) {
		if (Schedule.ItemAtIndex(i) != '') {
			var formattedTime = roundDateTime(new Date(Schedule.ItemAtIndex(i).StartDateTime));

			times.push(formattedTime);
			titles.push(Schedule.ItemAtIndex(i).Title);
		} else {
			times.push('');
			titles.push('');
		}
	}
}

function roundDateTime(time) {
	var roundedTime;

	if (time.getSeconds() > 30 && time.getMinutes() % 5 == 4) {
		roundedTime = new Date(Math.ceil(time / interval) * interval);
	} else {
		roundedTime = new Date(Math.floor(time / interval) * interval);
	}

	var roundedHours = ('0' + roundedTime.getUTCHours()).slice(-2);
	var roundedMinutes = ('0' + roundedTime.getMinutes()).slice(-2);

	return roundedHours + ':' + roundedMinutes;
}

findTimesAndTitles();
