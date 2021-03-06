window.onload=function() {
	document.body.onselectstart=document.body.oncontextmenu=function(){ return false;};
	var items = document.getElementById('items').value;
	if(!Strings.isEmpty(items)) {
		try {
			items = JSON.parse(items);
			if(items && items.token) token = items.token;
		} catch(e) {
			window.location.href='/';
		}
	}
	submit('');
}
var ans = {}, qid="",token="", rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
var Strings = {}, picpath ="files/pic/";
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
		row = jst;
//			JSON.parse(jst);
	} catch(e) {
		window.location.href='/';
	}
//	window.scrollTo(0,document.body.scrollHeight);
	var body = $("html, body");
	if(row.message=='end' || row.message=='prevend') {
		weui.toast('没有了', 1000);
		document.getElementById('close').style.display = '';
		body.animate({scrollTop:$(document).height()}, '100');
		return;
	} else if(!Strings.isEmpty(row.message)) {
		weui.toast(row.message, 1500);
		document.getElementById('close').style.display = '';
		return;
	} else {
		data = row.rows.data;
	}
	body.animate({scrollTop:0}, '100');
	clear();
	ans = data.answer;
	ans.class = data.class;
	//document.getElementById('id').value = data.id;
	document.getElementById('page').value = row.page;
	document.getElementById('title').innerHTML= (parseInt(row.page) + 1) + "." + data.title;
	if(data.titlepic) {
		document.getElementById('titlepicDiv').style.display = '';
		document.getElementById('titlepic').src =picpath + data.titlepic;
	}
	if(ans.anspic) {
		document.getElementById('anspicDiv').style.display = '';
		document.getElementById('anspic').src =picpath + ans.anspic;
	}
	if(ans.ans) {
		document.getElementById('exph').innerHTML = ans.ans;
	}
	if(data.class == 'big' || data.class == 'input') {
		document.getElementById('expdiv').style.display = '';
	}
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
//	document.getElementById('titlepic').src ="";
	document.getElementById('titlepicDiv').style.display = 'none';
//	document.getElementById('anspic').src ="";
	document.getElementById('anspicDiv').style.display = 'none';
	document.getElementById('close').style.display = 'none';
	document.getElementById('exparea').style.display = 'none';
	document.getElementById('expdiv').style.display = 'none';
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
function exp() {
	document.getElementById('exparea').style.display = '';
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
            if(direc && direc=='next' && (!ans.class || ans.class == 'select') && Strings.trim(ans.ans) != '' && answer != Strings.trim(ans.ans)) {
        		weui.toast('正确答案是'+ans.ans, 1000);
        		loading.hide();
        		return;
            }
            ajax('GET','/exam/go',data,function (obj) {
            	populate(obj)
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
	$.ajax({
	  url: url,
	  type: action,
	  data: data,
	  dataType: "json",
	  success: function(res) {
		  callback.call(this, res);
	  },
	  error: function(e) {
		console.log(e.message);
	  }
	});
	
//    var xhttp = null;
//	if (window.XMLHttpRequest) {
//		xhttp = new XMLHttpRequest();
//	} else if (window.ActiveXObject) {
//		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
//	}
//    xhttp.onreadystatechange = function() {
//      if (this.readyState == 4 && this.status == 200) {
//    	  if(callback) {
//    		  callback.call(this, xhttp);
//    	  }
//      }
//    };
//    if(action=='GET') {
//    	url = url +"?" + Object.keys(data).map(function(k) {
//    	    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
//    	}).join('&');
//    	data = null;
//    } else {
//    	data = JSON.stringify(data);
//    }
//	xhttp.open(action, url, false);
//	xhttp.setRequestHeader('Content-Type', 'application/json');
//	xhttp.send(data);
}