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
        case "men_and_animals":
        cat = 1;
        break;
        case "women_and_animals":
        cat = 2;
        break;
        case "animals":
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
                        $("ul.videos").append($('<li class="video"></li>').append($('<div class="video-img"></div>').append($('<a data-id="'+ element.movie_id + '" href="/movie/' + element.path + '"></a>').append(
                            $('<img src="https://www.gaybeast.com/thumbnails/480x320/' + element.path + '.jpg" width="260" height="173">').on('error', function() { showThMsg(this) })
                            ).append('<span class="video-time">' + element.duration + '</span>'))).append('<div class="video-info"><span class="video-title"><a href="/movie/' + element.path + '">' + element.title + '</a></span></div>'));
                    });
                    if(data.result.length === 0){
                        tt = "No results for: ";
                    }
                    else{
                        tt = "Search results for: ";
                    }
                    document.title = "Search \u2219 " + data.query + " | Free Premium Bestiality Movies";
                    $("#s-title").text(tt + data.query).show();
                    buildPaginationInf(pagenum, pagepath, data.next);
                }
                if(documentReady){
                    resultCallback();
                }            
            },
            error: function(e){
                if(!retried){
                    dataUrl = getDataUrl(_app.datadomain);
                    timeout = 3500;
                    retried = true;
                    getData();
                }
                else{
                    resultCallback = function(){
                        resultCallback = function(){};
                        var totalTime = new Date().getTime() - ajaxTime;
                        var additionalInfo = '';
                        if(totalTime < 100 && e.status === 0){
                            additionalInfo = '<p>' + _app.adblockMsg + '</p>';
                        }
                        $('#error-msg span').text(_app.errMsg).append($(additionalInfo)).parent().show();
                    }
                    if(documentReady){
                        resultCallback();
                    }
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
        return datadomain + "search.php?q=" + query.toLowerCase() + "&cat=" + cat + "&start=" + (pagenum - 1);
    }

    function showThMsg(img){
        unloadedImages.push(img);
        if(!thAlertVisible){
            thAlertVisible = true;
            if (typeof(Storage) !== "undefined") {
                var i = localStorage.getItem("_resth");
                if(i !== null && (Date.now() < parseInt(i))){
                    return;
                }
            }
            $('#info-msg span').html('Thumbnails not loading? Just open and close <a href="https://www.gaybeast.com/t" id="a02" target="_blank">this link</a> to fix it.').parent().show();
            $('#a01').one('click', function(){
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("_resth", Date.now()+21600000);
                }
            });
            $('#a02').on('click', function(){
                $('#info-msg').hide();
                _app.send(7,"fix thumbnail loading",window.location.pathname);
                setTimeout(function() {
                    for(var i = 0, j = unloadedImages.length; i < j; i++){
                        unloadedImages[i].src = unloadedImages[i].src + "?r=1";
                    }
                }, 1000);
            });
        }
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