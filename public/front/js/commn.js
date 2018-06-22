

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