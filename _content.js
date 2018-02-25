document.addEventListener('DOMContentLoaded', function() {
    if(!_app.allowed){
        return;
    }
    var cat, pagenum, pagepath, url = window.location.pathname, thAlertVisible = false, unloadedImages = [];
    var dataUrl, retried = false, timeout = 2000;
    pagepath = /\/\w+/.exec(url)[0];

    var video = document.getElementById('video');

    var videos = $("ul.videos");
    switch(pagepath) {
        case "/category_1":
        cat = 1;
        break;
        case "/category_2":
        cat = 2;
        break;
        case "/category_3":
        cat = 3;
        break;
        default:
        window.location.replace("/");
    }
    document.querySelector('input[name="category"][value="' + cat + '"]').checked = true;

    pagenum = getPageNum(url);
    dataUrl = _app.datadomain + "data.json?cat=" + cat + "&start=" + (pagenum - 1);
    getData();

    function getData(){
        var ajaxTime = new Date().getTime();
        $.ajax({
            type: 'GET',
            url: dataUrl,
            dataType: 'json',
            timeout: timeout,
            success: function (data) {
                $.each(data.result, function(index, element) { 
                    $("ul.videos").append($('<li class="video"></li>').append($('<div class="video-img"></div>').append($('<a data-id="0" href="#"></a>').append(
                        $('<img src="/thumb.png" width="260" height="173">')).append('<span class="video-time">' + element.rating + '</span>'))).append('<div class="video-info"><span class="video-title"><a href="#">' + element.title + '</a></span></div>'));
                });
                buildPagination(pagenum, pagepath, data.pages);            
            }
        });
    }

    function getPageNum(url){
        var x = /\/\w+\/page\/(\d+)/.exec(url);
        return x ? parseInt(x[1]) : 1;
    }

    function buildPagination(page, path, total){
        var paglist = $("#paglist");
        var edgeMinSize = 5;
        var aheadMinSize = 2;
        if(total <= 11){
            paglist.append(getPrev());
            for(var i = 1; i <= total; i++){
                paglist.append(getItem(i));
            }
            paglist.append(getNext());            
        }
        else{
            paglist.append(getPrev());

            if(page <= edgeMinSize - aheadMinSize){
                for(var i = 1; i <= edgeMinSize; i++){
                    paglist.append(getItem(i));
                }
                appendEnd();               
            }
            else if(page <= edgeMinSize + 1){
                for(var i = 1; i <= page + aheadMinSize; i++){
                    paglist.append(getItem(i));
                }
                appendEnd();
            }
            else if(page >= total - (edgeMinSize - aheadMinSize)){
                appendStart();
                for(var i = total - edgeMinSize; i <= total; i++){
                    paglist.append(getItem(i));
                }
            }
            else if(page >= total - edgeMinSize){
                appendStart();
                for(var i = page - aheadMinSize; i <= total; i++){
                    paglist.append(getItem(i));
                }
            }
            else{
                appendStart();
                for(var i = page - aheadMinSize; i <= page + aheadMinSize; i++){
                    paglist.append(getItem(i));
                }
                appendEnd();
            }
            paglist.append(getNext());
        }

        function appendStart(){
            paglist.append(getItem(1));
            paglist.append(getItem(2));
            paglist.append(getEmpty());
        }

        function appendEnd(){
            paglist.append(getEmpty());
            paglist.append(getItem(total - 1));
            paglist.append(getItem(total));
        }

        function getItem(i){
            if(page === i){
                return $('<li class="active"><span>' + i + '</span></li>');
            }
            else{
                return $('<li><a href="' + path + '/page/' + i + '">' + i + '</a></li>');
            }    
        }

        function getPrev(){
            if(page === 1){
                return $('<li class="disabled"><span>&laquo; Previous</span></li>');       
            }
            else{
                return $('<li><a href="' + path + '/page/' + (page - 1) + '">&laquo; Previous</a></li>');
            }
        }

        function getNext(){
            if(page === total){
                return $('<li class="disabled"><span>Next &raquo;</span></li>');
            }
            else{
                return $('<li><a href="' + path + '/page/' + (page + 1) + '">Next &raquo;</a></li>');
            }        
        }

        function getEmpty(){
            return $('<li><span>...</span></li>');
        }
    }

});