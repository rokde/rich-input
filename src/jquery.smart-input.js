/*!
 * jQuery smart-input plugin
 * Original author: rokde
 * Licensed under the MIT license
 */
;(function ($, window, document, undefined) {

	var pluginName = 'smartInput',
		pluginVersion = '1.0.0',
		debug = true;
		defaults = {

		};

	/**
	 * constructor
	 *
	 * @param element
	 * @param options
	 *
	 * @constructor
	 */
	function SmartInput(element, options)
	{
		this.log(pluginName + '/' + pluginVersion);

		this.element = element;
		this.options = $.extend({}, defaults, options);

		this.log(this.options);

		this.init();
	}

	/**
	 * initialize plugin:
	 * - attach key up handler for all given pattern
	 */
	SmartInput.prototype.init = function () {
		this.log('init called');

		//  @TODO global click handler for selecting an suggestion

		$(this.element).on('keyup', {smartInput: this}, function (event) {

			/** @var SmartInput self */
			var self = event.data.smartInput;

			if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
				self.log('event was fired by control-key only, ignore');
				return;
			}

			if (event.keyCode == 32)
			{
				self.resetCurrentMark();
				self.log('resetting current mark');
				return;
			}

			var content = $(this).text();
			self.log('key up handler: ' + content);

			self.log(/\+(\w+)?/gi.exec(content));

			var currentMark = self.getCurrentMark();

			if (currentMark == null) {
				self.log('current mark is not set')
				for (var i in self.options) {
					self.log(i);
					var test = self.options[i];
					if (test.pattern.test(content)) {
						self.setCurrentMark(test);
						//  @TODO call "onStart"
						break;
					}
				}
			}
			else
			{
				self.log('current mark: ' + currentMark.mark);

				var match = currentMark.pattern.exec(content);
				var m = content.match(currentMark.pattern);//fixing misbehaviour on matching
				if (match != null && match[1] != undefined)
				{
					self.log('phrase: ' + match[1]);
					self.log(match);
				}
			}
		});
	};

	SmartInput.prototype.resetCurrentMark = function ()
	{
		this.mark = null;
	};
	SmartInput.prototype.setCurrentMark = function (mark)
	{
		this.mark = mark;
	};
	SmartInput.prototype.getCurrentMark = function ()
	{
		return this.mark;
	};

	/**
	 * logging a message or object
	 * @param msg
	 */
	SmartInput.prototype.log = function (msg) {
		if (! debug) return;
		var console = window.console || {};
		if ($.isFunction(console.log))
			console.log(msg);
	};

	/**
	 * add the rich-input plugin to the jQuery plugin list
	 *
	 * preventing against multiple instantiations
	 *
	 * @param options
	 * @returns {*}
	 */
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (! $.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
					new SmartInput(this, options)
				);
			}
		});
	}

})(jQuery, window, document);