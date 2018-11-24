$(function () {
  // 存储长传图片的数组
  var picArr = [];
  // 当前页
  var currentPage = 1;
  // 每页多少条
  var pageSize = 3;
  render();


  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("productTpl", info);
        $("tbody").html(htmlStr);
        // 分页配置
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
    });
  }


  // 点击添加按钮显示模态框
  $("#productaddBtn").click(function () {
    $("#productaddModal").modal("show");
    // 发送ajax，请求所有的二级分了数据进行渲染
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        var htmlStr = template("dropdownTpl", info);
        $('.dropdown-menu').html(htmlStr);
      }
    });
  });


  // 给下拉框的a添加点击事件（事件委托）
  $(".dropdown-menu").on("click", "a", function () {
    var txt = $(this).text();
    $("#dropdownText").text(txt);
    // 获取id, 设置给隐藏域
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);
    // 将隐藏域的校验状态改成VALID
    $("#form").data("bootstrapValidator").updateStatus("brandId", "VALID");
  });


  // 配置fileupload，实现文件的上传
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      // 图片的信息（地址/名称）
      var picObj = data.result;
      picArr.unshift(picObj);
      var picUrl = picObj.picAddr;
      // 在图片盒子内部头部插入图片
      $('#imgBox').prepend('<img src="' + picUrl + '" style="width: 100px;">');
      // 如果>3 说明超出长度范围，需要将最后的图片删除
      if (picArr.length > 3) {
        // 删除数组的最后一项
        picArr.pop();
        // 删除最后一张照片
        $('#imgBox img:last-of-type').remove();
      }
    }
  });


  // 配置表单校验
  $('#form').bootstrapValidator({
    //1. 指定不校验的类型
    excluded: [],
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //3. 指定校验字段
    fields: {
      brandId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择二级分类'
          },
        }
      },
      proName: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品名称'
          },
        }
      },
      proDesc: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品描述'
          },
        }
      },
      num: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品库存'
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品尺码'
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '必须是xx-xx的格式, xx是两位数字, 例如: 36-44'
          }
        }
      },
      oldPrice: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品原价'
          },
        }
      },
      price: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入商品现价'
          },
        }
      },
      picStatus: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请上传3张照片 '
          },
        }
      },
    }
  });


  // 注册表单成功实践，阻止默认提交，通过ajax提交
  $("#form").on('success.form.bv', function (e) {
    // 阻止默认提交
    e.preventDefault();
    var paramsStr = $('#form').serialize(); // 所有表单内容数据

    // 还需要拼接上图片地址和名称
    // paramsStr += "&key1=value1&key2=value2"
    paramsStr += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    paramsStr += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    paramsStr += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: paramsStr,
      dataType: "json",
      success: function (info) {
        if (info.success) {
          $('#productaddModal').modal("hide");
          currentPage = 1;
          render();
          $('#form').data('bootstrapValidator').resetForm(true)
          // 由于下拉菜单  和  图片 不是表单元素, 需要手动重置
          $('#dropdownText').text("请选择二级分类");

          // 删除图片的同时, 清空数组
          $('#imgBox img').remove();
          picArr = [];
        }
      }
    });
  });
})