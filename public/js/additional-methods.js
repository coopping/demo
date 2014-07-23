jQuery.validator.addMethod("password", function(value, element) {
	return /^[A-Za-z]+[0-9]+[A-Za-z0-9]*|[0-9]+[A-Za-z]+[A-Za-z0-9]*$/g.test(value);
}, "密码必须由6-16个英文字母和数字的字符串组成");

