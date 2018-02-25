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
        case "/men_and_animals":
        cat = 1;
        break;
        case "/women_and_animals":
        cat = 2;
        break;
        case "/animals":
        cat = 3;
        break;
        default:
        window.location.replace("/");
    }
    document.querySelector('input[name="category"][value="' + cat + '"]').checked = true;

    pagenum = getPageNum(url);
    dataUrl = _app.datadomain + "movies.php?cat=" + cat + "&start=" + (pagenum - 1);
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
                    $("ul.videos").append($('<li class="video"></li>').append($('<div class="video-img"></div>').append($('<a data-id="'+ element.movie_id + '" href="/movie/' + element.path + '"></a>').append(
                        $('<img src="https://www.gaybeast.com/thumbnails/480x320/' + element.path + '.jpg" width="260" height="173">').on('error', function() { if(pagenum > 1) { showThMsg(this) } })
                        ).append('<span class="video-time">' + element.duration + '</span>'))).append('<div class="video-info"><span class="video-title"><a href="/movie/' + element.path + '">' + element.title + '</a></span></div>'));
                });
                buildPagination(pagenum, pagepath, data.pages);            
            },
            error: function(e){
                if(!retried){
                    dataUrl = dataUrl + "&_=" + Date.now();
                    timeout = 4000;
                    retried = true;
                    getData();
                    _app.send(8,"retrying json request; status: " + e.status,window.location.pathname);
                }
                else{
                    var totalTime = new Date().getTime() - ajaxTime;
                    var additionalInfo = '';
                    if(totalTime < 100 && e.status === 0){
                        additionalInfo = '<p>' + _app.adblockMsg + '</p>';
                    }
                    $('#error-msg span').text(_app.errMsg).append($(additionalInfo)).parent().show();
                    _app.send(3,"server error when requesting json; status: " + e.status,window.location.pathname);
                }                
            }
        });
    }

    function getPageNum(url){
        var x = /\/\w+\/page\/(\d+)/.exec(url);
        return x ? parseInt(x[1]) : 1;
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