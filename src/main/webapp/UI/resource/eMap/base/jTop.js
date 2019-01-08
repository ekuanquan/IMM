define(function () {
	var jTop = function (noGlobal) {
		//return new jQuery.fn.init( selector, context );
	}
	jTop.fn = jTop.prototype = {
		extend: function (obj1, obj2) {
			return (function (object) {
				for (property in object.prototype) {
					if (!this.prototype.hasOwnProperty(property))
						this.prototype[property] = object.prototype[property];
				}
				return this;
			}).apply(obj1, [obj2]);
		},
		setting: function (source, target) {
			if (!target) {
				throw "target is null"
			}
			switch (typeof target) {
				case 'object':
					if (undefined !== target.length) {
						source = source && (undefined !== source.length) ? source : [];
						var sLen = source.length;
						for (var i = 0, len = target.length; i < len; i++) {
							i < sLen ? source[i] = source[i] || target[i] : source.push(target[i]);
						}
					}
					else {
						source = source || {};
						for (var i in target) {
							source[i] = (source[i] != undefined && source[i] != null) ? source[i] : target[i];
						}
					}
					break;
				case 'undefined':
					source = source || target;
					break;
			}
			return source;
		}
	}
	if (typeof noGlobal === typeof  undefined) {
		window.jTop = window.T = jTop;
	}
	return jTop;
})