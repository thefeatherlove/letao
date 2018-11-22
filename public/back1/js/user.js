$(function () {
  // 当前页
  var currentPage = 1;
  // 每页的条数
  var pageSize = 5;
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize,
      },
      success: function (info) {
        var htmlStr = template("tpl", info);
        $('.lt_main tbody').html(htmlStr);
        // 配置分页插件
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          size: "small", //设置控件的大小，mini, small, normal,large
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });
      }
    })
  };


  // 禁用启用按钮点击事件

  $('.lt_main tbody').on("click", ".btn", function () {
    var id = $(this).parent().data("id");
    var isDelete = $(this).hasClass("btn-success") ? 1 : 0;
    $('#userModal').modal('show');
    $('#userBtn').off("click").on("click", function () {
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id: id,
          isDelete: isDelete,
        },
        success: function (info) {
          // console.log(info);
          if (info.success) {
            $("#userModal").modal('hide');
            render();
          }
        }
      });
    })

  })

})