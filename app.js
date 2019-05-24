// display current time
function updateClock() {
   const clock = moment().format("h:mm:ss a");
   $("#clock").text(clock);
};
// the current time will elapse by one second
setInterval(updateClock, 1000)
// initialize Firebase
const config = {
	apiKey: "AIzaSyBEvfvRzimElWF-3XO47hYG4yzqa7Jvd_s",
	authDomain: "aaron-project-c8c21.firebaseapp.com",
	databaseURL: "https://aaron-project-c8c21.firebaseio.com",
	projectId: "aaron-project-c8c21",
	storageBucket: "aaron-project-c8c21.appspot.com",
	messagingSenderId: "272640189163"
};
firebase.initializeApp(config);
const database = firebase.database();

$("#add-train").on("click", event => {
	event.preventDefault();

	const train = $("#train-name").val().trim();
	const destination = $("#destination").val().trim();
	const firstTrain = $("#first-train").val().trim();
	const frequency = $("#frequency").val().trim();

  	const dataTrain = {
    	train,
    	destination,
    	firstTrain,
   	frequency
  	};
	//add the dataTrain object to database
	database.ref().push(dataTrain);
	// clear inputs of text
	$("#train-name").val("");
	$("#destination").val("");
	$("#first-train").val("");
	$("#frequency").val("");
});

database.ref().on("child_added", retrieve => {

	console.log(retrieve.val());
	// store the database's object's properties in variables
	const { train, destination, firstTrain, frequency } = retrieve.val();
	// convert the retrieved value into readable hours and minutes
	let firstTrainConverted = moment(firstTrain, "hh:mm");
	console.log(firstTrainConverted);
	// create a variable that will store the calculated difference (in minutes) between now and the train's first run
	let timeDiff = moment().diff(firstTrainConverted, "minutes");
	console.log(`${timeDiff} minutes have passed since the train's first stop`);
	// use modulus to caculate the remainder, and store the remainder in a variable 
	let remainder = timeDiff % frequency;
	console.log(remainder);
	// calculate how many minutes away is the next train
	let minAway = frequency - remainder;
	console.log(`The next train is in ${minAway} minute(s)`);
	// cacluated the train's next arrival
	let nextStop = moment().add(minAway, "minutes");
	//convert the variable from unix time to readable hours and minutes
	nextStop = moment(nextStop).format("hh:mm");
	console.log(`The next train will arrive at ${nextStop}`);

  //display the pertinent information in the train schedule panel
   $("#train-table > tbody")
   .append(
		`<tr>
			<td>${train}</td>
			<td>${destination}</td>
			<td> ${frequency}</td>
			<td>${nextStop}</td>
			<td>${minAway}</td>
		</tr>`
   );
}); 