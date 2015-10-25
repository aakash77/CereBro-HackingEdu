angular.module('videoController', [
		'ngSanitize',
		'com.2fdevs.videogular',
		'com.2fdevs.videogular.plugins.controls',
		'com.2fdevs.videogular.plugins.overlayplay',
		'com.2fdevs.videogular.plugins.poster'])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$sce', '$scope','$http','Todos', 'Wolfram', 'HackerRank', function($sce, $scope, $http, Todos, Wolfram, HackerRank) {
		$scope.textArea = "";
		$scope.queryResult = [];
		$scope.loading = false;
		$scope.sucess = false;
		this.config = {
				sources: [
					{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
					{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
					{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
				],
				tracks: [
					{
						src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
						kind: "subtitles",
						srclang: "en",
						label: "English",
						default: ""
					}
				],
				theme: "bower_components/videogular-themes-default/videogular.css",
				plugins: {
					poster: "http://www.videogular.com/assets/images/videogular.png"
				}
			};
		$scope.togglequizModal = function() {
		    $scope.queryModalShown = false;
		    $scope.quizModalShown = !$scope.quizModalShown;
		};

		$scope.togglequeryModal = function() {
		    $scope.queryModalShown = !$scope.queryModalShown;
		    $scope.quizModalShown =  false;
		};

		$scope.fireQuiz = function (text){
			$scope.loading = true;
			$scope.quizArea = text;
			HackerRank.post(text).success(function (data){
				$scope.loading = false;
				$scope.quizResult = data;
				console.log(data);
			})
			.error(function(err){
				$scope.loading = false;
				console.log("err"+err);
			});
		}

		$scope.fireQuery = function (text){
			$scope.loading = true;
			$scope.textArea = text;
			Wolfram.get(text).success(function (data){
				$scope.loading = false;
				$scope.queryResult = data;
				filterResult($scope.queryResult);
			})
			.error(function(err){
				var myEl = angular.element(document.querySelector('#resultDiv'));
				myEl.append("Please try again!");
				$scope.loading = false;
				console.log("err"+err);
			});
		}
	}]);

function filterResult(qresult){
	var length = qresult.length;
	if(length > 0){
		for(var i =0; i<length;i++){
			console.log(qresult[i]);
		}
	}
}