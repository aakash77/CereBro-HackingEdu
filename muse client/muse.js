$(function(window, undefined){
	var museData = [];
	var aveStress = 0,aveDistraction=0,aveHorseShoe=0;
	const DISTRACTION_LIMIT = 0.5;
	const UNDERSTANDING_LIMIT = 0.5;
	const TOUCHING_FOREHEAD = "/muse/elements/touching_forehead";
	const MELLOW = "/muse/elements/experimental/mellow";
	const HORSESHOE = "/muse/elements/horseshoe";
	const THETA_SESSION = "/muse/elements/theta_session_score";
	var mellow_timer = null;
	var theta_session_timer = null;
	const TIME_LIMIT = 15000;
	const HORSESHOE_LOWER_LIMIT=12;
	var validHorseShoe = [];
	
	window.Muse = window.Muse || {
			eeg : {
				channels: function(obj){
				},
				quantization: function(obj){
				},
				dropped: function(obj){
				}
			},
			relative : {
				alpha: function(obj) {
					Muse.relative.brainwave('alpha', obj);
				},
				beta: function(obj) {
					Muse.relative.brainwave('beta', obj);
				},
				delta: function(obj) {
					Muse.relative.brainwave('delta', obj);
				},
				gamma: function(obj) {
					Muse.relative.brainwave('gamma', obj);
				},
				theta: function(obj) {
					Muse.relative.brainwave('theta', obj);
				},
                'brainwave' : function( band, obj) {
                }
            },
            absolute: {
            	low_freq: function(obj){
            	},
            	alpha: function(obj) {
            		Muse.absolute.brainwave('alpha', obj);
            	},
            	beta: function(obj) {
            		Muse.absolute.brainwave('beta', obj);
            	},
            	delta: function(obj) {
            		Muse.absolute.brainwave('delta', obj);
            	},
            	gamma: function(obj) {
            		Muse.absolute.brainwave('gamma', obj);
            	},
            	theta: function(obj) {
            		Muse.absolute.brainwave('theta', obj);
            	},
            	brainwave : function( band, obj) {            	
            	}
            },
            session: {
            	alpha: function(obj){
            		Muse.session.brainwave('alpha', obj);
            	},
            	beta: function(obj){
            		Muse.session.brainwave('beta', obj);
            	},
            	delta: function(obj){
            		Muse.session.brainwave('delta', obj);
            	},
            	gamma: function(obj){
            		Muse.session.brainwave('gamma', obj);
            	},
            	theta: function(obj){
            		Muse.session.brainwave('theta', obj);
            	},
            	brainwave: function(band, obj){
            	}
            },
            experimental: {
            	mellow: function (obj){            		
            	},
            	concentration: function(obj){            		
            	}
            },
            muscle: {
            	'blink' : function( obj ){
            	},
            	'jaw' : function( obj ){            		
            	}
            },
            raw: {
            	fft0: function ( obj ){
            	},
            	fft1: function ( obj ){
            	},
            	fft2: function ( obj ){
            	},
            	fft3: function ( obj ){
            	}
            },
            accelerate : function( obj ){                	
            },
			connect: function( opts ){
				var defaults = {
					host: 'http://127.0.0.1',
					port: 5000,
				    socket: {
				        host: '127.0.0.1',
				        ports: {
				          client: 3334,
				          server: 3333
				        }
				    }
				},
				opts = opts || defaults,
				socket = io.connect(opts.host, { port: opts.port, rememberTransport: false, reconnect: true});

			   socket.on('connect', function() {
			        socket.emit('config',
			            {
			                server: {
			                    port: opts.socket.ports.server,
			                    host: opts.socket.host
			                },
			                client: {
			                    port: opts.socket.ports.client,
			                    host: opts.socket.host
			                }
			            }
			        );
			    });

			    socket.on('message', function(obj) {
					console.log(obj);
					//Print -> fitting not appropriate
					if(obj[0]===TOUCHING_FOREHEAD && obj[1]!==1){
						console.log("Muse fitting not appropriate");
						//break/pause video;
					}
					//Handling Concentration of the student using Mellow signal
					else if(obj[0]===MELLOW){
						if(obj[1]>DISTRACTION_LIMIT){
							if(mellow_timer){
								if(Date.now() - mellow_timer > TIME_LIMIT)
									console.log("You are distracted and its time for some quiz now");
									//pop up quiz
							}else
								mellow_timer = Date.now();
						}else
							mellow_timer = null;
					} else if(obj[0]===HORSESHOE){
							if(obj.slice(1).reduce(function(pv, cv) { return pv + cv; }, 0) >= HORSESHOE_LOWER_LIMIT){
								console.log("Muse Device not working please configure it again");
								//break/pause video;
							}
							else{
								for(var i=1;i<obj.length;i++){
									validHorseShoe[i-1] = obj[i]>= 3 ? false : true;
								}
							}
					} else{
						//when THETA_SESSION
						var count = 0;
						var sum=0;
						for(var i=0;i<validHorseShoe.length;i++){
							if(validHorseShoe[i]){
								sum+=obj[i+1];
								count++;
							}
						}
						if((sum/count) > UNDERSTANDING_LIMIT){
							if(theta_session_timer){
								if(Date.now() - theta_session_timer > TIME_LIMIT){
									console.log("You are unable to understand the topic and its time for Wolfram Alpha");
									//Q&A
								}
							}else
								theta_session_timer = Date.now();
						}else
							theta_session_timer = null;
					}
					//museData.push(obj);
			    });
			}
	}
}(window))