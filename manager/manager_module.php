<?php
require('manager_settings.php');
?>

<!DOCTYPE html>
<html>
    <head>
        <?php echo printCss(); ?>
        <?php echo printJS(); ?>
        <title> <?php echo $list[0]; ?>  </title>
        <script type="text/javascript" src="js/time_functions.js"></script>
    </head>

    <body>
        <div id="wrapper">
            <?php echo printHeader(0); ?>
            <?php echo printNav(0); ?>
            <div id ="main_left_container">
                <?php echo printUserlist(); ?>

            </div>
            <div id ="main_right_container">
                <div id="sub_left_container">
                    <div id="name-id-container">
                    </div>
                    <div id="info_container">
                        <table id="info_table">
                            <tr> <td>Kullanıcı ID: </td> <td> <input  type="text"  id="kull_id" maxlength="15" style="width:145px; " disabled/> </td> </tr>
                            <tr> <td>Kullanıcı Adı: </td> <td> <input  type="text"  id="kull_adi" maxlength="15" style="width:145px"/> </td> </tr>    
                            <tr> <td>Şifre: </td> <td> <input  type="password"  id="sifre" maxlength="12" style="width:100px"/> <input type="button" id="show_btn" value="Göster" style="width:40px; font-size:11px;" /> </td> </tr>    
                            <tr> <td>Aktif: </td> <td> <input type="checkbox" id ="aktif"/> </td>
                            <tr> <td>Admin: </td> <td> <input type="checkbox" id="admin"/> </td>
                            <tr> <td>Maksimum Oturum: </td> <td> <input  type="text"  id="max_otur" maxlength="2" style="width:25px"/> </td> </tr>    
                            <tr> <td>Anlık Oturum: </td> <td> <input  type="text"  id="say_otur" maxlength="2" style="width:25px; " disabled/> </td> </tr>    
                            <tr> <td>Dil: </td> <td> <input  type="text"  id="lang" maxlength="2" style="width:25px;"/> </td> </tr>    
                            <tr> <td colspan="2"> <input type="button" id="save_button" value="KAYDET" /> <input type="button" id="new_button" value="YENİ" /> <input type="button" id="cancel_button" value="IPTAL" /> <input type="button" id="remove_button" value="SİL" /> </td> </tr>
                        </table>
                    </div>
                </div>

                <div id="date_container">
                    <table id="table_add_style">
                        <tr><td> <h1 class="selected_date" onclick="$('#tekrarli').slideUp('300');
                $('#table_add_style h1').removeClass('selected_date');
                $(this).addClass('selected_date');">Sabit Tarih</h1> </td> 
                            <td><h1 onclick="$('#tekrarli').slideDown('300');
                $('#table_add_style h1').removeClass('selected_date');
                $(this).addClass('selected_date');">Tekrarlı Tarih</h1> </td> </tr>
                    </table>

                    <div >
                        <div id="sabit">
                            <table class="rounded-corner">
                                <tr> <td>Başlangıç: </td> <td> <input name="baslangic_tarih" type="text" class="tarih_input" id="baslangic" maxlength="16" /> </td> </tr>
                                <tr> <td>Bitiş: </td> <td> <input name="bitis_tarih" type="text" class="tarih_input" id="bitis" maxlength="16"/> </td></tr>
                            </table>

                            <div id="tekrarli" style="z-index:1">
                                <form name="f">
                                    <select id="zaman_turu" onchange="changeDisplay(this.value)" >
                                        <option value="0" > Her hafta </option>
                                        <option value="1" onchange="$('.gun_sec').css('display', 'none');"> Her gün </option>
                                    </select>
                                    <select id="gun_1" class="gun_sec" size="1">
                                        <option value="0"> pazartesi  </option>
                                        <option value="1"> salı       </option>
                                        <option value="2"> çarşamba   </option>
                                        <option value="3"> perşembe   </option>
                                        <option value="4"> cuma       </option>
                                        <option value="5"> cumartesi  </option>
                                        <option value="6"> pazar      </option>
                                    </select>
                                    <span class="gun_sec"> </span> saat
                                    <input id="saat_1" class="saat_input" value="00:00" size="5" maxlength="5" />
                                    ile <br/>
                                    <span id="whitespace"> </span> <select id="gun_2" class="gun_sec" size="1">
                                        <option value="0"> pazartesi </option>
                                        <option value="1"> salı </option>
                                        <option value="2"> çarşamba </option>
                                        <option value="3"> perşembe </option>
                                        <option value="4"> cuma </option>
                                        <option value="5"> cumartesi </option>
                                        <option value="6"> pazar </option>
                                    </select>
                                    saat
                                    <input id="saat_2" class="saat_input" value="00:00" size="5" maxlength="5" />
                                    arası.

                                </form>
                            </div>  
                        </div>
                        <input type="button" value="EKLE" id="gonder"/>
                        <input type="button" value="IPTAL" onclick="reset_form()" id="iptal" style="display:none"/>
                    </div>
                </div>

                <div id="timetable_container">
                </div>
            </div>
            <div style="clear:both"> </div>
        </div>



        <script type="text/javascript">

            jQuery.fn.downloadUserInfo = function() {
                $("#info_table tr>td").css('font-weight', 'normal');
                $("#save_button").removeClass('unsaved');
                $("#kull_id").val($(this).children().html());
                $("#kull_adi").val($(this).children('td:nth-child(2)').html());
                if (typeof $prev !== "undefined") {
                    $prev.attr('id', "");
                }
                $(this).attr('id', "clicked_obj");

                $("#sub_left_container").showLoading();

                $.get("user_manager.php", {
                    mod: 'get',
                    kull_id: $(this).children().html()
                }, function(data) {
                    if (JSON.stringify(data).replace(/[\r\n\"]/ig, '') != "") {
                        var myObj = JSON.parse(data)[0];
                        if (myObj['active'] === '1') {
                            $('#aktif').prop({"checked": true});
                            $('#info_table tr:nth-child(4)').removeClass('passive');
                            $('#info_table tr:nth-child(4)').addClass('active');
                        } else {
                            $('#aktif').prop({"checked": false});
                            $('#info_table tr:nth-child(4)').removeClass('active');
                            $('#info_table tr:nth-child(4)').addClass('passive');
                        }

                        if (myObj['admin'] == '1') {
                            $('#admin').prop({"checked": true});
                            $('#info_table tr:nth-child(5)').removeClass('passive');
                            $('#info_table tr:nth-child(5)').addClass('active');
                        } else {
                            $('#admin').prop({"checked": false});
                            $('#info_table tr:nth-child(5)').removeClass('active');
                            $('#info_table tr:nth-child(5)').addClass('passive');
                        }

                        $('#max_otur').val(myObj['max_sessions']);
                        $('#say_otur').val(myObj['curr_sessions']);
                        $('#sifre').val(myObj['password']);
                        $('#lang').val(myObj['lang']);
                        $("#sub_left_container").hideLoading();

                    } else {
                        alert("Hata oluştu");
                        $("#sub_left_container").hideLoading();
                    }
                });

            }

            $("#sub_left_container").addLoading();




            $(document).ready(function() {
                var kullanicilar = JSON.parse('<?php echo utf8_encode(json_encode($kullanicilar)) ?>');
                var tumKullanicilar = Array();

                var i = 0;
                for (var key in kullanicilar) {
                    tumKullanicilar[i] = kullanicilar[key]['user_name'];
                    i++;
                }

                var mod = 'set';
                var currUser = "";

                $('#hor-zebra tr').click(function() {
                    currUser = $(this).children("td:nth-child(2)").html();
                    if ($(this).index() != 0) {
                        mod = 'set';
                        $(this).downloadUserInfo();
                        downloadDateInfo($(this).children().html());
                        $prev = $(this);
                        reset_form();
                    }
                });

                $('#clicked_obj').click();

                $("#show_btn").click(function() {
                    if ($("#sifre").attr('type') === "text") {
                        $(this).val("Göster");
                        $("#sifre").attr('type', 'password');
                    } else {
                        $("#sifre").attr('type', 'text');
                        $(this).val("Gizle");
                    }
                });

                $('input').keydown(function() {
                    $(this).parent().parent().children("td:nth-child(1)").css('font-weight', 'bold');
                    if (!$('#save_button').hasClass('unsaved')) {
                        $('#save_button').addClass('unsaved');
                    }
                });

                $("input[type='checkbox']").click(function() {
                    $(this).parent().parent().children("td:nth-child(1)").css('font-weight', 'bold');
                    if (!$('#save_button').hasClass('unsaved')) {
                        $('#save_button').addClass('unsaved');
                    }
                });

                $('#save_button').click(function() {
                    var charalpha = /[a-zA-Z]/; //Check if all characters are numbers or alphabets
                    var charnumber = /[0-9]/; //Check if all characters are numbers or alphabets
                    var isIncluded = jQuery.inArray($('#kull_adi').val(), tumKullanicilar) != -1; //checks if the user name exists.

                    if ($('#kull_adi').val() == "") {
                        alert("Kullanıcı adı giriniz!");
                        return;
                    } else if ((isIncluded && mod == 'add') || (isIncluded && mod == 'set' && $('#kull_adi').val() != currUser)) {
                        alert("Bu isim zaten var");
                        return;
                    } else if (!(charalpha.test($('#sifre').val()) && charnumber.test($('#sifre').val())) && mod == 'add') {
                        alert("Şifre hem harf hem de sayıdan oluşmalıdır!");
                        return;
                    } else if ($("#max_otur").val() == "") {
                        alert("Maksimum oturum numarası giriniz!");
                        return;
                    } else if (charalpha.test($("#max_otur").val()) || $("#max_otur").val() == "0") {
                        alert("Maksimum oturum için sayı değeri giriniz!");
                        return;
                    } else if (parseInt($("#max_otur").val()) >= 7) {
                        if (!confirm($("#max_otur").val() + ' kullanıcı çok fazla. Onaylayor musunuz?')) {
                            return;
                        }
                    } else if ($("#lang").val() !== 'en' && $("#lang").val() !== 'tr') {
                        alert("Dil seçeneği tr veya en olmalıdır!");
                        return;
                    }


                    $.get('user_manager.php', {
                        'mod': mod,
                        'kull_id': $('#kull_id').val(),
                        'kull_adi': $('#kull_adi').val(),
                        'sifre': $('#sifre').val(),
                        'aktif': ($('#aktif').prop('checked')) ? 1 : 0,
                        'admin': ($('#admin').prop('checked')) ? 1 : 0,
                        'maxOturum': $("#max_otur").val(),
                        'lang': $("#lang").val()
                    }, function(data) {
                        //console.log(data)
                        if (JSON.stringify(data).replace(/[\\rn\"]/ig, '') === "") {
                            window.location.href = "manager_module.php?id=" + $('#kull_id').val();
                        } else {
                            alert(data)
                            alert("Hata var")
                        }
                    }, "text");
                });

                $('#new_button').click(function() {
                    mod = 'add';
                    $('#info_table td').css('font-weight', 'normal');
                    $('#save_button').removeClass('unsaved');
                    $('#info_table tr').removeClass('active passive');
                    $('#cancel_button').show();
                    $('#remove_button').hide();
                    $(this).hide();
                    $('#kull_id').val('otomatik');
                    $('#kull_adi').val('');
                    $('#sifre').val('');
                    $('input[type=checkbox]').removeAttr('checked');
                    $('#max_otur').val('');
                    $('#say_otur').val('-');
                    $('#lang').val('en');
                });

                $('#cancel_button').click(function() {
                    $(this).hide();
                    $('#new_button').show();
                    $('#remove_button').show();
                    $('#clicked_obj').click();
                    mod = 'set';
                });

                $('#remove_button').click(function() {
                    if (confirm($('#kull_adi').val() + ' adlı kullanıcı silinsin mi?')) {
                        $.get('user_manager.php', {
                            'mod': 'rem',
                            'kull_id': $('#kull_id').val()
                        }, function(data) {
                            //console.log(data)
                            if (JSON.stringify(data).replace(/[\\rn\"]/ig, '') == "") {
                                window.location.href = "manager_module.php?id=" + $('#kull_id').val();
                            } else {
                                alert(data)
                                alert("Hata oluştu")
                            }
                        }, "text");
                    }
                });
            });

        </script>
    </body>
</html>