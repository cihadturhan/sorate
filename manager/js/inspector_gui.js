$(document).ready(function($){
    /*var ipMask1 = new InputMask("###.###.###.###", "single_ip"); */
    var field = 
    [fieldBuilder.inputNumbers(1,3), fieldBuilder.literal("."), 
    fieldBuilder.inputNumbers(1,3), fieldBuilder.literal("."),
    fieldBuilder.inputNumbers(1,3), fieldBuilder.literal("."),
    fieldBuilder.inputNumbers(1,3)];
    ipMask1 = new InputMask(field, "single_ip");
    ipMask2 = new InputMask(field, "ip1"); 
    ipMask3 = new InputMask(field, "ip2"); 
                
              
                
    $("#usr1").tokenInput(userlist, {
        preventDuplicates: true,
        hintText: '',
        noResultsText: 'Sonuç bulunamadý',
        searchingText: 'Aranýyor',
        resultsLimit: 5,
        propertyToSearch: "name",
        resultsFormatter: function(item){
            return "<li>" + "<div><div class='id' style='float: left; font-weight: bold; color: hsl(331, 71%, 52%); margin-right: 3px; width: 20px; text-align: center;'> " + item.id + 
            " </div><div class='name' style='color: hsl(0, 0%, 29%);'> " + item.name + " </div></div></li>"
        },
        tokenFormatter: function(item) {
            return "<li><p><b>" + item.name + "</b></p></li>"
        },
        onAdd: function(){
            setUserArray(true);
        }
    });
                
    $("#usr2").tokenInput(userlist, {
        preventDuplicates: true,
        hintText: '',
        noResultsText: 'Sonuç bulunamadý',
        searchingText: 'Aranýyor',
        resultsLimit: 5,
        propertyToSearch: "name",
        resultsFormatter: function(item){
            return "<li>" + "<div style='padding-left: 8px;'><div class='id' style='float: left; font-weight: bold; color: hsl(331, 71%, 52%); margin-right: 3px; width: 20px; text-align: center;'> " + item.id + 
            " </div><div class='name' style='color: hsl(0, 0%, 29%);'> " + item.name + " </div></div></li>"
        },
        tokenFormatter: function(item) {
            return "<li><p><b>" + item.name + "</b></p></li>"
        },
        onAdd: function(){
            setUserArray(false);
        }
    })
    
    setUserArray = function(isInclude){
        user1_arr = [];
        user2_arr = [];
        var arr = {};
        var _this = "#usr1";
        var _other = "#usr1";
        
        if(isInclude){
            _other = "#usr2";
        }else{
            _this = "#usr2";
        }
        
        $(_other).tokenInput("clear");
        $(_this).focus();
        arr = obj2arr($(_this).tokenInput("get"));
        (isInclude)?(user1_arr=arr):(user2_arr=arr);
        sendData.user1 =  JSON.stringify(user1_arr);
        sendData.user2 =  JSON.stringify(user2_arr);
        
    }
    
    function obj2arr(obj){
        return $.map(obj, function (value, key) {
            return value["name"];
        });
    }
    
    $('#token-input-usr1').attr('disabled','disabled');
    $('#token-input-usr1').attr('placeholder','Dahil');
                
    $('#token-input-usr2').attr('disabled','disabled');
    $('#token-input-usr2').attr('placeholder','Hariç');
                
            
    $(".ip_type_select").click(function(){
        $('.ip_type_select').removeClass('ico-radio-checked');
        $('.ip_type_select').addClass('ico-radio-unchecked');
        $(this).removeClass('ico-radio-unchecked');
        $(this).addClass('ico-radio-checked');
        $('.ip_input').attr('disabled','disabled');
        sendData.ip_mode = $(this).attr('value');
    });
           
    $(".user_type_select").click(function(){
        $('.user_type_select').removeClass('ico-radio-checked');
        $('.user_type_select').addClass('ico-radio-unchecked');
        $(this).removeClass('ico-radio-unchecked');
        $(this).addClass('ico-radio-checked');
        $('.user_input').attr('disabled','disabled');
                    
        $('#token-input-usr1').attr('disabled','disabled');
        $('#token-input-usr2').attr('disabled','disabled');
        sendData.user_mode = $(this).attr('value');
    });
                
    $(".time_type_select").click(function(){
        $('.time_type_select').removeClass('ico-radio-checked');
        $('.time_type_select').addClass('ico-radio-unchecked');
        $(this).removeClass('ico-radio-unchecked');
        $(this).addClass('ico-radio-checked');
        $('.time_input').attr('disabled','disabled');
        startDateTextBox.datetimepicker('setDate', (new Date(Date.now()-parseInt($(this).attr('value'))*1000)));
        endDateTextBox.datetimepicker('setDate', (new Date()));
        sendData.time1 = $('#time1').val();
        sendData.time2 = $('#time2').val();
    });
                
    $(".status_type_select").click(function(){
        if(!$(this).hasClass('disabled')){
            $('.status_type_select').removeClass('ico-radio-checked');
            $('.status_type_select').addClass('ico-radio-unchecked');
            $('.status_type_check').addClass('disabled')
            $(this).removeClass('ico-radio-unchecked');
            $(this).addClass('ico-radio-checked');
            sendData.status_mode = $(this).attr('value');
        }
    });
                
    $(".region_type_select").click(function(){
        $('.region_type_select').removeClass('ico-radio-checked');
        $('.region_type_select').addClass('ico-radio-unchecked');
        $(this).removeClass('ico-radio-unchecked');
        $(this).addClass('ico-radio-checked');
        sendData.region_mode = $(this).attr('value');
    });
                
                
    $("#suspect").click(function(){
        if ($(this).hasClass('ico-unchecked')){
            $(this).removeClass('ico-unchecked');
            $(this).addClass('ico-checked');
            $('.suspect_type_radio').removeClass('disabled');
            sendData.suspect_mode = 1;
        }else{
            $(this).removeClass('ico-checked');
            $(this).addClass('ico-unchecked');
            $('.suspect_type_radio').addClass('disabled');
            sendData.suspect_mode = 0;
        }
        enableStatusSelection(!$(".misc_type_check.ico-checked").length > 0);
    });
                
    $("#often").click(function(){
        if ($(this).hasClass('ico-unchecked')){
            $(this).removeClass('ico-unchecked');
            $(this).addClass('ico-checked');
            $('.often_type_select').removeClass('disabled');
            sendData.often_mode = $('.often_type_select.ico-radio-checked').attr('value');
        }else{
            $(this).removeClass('ico-checked');
            $(this).addClass('ico-unchecked');
            $('.often_type_select').addClass('disabled');
            sendData.often_mode = 0;
        }
        enableStatusSelection(!$(".misc_type_check.ico-checked").length > 0 );
    });
    
    function enableStatusSelection(enabled){
        if(enabled){
            $('.status_type_select').removeClass('disabled');
            $('.status_type_check').removeClass('disabled');
        }else{
            sendData.status_mode =  $('#opt_status').attr('value');
            status_arr = [parseInt($('#error').attr('value'))];
            sendData.status =  JSON.stringify(status_arr);
            
            $('.status_type_select.ico-radio-checked').removeClass('ico-radio-checked').addClass('ico-radio-unchecked');
            $('#opt_status').removeClass('ico-radio-unchecked').addClass('ico-radio-checked');
            $('.status_type_check').removeClass('ico-checked').addClass('ico-unchecked');
            $('#error').removeClass('ico-unchecked').addClass('ico-checked');
            
            $('.status_type_select').addClass('disabled');
            $('.status_type_check').addClass('disabled');
        }
    }
                
    $('.suspect_type_radio').click(function(){
        if(!$(this).hasClass('disabled')){
            $('.suspect_type_radio').removeClass('ico-radio-checked');
            $('.suspect_type_radio').addClass('ico-radio-unchecked');
            $(this).removeClass('ico-radio-unchecked')
            $(this).addClass('ico-radio-checked')
            sendData.suspect = $(this).attr('value') ;
        }
    });
               
    $('.often_type_select').click(function(){
        if(!$(this).hasClass('disabled')){
            $('.often_type_select').removeClass('ico-radio-checked')
            $('.often_type_select').addClass('ico-radio-unchecked')
            $(this).removeClass('ico-radio-unchecked')
            $(this).addClass('ico-radio-checked')
            sendData.often_mode = $(this).attr('value');
        }
    });
                
                
    $('#opt_status').click(function(){
        $('.status_type_check').removeClass('disabled');
    })
                
    $('.status_type_check').click(function(){
        if(!$(this).hasClass('disabled')){
            var val = parseInt($(this).attr('value'));
            if($(this).hasClass('ico-checked')){
                if(status_arr.length != 1){
                    status_arr.splice( jQuery.inArray(val, status_arr), 1 );
                    $(this).removeClass('ico-checked')
                    $(this).addClass('ico-unchecked')
                }
            }else{
                status_arr.push(val);
                $(this).removeClass('ico-unchecked')
                $(this).addClass('ico-checked')
            }
            sendData.status = JSON.stringify(status_arr);
        }
    });
                
    $('#opt_usr1').click(function(){
        $('#token-input-usr1').removeAttr('disabled');
        $('#token-input-usr2').removeAttr('disabled');
    });
                
    $('#opt_usr2').click(function(){
        $('#usr3').removeAttr('disabled');
        $('#usr4').removeAttr('disabled');
    });
    
    $('#usr3').blur(function(){
        sendData.user1 = $(this).val();
    } );

    $('#usr4').blur(function(){
        sendData.user2 = $(this).val();
    });
         
         
    $("#sip").click(function(){
        $("#single_ip").removeAttr('disabled');
    })
            
    $("#opt_ip").click(function(){
        $("#ip1, #ip2").removeAttr('disabled');
    })
               
            
                
    $('#opt_time').click(function(){
        $('.time_input').removeAttr('disabled');
    });
                
    $('.apply_type_check').click(function(){
        if($(this).hasClass('ico-unchecked')){
            $(this).removeClass('ico-unchecked');
            $(this).addClass('ico-checked');
            sendData.old_mode = '1';
        }else{
            $(this).removeClass('ico-checked');
            $(this).addClass('ico-unchecked');
            sendData.old_mode = '0';
        }
    })        
});