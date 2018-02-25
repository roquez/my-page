window._als = {
    il: null,
    init: function(){
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
    },
    gab: function(){
        return typeof window.ga === "undefined" || window.ga.length !== 1;
    }
};