document.addEventListener("DOMContentLoaded",function(){

    var active = null;
    var notification = new Audio("/notification.wav");
    var xhr;
    var completed = true;
    var timer = null;
    var initTimerInterval = 20;
    var lastStatus = -1;
    var statusChangesCount = 0;
    var repeated = 0;
    var notificationLimit = 0;

    $('#timer-interval').val(initTimerInterval);

    getActive();
    setTimer(initTimerInterval);

    function getActive(){
        if(!completed) xhr.abort();

        xhr = new XMLHttpRequest();
        xhr.open('GET', '//convers.cf/zw/active.php', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                completed = true;
                if(xhr.status == 200){
                    var resp = xhr.responseText;
                    if(isNumber(resp)){
                        setActive(parseInt(resp));
                    }
                    else{
                        setText("NaN", "NaN");
                    }
                }
                else{
                    setText("?", "unknown");
                }

                if(lastStatus != xhr.status){
                    statusChangesCount++;
                    repeated = 0;
                    insertToTable(xhr.status + "; " + xhr.responseText);
                }
                else{
                    repeated++;
                    incrementTable();
                }

                lastStatus = xhr.status;
            }
        };
        completed = false;
        xhr.send(null);
    }

    function setActive(num){
        setText(num,num);
        if(document.getElementById('notify').checked && active){
            if(num > active && num > notificationLimit){
                notification.play();
            }
        }
        active = num;
    }

    function setText(a, b){
        document.title = "(" + a + ") active users";
        document.getElementById("info").innerText = "active users: " + b;
    }

    function isNumber(n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    }

    // function processActive(response){
    //     if(response){
    //         document.title = "(" + response + ") active users";
    //         document.getElementById("info").innerText = "active users: " + response;
    //         if(active){
    //             if(document.getElementById('notify').checked) {
    //                 if(response > active){
    //                     notification.play();
    //                 }
    //             }
    //         }
    //         active = response;
    //     }
    //     else{
    //         document.title = "(?) active users";
    //         document.getElementById("info").innerText = "active users: unknown";
    //     }
    // }

    function incrementTable(){
        var id = "f" + statusChangesCount;
        $('#' + id).text(repeated);
    }

    function insertToTable(str){
        var id = "f" + statusChangesCount;
        var tr = $('<tr></tr>').appendTo($('#failed tbody'));
        $('<td></td>').text(new Date().toLocaleString()).appendTo(tr);
        $('<td></td>').text(str).appendTo(tr);
        $('<td id="' + id + '"></td>').text(repeated).appendTo(tr);
    }

    function setTimer(seconds){
        if(timer) clearTimeout(timer);
        timer = setInterval(function() {
            getActive();
        }, seconds * 1000);
    }

    function getNotificationLimit(){
        return parseInt($('#notify-limit').val());
    }

    $('#set-timer').click(function(){
        var value = $('#timer-interval').val();
        if(value < 10){
            alert("Too low");
        }
        else{
            setTimer(value);
        }
    });

    $('#notify-check').change(function(){
        if(this.checked){
            notificationLimit = getNotificationLimit();
            $('#notify-limit').css('visibility', 'visible');
        }
        else{
            notificationLimit = 0;
            $('#notify-limit').css('visibility', 'hidden');
        }
    });

    $('#notify-limit').change(function(){
        notificationLimit = getNotificationLimit();
    });

    $('#notify-limit').blur(function(){
        $('#notify-limit').addClass("applied");
    });

    $('#notify-limit').focus(function(){
        $('#notify-limit').removeClass("applied");
    });
});