// 进度条插件

$(function () {

  // ajax全局事件
  // 第一个ajax请求发送时调用
  $(document).ajaxStart(function () {
    //开启进度条
    NProgress.start();
  });
  // 所有的ajax请求发送完成时调用
  $(document).ajaxStop(function () {
    // 关闭进度条
    NProgress.done();
  });

  // 二级导航切换
  $('#category').click(function () {
    $(this).next().stop().slideToggle();
  });
  // 点击显示隐藏左侧侧边栏
  $('.lt_topbar .icon_left').click(function () {
    $('.lt_aside').toggleClass("hidemenu");
    $('.lt_topbar').toggleClass("hidemenu");
    $('.lt_main').toggleClass("hidemenu");
  });
  // 显示模态框
  $('.lt_topbar .icon_right').click(function () {
    $('#myModal').modal('show');
  });
  // 退出功能
  $('#logoutBtn').click(function () {
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if (info.success) {
          location.href = "login.html";
        }
      }
    });
  });

})