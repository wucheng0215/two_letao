$(function () {
  //表单校验
  //bootstrapValidator插件
  //1、依赖于表单bootstrap
  //2、会自动的进行表单的校验，需要配置一份校验单的规则
  //3、在表单提交ed时候以及输入内容的时候，自动的进行校验
  //如果校验失败，阻止表单的提交
  //如果表单校验成功，会让表单继续提交


  //初始化表单校验
  $form = $("form");
  $form.bootstrapValidator({

    //配置校验时的图标,
    feedbackIcons: {
      //校验成功时的图标
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //配置校验的规则
    //字段，你想要校验哪些字段
    fields: {
      //username对应的表单中name属性。
      username: {
        //username的规则
        validators: {
          notEmpty: {
            message: "用户名不能为空"
          },
          stringLength: {
            min: 3,
            max: 6,
            message: "用户名长度是3-6位"
          },
          callback: {
            message: "用户名不存在"
          }
        }

      },
      password: {

        //password的规则
        validators: {
          notEmpty: {
            message: "用户密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度是6-12位"
          },
          callback: {
            message: "密码错误"
          }
        }

      }
    }

  });


  //表单校验成功的事件
  $form.on("success.form.bv", function (e) {
    //阻止表单跳转
    e.preventDefault();
    //发送ajax请求
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $form.serialize(),
      success: function (info) {
        //做判断
        console.log(info);
        //校验成功后手动的更新某个字段的校验
        if (info.success) {
          location.href = "index.html";
        }
        if (info.error == 1000) {
         //手动的让username校验失败
         //参数一：更新哪个字段
		    //参数二：更新为什么状态 INVALID  VALID  校验失败  校验成功  ,一般情况下是校验失败以后显示的字段
         $form.data('bootstrapValidator').updateStatus("username", "INVALID", "callback")
        }
        if (info.error == 1001) {
          $form.data('bootstrapValidator').updateStatus("password", "INVALID", "callback")
        }
      }
    })


  })

  //重置表单
  $("[type=reset]").on("click", function () {
    //获取validator实例
    var validator = $form.data('bootstrapValidator');  

    validator.resetForm();//重置表单，并且会隐藏所有的错误提示和图标
  })
});
