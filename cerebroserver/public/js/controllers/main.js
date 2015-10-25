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
		$scope.playerState = false;
		$scope.noresult = false;
		$scope.quizArea = "import java.io.*;\nimport java.util.*;\npublic class Solution {\n\r\t// write code here\n}";

		var controller = this;
		controller.config = {
				sources: [
					{src: $sce.trustAsResourceUrl("http://www.scuc.txed.net/webpages/rburton/files/algorithms%20lesson%203-%20merge%20sort1.mp4"), type: "video/mp4"},
					{src: $sce.trustAsResourceUrl("http://www.scuc.txed.net/webpages/rburton/files/algorithms%20lesson%205-%20linear%20and%20binary%20searching.mp4"), type: "video/mp4"},
					{src: $sce.trustAsResourceUrl("http://www.scuc.txed.net/webpages/rburton/files/algorithms%20lesson%202-%20insertion%20sort.mp4"), type: "video/mp4"}
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
					poster: "http://xoax.net/comp_sci/crs/algorithms/lessons/Lesson3/Image3.png"
				}
			};
			controller.onPlayerReady = function(API) {
				console.log(API);
				controller.API = API;
			};

			
			$scope.stateChange = function(){
				$scope.playerState = !$scope.playerState;
				console.log($scope.playerState);
				if($scope.playerState)
					establishSocketConnection();
			};



	// handle modal related events
		$scope.togglequizModal = function() {
			$scope.quizModalShown = !$scope.quizModalShown;
		    $scope.queryModalShown = false;
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
				if(data == "" || data.length == 0)
					$scope.noresult = true;
				else
					$scope.noresult = false;
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

distractedCount = 0;
stressedCount = 0;
function getStudentStatus(status){
	if(status == "distracted")
		distractedCount++;
	if(status == "stressed")
		stressedCount++;

	if(stressedCount > 10){
		console.log("disconnected due to stress");
		console.log(document.getElementsByClassName("play")[0]);
		document.getElementsByClassName("play")[0].click();
		closeConnection();
		angular.element(document.getElementById('mainC')).scope().togglequeryModal();
	}else if(distractedCount > 10){
		console.log("disconnected due to distraction");
		document.getElementsByClassName("play")[0].click();
		closeConnection();
		angular.element(document.getElementById('mainC')).scope().togglequizModal();

	}
}