$(function () {

  // 当点击获取验证码的按钮时候，将验证码填入表单
  $('.verify').on('tap', function () {
    // 获取用户输入的手机号，变更进行验证
    var mobile = $('.mobile').val()
    console.log(mobile);
    var reg = /^1[3-9]\d{9}$/;
    if (!reg.test(mobile)) {
      mui.toast('手机号输入有误')
      return false;
    }
    $.ajax({
      type: 'post',
      url: 'users/get_reg_code',
      data: { mobile: mobile },
      dataType: 'json',
      success: function (result) {
        console.log(result);
        if (result.meta.status === 200) {
          // 将获取到的验证码，输入input里面
          $('[name="code"]').val(result.data)
        }

      }
    })


  })
  // 获取注册信息
  $('.btn_queren').on('tap', function () {
    // 获取所有表单输入的信息
    var data = $('form').serialize()
    console.log(data);
    $.ajax({
      type: 'post',
      data: data,
      url: 'users/reg',
      dataType: 'json',
      success: function (result) {
        console.log(result);
        if (result.meta.status === 200)
          mui.toast('注册成功')
          setTimeout(() => {
            location.herf = './login.html'
            
          }, 1000);
         
      }
    })

  })

})