
$(function () {


  //注册点击事件
  $(".btn_login").on("click", function () {

    //先获取input框里面的内容,取出多余的空格
    var username = $(".name").val();
    var password = $(".password").val();
    console.log(username);
    //表单校验，判断输入的内容是否为空
    if (!username) {
      mui.toast("用户名不能为空");
      return false;
    };

    if (!password) {
      mui.toast("密码不能为空");
      return false;
    };

    //如果校验成功，发送ajax请求
    $.ajax({
      type: "post",
      url: "/user/login",
      data: {
        username: username,
        password: password
      },
      success: function (info) {
        console.log(info);
        if (info.error == 403) {
          mui.toast("用户名或密码错误");
        }
        if (info.success) {
          
        }
      }



    })





  })




  


})