if(!_app.allowed){
    $("body > .container").html('')
    .append($('<div class="alert alert-info" style="font-size: 16px"></div>')
    .append($('<table width="100%"></table>').append($('<tr></tr>')
    .append('<td>Due to playback issues on some browsers, I highly recommend to use <strong>Google Chrome</strong> or <strong>Firefox</strong> on this site.</td>')).append($('<tr id="opt-more" colspan="2" style="display: block;"></tr>')
    .append($('<td></td>')
    .append($('<ul style="margin-top: 5px; margin-bottom: 0;"></ul>')
    .append($('<li></li>').append($('<a href="#">Go to the site anyway</a>').one('click',
        function(e){
            e.preventDefault();
            this.removeAttribute("href");
            if (typeof(Storage) !== "undefined") {
                try {
                    localStorage.setItem("_ends", Date.now()+10800000);
                    _app.send(7,"allow enter unsupported browser",window.location.pathname,function(){window.location.reload()});
                } catch(e){
                    _app.send(3,"local storage access failed",window.location.pathname);
                    alert("Your browser does not allow to store your choice. This usually is caused by using private browsing mode.");
                }
            }
            else {
                _app.send(3,"local storage unsupported",window.location.pathname);
                alert("Operation could not be performed. Please update your browser.");
            }
        }))))))));
    $("#navbar").html("");
}