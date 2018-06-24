

// 公共区域
//轮播图自动播放
var gallery = mui('.mui-slider');
gallery.slider({
  interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
});

// 初始化区域滚动,
mui('.mui-scroll-wrapper').scroll({
  indicators:false//会出现细的下拉框，改为false，默认为true;
});


// 获取地址栏里面的数据

  //1、获取地址栏中输入的地址
  function getUrl() {
    //1、获取地址栏中输入的地址
    var search = location.search;//获取地址栏中对应的key，把key的值放进input框中

    search = decodeURI(search);//地址栏会对中文进行转码  ?key=阿迪

    search = search.slice(1);//字符串的截取，把前面的问号去掉
    //console.log(search);
    var arr = search.split("&");//把字符串转换成一个数组
    //console.log(arr);
    var obj = {};//定义一个空对象
    arr.forEach(function (e, i) {
      var k = e.split("=")[0];//把字符串转换成数组得到[key,"内容"]
      var v = e.split("=")[1];
      obj[k] = v;
    })
    return obj;
  };
