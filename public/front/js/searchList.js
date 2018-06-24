


$(function () {




  //渲染
  var page = 1;
  var pageSize = 4;
  var key = getUrl().key;

  //页面加载之前先刷新，数据加载完成，下拉刷新结束
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      //下拉刷新
      down: {

        auto: true,//可选,默认false.首次加载自动下拉刷新一次


        callback: function (callback) {  //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        //page=1.page++,必须要写在callback的里，不能写在render里面，page=1.page++是由down up决定的，render是一个公共的部分
          page = 1;
          //回调函数
          render(function (info) {
            var html = template("tpl", info);
            $(".lt_product ul").html(html);
            //数据加载完成，结束下拉刷新
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();//注意：这串代码需放在ajax代码结束之后
            //注意：这边上拉加载时有个bug，当第一次上拉结束，显示没有更多数据，再次继续下拉加载时，只能加载一页，下面就会
            //显示没有更多数据，不能在加载了，就需要重置下拉加载控件
            mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
          });



        }
      },
      //上拉加载
      up: {

        //contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
        callback: function () {
          page++;
          render(function (info) {
            console.log(info)

            var html = template("tpl", info);
            $(".lt_product ul").append(html);
            //结束上拉，告诉用户没有更多数据endPullupToRefresh(true)里面如果直接加true,上拉第二次时就直接不加载了，即使后面有数据，
            //所以这边需要加一个判断，如果返回的data里面没有数据了，就结束，如果还有参数写false
            if (info.data.length == 0) {
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);//注意：这串代码需放在ajax代码结束之后
            } else {
              //如果有值，就继续加载
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
            }



          });//
        }
      }

    }
  });



  function render(callback) {

    var obj = {
      page: page,
      pageSize: pageSize,
      proName: key
    }

    //5、点击的时候判断是要加price还是加num
    $a = $(".lt_sort li.now")//获取的是一个数组
    if ($a.length > 0) {
      var type = $(".lt_sort li.now").data("type");
      var value = $(".lt_sort li.now").find("i").hasClass("fa-angle-down") ? 2 : 1;
      obj[type] = value;

    }


    //把值放进商品列表的input框里面
    $(".lt_search input").val(key);
    //发送ajax请求
    $.ajax({

      type: "get",
      url: "/product/queryProduct",
      data: obj,
      success: function (info) {
        //console.log(info);

        setTimeout(function () {//加载框

          callback(info);

        }, 1000);


      }
    })

  };


  //3、点击搜索按钮，获取文本里面的内容，重新渲染
  $(".search_btn").on("click", function () {

    //6、重置

    $(".lt_sort li").removeClass("now");
    $(".lt_sort li i").addClass("fa-angle-down").removeClass("fa-angle-up");


    key = $(".lt_search input").val();//获取文本里面的内容
    //点击按钮时，
    //console.log(mui('.mui-scroll-wrapper').pullRefresh());
    //调用一次下拉刷新功能
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  })




  //4、注册点击li事件
  //如果点击了价格，就要按照价格来进行排序 ，多传一个参数
  //如果点击了数字，就要按照数字来进行排序，多传一个参数

//使用mui提供的下拉刷新页面模板是，容器内的onclick事件没有触发，改为tap
  $(".lt_sort li[data-type]").on("tap", function () {

    console.log(1);
    //一进来先判断是否有这个类，如果没有添加，如果有就切换类
    if (!$(this).hasClass("now")) {
      //当点击时添加now类，移除其他兄弟的类
      $(this).addClass("now");
      $(this).siblings().removeClass("now"); //注：a没有兄弟元素

      //如果没有now这个类，添加now这个类，初始化箭头都为下
      $(".lt_sort li i").addClass("fa-angle-down").removeClass("fa-angle-up");

    } else {
      //如果有这个类，再次点击箭头将会切换，上下箭头
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");

    }

   //调用一次下拉刷新功能
   mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();


  });







})






