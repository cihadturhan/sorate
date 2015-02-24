function ekle(){
    kul_id = $("#kull_id").val();
    baslangic = $('#baslangic').val();
    bitis = $('#bitis').val();
    tekrarli = false;
                
    if(baslangic=="" || bitis==""){
        alert("Bir tarih giriniz");
        return;
    }
                
    if(baslangic>=bitis){
        alert("Başlangıç tarihi bitiş tarihinden önce olmalıdır.");
        return;
    }
                
    if($('#tekrarli').css('display')!='none'){
        tekrarli = true;
    }
                
    if(tekrarli){
        zaman = $('#zaman_turu').val();
        saat1=$('#saat_1').val();
        saat2=$('#saat_2').val();
                    
        if(zaman==0){
            gun1=$('#gun_1').val();
            gun2=$('#gun_2').val();
                        
            $.get('date_manager', {
                'id':kul_id, 
                'mod':'ekle',
                'z_id':0,
                'tekrarli':tekrarli, 
                'baslangic':baslangic,
                'bitis':bitis,
                'zaman':zaman,
                'gun1':gun1,
                'saat1':saat1,
                'gun2':gun2, 
                'saat2':saat2
            },
            function(data) {
                printData(data);
            },"text");
            return;
        }
                    
        $.get('date_manager', {
            'id':kul_id, 
            'mod':'ekle',
            'z_id':0,
            'tekrarli':tekrarli, 
            'baslangic':baslangic,
            'bitis':bitis,
            'zaman':zaman,
            'saat1':saat1, 
            'saat2':saat2
        },
        function(data) {
            printData(data);
        },"text");
                    
    }else{
        $.get('date_manager', {
            'id':kul_id, 
            'mod':'ekle',
            'z_id':0,
            'tekrarli':'false', 
            'baslangic':baslangic, 
            'bitis':bitis
        }, function(data) {
            printData(data);
        },"text");
    }
}
            
function degistir(z_id){
    kul_id = $("#kull_id").val();
    baslangic = $('#baslangic').val();
    bitis = $('#bitis').val();
    tekrarli = false;
                
    if($('#tekrarli').css('display')!='none'){
        tekrarli = true;
    }
                
    if(tekrarli){
        zaman = $('#zaman_turu').val();
        saat1=$('#saat_1').val();
        saat2=$('#saat_2').val();
                    
        if(zaman==0){
            gun1=$('#gun_1').val();
            gun2=$('#gun_2').val();
                        
            $.get('date_manager', {
                'id':kul_id, 
                'mod':'duzenle',
                'z_id':z_id,
                'tekrarli':tekrarli, 
                'baslangic':baslangic,
                'bitis':bitis,
                'zaman':zaman,
                'gun1':gun1,
                'saat1':saat1,
                'gun2':gun2, 
                'saat2':saat2
            },
            function(data) {
                printData(data);
            },"text");
            return;
        }
                    
        $.get('date_manager', {
            'id':kul_id, 
            'mod':'duzenle',
            'z_id':z_id,
            'tekrarli':tekrarli, 
            'baslangic':baslangic,
            'bitis':bitis,
            'zaman':zaman,
            'saat1':saat1, 
            'saat2':saat2
        },
        function(data) {
            printData(data);
        },"text");
                    
    }else{
        $.get('date_manager', {
            'id':kul_id, 
            'mod':'duzenle',
            'z_id':z_id,
            'tekrarli':'false', 
            'baslangic':baslangic, 
            'bitis':bitis
        }, function(data) {
            printData(data);
        },"text");
    }
}
            
            
function sil(id){
    if(window.confirm("Silmek istediğinizden emin misiniz?")){
        $.get('date_manager', {
            'z_id':id, 
            'mod':'sil'
        }, function(data) {
            printData(data);
        },"text");
    }
}
            
function reset_form(){
    $('#kul_adi').val('');
    $('.tarih_input').val('');
    $('.saat_input').val('00:00');
    $('#gun_1, #gun_2, #zaman_turu').val('0');
    $('.gun_sec').css('display','inline');
    $('#tekrarli').slideUp('500');
    $('#table_add_style h1').removeClass('selected_date');
    $('#table_add_style h1:first').addClass('selected_date');
    $('#iptal').fadeOut(500);
    $('#gonder').val("EKLE");
    document.getElementById("gonder").setAttribute('onclick','ekle()');
}
            
function printData(data){
    //alert(data);
    if(data.replace(/\s+/ig,'')==""){
        downloadDateInfo($('#kull_id').val());
        reset_form();
    }else{
        alert(data);
    }
    
}
            
function duzenle(key){
    uygula(timeData[key]);
    $('#gonder').val("DUZENLE");
    //$('#gonder').unbind('click');
    document.getElementById("gonder").setAttribute('onclick','degistir('+timeData[key]['z_id']+')');
    $('#iptal').fadeIn('500');
}

var hourMin = 60;
var dayMin = hourMin * 24;
var $weekMin = dayMin * 7;
var hafta_gunleri = Array("pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi", "pazar");
var timeData = {};

