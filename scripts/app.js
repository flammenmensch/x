/**
 * Created by flammenmensch on 22.06.14.
 */
(function (ng) {
	ng.module('xq', [ ])

		.factory('xqMoment', [ '$window', function ($window) {
			return $window.moment;
		} ])

		.factory('xqGlitchCanvas', [ '$window', function ($window) {
			return $window.glitch;
		} ])

        .factory('xqMobile', [ '$window', function ($window) {
            return {
                Android: function() {
                    return $window.navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function() {
                    return $window.navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function() {
                    return $window.navigator.userAgent.match(/iPhone|iPad|iPod/i);
                },
                Opera: function() {
                    return $window.navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function() {
                    return $window.navigator.userAgent.match(/IEMobile/i);
                },
                any: function() {
                    return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
                }
            };
        } ])

		.service('xqUtil', function () {
			this.pad = function (s, n) {
				if (n === undefined) {
					n = 2;
				}

				while (s.length < n) {
					s = '0' + s;
				}

				return s;
			};

			this.randomInt = function(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			};
		})

		.directive('xqVideoGlitch', [ '$window', '$timeout', 'xqGlitchCanvas', 'xqUtil', 'xqMobile', function ($window, $timeout, glitch, util, mobile) {
			return {
				restrict: 'A',
				compile: function (element) {
					if (!mobile.any()) {
                        element.remove();

                        return;
                    }

                    var originalVideo = element[0];

                    var canvas = $window.document.createElement('canvas');

					element.replaceWith(canvas);

					var context = canvas.getContext('2d');
					context.drawImage(originalVideo, 0, 0, canvas.width, canvas.height);

					return function (scope, element) {
						var draw = function () {

							context.drawImage(originalVideo, 0, 0, canvas.width, canvas.height);

							if (Math.random() > 0.05) {
								$window.requestAnimationFrame(draw, element);
							} else {
								var params = {
									seed: util.randomInt(0, 99),
									amount: util.randomInt(5, 10),
									quality: 1,
									iterations: util.randomInt(2, 4)
								};

								glitch(context.getImageData(0, 0, canvas.width, canvas.height), params, function (imageData) {
									context.putImageData(imageData, 0, 0);
								});

								//$timeout(draw, 100);
								$timeout(function () {
									$window.requestAnimationFrame(draw, element);
								}, 100);
							}
						};

						if (!originalVideo.paused) {
							//draw();
							$window.requestAnimationFrame(draw, element);
						} else {
							originalVideo.addEventListener('play', function () {
								//draw();
								$window.requestAnimationFrame(draw, element);
							});

							originalVideo.play();
						}

					};
				}
			};
		} ])

		.directive('xqGlitch', [ '$window', '$timeout', 'xqGlitchCanvas', 'xqUtil', function ($window, $timeout, glitch, util) {
			return {
				restrict: 'A',
				compile: function (element) {
					var canvas = document.createElement('canvas');
					var context = canvas.getContext('2d');

					canvas.width = element[0].width;
					canvas.height = element[0].height;

					context.drawImage(element[0], 0, 0, canvas.width, canvas.height);

					var originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);

					element.replaceWith(canvas);

					return function (scope, element) {
						var glitched = false;

						var applyGlitch = function () {
							if (Math.random() > 0.75) {
								if (glitched) {
									context.putImageData(originalImageData, 0, 0);
									glitched = false;
								}


								$timeout(function () {
									$window.requestAnimationFrame(applyGlitch);
								}, 2000);
							} else {
								var params = {
									seed: util.randomInt(0, 99),
									amount: util.randomInt(10, 20),
									quality: util.randomInt(8, 12),
									iterations: util.randomInt(5, 20)
								};

								glitch(context.getImageData(0, 0, canvas.width, canvas.height), params, function (data) {
									context.putImageData(data, 0, 0);
								});

								glitched = true;

								$timeout(function () {
									$window.requestAnimationFrame(applyGlitch, element[0]);
								}, Math.floor(Math.random() * 300));
							}
						};

						applyGlitch();
					};
				}
			};
		} ])

		.directive('xqCountdown', [ '$window', '$timeout', 'xqUtil', 'xqMoment', function ($window, $timeout, util, moment) {
			return {
				restrict: 'E',
				template: '<p></p>',
				replace: true,
				scope: {
					date: '@'
				},
				compile: function (element) {
					element.text('00:00:00:00');

					return function (scope, element) {
						var update = function () {
							var now = moment();
							var then = moment(scope.date, 'DD/MM/YYYY');
							var ms = then.diff(now, 'milliseconds', true);
							var days = Math.floor(moment.duration(ms).asDays());
							then = then.subtract('days', days);

							ms = then.diff(now, 'milliseconds', true);
							var hours = Math.floor(moment.duration(ms).asHours());
							then = then.subtract('hours', hours);

							ms = then.diff(now, 'milliseconds', true);
							var minutes = Math.floor(moment.duration(ms).asMinutes());
							then = then.subtract('minutes', minutes);

							ms = then.diff(now, 'milliseconds', true);
							var seconds = Math.floor(moment.duration(ms).asSeconds());
							then = then.subtract('seconds', seconds);

							ms = then.diff(now, 'milliseconds', true);
							var milliseconds = Math.floor(moment.duration(ms).asMilliseconds());

							element.text(days + ':' +
								util.pad(hours.toString(), 2) + ':' +
								util.pad(minutes.toString(), 2) + ':' +
								util.pad(seconds.toString(), 2) + '.' +
								util.pad(milliseconds.toString(), 3)
							);

							$timeout(function () {
								$window.requestAnimationFrame(update);
							}, 50);
						};

						$window.requestAnimationFrame(update);
					};
				}
			};
		} ]);
} (angular, moment));