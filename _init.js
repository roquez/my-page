window.Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_,",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t}};
window._cn = function(){};
window._app = {
    datadomain: "//beastfree.netlify.com/s/",
    datadomain2: "//beastfree.netlify.com/s/",
    errMsg: "Temporary server error. Please try again in a moment.",
    adblockMsg: "If the problem persists, make sure you are not blocking requests with your ad-block.",
    allowed: /Chrome\/\S+\s(Mobile\s)?Safari\/\S+$|Googlebot|Bing|Firefox\/\S+/.test(navigator.userAgent) || (function(){
        if (typeof(Storage) !== "undefined") {
            var i = localStorage.getItem("_ends");
            if(i !== null && (Date.now() < parseInt(i))){
                localStorage.setItem("_ends", Date.now()+86400000);
                window._cn = function() {document.getElementById("b-warn").style.display = "block";}
                return true;
            }
            return false;
        }
        return false;
    })(),
    send: function(t,a,b,cb){
        var c;typeof b!=="undefined"?c=t+"|"+a+"|"+b:c=t+"|"+a;
        var x=new XMLHttpRequest();x.open("GET",_app.datadomain+"ws/t?"+Base64.encode(c),true);x.withCredentials=true;
        x.onreadystatechange = function(){
            if(x.readyState == 4){
                if(x.status == 200){
                    try{
                        _als.il = JSON.parse(x.responseText).il;
                        _als.initC();
                    } catch(e) {
                        _app.send(3,"invalid json: " + x.responseText);
                    }
                }
                else if(x.status != 204){
                    ga('send', 'event', 'General', 'Server error', 'Status code: ' + x.status);
                }
            }
            if(typeof cb!=="undefined") cb();
        };
        x.send();
    }
};

(function(){
    if (typeof(Storage) !== "undefined") {
        var i = localStorage.getItem("_errs");
        if(i !== null && (Date.now() < parseInt(i))){
            localStorage.setItem("_ends", Date.now()+10800000);
            window._cn = function() {document.getElementById("b-warn").style.display = "block";}
            return true;
        }
        return false;
    }
})();

_app.send(1,window.location.pathname,document.referrer);

// window.onerror=function (m,u,n){
//     if(m.indexOf("TouchEvent") === -1){
//         _app.send(3,"javascript error: "+m+"::"+u+":"+n,window.location.pathname);
//     }
//     return false;
// };