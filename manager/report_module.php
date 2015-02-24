<?php
require('manager_settings.php');
?>
<!DOCTYPE html>
<html>
    <head>
        <?php echo printCss() ?>
        <?php echo printJS(); ?>
        <title> Rapor ve İstatistik </title>
        <script src="js/exporting.js"></script>
        <script src="js/charts.js"></script>
        <script type='text/javascript'> 
            TSort_Data = new Array ('ver-zebra','d','s','s','s','s', 's');
        </script> 
        <script type='text/javascript' src='js/gs_sortable.js'> </script>
    </head>
    <body>
        <div id="wrapper">
            <?php echo printHeader(1); ?>
            <?php echo printNav(1); ?>
            <div id ="main_left_container">
                <?php echo printUserlist(); ?>

            </div>
            <div id ="main_right_container">
                <div id="filter_container"> 
                    <div id="dateselect_container">
                        <input  type="text"  id="start" class="tarih_input" style="width:145px; background-color: white" /> &nbsp; - &nbsp;
                        <input  type="text"  id="end" class="tarih_input" style="width:145px; background-color: white" /> &nbsp;

                        <div class="time_type_select radio ico-radio-unchecked" id="time1m" value =    "3600"> </div>  Son Saat &nbsp;
                        <div class="time_type_select radio ico-radio-checked" id="time1d" value =   "86400" > </div> Son 24 Saat &nbsp;
                        <div class="time_type_select radio ico-radio-unchecked" id="time1w" value =  "604800"> </div> Son 1 Hafta &nbsp;

                    </div>

                    <div id="statusselect_container">
                        <div class="status_type_check checkbox ico-checked" id="login" value="1">  </div> Girişler &nbsp;
                        <div class="status_type_check checkbox ico-checked" id="logout" value="2" >  </div> Çıkışlar &nbsp;
                        <div class="status_type_check checkbox ico-checked" id="error" value="3" >  </div> Hatalar &nbsp;
                        <div class="status_type_check checkbox ico-checked" id="load" value="4" >  </div> Yüklemeler &nbsp;

                    </div>

                    <input type="button" id="refresh_date" value="UYGULA" onclick="$('#clicked_obj').click();" />
                </div>

                <div id="log_container">
                    <div id="heading_container">
                        <div id="log_heading" class="headings selected_heading"> LİSTE </div>
                        <div id="graph1" class="headings"> ÇİZGİ </div>
                        <div id="graph2" class="headings"> ÇUBUK </div>
                        <div class="headings ico-resize-enlarge" id="resize" div=""></div>
                    </div>

                    <div id="inner_log_container">
                        <div class="containers" id="log"> </div>
                        <div class="containers" id="graph_container_1"> </div>
                        <div class="containers" id="graph_container_2"> </div>
                    </div>

                </div>

                <div id="current_container">
                    <div id="inner_current">
                        
                    </div>
                </div>

                <div id="error_container">
                    <div id="inner_error">
                        
                    </div>
                </div>
            </div>
            <div style="clear:both"> </div>
        </div>

        <script type="text/javascript">
             $('#log_container').addLoading();
             $('#current_container').addLoading();
            
            $('.status_type_check').click(function(){
                if(!$(this).hasClass('disabled')){
                    if($(this).hasClass('ico-checked')){
                        if($(".status_type_check.ico-checked").length > 1){
                            $(this).removeClass('ico-checked')
                            $(this).addClass('ico-unchecked')
                        }
                    }else{
                        $(this).removeClass('ico-unchecked')
                        $(this).addClass('ico-checked')
                    }
                }
            });
            
            $(".time_type_select").click(function(){
                $('.time_type_select').removeClass('ico-radio-checked');
                $('.time_type_select').addClass('ico-radio-unchecked');
                $(this).removeClass('ico-radio-unchecked');
                $(this).addClass('ico-radio-checked');
                startDateTextBox.datetimepicker('setDate', (new Date(Date.now()-parseInt($(this).attr('value'))*1000)));
                endDateTextBox.datetimepicker('setDate', (new Date()));
            });
            
            function downloadCurrentSessInfo(){
                $("#current_container").showLoading();
                $.get("user_manager.php",{mod:'cur'}, function(data){
                    var printStr = "";
                    
                    for(var key in data){
                        printStr += "<div class='channel_container'> " + "<div class='channel_name'> "+ key +"</div>"+ 
                            " (<span class='" +((data[key]['curr_sessions']==data[key]['max_sessions'])?("maxOturum"):("sayOturum")) +"'>" + data[key]['curr_sessions'] + "</span>/<span class='maxOturum'>" +data[key]['max_sessions'] + "</span>)";
                        for(var ip in data[key]){
                            if(ip!='curr_sessions' && ip!='max_sessions'){
                                printStr += "<ul class='ip_container'>" + ip;
                                for(var sess in data[key][ip]){
                                    printStr += "<li> " + data[key][ip][sess]['page_to'] + " (" + data[key][ip][sess]['time'] + ") </li>"
                                }
                            
                                printStr += "</ul>";
                            }
                        }
                        printStr += "</div>";
                    }
                    $('#inner_current').html(printStr);
                    $("#current_container").hideLoading();
                },'json');
            };
            
            
            function downloadLastErrorInfo(){
                $.get("user_manager.php",{mod:'ler'}, function(data){
                    var printStr = "<table id='error_table' class='rounded-corner'>";
                    //console.log(data);
                    printStr += "<thead><tr> <th> Saat </th> <th> Kullanıcı Adı </th> <th> İşlem </th> <th> Açıklama </th> <th> IP Adresi </th></thead>";
                    var status_str = "";
                    var expl_str = "";
                    for(var key in data){
                        switch( data[key]['status']){
                            case 0:
                                status_str = 'Yanlış Şifre';
                                expl_str = data[key]['explanation'];
                                break;
                            case 1:
                                status_str = 'Aktif olmayan kullanıcı';
                                expl_str = data[key]['explanation'];
                                break;  
                            case 2:
                                status_str = 'Oturum limiti dolu';
                                expl_str = data[key]['explanation'];
                                break;  
                            case 3:
                                status_str = 'İzin verilmeyen zaman dilimi';
                                expl_str = data[key]['explanation'];
                                break;  
                        }
                        printStr += "<tr> <td>" + data[key]['time'] + "</td><td>" + data[key]['user_name']+ "</td><td>" + status_str +  "</td><td>" + expl_str +  "</td> <td>" +data[key]['ip'] +  "</td></tr>" ;
                    }
                    
                    printStr += "</table>";
                    $("#inner_error").html(printStr);
                    
                },'json');
            };
            
            function downloadChartInfo(){
                lineData = [];
                barData = [];
                totalSesssionNo = "Kullanıcı bu zaman aralığında sisteme girmemiştir.";
                totalSesssionNo2 = "Kullanıcı bu zaman aralaralığındanda sisteme girmemiştir.";
                if(chart){
                    //chart.series = [];
                    callGraph1();
                }
                if(chart2){
                    callGraph2();
                }
                $.get("user_manager.php",{
                    start : $("#start").val(),
                    end : $('#end').val(),
                    mod:'gra', //we use detailed log here...
                    kull_adi:currUser  
                }, function(data){
                    processLineData(data['line']);
                    processBarData(data['bar']);
                },'json');
            };
            
            function processBarData(data){
                console.log(data);
                var total_time = 0;
                for(var pageNo in data){
                    barData.push([pageNo, data[pageNo]/60]);
                    total_time += data[pageNo]/60;
                }
                
                totalSesssionNo2 = "Toplam harcanan süre yaklaşık " + Math.round(total_time) + " dakika";
                
                callGraph2();
            };
            
            function processLineData(data){
                var max = 0;
                var min = Number.MAX_VALUE;
            
                for(var currSessNo in data){
                    var currSeries = {};
                    currSeries.name = "Oturum " + currSessNo ;
                    var currData = [];
                    for(var time in data[currSessNo]){
                        currData.push([(time*1000), data[currSessNo][time]]);
                        if(time*1000<min){
                            min = time*1000;
                        }
                        if(time*1000>max){
                            max = time*1000;
                        }
                    }
                    currSeries.data = currData;
                    lineData.push(currSeries);
                }
                totalSesssionNo = "Toplam oturum sayısı: " + (parseInt(currSessNo)+1);
                var currSeries = {};
                currSeries.name = "dummy";
                currSeries.data = [[min,0],[max,0]];
                currSeries.color = 'transparent';
                lineData.push(currSeries);
                callGraph1();
            };

            var startDateTextBox = $('#start');
            var endDateTextBox = $('#end');
                
            startDateTextBox.datetimepicker({ 
                onClose: function(dateText, inst) {
                    if (endDateTextBox.val() != '') {
                        var testStartDate = startDateTextBox.datetimepicker('getDate');
                        var testEndDate = endDateTextBox.datetimepicker('getDate');
                        if (testStartDate > testEndDate)
                            endDateTextBox.datetimepicker('setDate', testStartDate);
                    }
                    else {
                        endDateTextBox.val(dateText);
                    }
                },
                onSelect: function (selectedDateTime){
                    endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') );
                    $('.time_type_select').removeClass('ico-radio-checked');
                    $('.time_type_select').addClass('ico-radio-unchecked');
                },
                stepMinute: 5,
                closeText: 'Kapat',
                prevText: '&#x3c;geri',
                nextText: 'ileri&#x3e;',
                monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                    'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
                monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz',
                    'Tem','Ağu','Eyl','Eki','Kas','Ara'],
                dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
                dayNamesShort: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'],
                dayNamesMin: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'],
                currentText: 'Güncel Zaman',
                timeOnlyTitle: 'Zamanı Seçin',
                timeText: 'Zaman',
                hourText: 'Saat',
                minuteText: 'Dakika',
                weekHeader: 'Hf',
                dateFormat: 'yy-mm-dd',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''
            });
            
            endDateTextBox.datetimepicker({ 
                onClose: function(dateText, inst) {
                    if (startDateTextBox.val() != '') {
                        var testStartDate = startDateTextBox.datetimepicker('getDate');
                        var testEndDate = endDateTextBox.datetimepicker('getDate');
                        if (testStartDate > testEndDate)
                            startDateTextBox.datetimepicker('setDate', testEndDate);
                    }
                    else {
                        startDateTextBox.val(dateText);
                    }
                },
                onSelect: function (selectedDateTime){
                    startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate') );
                    $('.time_type_select').removeClass('ico-radio-checked');
                    $('.time_type_select').addClass('ico-radio-unchecked');
                },
                stepMinute: 5,
                closeText: 'Kapat',
                prevText: '&#x3c;geri',
                nextText: 'ileri&#x3e;',
                monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                    'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
                monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz',
                    'Tem','Ağu','Eyl','Eki','Kas','Ara'],
                dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
                dayNamesShort: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'],
                dayNamesMin: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'],
                currentText: 'Güncel Zaman',
                timeOnlyTitle: 'Zamanı Seçin',
                timeText: 'Zaman',
                hourText: 'Saat',
                minuteText: 'Dakika',
                weekHeader: 'Hf',
                dateFormat: 'yy-mm-dd',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''
            });
                
            startDateTextBox.datetimepicker('setDate', (new Date(Date.now()-24*60*60*1000))); //1 hour 
            endDateTextBox.datetimepicker('setDate', (new Date()));
            startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate') );
            endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') );

            $('.headings').click( function(){
                if($(this).attr('id')!="resize"){
                    $('.headings').removeClass("selected_heading");
                    $(this).addClass("selected_heading");
                    $('.containers').hide();
                    
                }else{
                    
                    if(!$('#log_container').hasClass('enlarged')){
                        $('#log_container').addClass('enlarged');
                        $('#inner_log_container').addClass('changed_height');
                        $(this).removeClass('ico-resize-enlarge');
                        $(this).addClass('ico-resize-shrink');
                            
                    }else{
                        $('#log_container').removeClass('enlarged');
                        $('#inner_log_container').removeClass('changed_height');
                        $(this).removeClass('ico-resize-shrink');
                        $(this).addClass('ico-resize-enlarge');
                    }
                    callGraph1();
                    callGraph2();
                }
            });

            $('#log_heading').click(function(){
                $('#log').show();
                $('#inner_log_container').removeClass("inner_log_graph");
            });
            
            $('#graph1').click(function(){
                $('#graph_container_1').show();
                $('#inner_log_container').addClass("inner_log_graph");
                callGraph1();
            });
            
            $('#graph2').click(function(){
                $('#graph_container_2').show();
                $('#inner_log_container').addClass("inner_log_graph");
                callGraph2();   
            });
            
            
           


            

            $('#hor-zebra tr').click(function(){
                if($(this).index()!=0){
                    currUser = $(this).children('td:nth-child(2)').html();

                    if(typeof $prev !== "undefined"){
                        $prev.attr('id',"");
                    }
                    $(this).attr('id',"clicked_obj");
                    $('#log_container').showLoading(300);
                    
                    
                    
                    $.get("user_manager.php",{
                        start : $("#start").val(),
                        end : $('#end').val(),
                        error: $('#error').hasClass('ico-checked'),
                        load: $('#load').hasClass('ico-checked'),
                        login: $('#login').hasClass('ico-checked'),
                        logout: $('#logout').hasClass('ico-checked'),
                        mod:'logd', //we use detailed log here...
                        kull_adi:currUser  
                    }, function(data){
                        if( JSON.stringify(data).replace(/[\\rn\"]/ig,'')!=""){
                            $('#log').html("");
                            if(JSON.parse(data) != null){
                                var myObj = JSON.parse(data);
                                
                                str = "<table class='rounded-corner' id='log_table'>";
                                str += "<thead><tr> <th>Tarih </th> <th> İşlem </th> <th> Bulundugu Sayfa </th> <th> Gittigi Sayfa </th> <th> IP adresi </th> <th> Session ID </th> </tr></thead>";
                                for(var key in myObj){
                                    var elem = myObj[key];
                                    str +="<tr>";
                                    str +="<td>" + elem['time']+" </td> ";
                                    str +="<td>" + elem['status']+" </td> ";
                                    str +="<td>" + elem['page_from']+" </td> ";
                                    str +="<td>" + elem['page_to']+" </td> ";                                    
                                    str +="<td>" + elem['ip']+" </td> ";
                                    str +="<td>" + elem['sess_id']+" </td> ";
                                    str +="</tr>";
                                }
                                str += "</table>"
                                $('#log').append(str);
                                InitDynTable1();
                            }else{
                                $('#log').html('Kullanıcı bu zaman aralığında sisteme girmemiştir.');
                            }
                            $('#log_container').hideLoading(300);
                            
                        }else{
                            alert("Hata oluştu");
                            //console.log(data);
                            $('#log_container').hideLoading(300);
                        }
                            
                    });
                }
                $prev = $(this);
                downloadChartInfo();
            });
            
            $('#clicked_obj').click(); 
            
            
            function InitDynTable1 ()
            {   
                TSort_Data = new Array ('log_table','d','s','s','s','s', 's');
                TSort_Initial = new Array ('0D');
           
                TSort_Icons = new Array ('\u25B2','\u25BC');
                tsRegister();
                tsSetTable ('log_table');
                tsInit();
            }
            
            downloadCurrentSessInfo();
            downloadLastErrorInfo();
            var timer = setInterval(function(){
                downloadCurrentSessInfo();
                downloadLastErrorInfo();
            }, 30000);
            
        </script>


    </body>
</html>