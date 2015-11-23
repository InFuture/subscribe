var bodyParser = require("body-parser");
var express = require("express");
var GoogleSpreadsheet = require("google-spreadsheet");

var app = express();
var config = require("./config");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var sheet = new GoogleSpreadsheet(config.sheetId);

sheet.useServiceAccountAuth(config.creds, function(err) {
	if (err) { console.log("Unsuccessful auth to Google."); process.exit(1); }
	app.post("/", function(req, res, next) {
		// console.log(req.body);
	        if (!("email" in req.body)) return res.send({ success: 0, message: "Please provide an email." });
		var data = {
			"First Name": "",
			"Last Name": "",
			"Email Address": req.body.email
		};
		sheet.addRow(1, data, function (err2) {
			if (err2) {
				console.dir(err2);
				return res.send({ success: 0, message: "Error adding row." });
			}
			res.send({ success: 1, message: "Subscribed!" });
		});
	});
});

app.listen(4000);
console.log("Server is running on port 4000.");
