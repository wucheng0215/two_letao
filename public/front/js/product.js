


$(function () {

  //获取地址栏的值

  var productId = getUrl().productId;

  console.log(productId);
  //根据传的ID发送ajax请求，获取数据，渲染到页面来
  function render() {

    //发送ajax请求
    $.ajax({
      type: "get",
      url: "/product/queryProductDetail",
      data: {
        id: productId
      },
      success: function (info) {
        console.log(info)
        var html = template("tpl", info);
        $(".mui-scroll").html(html);

        //mui框架会默认初始化当前页面的图片轮播组件；若轮播组件内容为js动态生成时（比如通过ajax动态获取的营销信息），
        //则需要在动态生成完整DOM (包含mui-slider下所有DOM结构) 后，手动调用图片轮播的初始化方法

        var gallery = mui('.mui-slider');
        gallery.slider({
          interval: 2000//自动轮播周期，若为0则不自动播放，默认为0；
        });


        //mui在mui.init()中会自动初始化基本控件,但是 动态添加的Numbox组件需要手动初始化
        mui(".lt_num").numbox()


        // 设置span的now类
        $(".lt_size span").on("click", function () {
          $(this).addClass("now").siblings().removeClass("now");

        })

      }

    });
  }

  //1、渲染
  render();

  //2、点击span，添加类名





  //2、点击加入购物车，发送ajax请求，
  $(".shopping-car").on("click", function () {
    //获取到数据
    //<1>尺寸
    var size = $(".lt_size span.now").text();
    if (!size) {
      mui.toast("请选择尺码");
      return false;

    }
    //<2>数量
    var num = $(".lt_num").val();

    $.ajax({
      type: "post",
      url: "/cart/addCart",
      data: {
        productId: productId,
        num: num,
        size: size
      },
      success: function (info) {
        if (info.error) {
          //如果后台显示未登录，直接跳转到登录页面，把当前页面的地址加在后面，返回时直接返回之前的页面
          location.href = "login.html?back=" + location.href
        }
        if (info.success) {

        }
      }





    })




  })



})