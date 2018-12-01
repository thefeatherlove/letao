$(function () {


  /*
   * 功能1: 本地历史记录渲染展示
   * 思路:
   *   (1) 从本地读取搜索历史
   *   (2) 读出来的是 jsonStr, 转换成数组
   *   (3) 结合模板引擎渲染
   * */

  render();
  // 获取本地历史记录数组

  function getHistory() {
    var jsonStr = localStorage.getItem("search_list") || "[]";
    var arr = JSON.parse(jsonStr); // 将json字符串转化成数组
    return arr;
  }

  function render() {
    var arr = getHistory();
    var htmlStr = template("searchTpl", {
      list: arr
    });
    $(".lt_history").html(htmlStr);
  }

  // 功能2: 清空所有历史记录
  // 1、获取点击事件
  $(".lt_history").on("click", ".btn_empty", function () {
    mui.confirm('你确定要清空历史记录吗？', '温馨提示', ['取消', '确认'], function (e) {
      // 确认按钮被点击
      if (e.index === 1) {
        // 清除本地历史
        localStorage.removeItem("search_list");
        // 重新渲染页面
        render();
      }
    })
  });

  // 功能3: 删除单条历史记录
  $(".lt_history").on("click", ".btn_delet", function () {
    // 获取下标
    var index = $(this).data("index");
    // 获取数组
    var arr = getHistory();
    arr.splice(index, 1);
    localStorage.setItem("search_list", JSON.stringify(arr));
    render();
  });

  // 功能4: 添加历史记录功能
  $(".search_btn").click(function () {
    // 获取关键字
    var key = $(".search_input").val().trim();
    // 非空
    if (key === "") {
      mui.toast("请输入搜索关键字");
      return;
    }
    var arr = getHistory();
    // 去除重复项
    var index = arr.indexOf(key);
    if (index != -1) {
      arr.splice(index, 1);
    }
    if (arr.length >= 10) {
      arr.pop();
    }
    arr.unshift(key);
    localStorage.setItem("search_list", JSON.stringify(arr));
    render();
    $('.search_input').val("");
    location.href = "search_list.html?key=" + key;
  })
})