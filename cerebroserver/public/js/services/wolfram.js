/* simple factory for sending data to Wolfram API*/
	app.factory('Wolfram', ['$http',function($http) {
		return {
			get : function(input) {
				return $http.get('/api/query/'+encodeURIComponent(encodeURI(input)));
			},
		}
	}]);

	app.factory('HackerRank', ['$http',function($http) {
		return {
			post : function(input) {
				var params = {
			        apiKey: "XXX",
					source: input,
					lang: 3,
					testcases: "[\"Test 1\", \"Test 2\"]",
					format: "JSON",
					wait: "true"
			    }
			    return $http({
			        url: '/api/quiz',
			        method: 'POST',
			        data: params
			    });	
			},
		}
	}]);