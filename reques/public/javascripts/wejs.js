window.onload=function() {
	submit('');
}
var ans = {}, qid="",token="", rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
var Strings = {};
Strings.isEmpty = function (iStr) {
    if (typeof (iStr) == "undefined"
    		|| iStr == null 
    		|| iStr.toString().length == 0
    		|| iStr.toString().trim() == "")return true;
	return false;
};
Strings.trim = function (iStr) {
    return iStr ? iStr.replace(rtrim, '') : '';
};
function populate(jst) {
//	var data = JSON.parse(document.getElementById('items').innerHTML).data;
	if(jst == '') return;
	var row = null, data = {};
	try {
		row = JSON.parse(jst);
	} catch(e) {
		window.location.href='/';
	}
	if(row.message=='end' || row.message=='prevend') {
		weui.toast('没有了', 1000);
		document.getElementById('close').style.display = '';
		window.scrollTo(0,document.body.scrollHeight);
		return;
	} else if(!Strings.isEmpty(row.message)) {
		weui.toast(row.message, 1500);
		document.getElementById('close').style.display = '';
		window.scrollTo(0,document.body.scrollHeight);
		return;
	} else {
		data = row.rows.data;
	}
	clear();
	//document.getElementById('id').value = data.id;
	document.getElementById('page').value = row.page;
	document.getElementById('title').innerHTML= (parseInt(row.page) + 1) + "." + data.title;
	ans = data.answer;
	qid = data.id;
	token= row.token;
	for (var p in data.choices) {
		if(p && document.getElementById(p) && !Strings.isEmpty(data.choices[p])) {
			document.getElementById('d'+p).innerHTML = data.choices[p];
			document.getElementById('c'+p).style.display = '';
		}
	}
	if(row.rows.uanswer && row.rows.uanswer[data.id]) {
		var uans = row.rows.uanswer[data.id];
		if(uans.ans) {
			for (var i = 0; i < uans.ans.length; i++) {
				var elm = uans.ans[i];
				if(elm)
					document.getElementById(elm).checked = true;
			}
			
		}
	}
}
function clear() {
	ans = {};
	qid="";
	token="";
	document.getElementById('close').style.display = 'none';
	var inputs = document.getElementsByTagName('input');
	for (var i = 0; i < inputs.length; i++) {
		var it = inputs[i];
		if(it.type =='checkbox') {
			it.checked=false;
		}
	}
	var chos = document.getElementsByClassName('weui-cell__bd');
	for (var i = 0; i < chos.length; i++) {
		chos[i].innerHTML = '';
	}
	var chos = document.getElementsByClassName('weui-cell weui-check__label');
	for (var i = 0; i < chos.length; i++) {
		chos[i].style.display = 'none';
	}
}
function prev(){
	submit('prev');
}
function next(){
	submit('next');
}
function close(){
	window.location.href='/';
}
function submit(direc) {
    weui.form.validate('#form', function (error) {
        if (!error) {
            var loading = weui.loading('提交中...');
            var data = {};
//            data.id = '29ec671a-0e71-1bbd-f9a1-115ed2e01d95';
            data.id = document.getElementById('id').value;
            data.page = document.getElementById('page').value;
            if(data.page == '')
            	data.page = 0;
            data.direction = direc;
            var answer = "", anc = ""; 
            var inputElements = document.getElementsByClassName('weui-check');
            for(var i=0; inputElements[i]; ++i){
                  if(inputElements[i].checked){
                	  answer += inputElements[i].id;
                	  anc += document.getElementById('d'+inputElements[i].id).innerHTML;
                  }
            }
            data.answer=answer;
            data.anc=anc;
            data.qid=qid;
            data.token=token;
            if(direc && direc=='next' && Strings.trim(ans.ans) != '' && answer != Strings.trim(ans.ans)) {
        		weui.toast('正确答案是'+ans.ans, 1000);
        		loading.hide();
        		return;
            }
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
    var xhttp = null;
	if (window.XMLHttpRequest) {
		xhttp = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
    	  if(callback) {
    		  callback.call(this, xhttp);
    	  }
      }
    };
    if(action=='GET') {
    	url = url +"?" + Object.keys(data).map(function(k) {
    	    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    	}).join('&');
    	data = null;
    } else {
    	data = JSON.stringify(data);
    }
	xhttp.open(action, url, false);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(data);
}