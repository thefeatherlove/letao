$(function () {
  // 将地址栏传递的搜索关键字传递给搜索框
  var key = getSearch("key");
  $(".search_input").val(key);

  render();
  // 给搜索按钮注册事件
  $(".search_btn").click(function () {
    render();
  })
  //排序
  // 高亮效果
  $(".lt_sort a[data-type]").click(function () {
    if ($(this).hasClass("current")) {
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    } else {
      $(this).addClass("current").siblings().removeClass("current");
    }
    render();
  })

  function render() {
    // 根据搜索关键字发送ajax请求
    var paramsObj = {};
    paramsObj.proName = $('.search_input').val();
    paramsObj.page = 1;
    paramsObj.pageSize = 100;
    var $current = $(".lt_sort a.current");
    if ($current.length === 1) {
      var sortName = $current.data("type");
      var sortValur = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
      paramsObj[sortName] = sortValur;
    }
    setTimeout(function () {
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: paramsObj,
        dataType: "json",
        success: function (info) {
          console.log(info);
          var htmlStr = template("searchListTpl", info);
          $(".lt_product").html(htmlStr);
        }
      });
    }, 500);
  }
})