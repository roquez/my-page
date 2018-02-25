(function(){
    if(!_app.allowed){
        return;
    }
    var cat, pagenum, pagepath, query, url = window.location.pathname, documentReady = false, thAlertVisible = false, unloadedImages = [];
    var dataUrl, retried = false, timeout = 2000;
    var pageRegex = /\/search\/(\w+)\/query\/([^\/]+)/.exec(url);
    var resultCallback = function(){};
    if(!pageRegex){
        window.location.replace("/search");
        return;
    }
    switch(pageRegex[1]) {
        case "everywhere":
        cat = 0;
        break;
        case "category_1":
        cat = 1;
        break;
        case "category_2":
        cat = 2;
        break;
        case "category_3":
        cat = 3;
        break;
        default:
        window.location.replace("/search");
    }

    pagenum = getPageNum(url);
    pagepath = pageRegex[0]
    query = pageRegex[2];

    dataUrl = getDataUrl(_app.datadomain);
    getData();

    function getData(){
        var ajaxTime = new Date().getTime();
        $.ajax({
            type: 'GET',
            url: dataUrl, 
            dataType: 'json',
            timeout: timeout,
            success: function (data) {
                resultCallback = function(){
                    resultCallback = function(){};
                    var tt;
                    $.each(data.result, function(index, element) { 
                        $("ul.videos").append($('<li class="video"></li>').append($('<div class="video-img"></div>').append($('<a data-id="0" href="#"></a>').append(
                            $('<img src="/thumb.png" width="260" height="173">')).append('<span class="video-time">' + element.rating + '</span>'))).append('<div class="video-info"><span class="video-title"><a href="#">' + element.title + '</a></span></div>'));
                    });
                    if(data.result.length === 0){
                        tt = "No results for: ";
                    }
                    else{
                        tt = "Search results for: ";
                    }
                    document.title = "Search \u2219 " + data.query + " - my-page";
                    $("#s-title").text(tt + data.query).show();
                    buildPaginationInf(pagenum, pagepath, data.next);
                }
                if(documentReady){
                    resultCallback();
                }            
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        documentReady = true;
        resultCallback();
        document.querySelector('input[name="category"][value="' + cat + '"]').checked = true;
        if(cat !== 0){
            $('#navbar li a[href="/' + pageRegex[1] + '"]').parent().addClass("active");
        }
        $("#search-input").val(decodeURIComponent(query));
    });

    function getPageNum(url){
        var x = /\/page\/(\d+)\/?$/.exec(url);
        return x ? parseInt(x[1]) : 1;
    }

    function getDataUrl(datadomain){
        return datadomain + "search.json?q=" + query.toLowerCase() + "&cat=" + cat + "&start=" + (pagenum - 1);
    }

    function buildPaginationInf(page, path, next){
        var paglist = $("#paglist");
        var edgeMinSize = 5;
        var aheadMinSize = 1;

        paglist.append(getPrev());

        if(next === 0){
            if(page <= 1){
                paglist.append(getItem(1));
                paglist.hide();
            }
            else if(page <= edgeMinSize + 2){
                for(var i = 1; i <= page; i++){
                    paglist.append(getItem(i));
                }
            }
            else{
                appendStart();
                for(var i = page - aheadMinSize; i <= page; i++){
                    paglist.append(getItem(i));
                }
            }
        }
        else{
            if(page <= 1){
                appendStart();
            }
            else if(page <= edgeMinSize + 1){
                for(var i = 1; i <= page + aheadMinSize; i++){
                    paglist.append(getItem(i));
                }
                paglist.append(getEmpty());
            }
            else{
                appendStart();
                for(var i = page - aheadMinSize; i <= page + aheadMinSize; i++){
                    paglist.append(getItem(i));
                }
                paglist.append(getEmpty());
            }
        }

        paglist.append(getNext());

        function appendStart(){
            paglist.append(getItem(1));
            paglist.append(getItem(2));
            paglist.append(getEmpty());
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
            if(next === 0){
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
})();