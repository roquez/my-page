(function(){
    var video = {
        id: (function(){
            var id, reg = /\/movie\/+(\d+)/.exec(window.location.pathname);
            if(!reg){
                alert("Invalid url");
                window.location.replace("/");
            }
            id = reg[1];
            return id;
        })(), 
        loaded: false,
        error: null,
        played: false
    };

    var page = {
        dloaded: false,
        set: false,
        ok: -1
    };

    (function(){
        var retried = false;
        var dataUrl = _app.datadomain + "movie.php?id="+video.id;
        var timeout = 2000;
        if(!video.id){
            video.error = 1;
            return;
        }
        ping();
        getData();

        function getData(){
            var ajaxTime = new Date().getTime();
            $.ajax({
                type: 'GET',
                url: dataUrl, 
                dataType: 'json',
                timeout: timeout,
                success: function (data) {
                    if(data.error == 0){
                        video.title = data.title;
                        video.description = data.description;  
                        video.cat = data.cat;
                        video.path = data.path;
                        video.hash = data.hash;
                        video.mr = data.mr;
                        if(video.mr){
                            video.mirror = data.mirror;
                        }
                    }
                    video.loaded = true;
                    video.error = data.error;
                    setInfo();
                },
                error: function(e){
                    if(!retried && page.ok !== 0){
                        dataUrl = dataUrl + "&_=" + Date.now();
                        timeout = 3000;
                        retried = true;
                        getData();
                        _app.send(8,"retrying json request; status: " + e.status,window.location.pathname);
                    }
                    else{
                        var totalTime = new Date().getTime() - ajaxTime;
                        showErrorMsg(totalTime, e.status);
                        $('.play-content').hide();
                        _app.send(3,"server error when requesting json; status: " + e.status +"; retr="+retried+",p.ok="+page.ok,window.location.pathname);
                    }
                }
            });
        }

    })();

    function setInfo(){
        if(!video.loaded || !page.loaded || page.set) return;
        page.set = true;
        if(video.error == 0){
            //if(video.title){
            document.title = video.title + " | Free Premium Bestiality Movies";
            $('.play-title').text(video.title);
            //$('#title').text(video.title);
            //$('#sub-'+video.host).addClass('active');
                //document.getElementById("sub-"+video.host)
            //}
            if(video.description){
                if(video.description.length > 200){
                    document.querySelector('meta[name="description"]').setAttribute("content", video.description.substring(0, 197) + "...");
                    //$('meta[name=description]').attr('content', video.description.substring(0, 197) + "...");
                }
                else{
                    document.querySelector('meta[name="description"]').setAttribute("content", video.description);
                    //$('meta[name=description]').attr('content', video.description);
                }
                $('.play-desc').text(video.description);
            }
            setCat();
            initPlayer();
            $("#download").click(function(){
                //window.open(_app.datadomain + "movie/download/" + video.id + ".mp4?h=" + video.hash, '_blank');
                ga('send', 'event', 'Video', 'Download', video.id + ".mp4");
            }).show().parent().attr("href", _app.datadomain + "movie/download/" + video.id + ".mp4?h=" + video.hash);
            if(video.mr){
                $("#mirror").click(function(){
                    window.open(video.mirror, '_blank');
                    _app.send(8,"mirror click",video.id);
                    ga('send', 'event', 'Video', 'Mirror open', video.id + ".mp4");
                }).show();
            }
            history.replaceState(null, null, "/movie/"+video.path);
        }
        else{
            $(".play-content").html('<div class="err-text">Not found</div>');
        }
    };

    function showErrorMsg(requestTime, status){
        var additionalInfo = '';
        if(requestTime < 100 && status === 0){
            additionalInfo = '<p>' + _app.adblockMsg + '</p>';
        }
        $('#error-msg span').text(_app.errMsg).append($(additionalInfo)).parent().show();
    }

    function showBrowserMsg(){
        //$('#info-msg span').text("Playback may not work in some browsers. Please use Google Chrome.").parent().show();
    }

    function ping(){
        $.ajax({
            type: 'GET',
            url: _app.datadomain + "ping.php", 
            timeout: 5000,
            success: function (e) {
                page.ok = 1;
            },
            error: function(e){
                page.ok = 0;
            }
        });        
    }

    function setCat(){
        var href;
        switch(video.cat){
            case 1:
            href = "/category_1";
            break;
            case 2:
            href = "/category_2";
            break;
            case 3:
            href = "/category_3";
            break;
            default:
            return;     
        }
        document.querySelector('#navbar li a[href="' + href + '"]').parentElement.className = "active";
        document.querySelector('input[name="category"][value="' + video.cat + '"]').checked = true;
    };

    function initPlayer(){
        var player = jwplayer('player');
        var file = _app.datadomain + "movie/" + video.id + "?h=" + video.hash;
        player.setup({
                "file": file,
                "type": "mp4",
                "autostart": true,
                "mute": false,
                "width": "100%",
                "height": "100%",
                "preload": "none",
                "skin": {
                    url: "/lib/jwplayer/7.12.3/build.css",
                    name: "custom"
                },
                "playbackRateControls": [0.25, 0.5, 1, 1.5, 2],
                "ga": {}
        });
        player.on('error', function (e) {
            if(page.ok === 0){
                showErrorMsg(0, 1);
            }
            _app.send(3,"player error: " + e.message,window.location.pathname);
            ga('send', 'event', 'JW Player', 'Error', e.message);
        });
        player.on('playbackRateChanged', function (e) {
            ga('send', 'event', 'JW Player Video', 'Playback rate changed', e.playbackRate+'x');
        });

        player.on('play', function (e) {
            video.played = true;
            player.off('play');
        });        
    };

    document.addEventListener('DOMContentLoaded', function() {
        page.loaded = true;
        setInfo();
    });
})();

