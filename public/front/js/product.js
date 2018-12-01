$(function () {
  var productId = getSearch("productId");
  // console.log(productId);
  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: productId,
    },
    dataType: "json",
    success: function (info) {
      console.log(info);
      var htmlStr = template("productTpl", info);
      $('.lt_main .mui-scroll').html(htmlStr);
      // 轮播图初始化
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
      });
      // 初始化数字框
      mui('.mui-numbox').numbox();
    }
  });

  // 给尺码添加选择功能
  $('.lt_main').on("click", ".lt_size span", function () {
    $(this).addClass("current").siblings().removeClass("current");
  });

  // 添加购物车功能
  $('#addCart').click(function () {
    var size = $(".lt_size span.current").text();
    var num = $('mui-numbox-input').val();
    if (size === null) {
      mui.toast("请选择尺码");
      return;
    }
    // 发送ajax请求加入购物车
    $.ajax({
      type: "post",
      url: "/cart/addCart",
      data: {
        productId: productId,
        size: size,
        num: num,
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        // 未登录
        if (info.error === 400) {
          // location.href = "login.html?retUrl=" + location.href;
          location.href = "login.html"
          return
        }

        // 添加成功
        if (info.success) {
          // 给用户提示
          mui.confirm("添加成功", "温馨提示", ["去购物车", "继续浏览"], function (e) {
            // e.index 标记当前点击的按钮下标
            if (e.index === 0) {
              // 去购物车
              location.href = "cart.html";
            }
          })
        }

      }
    });

  })


})