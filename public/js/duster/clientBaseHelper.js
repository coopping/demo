function isString(arg) {
	  return typeof arg === 'string';
}

var baseCode = {
	_validBase : [{"key":"1", "value":"有效"}, {"key":"0", "value":"无效"}],
	valid : function (key) {
		if (key) {
			var returnValue = '未定义';
			for (var i = 0, l = this._validBase.length; i < l; i++) {
				var o = this._validBase[i];
				if (o.key === key) {
					return o.value;
				}
			}
			return returnValue;
		}
		return this._validBase;
	}
}; 

var util = {
	formatRegExp : /%[sdj%]/g,

	format : function(f) {
		var formatRegExp = this.formatRegExp;
		if (!isString(f)) {
			var objects = [];
			for (var i = 0; i < arguments.length; i++) {
				objects.push(inspect(arguments[i]));
			}
			return objects.join(' ');
		}

		var i = 1;
		var args = arguments;
		var len = args.length;
		var str = String(f).replace(formatRegExp, function(x) {
			if (x === '%%')
				return '%';
			if (i >= len)
				return x;
			switch (x) {
			case '%s':
				return String(args[i++]);
			case '%d':
				return Number(args[i++]);
			case '%j':
				try {
					return JSON.stringify(args[i++]);
				} catch (_) {
					return '[Circular]';
				}
			default:
				return x;
			}
		});
		for (var x = args[i]; i < len; x = args[++i]) {
			if (isNull(x) || !isObject(x)) {
				str += ' ' + x;
			} else {
				str += ' ' + inspect(x);
			}
		}
		return str;
	}
};

(function() {
	dust.helpers.isValidBaseCode = function (chunk, context, bodies, params) {
        var code = dust.helpers.tap(params.code, chunk, context);
        var base = dust.helpers.tap(params.base, chunk, context);
        var output = '';
        if (code) {
        	output = baseCode[base](code);
        } else {
        	var objs = baseCode[base]();
        	var id = dust.helpers.tap(params.id, chunk, context);
        	var name = dust.helpers.tap(params.name, chunk, context);
        	var blank = dust.helpers.tap(params.blank, chunk, context);
        	var selectValue = dust.helpers.tap(params.selectValue, chunk, context);
        	var required = dust.helpers.tap(params.required, chunk, context);
        	var css = dust.helpers.tap(params.class, chunk, context);
        	var disabled = dust.helpers.tap(params.disabled, chunk, context);
        	var disabledStr = '';
        	if (disabled && new Boolean(disabledStr)) {
        		disabledStr = 'disabled';
        	}
        	var cssStr = '';
        	if (css) {
        		cssStr = util.format('class="%s"', 'form-control ' + css);
        	} else {
        		cssStr = 'class="form-control"';
        	}
        	if(required) {
        		output = util.format('<select %s %s id="%s" name="%s" required>', cssStr, disabledStr, id, name);
        	} else {
        		output = util.format('<select %s %s id="%s" name="%s" >', cssStr, disabledStr, id, name);
        	}
        	
        	if (blank && new Boolean(blank)) {
        		output += util.format('<option value="" />');
        	}
        	for (var i = 0, l = objs.length; i < l; i++) {
        		var obj = objs[i];
        		if (selectValue && selectValue === obj.key) {
        			output += util.format('<option value="%s" selected="true" >%s</option>', obj.key, obj.value);
        		} else {
        			output += util.format('<option value="%s" >%s</option>', obj.key, obj.value);
        		}
        	}
        	output += '</select>';
        }
        return chunk.write(output);
    };
})();
