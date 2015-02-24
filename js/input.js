var delimeter = ',';
var allModuleList = [], allChannels = [], categoryList;
var addTab, tabs;
var tabTemplate = "<li> <a href='#{href}' id= '#{id}'> #{label} <span> #{no} </span> </a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
var user_id = 63;
var user_name = 'cihad.turhan';
var lang_array = {"user_name":"User Name","password":"Password","login":"LOGIN","is_a_sorate":" is a registered trademark of SBT. All rights reserved.  ","type_to":"Type to add.","last":"Last","hour":"hour","time_interval":"Time Interval","minute":"minute","new_tweets":"new tweets.","auto_update":"Auto Update","hi":"Hi","new_report":"New Report","ad_interval":"Ad Interval","cumulative":"cumulative","tweet_broadcast":"Tweet Broadcast","choose_date":"Choose Date","choose_channel":"Choose Channel","color":"Color","group_name":"Group Name","words":"Words","tweets":"tweets","remove":"Remove","lang":"en","choose_program":"Choose Program","m":"m","hr":"hr","all":"All","total_tweets":"Total Tweets","unique_users":"Unique Users","rank":"Rank","logout":"Logout","feedback":"Feedback","user":"User","comment":"Comment","attach_pictures":"Attach pictures (jpeg, png ve gif):","send":"Send","sending":"Sending...","sent":"Sent!","series":"Series","news":"News","entertainment":"Entertainment","sport":"Sport","categories":"Categories","columns":"Columns","selected":"Selected","reach":"Reach","retweets":"Retweets","list":"LIST","programs":"Programs","topics":"Topics","popular_tv":"Popular TV Programs","hourly":"Hourly","daily":"Daily","weekly":"Weekly","monthly":"Monthly","listing_criteria":"Listing Criteria","trending_topics":"Trending Topics","html_lang":"en","title_sorate":"soRate - Social Rating Measure Platform","err":"User name or password is wrong.","erra":"User is not active.","erro":"Session limit is full.","errt":"You have no permission in this time period.","no_tweet":"No tweet sent in this time period.","new_keyword":"New Keyword","hashtags":"Hashtags","channels":"Channels","choose_time":"Choose Time Interval","no_program":"No program found.","trending_topics_in":"Trending Topics in Here","heatmap":"Heatmap","cluster":"Cluster","map_type":"Map Type","others":"Others","is_a_sosyalim":"is a registered trademark of SOURCEONE. All rights reserved.  ","title_sosyalim":"sosyalimm - Social Rating Measure Platform","title_metis":"metis - Social Rating Measure Platform","is_a_metis":"is a registered trademark of Ngine. All rights reserved.  ","related_pictures":"Related Pictures","top_url":"Top URL Adresses","related_hashtags":"Top Hashtags","top_retweets":"Top Retweets","related_videos":"Top Videos","tweets_retweets":"Tweets / Retweets","top_users":"Top Users","selected_groups":"Selected Groups","share":"Share","social_rating":"Social Rating","social_reach":"Social Reach","interaction_ratio":"Interaction Ratio","precalculate":"Precalculating data...","date":"Date","total_engagement":"Total Engagement","top_mentions":"Top Mentions","example_mobile":"Example: 5061234567","example_email":"Example: johndoe@mail.com","count":"Count","mention":"Mention","tweet_count":"Tweet Count","user_fullname":"User Name","video":"Video","link":"Link","hashtag":"Hashtag","retweet":"Retweet","tweet_text":"Tweet","export":"Export","no_alerts":"You have no alerts.<br/> Start by creating new one.","new_alert":"Create New Alert","all_alerts":"All Alerts","alert_details":"Alert Details","close_panel":"Close this panel","alert_name":"Alert Name","email_adress":"Email Adresses","telephone_number":"Telephone Numbers","threshold":"Threshold","manual":"Manual","automatic":"Automatic","low":"Low","medium":"Medium","high":"High","night":"Night","day":"Day","all_day":"All Day","alerts":" alerts","edit_text":"Edit ","change_in_words":"You have made changes in words.\r\nAlert history will reset.\r\nDo you proceed?","change_in_treshold":"You have made changes in threshold.\r\nAlert history will reset.\r\nDo you proceed?","delete_alarm1":"Do you want to remove","delete_alarm2":"?","wrong_format":"You typed in wrong format.","no_alert":"No alerts.","alert_time":"Alert Time","save_changes":"Save Changes","delete_alert":"Delete This Alert","top_device":"Top Devices","tweetCount":"Tweet Count","uniqueUser":"Unique Users","socialReach":"Social Reach","totalEngagement":"Total Enagement","socialRating":"Social Rating","retweetCount":"Retweet Count","interactionRatio":"Interaction Ratio","repliesCount":"Reply Count","mean":"Mean","tweetCountExpl":"The number of  tweets that include the selected keywords","uniqueUserExpl":"The number of unique users tweeted the selected keywords","meanExpl":"The number of tweets  per user tweeted the selected keywords","retweetCountExpl":"Total number of retweets that include the selected keywords","repliesCountExpl":"Total number of replies that include the selected keywords","interactionRatioExpl":"The number of reweets, replies and mentions that include the selected keywords per twitter user","shareExpl":"The ratio of tweets that include the selected keywords among all tweets","socialRatingExpl":"The number of tweets that include the selected keywords per twitter user ","socialReachExpl":"The ratio of the users tweted the selected keywords among all twitter users","totalEngagementExpl":"Total number of retweets, replies and mentions that include the selected keywords","turkeyExpl":"Best rank in Turkey","worldExpl":"Best rank in the World","amrExpl":"AMR% value  (All Individuals)","shrExpl":"SHR value (All Individuals)","spam":"Spam","users":"Users","hits":"Hits","pictures":"Pictures","save_spam":"Save as spam","remove_spam":"Remove spam feature"};
allChannels = {"1": {"1": "TRT 1", "2": "Red"}, "2": {"1": "ATV", "2": "Green"}, "3": {"1": "FOX", "2": "Brown"}, "4": {"1": "SHOW TV", "2": "Yellow"}, "5": {"1": "KANAL D", "2": "Orange"}, "6": {"1": "KANAL 7", "2": "MediumSeaGreen"}, "7": {"1": "SAMANYOLU TV", "2": "LawnGreen"}, "8": {"1": "STAR TV", "2": "Aquamarine"}, "9": {"1": "NTV", "2": "RoyalBlue"}, "10": {"1": "CNN TÜRK", "2": "Chocolate"}, "11": {"1": "HABERTÜRK", "2": "DarkGreen"}, "12": {"1": "TRT HABER", "2": "DarkMagenta"}, "13": {"1": "TRT 3 GRUBU", "2": "CadetBlue"}, "14": {"1": "TRT ARAPÇA", "2": "DarkSalmon"}, "15": {"1": "TRT TÜRK", "2": "SeaGreen"}, "16": {"1": "TRT AVAZ", "2": "YellowGreen"}, "17": {"1": "TRT ANADOLU", "2": "Plum"}, "18": {"1": "TRT 6", "2": "Firebrick"}, "19": {"1": "TRT ÇOCUK / OKUL", "2": "Tomato"}, "20": {"1": "TRT BELGESEL", "2": "Cornsilk"}, "21": {"1": "TRT MÜZİK", "2": "DimGray"}, "22": {"1": "TRT OKUL", "2": "Fuchsia"}, "23": {"1": "FLASH TV", "2": "OliveDrab"}, "24": {"1": "TNT", "2": "Goldenrod"}, "25": {"1": "KANALTÜRK", "2": "IndianRed"}, "26": {"1": "TV 8", "2": "Olive"}, "27": {"1": "SAMANYOLU HABER", "2": "DarkCyan"}, "28": {"1": "TRT SPOR", "2": "Lime"}, "30": {"1": "TV2", "2": "Goldenrod"}};
categoryList = [{"ID": "1", "NAME": "DİZİ/FİLM", "ZINDEZ": "1"}, {"ID": "2", "NAME": "HABER", "ZINDEZ": "2"}, {"ID": "3", "NAME": "MAGAZİN/KÜLTÜR SANAT", "ZINDEZ": "3"}, {"ID": "4", "NAME": "DİĞER", "ZINDEZ": "4"}];


