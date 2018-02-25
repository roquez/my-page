window._als = {
    il: null,
    init: function(){
        delete window.ga;
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();
        a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
        })(window,document,'script','/analytics.js','ga');
        if(this.il){
            this.set();
        }
        else{
            _als.initC = _als.set;
        }
    },
    initC: function(){},
    set: function(){
        this.initC = function(){};

        function get(i) {
            return ((i>>>24) +'.'+(i>>16 & 255) +'.'+(i>>8 & 255)+'.'+(i & 255));
        }

        ga('create', 'UA-84561173-2', 'auto');    
        ga('set', '&uip', get(this.il));
        ga('send', 'pageview');
    },
    gab: function(){
        return typeof window.ga === "undefined" || window.ga.length !== 1;
    }
};

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();
a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;a.onload=function(){
    if(_als.gab()){
        _als.init();
    }
};a.onerror=function(){
    _als.init();
};
m.parentNode.insertBefore(a,m);
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-84561173-2', 'auto');
ga('send', 'pageview');