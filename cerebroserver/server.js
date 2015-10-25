// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express

var port  	 = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan   = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var http = require('http');
var wolfram = require('wolfram').createClient("2APKW7-7T6KULKPRP")

// configuration ===============================================================

app.use(morgan('dev')); // log every request to the console

app.use(bodyParser.urlencoded({'extended':'false'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json



// routes ======================================================================
app.get('/api/query/:input', function(req, res) {
		var input = req.params.input;
		console.log(input);
		var format = 'plaintext';//req.param('format');
		var appid = "2APKW7-7T6KULKPRP";
		var path = '/v2/query?appid='+appid+'&input='+input+'&format=html';
		// getQueryAnswer(res, path);
		input = unescape(input);
		wolfram.query(input, function(err, result) {
		  if(err) throw err
		  res.send(result);
		});

	});

app.post('/api/quiz', function(req, res) {
		var param = req.body;
		console.log("**************",param);
		getQuizAnswer(res, param);
	});

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users

require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);

function getQuizAnswer(response, param){
	var options = {
	  "method": "POST",
	  "hostname": "api.hackerrank.com",
	  "port": null,
	  "path": "/checker/submission.json",
	  "headers": {
	    "content-type": "multipart/form-data; boundary=---011000010111000001101001",
	    "cache-control": "no-cache",
	    "postman-token": "2afdd6c1-18c1-a403-5219-49dd418c867a"
	  }
	};

	var req = http.request(options, function (res) {
	  var chunks = [];

	  res.on("data", function (chunk) {
	    chunks.push(chunk);
	  });

	  res.on("end", function () {
	    var body = Buffer.concat(chunks);
	    console.log(body.toString());
	    var output;
	  	body = JSON.parse(body);
	  	body = body.result;
	    console.log(body.message);
	    if(body.message == null){
	    	output = {
	    		result: "error",
	    		compilemessage: body.compilemessage,
	    	}
	    } else{
	    	if(body.stdout[0] === "Hello, World!"){
	    		output = {
	    			result: "success",
	    			time: body.time
	    		}
	    	}else{
	    		output = {
	    			result: "failed",
	    		}
	    	}
	    }
	    	
	    response.send(output);
	  });
	});

	req.write("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"api_key\"\r\n\r\nhackerrank|117631-391|d0ccf73d887c2d7cae3688f299aa81aca1734d66\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"source\"\r\n\r\n"+param.source+"\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"lang\"\r\n\r\n3\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"testcases\"\r\n\r\n[\"Hello, World!\"]\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"format\"\r\n\r\nJSON\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"wait\"\r\n\r\ntrue\r\n-----011000010111000001101001--");
	req.end();
}