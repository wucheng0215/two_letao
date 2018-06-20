

$(function () {

  // 发送ajax获取数据，根据后台数据 动态的添加
  var page = 1;
  var pageSize = 5;
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        //console.log(info);
        var html = template("tpl", info);
        // 添加到tbody里面
        $("tbody").html(html);
        // 添加分类页
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / pageSize),
          onPageClicked: function (a, b, c, p) {
            page = p,
              //点击的时候重新渲染
              render();
          }
        })
      }
    })
  }

  render();

  // 点击添加按钮，弹出模态框
  $(".btn_add2").on("click", function () {
    $("#secondModal").modal("show");


    //发送ajax请求，将一级分类里面的数据动态的添加到ul里面
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        var html = template("tpl2", info)
        $(".dropdown-menu").html(html);

      }
    })

  })


  //给dropdown-menu下面的a注册点击事件，拿到对应的id
  $(".dropdown-menu").on("click", "a", function () {
    var id = $(this).data("id");
    var txt = $(this).text();
    //将选中的文本显示到一级分类框里面
    $(".dropdown-text").text(txt);
    //查看pc端口，二级分类登录时需要的参数
    $('[name="categoryId"]').val(id);

    //如果选中，就让它手动的通过，VALID不需要第三个参数
    $("#form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });



  //上传图片
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      //console.log(data);
      $(".img-box img").attr("src", data.result.picAddr);
      //把图片的地址复制给brandLogo
      $('[name="brandLogo"]').val(data.result.picAddr);
      console.log(data.result.picAddr)
      //要手动的让它校验通过，如果图片上传成功，就通过
      $("#form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });



  //表单的校验
  //初始化表单校验
  $("#form").bootstrapValidator({
    excluded: [],//不校验的内容
    //小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //指定校验的字段
    fields: {
      categoryId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择一级分类'
          },

        }
      },
      brandName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入二级分类的名称'
          },

        }
      },
      brandLogo: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请上传品牌图片'
          }
        }
      }
    }
  });

console.log($("#form"))
  //注册表单验证成功事件，阻止跳转，发送ajax请求
  $("#form").on('success.form.bv', function (e) {
    // 阻止表单跳转
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $("#form").serialize(),
      success: function (info) {
        //console.log(info);
        if (info.success) {
          //隐藏模态框
          $("#secondModal").modal("hide");
          //页面停留在第一页
          page = 1;
          //重新渲染
          render();
          //重置表单
          var validator = $("#form").data('bootstrapValidator');
          //重置表单，并且会隐藏所有的错误提示和图标
          validator.resetForm();
          //重置内容

          //重置input框里面的内容
          $("#form")[0].reset();
          //重新设置文本的内容
          $(".dropdown-text").text("请选择一级分类");
          //id值重新变为空
           $('[name="categoryId"]').val("");
          $(".img-box img").attr("src", "images/none.png");
           $('[name="brandLogo"]').val("");


        }
      }

    })


  });





})