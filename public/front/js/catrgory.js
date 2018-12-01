$(function () {

  // 1、一进入页面, 发送请求, 获取左侧一级分类数据进行渲染
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    dataType: "json",
    success: function (info) {
      console.log(info);
      var htmlSet = template("leftTpl", info);
      $(".lt_category_left ul").html(htmlSet);
      renderSecondById(info.rows[0].id);
    }
  });

  // 2. 通过事件委托, 给所有的左侧 a 绑定点击事件, 点击 a 切换显示二级分类
  $('.lt_category_left ul').on("click", "a", function () {
    $(".lt_category_left ul li a").removeClass("current");
    $(this).addClass("current");
    var id = $(this).data("id");
    renderSecondById(id);
  });


  // 通过 一级分类的 id, 进行右侧二级分类的重新渲染
  function renderSecondById(id) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id,
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlSet = template("rightTpl", info);
        $(".lt_category_right ul").html(htmlSet);
      }
    });
  }

})