function parseTimeData(data){
    
    var timeData = {};
    for(var key in data){
        timeData[key] = {};
        timeData[key]['z_id'] = data[key]['time_id'];
        timeData[key]['baslangic'] = data[key]['start'];
        timeData[key]['bitis'] = data[key]['end'];
        
        if(data[key]['repeat']=='1'){
            timeData[key]['tekrar'] = 1;
        
            if(data[key]['daily']=='0'){
                timeData[key]['gunluk'] = 0;
            
                startDay = ( Math.floor(parseInt(data[key]['interval_start']) / dayMin));
                endDay = ( Math.floor(parseInt(data[key]['interval_end']) / dayMin));

                s1 = Math.floor((parseInt(data[key]['interval_start']) - startDay * dayMin) / hourMin);
                d1 = (parseInt(data[key]['interval_start']) - startDay * dayMin) % hourMin;
                        
                        
                s10 = (s1 < 10) ? ('0') : ('');
                d10 = (d1 < 10) ? ('0') : ('');

                s2 = Math.floor((parseInt(data[key]['interval_end']) - endDay * dayMin) / hourMin);
                d2 = (parseInt(data[key]['interval_end']) - endDay * dayMin) % hourMin;
                s20 = (s2 < 10) ? ('0') : ('');
                d20 = (d2 < 10) ? ('0') : ('');
                timeData[key]['gun1'] = startDay;
                timeData[key]['gun2'] = endDay;
            
                timeData[key]['saat1'] = s10+s1+':'+d10+d1;
                timeData[key]['saat2'] = s20+s2+':'+d20+d2;
            
            }else{
                timeData[key]['gunluk'] = 1;
            
                s1 = ( Math.floor(parseInt(data[key]['interval_start']) / hourMin));
                d1 = parseInt(data[key]['interval_start']) % hourMin;
                s10 = (s1<10) ? ('0') : ('');
                d10 = (d1 < 10) ? ('0') : ('');
            
                s2 = ( Math.floor(parseInt(data[key]['interval_end']) / hourMin));
                d2 = parseInt(data[key]['interval_end']) % hourMin;
                s20 = (s2 < 10) ? ('0') : ('');
                d20 = (d2 < 10) ? ('0') : ('');
            
                timeData[key]['saat1'] = s10+s1+':'+d10+d1;
                timeData[key]['saat2'] = s20+s2+':'+d20+d2;
            }
        
        }else{
            timeData[key]['tekrar'] = 0;
        }
    }
    return timeData;

}

function uygula(timeData){
                
    $('#baslangic').val(timeData['baslangic']);
    $('#bitis').val(timeData['bitis']);
    
    if(timeData['tekrar']){
        $("#tekrarli").slideDown('500');
        if(!timeData['gunluk']){
            $('#zaman_turu').val('0');
            $('.gun_sec').css('display','inline');
                        
            $('#gun_1').val(timeData['gun1']);
            $('#gun_2').val(timeData['gun2']);
                        
            $('#saat_1').val(timeData['saat1']);
            $('#saat_2').val(timeData['saat2']);
                        
        }else{
            $('#zaman_turu').val('1');
            $('.gun_sec').css('display','none');
            
            $('#saat_1').val(timeData['saat1']);
            $('#saat_2').val(timeData['saat2']);
        }
    }else{
        $("#tekrarli").slideUp('500');
    }
}


function downloadDateInfo(id){
    $('#table_loading').fadeIn(300);
    $('#timetable_container').html('');
    $.get('date_manager.php', {
        mod:'uget', 
        id:id
    }, function ( data ) {
        if( data){
            printTimeTable(data);
        }else{
            $('#timetable_container').html('Kullanıcı için herhangi bir izin tarihi belirlenmemiştir.')
        }
        $('#table_loading').fadeOut(300);
    },'json'
    )
}


function printTimeTable(data){
    timeData = parseTimeData(data);
    var tableStr = "<table class='rounded-corner'>";
    tableStr+= "<tr><th>Başlama tarihi</th> <th>Bitiş tarihi</th> <th>Tekrar</th> <th>İşlem</th></tr>";
    for (var key in timeData){
        var repeatStr = "";
        tableStr += "<tr><td>" + timeData[key]['baslangic'] + "</td> <td>" + timeData[key]['bitis'] + "</td>";
        if(timeData[key]['tekrar']){
            if(timeData[key]['gunluk']){
                repeatStr = "Her gün saat " + timeData[key]['saat1'] + " ile" +
                " saat " + timeData[key]['saat2'] + " arası";
            }else{
                repeatStr = "Her hafta " + hafta_gunleri[timeData[key]['gun1']] + " günü saat " +
                timeData[key]['saat1']  + " ile " +
                hafta_gunleri[timeData[key]['gun2']] + " günü saat " +
                timeData[key]['saat2']  + " arası";
            }
        }else{
            repeatStr = "--";
        }
        tableStr += "<td> " + repeatStr + " </td>"
        tableStr += "<td><input type='button' value='sil' onclick='sil(" + timeData[key]['z_id'] + ")' style=' padding:3px;'/> ";
        tableStr+= "<input type='button' value='dznle' onclick='duzenle(" + key + ")' style=' padding:3px;' /> </td></tr>";
    }
    tableStr+= "</table>";
    $('#timetable_container').html(tableStr);
                
}

            
$(function(){
    $('.saat_input').timepicker({
        stepMinute: 5,
        closeText: 'Kapat',
        prevText: '&#x3c;geri',
        nextText: 'ileri&#x3e;',
        currentText: 'Güncel Zaman',
        timeOnlyTitle: 'Zamanı Seçin',
        timeText: 'Zaman',
        hourText: 'Saat',
        minuteText: 'Dakika'
    });
		
    $('.tarih_input').datetimepicker({
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
                
    document.getElementById("gonder").setAttribute('onclick','ekle()');
});

function changeDisplay(val){
    if(val=="1"){
        $('.gun_sec').css('display','none');
    }else{
        $('.gun_sec').css('display','inline');		
    }
}