

// 分类一的功能
$(function () {

  //1、发送ajax获取数据,查询功能

  var pageNum = 1;
  var pageSize = 5;

  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: pageNum,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        var html = template("tpl", info);
        $("tbody").html(html);

        //添加分类页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: pageNum,
          totalPages: Math.ceil(info.total / pageSize),
          onPageClicked: function (a, b, c, p) { //点击时重新渲染
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

  //2、点击添加分类按钮，弹出模态框
  $(".btn_add").on("click", function () {
    $("#firstModal").modal("show");

  });


  //3、表单校验的功能
  //1. 用户名不能为空


  //如何使用表单校验插件：
  //1. 引包
  //2. 调用bootstrapValidator

  //初始化表单校验
  $("#form").bootstrapValidator({

    //添加小图标
    feedbackIcons: {
      //校验成功的图标
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },


    //指定校验的字段
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            //用户名内容不能为空
            message: "请输入一级分类的名称"
          }
        }
      }
    }
  });
  //注册表单成功的事件
  $("#form").on("success.form.bv", function (e) {
    e.preventDefault();
    //发送ajax
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $("#form").serialize(),
      success: function (info) {
        if (info.success) {
          $("#firstModal").modal("hide"); //成功以后模态框隐藏
          render(); //重新渲染
          //重置表单
          //获取获取实例var 
          validator = $("#form").data('bootstrapValidator');

          //重置表单，并且会隐藏所有的错误提示和图标
          validator.resetForm();
          //$form是一个jquery对象，没有reset方法
          //但是dom对象有reset方法，所以需要把form这个对象取出来，才能调用reset方法
          $("#form")[0].reset();

        }
      }
    })
  })



})