function submit() {
    weui.form.validate('#form', function (error) {
        if (!error) {
            var loading = weui.loading('提交中...');
            setTimeout(function () {
                loading.hide();
                weui.toast('提交成功', 1000);
            }, 500);
        }
        // return true; // 当return true时，不会显示错误
    }, {
        regexp: {
            IDNUM: /(?:^\d{15}$)|(?:^\d{18}$)|^\d{17}[\dXx]$/,
            VCODE: /^.{4}$/
        }
    });
}