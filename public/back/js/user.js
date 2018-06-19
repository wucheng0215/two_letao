

// 入口函数
$(function () {



  //发送ajax，获取到数据，动态的添加到tbody里面
  var pageNum = 1;
  var pageSize = 8;
  function render() {

    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: pageNum,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        var html = template("tpl", info)
        $("tbody").html(html);
        //添加分类页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: pageNum,
          totalPages: Math.ceil(info.total / pageSize),
          onPageClicked: function (a, b, c, p) {
            //console.log(p);
            pageNum = p;
            //console.log(pageNum)
            render();
          }

        });

      }
    });
  }
  render();
  //功能二：点击禁用按钮的时候，弹出模态框，点击确认按钮，对应的状态跟操作都要更改
  $("tbody").on("click", ".btn", function () {

    $("#userModal").modal("show");
    var id = $(this).data("id"); //得到对应的ID

    //要获取到点击的当前状态是0还是1，判断是否有这个类，有就返回1，没有就返回0
    var isDelete = $(this).hasClass("btn-success") ? 1 : 0;
    $(".btn_user").off().on("click", function () {  //加off是防止事件的叠加
      //发送ajax请求
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id: id,
          isDelete: isDelete
        },
        success: function (info) {
          if (info.success) {
            //发送成功后，不需要前端修改状态跟按钮，服务器返回结果，前端只需要重新渲染即可
            
            $("#userModal").modal("hide");
            render();
          }
        }
      })

    })

  })



})