$(function(){
 
  var cateData  //将获取到的数据，弄成全局变量。方便后续函数使用
 
  /* 创建渲染函数，实现数据的动态渲染 */
  render()
  function render() {
    // 判断数据事件是否超时，如果没有超时，就加载加载页面如果超时，需要重新获取，如果没有超时，则渲染
    cateData = JSON.parse(localStorage.getItem('pyg_CataData')) // 将字符传类型的数据，变换成json格式的对象
    if (cateData && Date.now() -cateData.time < 24*60*60*1000 ){
      leftCateList()
      rightCateList(0)
      // 如果超时，再次发起请求
    }else{

      getCateData()
    }
    
  }

/* 获取分类数据 */
  function getCateData() {

    $('body').addClass('loadding')
    /* 发送请求获取后台数据 */
    $.get('categories', function (result) {
      // 这样一次性获取到了所有数据，我们需要对数据进行拆分。并且将数据保存到本地存储，提升页面加载速率
      console.log(result); //obj
      /* 如果获取数据成功执行以下代码  */
      if(result.meta.status ==200){
        /* 将数据存储到本地 。由于客户端与服务器之间数据的交互，是字符串的形式*/
        /* 将事件也进行存储，如果事件超时，需要重新获取数据。确保数据，即时更新 */
         cateData = {'list':result.data,time:Date.now()} // 获取到是对象
        localStorage.setItem('pyg_CataData', JSON.stringify(cateData)) // 将数据转换成字符串的形式，存储
        // 动态生成左侧导航结构
        leftCateList()
        // 生成右侧分类数据
        rightCateList(0)
      }
     

    }, 'json')
  }
 
  //左侧栏目的渲染
  function leftCateList(){
    
    var html = template('leftTemp',cateData)
  //   console.log(html);
    $('.left ul').html(html);
    /* 页面渲染到页面后，进行滚轮的初始化 */
    // 通过iScoll 来添加滚动.初始化
    var myScroll = new IScroll('.left');                                                               
    /* 给左侧li绑定单击操作，事件委托。因为li是动态生成的 */
    $('.left').on('tap', 'li', function () {
      // console.log(this);  //li
      // 样式的切换
      $(this).addClass('active').siblings().removeClass('active')
      // 实现置顶。
      myScroll.scrollToElement(this)
      // 动态渲染二级分类数据
      var index =$(this).index()
      rightCateList(index)
    })
  }
 // 右侧图片的渲染
  function rightCateList(index) {

    var rightHtml = template('rightCate', cateData.list[index])
    
    $('.rightList').html(rightHtml)
    // 判断图片加载是否完成
    var imgcount= $('.right img').length;
    $('.right img').on('load',function(){
      imgcount--;
     
      if (imgcount==0){
        $('body').removeClass('loadding')
        // 右侧也使用iScroll滑动效果
        var iscroll = new IScroll('.right')
      }

    })


    
  }

})
