<?php
require('manager_settings.php');
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-9">
        <?php
        echo printCss();
        echo printJS();
        echo printUserJsonList();
        ?>
        <script src="js/inputmask/JavaScriptUtil.js"></script>
        <script src="js/inputmask/Parsers.js"></script>
        <script src="js/inputmask/InputMask.js"></script>

        <script src="js/tokeninput/jquery.tokeninput.js"></script>
        <script src="js/inspector_time.js"></script>
        <script src="js/inspector_gui.js"></script>
        <style type='text/css'>
            @import 'js/tokeninput/token-input.css';
        </style>

    </head>

    <body>
        <div id="wrapper">
            <?php echo printHeader(2); ?>
            <?php echo printNav(2); ?>
            <div id ="main_right_container">
                <div class="filter-box"> <span class="filter-heading"> IP Aralığı</span>
                    <div class="filter-region">
                        <div class="radio ip_type_select  ico-radio-checked" id="all_ip" value="1" > </div> Tümü <br/>

                        <div class="radio ip_type_select  ico-radio-unchecked" id="sip" value="2"> </div> Tek IP <br/>
                        <input type="text" class="ip_input " name="single_ip" id="single_ip" value="000.000.000.000" disabled /> <br/>

                        <div class="radio ip_type_select ico-radio-unchecked" id="opt_ip" value="3"> </div> Aralık <br/>
                        <input type="text" name="ip1" class="ip_input" id="ip1" value="000.000.000.000" disabled /> <br/>
                        <input type="text" name="ip2" class="ip_input" id="ip2" value="255.255.255.255" disabled />
                    </div>
                </div>


                <div class="filter-box"> 
                    <span class="filter-heading"> Kullanıcılar</span>
                    <div class="filter-region">
                        <div class="user_type_select radio ico-radio-checked" id="all_user" value="1" >  </div> Tümü <br/>
                        <div class="user_type_select radio ico-radio-unchecked" id="suser" value="2"> </div> Kayıtlı Harici <br/>
                        <div class="user_type_select radio ico-radio-unchecked" id="opt_usr1" value="3"> </div> Seçim <br/>

                        <input type="text" name="usr1" class="user_input" id="usr1" disabled />
                        <input type="text" name="usr2" class="user_input" id="usr2" disabled />
                        <div class="user_type_select radio ico-radio-unchecked" id="opt_usr2" value="4"> </div> Belirsiz Seçim<div class="ico-question" style="display:inline-block; cursor:pointer; font-weight:bold">*</div><br/>
                        <input type="text" name="usr3" class="user_input" id="usr3" placeholder="Dahil" disabled /> <br/>
                        <input type="text" name="usr4" class="user_input" id="usr4" placeholder="Hariç" disabled /> <br/>

                    </div>
                </div>
                <div class="filter-box"> <span class="filter-heading"> Zaman Aralığı</span>
                    <div class="filter-region">
                        <div class="time_type_select radio ico-radio-unchecked" id="all_time" value ="63072000">  </div> Tümü <br/>
                        <div class="time_type_select radio ico-radio-checked" id="time1m" value =    "3600"> </div> Son 1 Saat <br/>
                        <div class="time_type_select radio ico-radio-unchecked" id="time1d" value =   "86400" > </div> Son 1 Gün <br/>
                        <div class="time_type_select radio ico-radio-unchecked" id="time1w" value =  "604800"> </div> Son 1 Hafta <br/>
                        <div class="time_type_select radio ico-radio-unchecked" id="opt_time"> </div> Seçim <br/>
                        <input type="text" name="time1" class="time_input" id="time1" placeholder="yyyy-aa-gg ss:dd" disabled /> <br/>
                        <input type="text" name="time2" class="time_input" id="time2" placeholder="yyyy-aa-gg ss:dd" disabled /> <br/>
                    </div>

                </div>
                <div class="filter-box"> <span class="filter-heading"> İşlemler </span>
                    <div class="filter-region">
                        <div class="status_type_select radio ico-radio-checked" id="all_status" value="1">  </div> Tümü <br/>
                        <div class="status_type_select radio ico-radio-unchecked" id="opt_status" value="2">  </div> Seçim <br/>
                        <div class="checkbox_container">
                            <div class="status_type_check checkbox ico-checked disabled" id="login" value="1">  </div> Giriş <br/>
                            <div class="status_type_check checkbox ico-checked disabled" id="logout" value="2" >  </div> Çıkış 
                        </div>
                        <div class="checkbox_container" style="margin-left: 0px">
                            <div class="status_type_check checkbox ico-checked disabled" id="error" value="3" >  </div> Hata <br/>
                            <div class="status_type_check checkbox ico-checked disabled " id="load" value="4" >  </div> Yükleme
                        </div>


                    </div>
                </div>


                <div class="filter-box"> <span class="filter-heading"> Bölge </span>
                    <div id="warning_region">
                        Bölge seçimi yapabilmek için ücretli bir IP servisi gereklidir.
                    </div>
                    <div class="filter-region">
                        <div class="region_type_select radio ico-radio-checked" id="all_region" value="1">  </div> Tümü <br/>
                        <div class="region_type_select radio ico-radio-unchecked" id="regioni" value="2"> </div> İstanbul <br/>
                        <div class="region_type_select radio ico-radio-unchecked" id="regiona" value="3"> </div> Ankara <br/>
                        <div class="region_type_select radio ico-radio-unchecked" id="regionm" value="4"> </div> Mobil Oper. <br/>
                        <div class="region_type_select radio ico-radio-unchecked" id="regiono" value="5"> </div> Diğer <br/>
                    </div>
                </div>

                <div class="filter-box"> <span class="filter-heading"> Çeşitli </span>
                    <div class="filter-region">
                        <div class="misc_type_check checkbox ico-unchecked" id="suspect" >  </div> Şüpheli Veriler <br/>
                        <div class="checkbox_container" style="width: 100%;">
                            <div class="suspect_type_radio radio ico-radio-checked disabled" id="longtext" value="1">  </div> Uzun girdi <br/>
                            <div class="suspect_type_radio radio ico-radio-unchecked disabled" id="notext" value="2">  </div> Eksik bilgi <br/>
                            <!--  <div class="suspect_type_check checkbox ico-checked disabled" id="difftext" >  </div> Olmayan kullanıcı <br/> -->
                        </div> <br/>
                        <div class="misc_type_check checkbox ico-unchecked" id="often" >  </div> Sık Giriş Çabaları <br/>
                        <div class="checkbox_container" style="width: 100%;">
                            <div class="often_type_select radio ico-radio-checked disabled" id="often1m" value="1"> </div> < 1 dakika <br/>
                            <div class="often_type_select radio ico-radio-unchecked disabled" id="often5m" value="2"> </div> < 5 dakika <br/>
                        </div>
                    </div>
                </div>

                <div class="filter-box"> <span class="filter-heading"> Uygulama </span>
                    <div class="filter-region">

                        <div class="apply_type_check checkbox ico-unchecked" id="oldlog">  </div> Eski Kayıtlar <br/>

                        <div style="width:100%; margin-top:10px; text-align: center">
                            <input type="button" id="filter_button" value="Filtrele"/>
                        </div>
                    </div>
                </div>

                <div style="clear:both"> </div>
                <div id="error_container">
                    <div id="button_container"></div>
                    <div id="inner_error"></div>
                </div>
            </div>



        </div>
        <script type="text/javascript">
            var startDateTextBox = $('#time1');
            var endDateTextBox = $('#time2');
            
            var user1_arr = '';
            var user2_arr = '';
            var status_arr = [1,2,3,4];
            
            var sendData = {
                ip_mode:1,
                ip1:'000.000.000.000',
                ip2:'255.255.255.255',
                user_mode:1,
                user1:'',
                user2:'',
                time1:0,
                time2:0,
                status_mode: 1,
                status: JSON.stringify(status_arr),
                region_mode: 1,
                suspect_mode: 0,
                suspect:1,
                often_mode: 0,
                old_mode: 0
            };
            
            var resultData = [];
            var keyArray = 0;
            var listLength = 200;
            getResponse = "";
                
            function listInterval(start){
                var end = start + listLength;        
                $("#inner_error").html("");
                var printStr = "<table id='error_table' class='rounded-corner'>";
                printStr += "<thead><tr> <th> Saat </th> <th> Kullanıcı Adı* </th> <th> İşlem </th> <th> Açıklama </th> <th> IP Adresi </th></thead>";
                    
                for( var x = start; x < end && x < keyArray.length; x++){
                    printStr += "<tr> <td>" + resultData[keyArray[x]]['time'] + "</td><td>" + resultData[keyArray[x]]['user_name']
                        + "</td><td>" + resultData[keyArray[x]]['status'] +  "</td><td>" 
                        + resultData[keyArray[x]]['password'] +  "</td> <td>" +resultData[keyArray[x]]['ip'] +  "</td></tr>" ;
                }
                printStr += "</table>";
                $("#inner_error").html(printStr);
            }
            
            $(document).ready(function(){
                $('#error_container').addLoading();
                
                sendData.time1 = $('#time1').val();
                sendData.time2 = $('#time2').val();
               
                $('#single_ip').blur(function(){
                    if(!ipMask1.isComplete()){
                        $(this).val('000.000.000.000')
                    }
                    sendData.ip1 = $(this).val();
                });
                
                $('#ip1').blur(function(){
                    if(!ipMask2.isComplete()){
                        $(this).val('000.000.000.000')
                    }
                    sendData.ip1 = $(this).val();
                });
                
                $('#ip2').blur(function(){
                    if(!ipMask3.isComplete()){
                        $(this).val('255.255.255.255')
                    }
                    sendData.ip2 = $(this).val();
                });
                
                
                
                $('#filter_button').click(function(){
                    $("#button_container").html("");
                    $("#error_container").showLoading();
                    $("#inner_error").html('Sonuçlar yükleniyor...');
                getResponse = $.get("data_manager.php", sendData, function(data){
                        resultData = data;
                        console.log();
                        if(data){
                            keyArray = Object.keys(data);
                            
                            var buttonStr = "";
                            var value = "";
                            
                            for(var val = 0; val<keyArray.length; val+=listLength){
                                value = val+"-"+((val+300>keyArray.length)?(keyArray.length):(val+listLength));
                                buttonStr += "<input type='button' class='interval' value='" +value+ "' onclick='listInterval("+val+")' />";
                            }
                            $("#button_container").html(buttonStr);
                            listInterval(0);
                            if(keyArray.length>listLength*3){
                                alert("Fazla sonuç var. Araman\u0131zı daraltın. ")
                            }
                            
                        }
                        $("#error_container").hideLoading();
                    },'json');
                    getResponse.error(function(){
                        $("#inner_error").html('Sonuç bulunamad\u0131!');
                        $("#error_container").hideLoading();
                    });
                })
                
                
            })
            
        </script>

    </body>
</html>
