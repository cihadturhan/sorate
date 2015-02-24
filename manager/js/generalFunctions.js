jQuery.fn.addLoading = function() {
    var id = $(this).attr('id') + '_loading';
    var width = $(this).innerWidth();
    var height = $(this).innerHeight();
    var l_size = Math.min(width, height) * 1 / 3;

    $(this).prepend("<div id='" + id + "' class='loading' style='width:" + width + "px; height:" + height + "px;'>"
            + "<div class='loading_container' style='width:" + l_size + "px; height:" + l_size + "px; margin-left:-" + l_size + "px; margin-top:-" + (l_size * 3 / 2) + "px'>"
            + "<div class='lblue animated'> </div><div class='dblue animated'> </div><div class='red animated'>"
            + "</div></div> </div>");
}

jQuery.fn.showLoading = function(time) {
    var id = $(this).attr('id') + '_loading';
    var width = $(this).innerWidth();
    var height = $(this).innerHeight();
    $('#' + id).css({width: width + 'px', height: height + 'px'});
    if (typeof time == undefined)
        time = 200;
    $('#' + id).fadeIn(time);
}

jQuery.fn.hideLoading = function(time) {
    var id = $(this).attr('id') + '_loading';
    if (typeof time == undefined)
        time = 200;
    $('#' + id).fadeOut();
}

var keepAliveTimer = setInterval(function() {
    $.get('../data_manager.php');
}, 45000);