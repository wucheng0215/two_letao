

$(function () {


  var page = 1;
  var pageSize = 5;
  var img = [];
  function render() {

    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        var html = template("tpl", info);
        $("tbody").html(html);

        //添加分类页
        // 添加分类页
        //type属性：
        // 如果是首页---> first
        // 上一页-->prev
        // 下一页-->next
        // 尾页-->last
        // 具体的页码-->page
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / pageSize),
          //框里面显示
          itemTexts: function (type, page, current) {
            switch (type) {
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "first":
                return "首页";
              //如果是数字就是现实对应的数字
              default: return page;
            }
          },
          //放上去时显示的页码数
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "first":
                return "首页";
              //如果是数字就是现实对应的数字
              default: return "跳转到" + page + "页";
            }
          },
          //一定要设置为true，否则上面的页码数显示不出来
          useBootstrapTooltip: true,
          onPageClicked: function (a, b, c, p) {
            page = p,
              //点击的时候重新渲染
              render();
          }
        })
      }
    })
  }

  //页面一开始要进行渲染
  render();

  //点击添加按钮，模态框显示，
  $(".btn_add3").on("click", function () {
    $("#productModal").modal("show");

    //添加二级分类
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        var html = template("tpl2", info);
        $(".dropdown ul").html(html);
      }
    });

  });
  //给a注册点击事件，
  //给dropdown-menu下面的a注册点击事件，拿到对应的id
  $(".dropdown-menu").on("click", "a", function () {
    var id = $(this).data("id");
    var txt = $(this).text();
    //将选中的文本显示到二分类框里面
    $(".dropdown-text").text(txt);
    //查看pc端口，二级分类登录时需要的参数
    $('[name="brandId"]').val(id);
    //手动的添加    
    //如果选中，就让它手动的通过，VALID不需要第三个参数
    $("#form").data("bootstrapValidator").updateStatus("brandId", "VALID");
  });


  //初始化表单的校验
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
      brandId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择二级分类'
          },

        }
      },
      proName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的名称'
          },

        }
      },
      proDesc: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的描述'
          },


        }
      },
      num: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的库存'
          },
          regexp: {
            regexp: /^\d{0,4}$/,
            message: '请输入合法的库存'
          }
        }
      },
      size: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的尺码'
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '请输入合法的尺码，例如：30-45'
          }
        }
      },

      oldPrice: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的原价'
          }
        }
      },

      Price: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品的价格'
          }
        }
      },
      brandLogo: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择三张图片'
          }
        }
      },
    }
  });



  //文件上传
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data.result);

      //如果图片超过三张，就直接不能上传了，如果没有这个条件，可以上传四张甚至更多
      if (img.length >= 3) {
        return;
      }



      $(".img-box").append('<img src="' + data.result.picAddr + '" width="100" height="100" alt="">')
      img.push(data.result);
      if (img.length === 3) {
        //手动的校验成功
        $("#form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
      } else {
        //否则都是校验失败的
        $("#form").data("bootstrapValidator").updateStatus("brandLogo", "INVALID");
      }

    }
  });

  // 校验成功事件，触发表单校验成功事件，发送ajax请求，添加数据
  $("#form").on("success.form.bv", function (e) {

    var param = $("#form").serialize()
    //console.log(param);
    param += "& picName1=" + img[0].picName + " & picAddr1=" + img[0].picAddr;
    param += "& picName2=" + img[1].picName + " & picAddr2=" + img[1].picAddr;
    param += "& picName3=" + img[2].picName + " & picAddr3=" + img[2].picAddr;

    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: param,
      success: function (info) {
        //console.log(info);
        if (info.success) {
          $("#productModal").modal("hide");
          //重新渲染
          page = 1;
          render();
          //重置表单
          //重置内容和样式
          $("#form")[0].reset();
          console.log($("#form"));
          $("#form").data("bootstrapValidator").resetForm();

          //重置请选择二级分类
          $(".dropdown-text").text("请选择二级分类");
          //数组为空，方便下次重0开始
          img = [];
          //id重置
          $('[name="brandId"]').val("");
          //删除原始图片
          $(".img-box img").remove();

        }
      }
     

    })
    console.log(img);
  })







})