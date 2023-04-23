const app = require("./app");
require("./utils/db").connect();

app.listen(process.env.PORT, () =>
	console.log(`App is running on port:${process.env.PORT}`)
);
