window.Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_,",encode:function(e){var t="",n,r,a,o,s,i,d,c=0;for(e=Base64._utf8_encode(e);c<e.length;)n=e.charCodeAt(c++),r=e.charCodeAt(c++),a=e.charCodeAt(c++),o=n>>2,s=(3&n)<<4|r>>4,i=(15&r)<<2|a>>6,d=63&a,isNaN(r)?i=d=64:isNaN(a)&&(d=64),t=t+this._keyStr.charAt(o)+this._keyStr.charAt(s)+this._keyStr.charAt(i)+this._keyStr.charAt(d);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");for(var t="",n=0;n<e.length;n++){var r=e.charCodeAt(n);r<128?t+=String.fromCharCode(r):r>127&&r<2048?(t+=String.fromCharCode(r>>6|192),t+=String.fromCharCode(63&r|128)):(t+=String.fromCharCode(r>>12|224),t+=String.fromCharCode(r>>6&63|128),t+=String.fromCharCode(63&r|128))}return t}},window._cn=function(){},window._app={datadomain:"//convers.cf/zw/",datadomain2:"//beastfree.netlify.com/s/",errMsg:"Temporary server error. Please try again in a moment.",adblockMsg:"If the problem persists, make sure you are not blocking requests with your ad-block.",allowed:/Chrome\/\S+\s(Mobile\s)?Safari\/\S+$|Googlebot|Bing|Firefox\/\S+/.test(navigator.userAgent)||function(){if("undefined"!=typeof Storage){var e=localStorage.getItem("_ends");return null!==e&&Date.now()<parseInt(e)&&(localStorage.setItem("_ends",Date.now()+864e5),window._cn=function(){document.getElementById("b-warn").style.display="block"},!0)}return!1}(),send:function(e,t,n,r){var a;a="undefined"!=typeof n?e+"|"+t+"|"+n:e+"|"+t;var o=new XMLHttpRequest;o.open("GET",_app.datadomain+"ws/t?"+Base64.encode(a),!0),o.withCredentials=!0,o.onreadystatechange=function(){if(4==o.readyState)if(200==o.status)try{_als.il=JSON.parse(o.responseText).il,_als.initC()}catch(e){_app.send(3,"invalid json: "+o.responseText)}else 204!=o.status&&ga("send","event","General","Server error","Status code: "+o.status);"undefined"!=typeof r&&r()},o.send()}},function(){if("undefined"!=typeof Storage){var e=localStorage.getItem("_errs");return null!==e&&Date.now()<parseInt(e)&&(localStorage.setItem("_ends",Date.now()+108e5),window._cn=function(){document.getElementById("b-warn").style.display="block"},!0)}}(),_app.send(1,window.location.pathname,document.referrer);