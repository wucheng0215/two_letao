
// 1、页面一上来需要发送ajax请求，检查是否已经登录,如果没有登录，直接跳到登录页面
// 2、如果是登录页面，是不需要发送ajax请求的，直接在登录页面

if (location.href.indexOf("login.html") == -1) { //只有不在登录页面的情况下，才发送ajax数据

  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    success: function (info) {
      //console.log(info)
      if (info.error == 400) {
        location.href = "login.html"
      }

    }
  })

}


//关闭进度环按钮
NProgress.configure({ showSpinner: false });

//ajax开始的时候执行
$(document).ajaxStart(function () {
  //进度条开始
  NProgress.start();
});


//ajax结束的时候执行
$(document).ajaxStop(function () {
  //进度条结束
  setTimeout(function () {
    NProgress.done();
  }, 5000)

});



//首页
// 功能一：点击分类按钮，显示隐藏
$(".child").prev().on("click", function () {

  $(this).next().slideToggle();
})

//功能二：侧边栏显示与隐藏效果
$(".header_left").on("click", function () {
  $(".lt_aside").toggleClass("now");
  $(".lt_main").toggleClass("now");
});

//功能三：点击退出按钮，模态框显示，即可退出,需要发送ajax请求，告诉服务端要退出
$(".log-out").on("click", function () {
  //console.log(1);
  $("#logoutModal").modal("show");
})

$(".btn_logout").on("click", function () {
  console.log(1);
  $.ajax({
    type: "get",
    url: "/employee/employeeLogout",
    success: function (info) {
      //console.log(info);
      if (info.success) {
        location.href = "login.html";
      }
    }
  })
})




