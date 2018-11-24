$(function () {
  // 当前页
  var currentPage = 1;
  // 每页多少条
  var pageSize = 5;
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json ",
      success: function (info) {
        var htmlStr = template("secondTpl", info);
        $('.lt_main tbody').html(htmlStr);
        // 分页
        $('#pagintor').bootstrapPaginator({
          // 配置bootstrap版本
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil(info.total / info.size),
          // 注册每个页码的点击事件
          onPageClicked: function (a, b, c, page) {
            // 重新渲染页面
            currentPage = page;
            render();
          }
        })
      }
    });
  }
  // 添加分类的点击事件
  $("#secondaddBtn").click(function () {
    $("#secondaddModal").modal("show");
    // 发送ajax请求，查询一级分类列表，进行渲染
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        var htmlStr = template("dropdownTpl", info);
        $(".dropdown-menu").html(htmlStr);
      }
    });
  });
  // 事件委托给一级菜单a添加点击事件
  $(".dropdown-menu").on("click", "a", function () {
    var txt = $(this).text();
    var id = $(this).data("id");
    $("#dropdownText").text(txt);
    $('[name="categoryId"').val(id);
    // 手动修改隐藏域的校验状态
    $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
  })
  // 4. 配置图片上传
  $('#fileupload').fileupload({
    // 指定数据类型为 json
    dataType: "json",
    // done, 当图片上传完成, 响应回来时调用
    done: function (e, data) {
      // console.log(data);
      // 获取上传成功的图片地址
      var picAddr = data.result.picAddr;
      // 设置图片地址
      $('#imgBox img').attr("src", picAddr);
      // 将图片地址存在隐藏域中
      $('[name="brandLogo"]').val(picAddr);
      $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });
  // 表单校验
  $("#form").bootstrapValidator({
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 校验的字段
    fields: {
      // 品牌名称
      brandName: {
        //校验规则
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      // 一级分类的id
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      // 图片的地址
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  });
  // 阻止默认的提交方式，以aajax提交
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $('#form').serialize(),
      success: function (info) {
        // console.log(info);
        if (info.success) {
          $('#secondaddModal').modal("hide");
          currentPage = 1;
          render();
          $('#form').data("bootstrapValidator").resetForm(true);
          $('#dropdownText').text("请选择一级分类");
          $("#imgBox img").attr("src", "./images/none.png");
        }
      }
    });
  });
})