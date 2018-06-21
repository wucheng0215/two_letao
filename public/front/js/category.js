

$(function () {

  //渲染一级分类
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    success: function (info) {
      console.log(info);
      var html = template("tpl", info)
      //console.log(html)
      $(".content-left ul").html(html);

      //一上来默认选中第一个
      render(info.rows[0].id);
    }
  });



  function render(id) {
    // 渲染二级分类,每点击一次发送一次ajax请求，获取数据

    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      success: function (info) {
        console.log(info)
        var html = template("tpl2", info)
        console.log(html);

        $(".content-right ul").html(html);
      }

    })

  }


  //给下面的li注册点击事件
  $(".content-left ul").on("click", "li", function () {
    //排他
    var id = $(this).data("id");
    console.log(id);
    $(this).siblings().removeClass("now");
    $(this).addClass("now");
    //渲染二级分类,每点击一次发送一次ajax请求，获取数据
    render(id);
    
    //让右边的区域滚动滚回 0，0
    mui('.mui-scroll-wrapper').scroll()[1].scrollTo(0, 0, 500);//100毫秒滚动到顶2
  })

})