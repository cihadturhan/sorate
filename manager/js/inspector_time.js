$().ready(function(){
                
    startDateTextBox.datetimepicker({ 
        onClose: function(dateText, inst) {
            var testStartDate = startDateTextBox.datetimepicker('getDate');
            var testEndDate = endDateTextBox.datetimepicker('getDate');
            if (testStartDate > testEndDate)
                endDateTextBox.datetimepicker('setDate', testStartDate);
            sendData.time1 = $('#time1').val();
        },
        onSelect: function (selectedDateTime){
            endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') );
            sendData.time1 = $('#time1').val();
        },
        stepMinute: 5,
        closeText: 'Kapat',
        prevText: '&#x3c;geri',
        nextText: 'ileri&#x3e;',
        monthNames: ['Ocak','�ubat','Mart','Nisan','May�s','Haziran',
        'Temmuz','A�ustos','Eyl�l','Ekim','Kas�m','Aral�k'],
        monthNamesShort: ['Oca','�ub','Mar','Nis','May','Haz',
        'Tem','A�u','Eyl','Eki','Kas','Ara'],
        dayNames: ['Pazar','Pazartesi','Sal�','�ar�amba','Per�embe','Cuma','Cumartesi'],
        dayNamesShort: ['Pz','Pt','Sa','�a','Pe','Cu','Ct'],
        dayNamesMin:   ['Pz','Pt','Sa','�a','Pe','Cu','Ct'],
        currentText: 'G�ncel Zaman',
        timeOnlyTitle: 'Zaman� Se�in',
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
            var testStartDate = startDateTextBox.datetimepicker('getDate');
            var testEndDate = endDateTextBox.datetimepicker('getDate');
            if (testStartDate > testEndDate)
                startDateTextBox.datetimepicker('setDate', testEndDate);
            sendData.time2 = $('#time2').val();
        },
        onSelect: function (selectedDateTime){
            startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate') );
            sendData.time2 = $('#time2').val();
        },
        stepMinute: 5,
        closeText: 'Kapat',
        prevText: '&#x3c;geri',
        nextText: 'ileri&#x3e;',
        monthNames: ['Ocak','�ubat','Mart','Nisan','May�s','Haziran',
        'Temmuz','A�ustos','Eyl�l','Ekim','Kas�m','Aral�k'],
        monthNamesShort: ['Oca','�ub','Mar','Nis','May','Haz',
        'Tem','A�u','Eyl','Eki','Kas','Ara'],
        dayNames: ['Pazar','Pazartesi','Sal�','�ar�amba','Per�embe','Cuma','Cumartesi'],
        dayNamesShort: ['Pz','Pt','Sa','�a','Pe','Cu','Ct'],
        dayNamesMin: ['Pz','Pt','Sa','�a','Pe','Cu','Ct'],
        currentText: 'G�ncel Zaman',
        timeOnlyTitle: 'Zaman� Se�in',
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
                
    startDateTextBox.datetimepicker('setDate', (new Date(Date.now()-2*60*60*1000))); //2 years
    endDateTextBox.datetimepicker('setDate', (new Date()));
    startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate') );
    endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') );
                
});