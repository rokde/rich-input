/**
 * @see http://www.9lessons.info/2010/08/tag-friends-with-jquery-ajax-and-php.html
 */
(function ( $ ) {

	$.fn.richInput = function ( options ) {

		var eventProcessed = false;

		var settings = $.extend({

			t: [
				{
					pattern: /@(\w+)?/gi,
					hint: 'Type the name of an user...',
					mark: 'owner'
				},
				{
					pattern: /\+(\w+)?/gi,
					hint: 'Type the name of an user for copy...',
					mark: 'cc',
					onMatched: function(phrase, test) {
						debug('cc: onMatched('+phrase+')');

						$(settings.messageBoxSelector).hide();

						var user = [];
						user.push({
							image: 'http://lorempixel.com/output/people-q-c-32-32-10.jpg',
							name: 'Max Mustermann'
						});
						user.push({
							image: 'http://lorempixel.com/output/people-q-c-32-32-10.jpg',
							name: 'Lisa Lispel'
						});
						var fakeUser = '';
						for (var i in user)
						{
							var u = user[i];

							if (u.name.indexOf(phrase) > -1) {
								fakeUser += '<div class="display_box"><img src="' + u.image + '" class="image" />'
								+ '<a href="#" class="addname" data-username="' + u.name + '">' + u.name + '</a></div>';
							}
						}

						$(settings.displayBoxSelector).html(fakeUser).show();

						$('.addname').on('click', function () {
							onDone('<a class="red" contenteditable="false" href="#"><span class="label label-default">CC</span>%username%</a>', $(this).data(), test);
						});
					}
				},
				{
					pattern: /\#(\d+)?/g,
					hint: 'Type the number of an issue...',
					mark: 'issue'
				},
				{
					pattern: /\*(\d+)?/,
					hint: 'Type the number of a priority...',
					mark: 'priority',
					onStart: function (test) {
						$(settings.messageBoxSelector).hide();

						var priorities = [];
						priorities.push({
							value: 1,
							name: 'low'
						});
						priorities.push({
							value: 2,
							name: 'medium'
						});
						priorities.push({
							value: 3,
							name: 'high'
						});

						var html = '';
						for (var i in priorities)
						{
							var p = priorities[i];

							html += '<div class="display_box">'
							+ '<a href="#" class="addname" data-priority="' + p.value + '">' + p.name + '</a></div>';
						}

						$(settings.displayBoxSelector).html(html).show();

						$('.addname').on('click', function () {
							onDone('<a class="badge badge-info" contenteditable="false" href="#">%priority%</a>', $(this).data(), test);
						});
					},
					onMatched: function (phrase, test) {
						debug('cc: onMatched('+phrase+')');

						$(settings.messageBoxSelector).hide();

						var priorities = [];
						priorities.push({
							value: 1,
							name: 'low'
						});
						priorities.push({
							value: 2,
							name: 'medium'
						});
						priorities.push({
							value: 3,
							name: 'high'
						});

						var html = '';
						for (var i in priorities)
						{
							var p = priorities[i];

							html += '<div class="display_box">'
								+ '<a href="#" class="addname" data-priority="' + p.value + '">' + p.name + '</a></div>';
						}

						$(settings.displayBoxSelector).html(html).show();

						$('.addname').on('click', /*'a',*/ function () {
							onDone('<a class="badge badge-info" contenteditable="false" href="#">%priority%</a>', $(this).data(), test);
						});
					}
				},
				{
					pattern: /\!(\w+)?/i,
					hint: 'Type a date identifier...',
					mark: 'duedate'
				}
			],

			messageBoxSelector: '#msgbox',
			displayBoxSelector: '#display'
		}, options);

		var elem = $( this );
		elem.on('keyup', function (event) {
			var content = $(this).text();

			if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
				debug('event was fired by control-key only, ignore');
				return;
			}

			debug(event);

			for (var i in settings.t)
			{
				var test = settings.t[i];

				match = test.pattern.exec(content);
				if (match == null)
					continue;

				eventProcessed = true;

				debug('event will be used');

				var phrase = match[1];
				if (phrase == undefined)
				{
					debug('onStart calling');

					if (test.onStart != undefined)
						test.onStart(test);
					else
						onStart(test);

					debug('onStart called');
				}
				else
				{
					debug('onMatched calling');

					if (test.onMatched != undefined)
						test.onMatched(phrase, test);
					else
						onMatched(phrase, test);

					debug('onMatched called');
				}
			}

			if (! eventProcessed)
			{
				debug('cleaning up...');
				$(settings.displayBoxSelector).hide();
				$(settings.messageBoxSelector).hide();
			}
		});

		function onStart(test) {
			debug('global onStart()');
			$(settings.messageBoxSelector).slideDown('show');
			$(settings.displayBoxSelector).slideUp('show');
			$(settings.messageBoxSelector).html(test.hint);
		}

		function onMatched(phrase, test) {
			debug('global onMatched('+phrase+')');

			$(settings.messageBoxSelector).hide();

			var user = [];
			user.push({
				image: 'http://lorempixel.com/output/people-q-c-32-32-10.jpg',
				name: 'Max Mustermann'
			});
			user.push({
				image: 'http://lorempixel.com/output/people-q-c-32-32-10.jpg',
				name: 'Lisa Lispel'
			});
			var fakeUser = '';
			for (var i in user)
			{
				var u = user[i];

				if (u.name.indexOf(phrase) > -1) {
					fakeUser += '<div class="display_box"><img src="' + u.image + '" class="image" />'
					+ '<a href="#" class="addname" data-username="' + u.name + '">' + u.name + '</a></div>';
				}
			}

			$(settings.displayBoxSelector).html(fakeUser).show();

			$('.addname').on('click', function () {
				onDone('<a class="red" contenteditable="false" href="#">%username%</a>', $(this).data(), test);
			});
		}

		function onDone(template, data, test) {

			var str = template;

			str = str.replace(/%\w+%/g, function (all) {
				var key = all.replace(/%/g, '');
				return data[key] || all;
			});

			var old = elem.html();
			var content = old.replace(test.pattern, ' ');// replace [pattern] to " "
			elem.html(content);

			elem.append(str + '&nbsp;');
			$(settings.displayBoxSelector).hide();
			$(settings.messageBoxSelector).hide();

			// get focus to input end
			placeCaretAtEnd( elem.get(0) );

			eventProcessed = false;
		}

		function debug (msg)
		{
			if (console && console.debug)
				console.debug(msg);
		}

		/**
		 * places a caret at the end of the element
		 * @param el document element
		 */
		function placeCaretAtEnd(el) {
			el.focus();
			if (typeof window.getSelection != "undefined"
				&& typeof document.createRange != "undefined") {
				var range = document.createRange();
				range.selectNodeContents(el);
				range.collapse(false);
				var sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} else if (typeof document.body.createTextRange != "undefined") {
				var textRange = document.body.createTextRange();
				textRange.moveToElementText(el);
				textRange.collapse(false);
				textRange.select();
			}
		}
	}

})( jQuery );