$(function () {
  /* 
    1. 进行表单校验配置
      校验要求:
       (1) 用户名不能为空, 长度为2-6位
       (2) 密码不能为空, 长度为6-12位
  */
  $('form').bootstrapValidator({
    //验证图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 校验字段
    fields: {
      // 用户名配置
      username: {
        // 校验规则
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2到6之间'
          },
          callback: {
            message: '用户名不存在'
          }
        }
      },
      // 密码配置
      password: {
        validators: {
          //不能为空
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度必须在6到12之间'
          },
          callback: {
            message: '密码错误'
          }
        }
      }
    }
  });
  /* 
    表单验证
  */
  $("#form").on('success.form.bv', function (e) {
    // 阻止默认的表单提交
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        // console.log(info);
        // 登录成功
        if (info.success) {
          location.href = "index.html";
        }
        // 用户名不存在
        if (info.error === 1000) {
          $('#form').data('bootstrapValidator').updateStatus("username", "INVALID", 'callback')
        }
        // 密码错误
        if (info.error === 1001) {
          $('#form').data('bootstrapValidator').updateStatus("password", "INVALID", 'callback')
        }
      }
    })
  });
  // 重置功能
  $('[type="reset"]').click(function () {
    $("#form").data('bootstrapValidator').resetForm();
  })
});