dateLang = {tr: {
        closeText: 'Kapat',
        prevText: '&#x3c;geri',
        nextText: 'ileri&#x3e;',
        monthNames: ['Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran',
            'Temmuz', 'Agustos', 'Eyl�l', 'Ekim', 'Kasim', 'Aralik'],
        monthNamesShort: ['Oca', 'Sub', 'Mar', 'Nis', 'May', 'Haz',
            'Tem', 'Agu', 'Eyl', 'Eki', 'Kas', 'Ara'],
        dayNames: ['Pazar', 'Pazartesi', 'Sali', '�arsamba', 'Persembe', 'Cuma', 'Cumartesi'],
        dayNamesShort: ['Pz', 'Pt', 'Sa', '�a', 'Pe', 'Cu', 'Ct'],
        dayNamesMin: ['Pz', 'Pt', 'Sa', '�a', 'Pe', 'Cu', 'Ct'],
        currentText: 'Güncel Zaman',
        timeOnlyTitle: 'Zamani Seçin',
        timeText: 'Zaman',
        hourText: 'Saat',
        minuteText: 'Dakika',
        weekHeader: 'Hf',
    },
    en: {}
};

highchartsLang = {tr: {
        months: ['Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran', 'Temmuz', 'Agustos', 'Eyl�l', 'Ekim', 'Kasim', 'Aralik'],
        shortMonths: ['Oca', 'Sub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ags', 'Eyl', 'Eki', 'Kas', 'Ara'],
        weekdays: ['Pazar', 'Pazartesi', 'Sali', '�arsamba', 'Persembe', 'Cuma', 'Cumartesi'],
        downloadJPEG: 'JPEG olarak kaydet',
        loading: 'Yükleniyor',
        downloadPDF: 'PDF olarak kaydet',
        downloadPNG: 'PNG olarak kaydet',
        downloadSVG: 'SVG olarak kaydet',
        exportButtonTitle: 'Vekt�r veya resim formatinda kaydet',
        printButtonTitle: 'Grafigi yazdir',
        rangeSelectorFrom: '',
        rangeSelectorTo: '-',
        rangeSelectorZoom: 'Aralik:'
    },
    en: {}
};

