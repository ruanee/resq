window.onload=function() {
	submit('');
}
function populate(jst) {
//	var data = JSON.parse(document.getElementById('items').innerHTML).data;
	if(jst == '') return;
	var row = JSON.parse(jst), data = {};
	if(row.message=='end' || row.message=='prevend') {
		weui.toast('没有了', 1000);
		return;
	} else {
		data = row.rows.data;
	}
	document.getElementById('id').value = data.id;
	document.getElementById('page').value = row.page;
	document.getElementById('title').innerHTML= (parseInt(row.page) + 1) + "." + data.title;
	for (var p in data.choices) {
		if(p && document.getElementById(p))
			document.getElementById(p).innerHTML = data.choices[p];
	}
}
function prev(){
	submit('prev');
}
function next(){
	submit('next');
}
function submit(direc) {
    weui.form.validate('#form', function (error) {
        if (!error) {
            var loading = weui.loading('提交中...');
            var data = {};
            data.id = '6b592b36-d42a-6f5a-8a72-b809a76f9b83';
//            	document.getElementById('id').value;
            data.page = document.getElementById('page').value;
            if(data.page == '')
            	data.page = 0;
            data.direction = direc;
            ajax('GET','/exam/go',data,function (obj) {
            	populate(obj.response)
                loading.hide();
            });
        }
        // return true; // 当return true时，不会显示错误
    }, {
        regexp: {
            IDNUM: /(?:^\d{15}$)|(?:^\d{18}$)|^\d{17}[\dXx]$/,
            VCODE: /^.{4}$/
        }
    });
}
function ajax(action,url, data, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
//      if (this.readyState == 4 && this.status == 200) {
    	  if(callback) {
    		  callback.call(this, xhttp);
    	  }
//      }
    };
    if(action=='GET') {
    	url = url +"?" + Object.keys(data).map(function(k) {
    	    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    	}).join('&');
    	console.log(url);
    	data = null;
    } else {
    	data = JSON.stringify(data);
    }
	xhttp.open(action, url, false);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(data);
}