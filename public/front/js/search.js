


//用户搜素的数据存储在本地 ，localstorage

$(function () {

  //获取数据
  //localStorage.getItem("lt_history")返回的是一个字符串，需要转换成js对象
  function getHistory() {
    //后面要加一个空数组不然前面遍历的时候，没有获取到数据时，result会是空
    var result = localStorage.getItem("lt_history") || '[]';

    result = JSON.parse(result);
    return result; //一定要return，不然没有返回值

  }


  function render() {
    var history = getHistory();

    //用模板引擎渲染进去
    $(".lt_history").html(template("tpl", { rows: history }))
  }

  //1、一上来先渲染
  render();


  //2、清空历史数据,点击清空按钮全部清除
  $(".clear").on("click", function () {

    localStorage.removeItem("lt_history");
    render();

  });

  //3、删除，给btn_delete注册点击事件，获取到数组，把对应的数据在数组里面删除掉，
  //重新添加localStorage.setItem ,重新获取，重新渲染
  $(".lt_history").on("click", " .btn_delete", function () {

    var history = getHistory();//获取到数据

    var index = $(this).parent().data("index");//获取到点击时对应的下标

    //点击要删除时，先弹出一个确认框
    mui.confirm("你确定要删除吗？", "温馨提示", ["是", "否"], function (e) {
      //console.log(e);  点击是返回的是0，点击否返回的是1

      if (e.index == 0) { //如果用户点击的是0,就删除
        history.splice(index, 1);//删除点击的那个li，获得一个新的数组

        localStorage.setItem("lt_history", JSON.stringify(history));//重置local里面的数据,注：设置的一定要是字符串格式

        render();//再重新渲染
      }
    })
  });


  //4、增加,点击搜索按钮，获取到数据，把input里面的内容，添加到数组最前面，重新添加localStorage.setItem,重新获取渲染
  //当超过十条时，后面的内容就删除，新增的添加到最前面
  //有重复的就把原先的删除把最新的添加到最前面
  $(".search_btn").on("click", function () {

    var txt = $(".lt_search input").val();//获取文本框里面的内容

    if (txt === "") {
      mui.toast("请输入内容");
      return;
    }


    $(".lt_search input").val("");//获取到数据以后将文本框里面的内容设置为空
    //一上来要先判断文本框里面的内容是否为空

    var history = getHistory();//获取到数据


    //获取txt在数组中下标
    var index = history.indexOf(txt);
    if (history.indexOf(txt) != -1) {  //判断是否有这个文本，如果有，就删除

      history.splice(index, 1);
    }

    //这个要放在后面，保证上面如果有重复，会删除重复的，不满足大于等于十的条件就可以最后一个不用删除
    if (history.length >= 10) { //如果大于等于十，把最后面的删除
      history.pop();
    }

    history.unshift(txt);//往数组的最前面添加新增的数据

    localStorage.setItem("lt_history", JSON.stringify(history));//重新添加到本地数据里面

    render();

    //页面发生跳转
     location.href="searchList.html?key="+txt;

  })





})