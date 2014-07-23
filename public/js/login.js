$("#submitbtn").click(function(){
    var username = $("#username").val();
    var password = $("#password").val();
    var password2 = $("#confirmpd").val();
    if (username.trim() == '') {
       alert('用户名必须录入！');
       $("#nameFiled").addClass('has-error');
       return;
    } else {
        $("#nameFiled").removeClass('has-error');
    }
    if (password.trim() == '') {
        alert('密码必须输入！');
        $("#passwdFiled").addClass('has-error');
        return;
    } else {
        $("#passwdFiled").removeClass('has-error');
    }
    $("#userform").submit();
});

