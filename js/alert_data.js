/* 
?action=insert
&threshold=1000&interval=00-24
&keylist=['kelime1','kelime2','kelime3']
&alarmName=alarmIsmi
&emails=['johndoe@company.com', 'noname@mysite.com']
&mobileNumbers=['905068787152', '9053091787150']
&userId=63
*/



request = "?action=getlist&user_id=63";
response1 = [
    {
        alarmName: 'sehirler',
        active: 1,
        isNew: 1,
        keylist: ["istanbul", "ankara", "izmir"],
        interval: '01-08',
        treshold: 'low',
        emails: ['johndoe@company.com', 'noname@mysite.com'],
        mobilenumbers: ['905068787152', '9053091787150'],
        trigger_times: {
            1231: {
                date: '2013-08-28 12:05:00',
                count: 19745
            },
            1231: {
                date: '2013-08-28 1505:00',
                count: 11745
            },
            1231: {
                date: '2013-08-29 08:05:00',
                count: 13745
            },
            1231: {
                date: '2013-08-29 13:45:00',
                count: 15400
            },
            1231: {
                date: '2013-08-29 22:05:00',
                count: 11545
            },
            1231: {
                date: '2013-08-30 07:05:00',
                count: 13670
            },
            1231: {
                date: '2013-08-30 20:05:00',
                count: 44087
            }}
    },
    {
        alarmname: 'kanallar',
        active: 0,
        isNew: 0,
        keylist: ["atv", "show tv", "kanald"],
        interval: '00-24',
        treshold: 'low',
        emails: ['johndoe@company.com', 'noname@mysite.com'],
        mobilenumbers: ['905068787152', '9053091787150'],
        trigger_times: {
            1231: {
                date: '2013-08-28 12:05:00',
                count: 19745
            },
            1231: {
                date: '2013-08-28 1505:00',
                count: 11745
            },
            1231: {
                date: '2013-08-29 08:05:00',
                count: 13745
            },
            1231: {
                date: '2013-08-29 13:45:00',
                count: 15400
            },
            1231: {
                date: '2013-08-29 22:05:00',
                count: 11545
            },
            1231: {
                date: '2013-08-30 07:05:00',
                count: 13670
            },
            1231: {
                date: '2013-08-30 20:05:00',
                count: 44087
            }}
    }
];