var sampleTweetData= {"404894442928476160":{"tweetText":"Herkese iyi haftalar Bugünkü yazımı paylaşıyorum:  BAŞBAKAN\u0027A AÇIK MEKTUP  http://t.co/5y6foPzAoZ #ÖğretmenlerMutsuzÇünkü #DershaneGerçeği","userProfileImage":"http://pbs.twimg.com/profile_images/378800000774042010/6421b4327dec7556ca2801bab62e93d6_normal.jpeg","userId":"2191116071","userName":"hsglxblgt10","tweetTime":"2013-11-25T08:48:52.000Z","fullName":"Ömer","isDeleted":"0"},"404894443402448896":{"tweetText":"MEB Bakanı:Başbakan\u0027ım.Artık yeter,inanmadıklarımı bana söyletme.Dershane kapatmak saçma,diyordu.Uyandım,sabah olmuş.#ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://pbs.twimg.com/profile_images/378800000765468133/713e943baec77ebf8a4dadeda43bc19a_normal.jpeg","userId":"447931180","userName":"emreus61","tweetTime":"2013-11-25T08:48:52.000Z","fullName":"emre usta ","isDeleted":"0"},"404894443532455936":{"tweetText":"Dershaneci:Kapatmayın   Öğrenci:Kapatmayın  Veli:Kapatmayın   okul:Kapatmayın   USTA:Herkesi dinledik KAPATIN  #ÖğretmenlerMutsuzÇünkü\u0027","userProfileImage":"http://pbs.twimg.com/profile_images/378800000667068993/e2e0ac83f19e7d30fcbcd5a9ba30b451_normal.jpeg","userId":"975189763","userName":"AyferUstaomer","tweetTime":"2013-11-25T08:48:52.000Z","fullName":"Ayfer Ustaomer","isDeleted":"0"},"404894444325203968":{"tweetText":"\u0027Yazar E.Şenlikoğlu dershaneleri savundu hedef oldu!\u0027 @senlikogluemine  http://t.co/vSQoEe0I0p @bugun  #ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://pbs.twimg.com/profile_images/378800000775146088/a27193ac671d7bddb0c1c5b13abb150a_normal.png","userId":"2209240447","userName":"erdoan2013","tweetTime":"2013-11-25T08:48:52.000Z","fullName":"ela erdoğan","isDeleted":"0"},"404894445352779776":{"tweetText":"#ÖğretmenlerMutsuzÇünkü okulların hali içler acısı.","userProfileImage":"http://pbs.twimg.com/profile_images/378800000736025469/10049ed72924ce6af6d67fe4f2df6cc7_normal.jpeg","userId":"1088710993","userName":"kocbekir35","tweetTime":"2013-11-25T08:48:53.000Z","fullName":"Bekir Koç","isDeleted":"0"},"404894445533138944":{"tweetText":"Sübhânallah!  Elhamdülillâh!  Allahû Ekber!  Lâ ilâhe illallâh,  Muhammedür Resûlullâh!  #ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://abs.twimg.com/sticky/default_profile_images/default_profile_4_normal.png","userId":"2208542648","userName":"cinga32","tweetTime":"2013-11-25T08:48:53.000Z","fullName":"cinga","isDeleted":"0"},"404894447064076288":{"tweetText":"3 bin 858 dershaneden sadece %20\u0027si dönüşüme uygun!  #DershaneGerçeği eki bugün bayilerde.. #ÖğretmenlerMutsuzÇünkü http://t.co/0ECOhuTQ25\u0027","userProfileImage":"http://pbs.twimg.com/profile_images/378800000784000192/bdf3bf1da3405725be763540d6601144_normal.jpeg","userId":"2212499317","userName":"davutdavut06","tweetTime":"2013-11-25T08:48:53.000Z","fullName":"davut davut","isDeleted":"0"},"404894449152839680":{"tweetText":"@cbabdullahgul Sayın C Başkanım Dershaneye gariban aile çocukları gidiyor zengin özel ders alıyor yanlışa dur demeli #ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://pbs.twimg.com/profile_images/378800000778678755/327c360f43694c37e20a8cf6b348cf38_normal.jpeg","userId":"608502270","userName":"kadirmus","tweetTime":"2013-11-25T08:48:53.000Z","fullName":"mustafa çiçek","isDeleted":"0"},"404894449249320960":{"tweetText":"#ÖğretmenlerMutsuzÇünkü  \u0027Bana birharföğretenin kölesi olurum\u0027 diyenler öğretmenlerin ekmek teknesine kilit vuruyor. http://t.co/xVDq5Spjlw”","userProfileImage":"http://pbs.twimg.com/profile_images/378800000424245158/7707d23b4d913eeefc464d6747a09d4c_normal.png","userId":"625558825","userName":"Bedia4156","tweetTime":"2013-11-25T08:48:53.000Z","fullName":"Bedia Işık","isDeleted":"0"},"404894449547108352":{"tweetText":"Sağlıkta dönüşüm özel hastaneler kapatılarak mı başlandı? #ÖğretmenlerMutsuzÇünkü #DershaneGerçeği\u0027","userProfileImage":"http://pbs.twimg.com/profile_images/378800000619190700/ff3e59d1fb58e220517f3ef2b627f42c_normal.jpeg","userId":"966542803","userName":"Jasminrhn","tweetTime":"2013-11-25T08:48:54.000Z","fullName":"Jasmin rhn","isDeleted":"0"},"404894451078037504":{"tweetText":"Adem Yavuz Arslan, Akit\u0027in takiyyesini fena yakalamış... #ÖğretmenlerMutsuzÇünkü http://t.co/yItBUpMuVx","userProfileImage":"http://pbs.twimg.com/profile_images/2839641563/deb10b88688cbaefe8f1cec6c9a1066a_normal.jpeg","userId":"943127102","userName":"alp5740","tweetTime":"2013-11-25T08:48:54.000Z","fullName":"ALP EGEMEN","isDeleted":"0"},"404894451950448640":{"tweetText":"56) Bu niyetimizin tahakkuku için elimizden gelen her meşru vesileyi değerlendirecek; ++ #ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://pbs.twimg.com/profile_images/1208677422/12302_383759635052_550885052_3713989_2567176_n_normal.jpg","userId":"234511333","userName":"alitayyarmaras","tweetTime":"2013-11-25T08:48:54.000Z","fullName":"alitayyar","isDeleted":"0"},"404894453241892864":{"tweetText":"#DershaneGerçeği   BİZ BÖYLE OLMAMALIYDIK...  #ÖğretmenlerMutsuzÇünkü NE OLDU BİZE ...","userProfileImage":"http://pbs.twimg.com/profile_images/378800000312435141/a3f0cf81caa6fe86788a8ac9dbcbba89_normal.jpeg","userId":"200609756","userName":"enginyuce58","tweetTime":"2013-11-25T08:48:54.000Z","fullName":"Engin Yüce","isDeleted":"0"},"404894454139846656":{"tweetText":"Bugünkü birinci sayfamız: #DershaneGerçeği eki bugün bayilerde...  #ÖğretmenlerMutsuzÇünkü http://t.co/WbqqtYc0Jz","userProfileImage":"http://pbs.twimg.com/profile_images/378800000743860579/aac1209e9ee65a17df11203a7f7d4af1_normal.jpeg","userId":"2196418951","userName":"emurat35","tweetTime":"2013-11-25T08:48:55.000Z","fullName":"murat gülmez","isDeleted":"0"},"404894455133896704":{"tweetText":"Prof.Dr.Mehmet Öz: Oslo\u0027da pazarlık iddiası vahim http://t.co/s9fd4y37LG #ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://pbs.twimg.com/profile_images/378800000756359433/90af80b24d12f98281ec65cf69c21eef_normal.png","userId":"2200986019","userName":"dershan22638551","tweetTime":"2013-11-25T08:48:55.000Z","fullName":"dershane","isDeleted":"0"},"404894456710983680":{"tweetText":"İftiracı diyenler buyrun Bakan sizi yalanlıyor :) http://t.co/QHoF7TdZ0a #ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://pbs.twimg.com/profile_images/3117665174/81b365e95f82067e87166968b5125443_normal.jpeg","userId":"977279966","userName":"yakisikliprens0","tweetTime":"2013-11-25T08:48:55.000Z","fullName":"Mehmet.","isDeleted":"0"},"404894457851437057":{"tweetText":"Etüt merkezlerini kes-yapıştır sırasında yanlışlıkla koyduk http://t.co/KnQMxdLOb3 @zamancomtr aracılığıyla - #ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://pbs.twimg.com/profile_images/2891277653/5f0915966c8f1f4af1c8b11095ae48c2_normal.jpeg","userId":"931483328","userName":"cobanbesir","tweetTime":"2013-11-25T08:48:55.000Z","fullName":"BEŞİR ÇOBAN","isDeleted":"0"},"404894462012567552":{"tweetText":"#ÖğretmenlerMutsuzÇünkü. Ehl-i siyaset onları rantcı zannediyor.Oysa onlar ve dersaneleri alınan paraları başka çocuklara harcıyor","userProfileImage":"http://pbs.twimg.com/profile_images/2552818896/image_normal.jpg","userId":"128969116","userName":"alagozhakan","tweetTime":"2013-11-25T08:48:57.000Z","fullName":"hakan alagöz","isDeleted":"0"},"404894463194968064":{"tweetText":"ingilizce kursu serbest, Türkçe kursu yasak mı olacak?  #ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://pbs.twimg.com/profile_images/2962318684/1c55df49be9667cd612491f38e4f1463_normal.jpeg","userId":"145599598","userName":"fahreddingurbuz","tweetTime":"2013-11-25T08:48:57.000Z","fullName":"Fahreddin GÜRBÜZ","isDeleted":"0"},"404894464885669888":{"tweetText":"“@ntfnmv_hamza: Ekrem Dumanlı\u0027dan Başbakan\u0027a açık mektup bugün ZAMAN\u0027da...   #ÖğretmenlerMutsuzÇünkü @Dumanlie http://t.co/ol9QxoJG6H\u0027”","userProfileImage":"http://pbs.twimg.com/profile_images/378800000780182719/6f0e8ecfe868746ba5ea3555fb68755a_normal.jpeg","userId":"2211177253","userName":"rabia45_","tweetTime":"2013-11-25T08:48:57.000Z","fullName":"RABİA ÇARIK","isDeleted":"0"},"404894465263173632":{"tweetText":"#ÖğretmenlerMutsuzÇünkü fedakarca çalışan öğretmenler, öz yurdunda öz vatanında parya muamesi görüyor.","userProfileImage":"http://pbs.twimg.com/profile_images/378800000753493944/aa6be98bb1b082fba7c93e26ccf377a9_normal.jpeg","userId":"2194732070","userName":"nehirbircan","tweetTime":"2013-11-25T08:48:57.000Z","fullName":"nehir kaya","isDeleted":"0"},"404894465485471744":{"tweetText":"Cirpindikca KUCULUYORSUNUZ!!! Devam edin!!! #ÖğretmenlerMutsuzÇünkü http://t.co/1GP97mLt6a","userProfileImage":"http://pbs.twimg.com/profile_images/378800000104262652/7b5cffa7fa491a9a71d51ecc7ed68ee7_normal.jpeg","userId":"361820018","userName":"buneykisimdi","tweetTime":"2013-11-25T08:48:57.000Z","fullName":"Moody Blue","isDeleted":"0"},"404894465502228480":{"tweetText":"#ÖğretmenlerMutsuzÇünkü BA Gündüz\u0027Görüşeceğiz\u0027dedi BB Akşam\u0027bu iş bitti,kapanacak\u0027dedi Görüşmeyene mektup yazılır.. http://t.co/kaiNfF5Nj3","userProfileImage":"http://abs.twimg.com/sticky/default_profile_images/default_profile_4_normal.png","userId":"2208542648","userName":"cinga32","tweetTime":"2013-11-25T08:48:57.000Z","fullName":"cinga","isDeleted":"0"},"404894466869587968":{"tweetText":"@cbabdullahgul Sayın C Başkanım Dershaneye gariban aile çocukları gidiyor zengin özel ders alıyor yanlışa dur demeli #ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://pbs.twimg.com/profile_images/3695637838/9c7a6b0ab4d7bbf0990243e7ece39a4b_normal.jpeg","userId":"1449237128","userName":"ERKUTYILMAZENG","tweetTime":"2013-11-25T08:48:58.000Z","fullName":"ERKUT YILMAZ","isDeleted":"0"},"404894467213524992":{"tweetText":"57) ++ illa bunlardan biri ya da birkaçı kapatılacak olursa, ++ #ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://pbs.twimg.com/profile_images/1208677422/12302_383759635052_550885052_3713989_2567176_n_normal.jpg","userId":"234511333","userName":"alitayyarmaras","tweetTime":"2013-11-25T08:48:58.000Z","fullName":"alitayyar","isDeleted":"0"},"404894469436477440":{"tweetText":"A.Y.Arslan\u0027dan Akit\u0027e osmanli tokadi: http://t.co/g7nkdODYn5 Akit Sol-Aydinlik ve\u0027israil ajani\u0027tarafi da basiyormus #ÖğretmenlerMutsuzÇünkü\u0027","userProfileImage":"http://pbs.twimg.com/profile_images/378800000012309165/fc82073796edea728043c11a412e6952_normal.jpeg","userId":"208664548","userName":"ariza_06","tweetTime":"2013-11-25T08:48:58.000Z","fullName":"KIRIK KANAT #pesdedi","isDeleted":"0"},"404894469935230977":{"tweetText":"Fiyatlar ne kadar, dönüşüm mümkün mü?  http://t.co/xtvEhb9HdD @zamancomtr aracılığıyla  #DershaneGerçeği #ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://pbs.twimg.com/profile_images/378800000500630764/fa36372f36dd82f2519106d105b04185_normal.jpeg","userId":"186991468","userName":"BOZDUMANOMER","tweetTime":"2013-11-25T08:48:58.000Z","fullName":"ÖMER BOZDUMAN","isDeleted":"0"},"404894470338260992":{"tweetText":"Allah\u0027ım! bize karşı haddini aşanlara, adavet besleyenlere, komplo kuranlara bizi hiç muhtaç etme.. #DershaneGerçeği #ÖğretmenlerMutsuzÇünkü","userProfileImage":"http://pbs.twimg.com/profile_images/3641041232/09dab6a95fb46c5630b639a4430e55a7_normal.jpeg","userId":"943139054","userName":"SemihMenzilci","tweetTime":"2013-11-25T08:48:58.000Z","fullName":"SemihMenzilci","isDeleted":"0"},"404894472338948096":{"tweetText":"A.Y.Arslan\u0027dan Akit\u0027e osmanli tokadi: http://t.co/g7nkdODYn5 Akit Sol-Aydinlik ve\u0027israil ajani\u0027tarafi da basiyormus #ÖğretmenlerMutsuzÇünkü\u0027","userProfileImage":"http://pbs.twimg.com/profile_images/378800000784000192/bdf3bf1da3405725be763540d6601144_normal.jpeg","userId":"2212499317","userName":"davutdavut06","tweetTime":"2013-11-25T08:48:59.000Z","fullName":"davut davut","isDeleted":"0"},"404894472817090560":{"tweetText":"#ÖğretmenlerMutsuzÇünkü öğretmenler odasında grup seks için yeterli imkan yok.","userProfileImage":"http://pbs.twimg.com/profile_images/378800000762071821/4e62e755372208c298dc357b628c816d_normal.jpeg","userId":"2180935947","userName":"yesilyurt_omer","tweetTime":"2013-11-25T08:48:59.000Z","fullName":"dadash2525","isDeleted":"0"}};

$().ready(function(){
    $('body').append($('<canvas>').attr('id','canvas').css('display','none'));
});
/*
 
 
 ['{{repeat(5,10)}}',
 {
 "keyword": [ '{{repeat(1,10)}}',
 '{{lorem(1,words)}}'
 ], 
 "interval": function(){
 var levels = ['08-24', '00-08', '00-24'];
 var number = this.numeric(0,2);
 return levels[number];
 }, 
 "alarmName": '{{lorem(1,words)}}', 
 "mobilenumbers": ['{{repeat(5,10)}}','{{phone(050xxxxxxxx)}}'
 ], 
 "active": '{{bool}}', 
 "treshold": function(){
 var levels = ['low', 'medium', 'high'];
 var number = this.numeric(0,3);
 if(number<3)
 return levels[number];
 else return this.numeric(1000,30000);
 }, 
 "emails": ['{{repeat(-1,10)}}', '{{email(true)}}'], 
 "trigger_times": ['{{repeat(-1,10)}}',
 {
 "date": '{{date(2013-08-dd hh:mm:ss)}}', 
 "count": '{{numeric(1000,30000)}}', 
 "id": '{{numeric(1000,30000)}}',
 "isNew": '{{bool}}'
 }
 ]
 }
 ]
 
 
 */