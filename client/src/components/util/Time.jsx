const Time = ({ time }) => {
	time = new Date(time);
	let hours = time.getHours();
	let minutes = time.getMinutes();
	let ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? "0" + minutes : minutes;
	return " " + hours + ":" + minutes + " " + ampm;
};

export default Time;
