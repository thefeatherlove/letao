$(function () {

  var currentPage = 1;
  var pageSize = 5

  render();

  function render() {
    $.ajax({
      url: "/category/queryTopCategoryPaging",
      type: "get",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        var htmlStr = template("addTpl", info);
        $('.lt_main tbody').html(htmlStr);
        // 分页插件
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();

          }
        });
      }
    })

  }
  $('#addBtn').click(function () {
    $('#firstaddModal').modal("show");
  });
  $('#form').bootstrapValidator({
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入一级用户名'
          },
        }
      }
    }
  });
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $("#form").serialize(),
      success: function (info) {
        if (info.success) {
          $("#firstaddModal").modal("hide");
          currentPage = 1;
          render();
          // 重置表单
          $("#form").data('bootstrapValidator').resetForm(true);
        }
      }
    })
  });
  // 点击取消按钮，重置表单
  var dismiss = $(".modal-footer .btn");
  dismiss.click(function () {
    $("#form").data('bootstrapValidator').resetForm(true);
  })
})