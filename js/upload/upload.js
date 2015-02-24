
var formdata = false;

function sendFeedback() {

    $('#sent_info').show().html('Gönderiliyor...');
    var input = document.getElementById("images");
    if (window.FormData) {
        formdata = new FormData();
    }

    var i = 0, len = input.files.length, img, reader, file;

    for (; i < len; i++) {
        file = input.files[i];

        if (!!file.type.match(/image.*/) && file.size < 10000000) {

            if (formdata) {
                formdata.append("images[]", file);
            }
        }
    }

    formdata.append("user_id", $('#feedback_user_id').val());
    formdata.append("user", $('#feedback_user').val());
    formdata.append("user_info", $('#user_info').val());
    formdata.append("technical_info", JSON.pruned(allModuleList, 10));

    if (formdata) {
        $.ajax({
            url: "upload.php",
            type: "POST",
            data: formdata,
            dataType: 'html',
            processData: false,
            contentType: false,
            success: function(res) {
                $('#sent_info').html('Gönderildi!');
            }
        });
    }
}
;
