(function(){
    $('body').on('click', function (e) {
        if (!$('#search-dropdown,#search-input').is(e.target)) {
            $('#search-dropdown').parent().removeClass('open');
        }
    });

    $('#search-input').focus(function () {
        $(this).parent().addClass('open');
        $(this).select();
    });

    $("#search-dropdown a").on("click", function (e) {
        e.stopPropagation();
        if (e.target.type !== "radio") {
            e.preventDefault();
            this.firstChild.checked = true;
        }
        $("#search-input").focus();
    });

    $("#search-input").keypress(function(e){
        if(e.keyCode == 13){
            doSearch();
        }
    });

    $("#search-btn").click(function(){
        doSearch();
    });

    function doSearch(){
        var query = $("#search-input").val();
        if(query.length === 0){
            window.location.href = "/search";
        }
        else{
            var qe = encodeURIComponent(query);
            var path, path1 = "/search", path2 = "/query/" + encodeURIComponent(query) + "/page/1";
            switch($('input[name="category"]:checked').val()){
                case "0":
                path = path1 + "/everywhere" + path2;
                break;
                case "1":
                path = path1 + "/men_and_animals" + path2;
                break;
                case "2":
                path = path1 + "/women_and_animals" + path2;
                break;
                case "3":
                path = path1 + "/animals" + path2;
                break;
                default:
                path = path1;
            }
            _app.send(4,query,window.location.pathname,function(){window.location.href = path});
        }
    }
})();