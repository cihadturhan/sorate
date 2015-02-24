//Panel modulunun sahte ismi
delimeter = ',';

Dashboard2 = function(container) {
    this.response = {};
    this.tweetList = {};
    this.newAddedKeys = [];
    this.currentTweetKey = "";
    this.container = container;
    this.chart = null;
    this.timers = [];
    this.processing = false;
    this.ready = false;
    this.dataQuery = {
        starttime: current().subtract('days', 1).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endtime: current().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        keylist: '{list:[""]}',
        mod: 'dashboard2'
    };
    this.keylist = [""];
    this.xhrPool = [];
    this.subModules = [];
    this.allKeylist = {};
    this.key = "";
    this.filetype = 'xlsx';
    this.xlsData = {
        general: {},
        0: null,
        1: null,
        2: null,
        3: null,
        4: null
    };
};



Dashboard2.prototype.animateContainers = Common.prototype.animateContainers;
Dashboard2.prototype.$ = Common.prototype.$;
Dashboard2.prototype.myGet = Common.prototype.myGet;
Dashboard2.prototype.loadKeygroup = Common.prototype.loadKeyGroup;
Dashboard2.prototype.resetKeygroup = Common.prototype.resetKeyGroup;
Dashboard2.prototype.downloadKeylist = Common.prototype.downloadKeylist;
Dashboard2.prototype.uploadKeylist = Common.prototype.uploadKeylist;
Dashboard2.prototype.updateGroupList = Common.prototype.updateGroupList;
Dashboard2.prototype.addKeyGroupListeners = Common.prototype.addKeyGroupListeners;

Dashboard2.prototype.datetimeIntervalPicker = Common.prototype.datetimeIntervalPicker;

Dashboard2.prototype.excelExport = Common.prototype.excelExport;
Dashboard2.prototype.addExportButton = Common.prototype.addExportButton;

Dashboard2.prototype.initialize = function() {
    var This = this;
    $().ready(function() {
        This.prepareDOM();
    });
};

Dashboard2.prototype.destroy = function() {

};

Dashboard2.prototype.stop = function() {

};

Dashboard2.prototype.resume = function() {

};



Dashboard2.prototype.prepareDOM = function() {
    var This = this;
    var containers = ['.toplist_summary', '.main_graph_container', '.instant_summary', '.main_right'];
    this.animateContainers(containers);

    var $container = this.$('.packery');
    subModule.parent = $container;
    $container.packery({
        columnWidth: 330,
        rowHeight: 330,
        isResizeBound: false
    });
    $container.packery('bindUIDraggableEvents', $container.children());

    var pckry = $container.data('packery');

    /* **/
    var gutter = pckry.options.gutter || 0;
    var columnWidth = pckry.options.columnWidth + gutter;

    function onResize() {
        var outsideSize = $container.parent().innerWidth();
        var cols = Math.floor(outsideSize / (columnWidth));
        // set container width to columns
        $container.css('width', (cols * columnWidth - gutter) + 'px');
        // manually trigger layout
        pckry.layout();
    }

    // debounce resize event
    var resizeTimeout;
    $(window).on('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(onResize, 100);
    });

    onResize();
    subModule.parentModule = This;

    this.subModules = [
        new subModule({
            title: lang_array['related_pictures'],
            resize: 'e s',
            default: '42',
            data: [],
            type: 'dataTable',
            columns: [{text: lang_array['pictures'], tag: '<a>'}, {text: lang_array['hits']}],
            options: {
                mode: 'top_pictures',
                size: 100,
                export: true,
                exportOrder: 4
            }
        }),
        new subModule({
            title: lang_array['top_url'],
            resize: 'e s',
            default: '42',
            data: [],
            type: 'dataTable',
            columns: [{text: 'URL', tag: '<a>'}, {text: lang_array['hits']}],
            options: {
                mode: 'top_url',
                size: 100,
                export: true,
                exportOrder: 2
            }
        }),
        new subModule({
            title: lang_array['related_hashtags'],
            resize: 'e s',
            default: '24',
            data: [],
            type: 'dataTable',
            columns: {key: {text: 'Hashtag', builder: function(key, value, data) {
                        return '#' + data[key][value];
                    }}, value: {text: lang_array['hits']}},
            options: {
                mode: 'related_htags',
                size: 100,
                export: true,
                exportOrder: 0
            }
        }),
        new subModule({
            title: lang_array['top_retweets'],
            resize: 'e s',
            default: '24',
            data: [],
            type: 'tweetTable',
            options: {
                mode: 'top_rt',
                size: 100,
                export: true,
                exportOrder: 1
            }
        }),
        new subModule({
            title: lang_array['related_videos'],
            resize: 'e s',
            default: '24',
            data: [],
            type: 'dataTable',
            columns: {key: {text: 'Video', builder: function(key) {
                        return $('<a>').attr({href: key, target: '_blank'}).html(key);
                    }}, value: {text: 'Hits', builder: function(key, value, data) {
                        return data[key];
                    }}},
            options: {
                mode: 'top_videos',
                size: 100
            }
        }),
        new subModule({
            title: lang_array['tweets_retweets'],
            resize: 'es',
            default: '22',
            data: [],
            type: 'chart',
            subtype: 'pie',
            options: {
                mode: 'tweet_retweets',
                size: 100
            }
        }),
        new subModule({
            title: lang_array['top_users'],
            resize: 'e s',
            default: '24',
            data: [],
            type: 'dataTable',
            columns: {key: {text: lang_array['user']}, value: {text: lang_array['hits']}},
            options: {
                mode: 'top_users',
                size: 100,
                tag: '<a>',
                export: true,
                exportOrder: 3
            }
        })];

    for (var i = 0; i < This.subModules.length; i++) {
        This.subModules[i].request(
                (function() {
                    return subModule.prototype.init;
                })()
                );
    }
    this.createXLSData();


    this.downloadKeylist();
    this.addKeyGroupListeners({
        minLength: -1,
        add: function(key) {
            var keyArray = Object.keys(This.allKeylist), keylist;
            if ($.inArray(key, keyArray) >= 0) {
                keylist = This.allKeylist[key].keylist;
            } else {
                keylist = [key];
            }
            This.key = key;
            This.keylist = keylist;
            var obj = {};
            if (key.length === 0) {
                key = 'list';
            }
            obj[key] = keylist;
            This.dataQuery.keylist = JSON.stringify(obj);
            This.request();
        }
    });

    this.$('button[name=add_kw]').removeAttr('disabled');

//    this.addDayListener(function(date) {
//        This.dataQuery.date = moment(date).format('YYYY-MM-DD');
//    });
//    
    this.datetimeIntervalPicker({}, function(start, end) {
        This.dataQuery.starttime = moment(start).format('YYYY-MM-DD HH:mm:ss');
        This.dataQuery.endtime = moment(end).format('YYYY-MM-DD HH:mm:ss');
    });


    This.$('input[name=daypicker]').datepicker(('setDate'), current().format('YYYY-MM-DD'));

};


Dashboard2.prototype.createXLSData = function() {
    var start = moment(this.dataQuery.date).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            end = moment(this.dataQuery.date).endOf('day').format('YYYY-MM-DD HH:mm:ss');

    this.xlsData.general = {
        queryDate: [start, end],
        groupName: this.key,
        keywords: this.keylist
    };

};

Dashboard2.prototype.request = function() {
    var This = this;
    for (var i = 0; i < this.subModules.length; i++) {
        this.subModules[i].request(subModule.prototype.update, function() {
            This.$('button[name=add_kw]').removeAttr('disabled');
//            if (This.$('button.export').length === 0)
//                This.addExportButton(This.$('.export_container'));
        });
    }
};

Dashboard2.prototype.reset = function() {
    this.tweetCount = 0;
    this.timers = [];
    this.response = {};
};

/*
 tw = new subModule({
 title: 'Top Words',
 resize: 's',
 default: '24',
 data: topWords,
 type: 'chart',
 subtype: 'bar'
 }).init();
 
 ta = new subModule({
 title: 'Tweets/Retweets',
 resize: 'es',
 default: '22',
 data: tweetAnalyze,
 type: 'chart',
 subtype: 'pie'
 }).init();
 
 wCloud = new subModule({
 title: 'Tag Cloud',
 resize: 'es',
 default: '22',
 data: tagCloudHT,
 type: 'wordCloud'
 }).init();
 
 ta2 = new subModule({
 title: 'Top Users',
 resize: 's',
 default: '22',
 data: topUsers,
 type: 'chart',
 subtype: 'bar'
 }).init();
 
 ta3 = new subModule({
 title: 'Top Mention',
 resize: 's',
 default: '22',
 data: topMention,
 type: 'chart',
 subtype: 'bar'
 }).init();
 
 ta4 = new subModule({
 title: 'Top Reply',
 resize: 's',
 default: '24',
 data: topReply,
 type: 'chart',
 subtype: 'bar'
 }).init();
 
 ta5 = new subModule({
 title: 'Top Sources',
 resize: 'es',
 default: '22',
 data: topSources,
 type: 'chart',
 subtype: 'pie'
 }).init();
 
 imgs = new subModule({
 title: 'Related Pictures',
 resize: 'es',
 default: '22',
 data: imageSlider,
 type: 'imgSlider',
 lightbox: This.$('.imageviewer')
 }).init();
 
 vids = new subModule({
 title: 'Related Videos',
 resize: 'es',
 default: '22',
 data: videoPlayer,
 type: 'videoPlayer'
 }).init();
 
 ta6 = new subModule({
 title: 'All Tweets',
 default: '24',
 data: tweets,
 type: 'tweetTable'
 }).init();
 ta7 = new subModule({
 title: 'Top Retweets',
 resize: 's',
 default: '22',
 data: topRetweets,
 type: 'tweetTable'
 }).init();
 ta8 = new subModule({
 title: 'Top URL Adresses',
 resize: 'e',
 default: '22',
 data: topUrl,
 type: 'dataTable',
 columns: ['URL', 'Hits']
 }).init();
 
 taLine = new subModule(
 {
 title: 'Tweet Timeline',
 resize: 's',
 default: '42',
 data: lineData,
 type: 'chart',
 subtype: 'line'
 }
 ).init();
 
 taRandom = new subModule(
 {
 title: 'Random Table',
 resize: 'e',
 default: '22',
 data: randomTable,
 type: 'dataTable',
 columns: [{text: 'One'}, {text: ' Hideable ', w4: true}, {text: ' Three '}, {text: 'Hideable', w4: true}, {text: 'Five'}, {text: 'Six'}, {text: 'Seven'}]
 }
 ).init();
 
 */
/*
 //tweettable
 var topRetweets = {"359570720273084417": {"tweetText": "@Muveyik kardo kendi face ne veriyolar sana geliyo iste mucahit uveyik yaziyo qr kodu var yazdiriyosun gidiyosun", "userId": "1012697318", "userName": "abdullahaktasA7", "tweetTime": "2013-07-23T10:08:34.000+03:00", "fullName": "Abdullah AKTAS"}, "359571063711076354": {"tweetText": "Mali\u0027den de hapishane baskini haberi... 130 mucahit kurtarildi 116 asker olduruldu. Zulum hapishanelerinde bayram erken geldi elhamdulillah", "userId": "1372502011", "userName": "myldrm80", "tweetTime": "2013-07-23T10:09:56.000+03:00", "fullName": "myldrm80"}, "359572371503460352": {"tweetText": "Mali\u0027den de hapishane baskini haberi... 130 mucahit kurtarildi 116 asker olduruldu. Zulum hapishanelerinde bayram erken geldi elhamdulillah", "userId": "456015395", "userName": "FatihAktas_92", "tweetTime": "2013-07-23T10:15:08.000+03:00", "fullName": "Fatih Aktaş"}, "359575665495916546": {"tweetText": "muhtemelen Cuma namazindan. seni bizlere nasip edenden Allah razi olsun. Mucahit Moussa Sow! http://t.co/QHwrW7pjBE", "userId": "592084141", "userName": "ibrahimais", "tweetTime": "2013-07-23T10:28:13.000+03:00", "fullName": "ibrahim akay"}, "359576269286948866": {"tweetText": "Eksi Sozluk ozur dilemis. Mucahit fenolara kocaman bi FAV!", "userId": "190040927", "userName": "furkanbolukbasi", "tweetTime": "2013-07-23T10:30:37.000+03:00", "fullName": "Kyuubi no Kitsune"}, "359576695365320704": {"tweetText": "Tezgahtara \u0027Pantolon ne kadar\u0027 dedim, \u002790 tl\u0027 dedi \u0027size 32\u0027 yaziyo banane dedim, Allahtan hizli kosuyorum.. :D mucahit", "userId": "297039995", "userName": "davutak", "tweetTime": "2013-07-23T10:32:19.000+03:00", "fullName": "davut akviranlı"}, "359580516590174209": {"tweetText": "@HsynSnmTurgut 30 temmuz da gelicem de 2 gun hastanede oyalanirim 1 agustos aksam hep birlikte yapalim mucahit te geliyor", "userId": "898153716", "userName": "HsynSnmTurgut", "tweetTime": "2013-07-23T10:47:30.000+03:00", "fullName": "HsynSnm *-,-*"}, "359581528457625600": {"tweetText": "Mali\u0027den de hapishane baskini haberi... 130 mucahit kurtarildi 116 asker olduruldu. Zulum hapishanelerinde bayram erken geldi elhamdulillah", "userId": "1289087172", "userName": "betulkrgl", "tweetTime": "2013-07-23T10:51:31.000+03:00", "fullName": "bötööl"}};
 var tweets = {"359582241694818304": {"tweetText": "Fikret Orman\u0027a gore Besiktas stadini \u0027Tokisiz mokisiz\u0027 yapacakmis. Biz Arena\u0027nin yapiminda devlete yuzlerce milyon kazandirdik, siz?", "userId": "1391912394", "userName": "Arena1905org", "tweetTime": "2013-07-23T10:54:21.000+03:00", "fullName": "Arena1905"}, "359582247776555008": {"tweetText": "+ Mutlulugu aciklar misin? - FENERBAHCE", "userId": "1103006996", "userName": "eliifdiyorkiii", "tweetTime": "2013-07-23T10:54:23.000+03:00", "fullName": "Elif Çebi"}, "359582259264757760": {"tweetText": "fenerbahce cardozo alamadi. madem beceremiceksin niye bize o kadar umut verdin yonetim?", "userId": "308504508", "userName": "BehzatPinar", "tweetTime": "2013-07-23T10:54:25.000+03:00", "fullName": "Behzat Pınar"}, "359582263052214272": {"tweetText": "cArsi Besiktas sevdalisidir ve sivil toplum kurulusudr ulke yangin yeriyken ses cikartmayan dilsiz seytandir", "userId": "212181053", "userName": "Burakof", "tweetTime": "2013-07-23T10:54:26.000+03:00", "fullName": "kötükenan"}, "359582263601659904": {"tweetText": "@Oto_Rent_A_Car @currogol Arkadasim ve ben bir Real Murcia Vs list Sampiyonlar ligi izlemek 2016 yilinda Istanbul\u0027da olacak.", "userId": "221597651", "userName": "Mikiriver", "tweetTime": "2013-07-23T10:54:27.000+03:00", "fullName": "Miguel Angel Del Rio"}, "359582267493994496": {"tweetText": "I\u0027m at Fenerbahce Orduevi (Istanbul, Turkiye) http://t.co/58JPkzwG3I", "userId": "519827245", "userName": "BatuhanKalann", "tweetTime": "2013-07-23T10:54:27.000+03:00", "fullName": "Batuhan Kalan"}, "359582296740855809": {"tweetText": "@gokhanceliik gunaydin Fenerbahce cumhuriyetinin evladi @elifcetin85 @ergul1988 @elifff27 @EmreCoraa @ottoman_turco", "userId": "1013204827", "userName": "yamurgren1", "tweetTime": "2013-07-23T10:54:34.000+03:00", "fullName": "yağmur gören"}, "359582305947369472": {"tweetText": "@Fenerbahce Baskan Hani alirdin istedigin ouuncuyu 14 milyon veriyosan 15 milyonda verebilirsin !!", "userId": "1444470157", "userName": "FenerbhceSK", "tweetTime": "2013-07-23T10:54:37.000+03:00", "fullName": "Fenerbahce United "}, "359582316370198528": {"tweetText": "Yildirim\u0027dan Cardozo aciklamasi: Fenerbahce Baskani Aziz Yildirim\u0027dan transfer sezonunun basindan beri adi Fen... http://t.co/GfNLhdQchs", "userId": "47070156", "userName": "borsagundem", "tweetTime": "2013-07-23T10:54:39.000+03:00", "fullName": "borsagundem"}, "359582321617289216": {"tweetText": "Besiktas Baskani Orman: Gezi Parki eylemlerine katilan Carsi yanlis yapti | soL Haber Portali http://t.co/MRiFGZp79s", "userId": "447499281", "userName": "T_unca", "tweetTime": "2013-07-23T10:54:40.000+03:00", "fullName": "Tunca Özlen"}, "359582325174050817": {"tweetText": "Bugun list ile karsilasacak olan Malaga\u0027da forvet Santa Cruz, verdigi poz ile listlilari kizdiracak.. http://t.co/PWRqvZNMPr", "userId": "1058596040", "userName": "AbcDuygu", "tweetTime": "2013-07-23T10:54:41.000+03:00", "fullName": "DuyguStar"}, "359582329452232706": {"tweetText": "@SporMansetTRT  Feneri anlariz sike yaptida besiktas neden UEFAdan ceza aldi", "userId": "1614474943", "userName": "EmreKaanALIKLI", "tweetTime": "2013-07-23T10:54:42.000+03:00", "fullName": "EmreKaan ALIKLI"}, "359582330177859584": {"tweetText": "Turkiye\u0027de sike yapilmadigindan beri lider ve sampiyon hic degismedi!..list...", "userId": "310239300", "userName": "enver_can", "tweetTime": "2013-07-23T10:54:42.000+03:00", "fullName": "enver can"}, "359582342592991233": {"tweetText": "Setelah Arsenal, Kemudian Liverpool, sekarang Chelsea, Celtik FC ma list Kapan", "userId": "269203011", "userName": "ucheinSzyareev", "tweetTime": "2013-07-23T10:54:45.000+03:00", "fullName": "@ucheinSzyareev"}, "359582348641185792": {"tweetText": "@gokhanceliik gunaydin Fenerbahce cumhuriyetinin evladi @elifcetin85 @ergul1988 @elifff27 @EmreCoraa @ottoman_turco", "userId": "306234619", "userName": "gokhanceliik", "tweetTime": "2013-07-23T10:54:47.000+03:00", "fullName": "GÖKHAN ÇELİK"}, "359582351174545408": {"tweetText": "Besiktas Baskani Orman: Gezi Parki eylemlerine katilan Carsi yanlis yapti | soL Haber Portali http://t.co/Yd40Yth8bG", "userId": "180327731", "userName": "aktas_derya", "tweetTime": "2013-07-23T10:54:47.000+03:00", "fullName": "derya aktas"}, "359582401522974720": {"tweetText": "tek gercek FENERBAHCE", "userId": "1329981950", "userName": "takmabile", "tweetTime": "2013-07-23T10:54:59.000+03:00", "fullName": "Erhan Oduncu"}, "359582407369822209": {"tweetText": "@SPORARTI fenerbahce Mevlut erdin\u0027ci kadrosuna katicak mi", "userId": "1603162286", "userName": "aygunalper1", "tweetTime": "2013-07-23T10:55:01.000+03:00", "fullName": "aygun alper"}, "359582411773841408": {"tweetText": "Gezicilerin hedefindeki son isim \u0027Carsi’nin sadece takimi desteklemesi lazim, eylemlere katilmak yanlis\u0027 diyen Besiktas Baskani Fikret Orman", "userId": "529252470", "userName": "TdTlay", "tweetTime": "2013-07-23T10:55:02.000+03:00", "fullName": "tülay emin"}, "359582416702148608": {"tweetText": "Fenerbahce Spor Kulubu ile 3 yillik sozlesme imzaladim. Insallah simdi hersey daha guzel olur :) http://t.co/Gz3qMXtbpx", "userId": "562337119", "userName": "CedricSacras", "tweetTime": "2013-07-23T10:55:03.000+03:00", "fullName": "Ca passe crème!"}, "359582420359593984": {"tweetText": "3 hece 8 harf, Sadece BESIKTAS http://t.co/gqbnW8mixy", "userId": "113037224", "userName": "BesiktasRuhu", "tweetTime": "2013-07-23T10:55:04.000+03:00", "fullName": "Beşiktaş Ruhu"}, "359582424054759424": {"tweetText": "Gunaydin Buyuk Fenerbahce Taraftari.!  TakibeDegeriz Cunku FENERBAHCEliyiz", "userId": "202107547", "userName": "topraktanem", "tweetTime": "2013-07-23T10:55:05.000+03:00", "fullName": "Sultan Sayın"}, "359582430329450496": {"tweetText": "Bu arada Besiktas neden bir macini Kadikoy bir macini Kasimpasa\u0027da oynamiyor ? Ayni hesap degil mi ? Samimiyet testi buradan belli oluyor", "userId": "179655651", "userName": "MetinTutcu", "tweetTime": "2013-07-23T10:55:06.000+03:00", "fullName": "MetinTutcuoglu"}, "359582437459755009": {"tweetText": "\u0027Cardozo\u0027dan Vazgectik\u0027 http://t.co/NRSsXSzbtW TekAsk FENERBAHCE GerisiHikaye TakibeDegeriz Cunku FENERBAHCEliyiz", "userId": "1572400440", "userName": "emlakkulisim", "tweetTime": "2013-07-23T10:55:08.000+03:00", "fullName": "emlakkulisim"}, "359582449405132800": {"tweetText": "10 numara formasi ve Fenerbahce bayragi basucunda... #MekaninCennetOlsunEmirEfe http://t.co/fU1YFmeshj", "userId": "482136968", "userName": "hayriyeece", "tweetTime": "2013-07-23T10:55:11.000+03:00", "fullName": "Hαуяiyє Öztürk"}, "359582469588123648": {"tweetText": "\u0027Carsi Grubu siyasi bir olusum degil. Ayrica Besiktas da siyasi bir kulup degil.\u0027\u0027 demis Fikret. Stada asilan pankart icin ne yaptin ?", "userId": "133472867", "userName": "ozkansarioglu", "tweetTime": "2013-07-23T10:55:16.000+03:00", "fullName": "Ozkan Sarioglu"}};
 
 //bar
 var tweetAnalyze = [{key: 'tweets', value: 80}, {key: 'retweets', value: 20}];
 var topHashtags = [{key: 'Flaş', value: 122}, {key: 'Turkey', value: 118}, {key: 'SonDakika', value: 113}, {key: 'Syria', value: 109}, {key: 'BaskbakanlikYanGorsume', value: 80}, {key: 'ArakanicinELELE', value: 68}, {key: 'AirCrash', value: 48}, {key: 'Crysis', value: 48}, {key: 'korkanCNNTURK', value: 40}, {key: 'C', value: 31}];
 var topWords = [{key: 'rt', value: 5343}, {key: 't', value: 3267}, {key: 'co', value: 3093}, {key: 'http', value: 3091}, {key: 'baskbakan', value: 1823}, {key: 've', value: 1528}, {key: 'suriye', value: 1464}, {key: 'yap', value: 1099}, {key: 'bir', value: 1035}, {key: 'ol', value: 888}];
 var topUsers = [{key: 'MehmetArslan', value: 69}, {key: 'Muammet_Serif', value: 69}, {key: 'Nihat_H', value: 69}, {key: 'gtelsoz', value: 68}, {key: 'kakbas', value: 68}, {key: 'MehmetCebiturk', value: 68}, {key: 'denizengn1907', value: 67}, {key: 'esraonayli', value: 67}, {key: 'kitapgibikz', value: 67}, {key: 'PabloAimarr', value: 67}];
 var topMention = [{key: 'fenerovic', value: 573}, {key: 'cuneytozdemir', value: 196}, {key: 'Seumavi', value: 156}, {key: 'dipnottv', value: 132}, {key: 'Haberturk', value: 122}, {key: 'Konyaninnabzi', value: 111}, {key: 'Hurrıyet', value: 106}, {key: 'KızılHackerLAR', value: 104}, {key: 'kuyumcuender', value: 103}, {key: 'serdalakınan', value: 86}];
 var topReply = [{key: '06melihgokcek', value: 90}, {key: 'RT_Erdogan', value: 21}, {key: 'GSB_SuatKilic', value: 12}, {key: 'cuneytozdemır', value: 10}, {key: 'Ladyimam', value: 9}, {key: 'KrediYurtlrGnMd', value: 6}, {key: 'onderaytac', value: 6}, {key: 'hilalcebeciii', value: 5}, {key: 'memetsımsek', value: 5}, {key: 'Turuncu_Time', value: 5}];
 var topSources = [{key: 'web', value: 4064}, {key: 'iPhone', value: 1544}, {key: 'Android', value: 742}, {key: 'twitterfeed', value: 684}, {key: 'Mobile Web', value: 548}, {key: 'BlackBerry(R)', value: 387}, {key: 'TweetDeck', value: 218}, {key: 'Tweet Button', value: 211}, {key: 'Facebook', value: 211}, {key: 'iPad', value: 156}];
 
 //table
 var topUrl = [['http://www.hurriyet.com.tr/anasayfa/', 84], ['http://gez.io/9454', 83], ['http://www.konyatv.com.tr/anasayfa/', 12], ['http://www.dipnottv.com.tr', 64], ['http://fb.me/Jklsdafqaso', 44], ['http://www.radikal.com.tr/haber81231', 38], ['http://bit.ly/Nasdfa', 31], ['http://fb.me/2342aa', 29], ['http://fb.me/1wa23a', 28], ['http://t.co/tasd23f', 22]];
 var randomTable = [[368, 191, 417, 211, 360, 536, 248], [545, 24, 431, 258, 114, 256, 327], [201, 197, 568, 202, 489, 262, 318], [387, 371, 416, 348, 242, 551, 374], [533, 142, 425, 94, 435, 570, 291], [375, 468, 437, 160, 367, 347, 236], [112, 356, 97, 327, 513, 505, 315]];
 
 //tagcloud
 var tagCloudPW = [{key: 'Flaş', value: 122}, {key: 'Turkey', value: 118}, {key: 'SonDakika', value: 113}, {key: 'Syria', value: 109}, {key: 'BaskbakanlikYanGorsume', value: 80}, {key: 'ArakanicinELELE', value: 68}, {key: 'AirCrash', value: 48}, {key: 'Crysis', value: 48}, {key: 'korkanCNNTURK', value: 40}, {key: 'C', value: 31}];
 
 //line
 var lineData = {"2013-07-22 12:55:00": {"list": 11}, "2013-07-22 12:56:00": {"list": 4}, "2013-07-22 12:57:00": {"list": 14}, "2013-07-22 12:58:00": {"list": 6}, "2013-07-22 12:59:00": {"list": 16}, "2013-07-22 13:00:00": {"list": 18}, "2013-07-22 13:01:00": {"list": 13}, "2013-07-22 13:02:00": {"list": 10}, "2013-07-22 13:03:00": {"list": 19}, "2013-07-22 13:04:00": {"list": 10}, "2013-07-22 13:05:00": {"list": 10}, "2013-07-22 13:06:00": {"list": 6}, "2013-07-22 13:07:00": {"list": 14}, "2013-07-22 13:08:00": {"list": 19}, "2013-07-22 13:09:00": {"list": 7}, "2013-07-22 13:10:00": {"list": 19}, "2013-07-22 13:11:00": {"list": 13}, "2013-07-22 13:12:00": {"list": 15}, "2013-07-22 13:13:00": {"list": 19}, "2013-07-22 13:14:00": {"list": 7}, "2013-07-22 13:15:00": {"list": 10}, "2013-07-22 13:16:00": {"list": 8}, "2013-07-22 13:17:00": {"list": 9}, "2013-07-22 13:18:00": {"list": 13}, "2013-07-22 13:19:00": {"list": 11}, "2013-07-22 13:20:00": {"list": 120}, "2013-07-22 13:21:00": {"list": 3}, "2013-07-22 13:22:00": {"list": 13}, "2013-07-22 13:23:00": {"list": 12}, "2013-07-22 13:24:00": {"list": 6}, "2013-07-22 13:25:00": {"list": 13}, "2013-07-22 13:26:00": {"list": 7}, "2013-07-22 13:27:00": {"list": 20}, "2013-07-22 13:28:00": {"list": 13}, "2013-07-22 13:29:00": {"list": 12}, "2013-07-22 13:30:00": {"list": 13}, "2013-07-22 13:31:00": {"list": 7}, "2013-07-22 13:32:00": {"list": 11}, "2013-07-22 13:33:00": {"list": 7}, "2013-07-22 13:34:00": {"list": 10}, "2013-07-22 13:35:00": {"list": 7}, "2013-07-22 13:36:00": {"list": 10}, "2013-07-22 13:37:00": {"list": 10}, "2013-07-22 13:38:00": {"list": 6}, "2013-07-22 13:39:00": {"list": 6}, "2013-07-22 13:40:00": {"list": 8}, "2013-07-22 13:41:00": {"list": 15}, "2013-07-22 13:42:00": {"list": 10}, "2013-07-22 13:43:00": {"list": 3}, "2013-07-22 13:44:00": {"list": 7}, "2013-07-22 13:45:00": {"list": 8}, "2013-07-22 13:46:00": {"list": 6}, "2013-07-22 13:47:00": {"list": 5}, "2013-07-22 13:48:00": {"list": 6}, "2013-07-22 13:49:00": {"list": 7}, "2013-07-22 13:50:00": {"list": 7}, "2013-07-22 13:51:00": {"list": 9}, "2013-07-22 13:52:00": {"list": 10}, "2013-07-22 13:53:00": {"list": 11}, "2013-07-22 13:54:00": {"list": 14}};
 
 */
//var videolinks = ["http://www.youtube.com/watch?v=_ZUoYdOoXkQ", "http://www.youtube.com/watch?v=01LhHcrGuy4", "http://www.youtube.com/watch?v=01LhHcrGuy4", "http://www.youtube.com/watch?v=122feLuEhto", "http://www.youtube.com/watch?v=122feLuEhto", "http://www.youtube.com/watch?v=2qPujc-N9Fo", "http://www.youtube.com/watch?v=2zNSgSzhBfM", "http://www.youtube.com/watch?v=3O1_3zBUKM8", "http://www.youtube.com/watch?v=5LEVrFNGwt4", "http://www.youtube.com/watch?v=bmrXFtkGjM4", "http://www.youtube.com/watch?v=BU4a4DNpwDg", "http://www.youtube.com/watch?v=DlQo2m69BT8", "http://www.youtube.com/watch?v=GdHZIBFfiMs", "http://www.youtube.com/watch?v=GdHZIBFfiMs", "http://www.youtube.com/watch?v=GdHZIBFfiMs", "http://www.youtube.com/watch?v=jdcHDKtdpHs", "http://www.youtube.com/watch?v=KqsX_ImLR4g", "http://www.youtube.com/watch?v=M3ccqBfARO4", "http://www.youtube.com/watch?v=M3ccqBfARO4", "http://www.youtube.com/watch?v=n-D1EB74Ckg", "http://www.youtube.com/watch?v=ow49zzdXpzs", "http://www.youtube.com/watch?v=paqHpDblkAo", "http://www.youtube.com/watch?v=PNetIFufahk", "http://www.youtube.com/watch?v=PNetIFufahk", "http://www.youtube.com/watch?v=QG6lPt0ra7A", "http://www.youtube.com/watch?v=rbFIoUFBMV8", "http://www.youtube.com/watch?v=TJAfLE39ZZ8", "http://www.youtube.com/watch?v=uoaBjHYsDAg", "http://www.youtube.com/watch?v=-UTNaWxI89c", "http://www.youtube.com/watch?v=X0vgHBUVWAU", "http://www.youtube.com/watch?v=xnfMmmrzaX4", "http://www.youtube.com/watch?v=ZYcTImiQYr0", "http://youtu.be/2P8Ni4fX41E", "http://youtu.be/2P8Ni4fX41E", "http://youtu.be/49Kh1mS4Fhs", "http://youtu.be/49Kh1mS4Fhs", "http://youtu.be/502sm-kftd8", "http://youtu.be/-8qifzv_F4Q", "http://youtu.be/92qJe6_CEWM", "http://youtu.be/9s6rd32Fj9w", "http://youtu.be/abWeJq_XlwA", "http://youtu.be/anonbV0CGzk?a", "http://youtu.be/BCZxDoaXIHE", "http://youtu.be/cm1PF9vwKIM", "http://youtu.be/DUT5rEU6pqM", "http://youtu.be/E6b5HsbCjJQ", "http://youtu.be/eNtDLH6Y-8Q", "http://youtu.be/F3RYvO2X0Oo", "http://youtu.be/FiotMATg3Cs", "http://youtu.be/FQ2yXWi0ppw", "http://youtu.be/fSKG_nxR1FQ", "http://youtu.be/GhHBrlCMJBI", "http://youtu.be/HJRxc6xLvRw", "http://youtu.be/IH06lB2xQ9Q", "http://youtu.be/JhueI4gybM4", "http://youtu.be/K9ESJIV5wGI", "http://youtu.be/kQ8talas-j8", "http://youtu.be/lJXhxvJBeX0", "http://youtu.be/lW8WWPVqsJ4", "http://youtu.be/m2G3trEgsyE", "http://youtu.be/NtOyWTNkd-c", "http://youtu.be/oGo3Hc4NQes", "http://youtu.be/oGo3Hc4NQes", "http://youtu.be/oGo3Hc4NQes", "http://youtu.be/oGo3Hc4NQes", "http://youtu.be/oLi4DnYD4iA", "http://youtu.be/opBgHi6iMg0", "http://youtu.be/RBumgq5yVrA", "http://youtu.be/R--GZahl97k", "http://youtu.be/SR6iYWJxHqs", "http://youtu.be/t31Nd15S6Ac", "http://youtu.be/tIKG-kOxF7M", "http://youtu.be/TzCOjvm77Q0", "http://youtu.be/u2oPOmzvgRU", "http://youtu.be/V7vJ4lYBUp8?a", "http://youtu.be/wCVrC7Dg2qo", "http://youtu.be/xNOq4Ku8MaQ", "http://youtu.be/YnPDAyHdvIc", "http://youtu.be/YnPDAyHdvIc", "https://www.youtube.com/watch?v=0hyfHES4Qi8", "https://www.youtube.com/watch?v=5G21I9ZS03k", "https://www.youtube.com/watch?v=8C0l2Bd8au0", "https://www.youtube.com/watch?v=hOxXHONI5Dk", "https://www.youtube.com/watch?v=Igk3MD7hltU", "https://www.youtube.com/watch?v=KmxaY_OVvWA", "https://www.youtube.com/watch?v=ktvTqknDobU", "https://www.youtube.com/watch?v=PBZfCmlRIVs", "https://www.youtube.com/watch?v=pkcJEvMcnEg", "https://www.youtube.com/watch?v=TzFKJzq5HuM", "https://www.youtube.com/watch?v=WQDRxeqPeJM", "https://www.youtube.com/watch?v=ys7hv-xT0jw", "https://www.youtube.com/watch?v=ZlWsdR5O0KQ", "https://www.youtube.com/watch?v=ZlWsdR5O0KQ", "https://www.youtube.com/watch?v=ZlWsdR5O0KQ", "https://www.youtube.com/watch?v=ZlWsdR5O0KQ", "https://www.youtube.com/watch?v=ZlWsdR5O0KQ", "https://www.youtube.com/watch?v=ZlWsdR5O0KQ", "http://vimeo.com/7006013", "http://vimeo.com/7006932", "http://vimeo.com/7021865", "http://vimeo.com/7031260", "http://vimeo.com/7053471", "http://vimeo.com/7059375", "http://vimeo.com/7059580", "http://vimeo.com/7063480", "http://vimeo.com/7069242", "http://vimeo.com/7070083", "http://vimeo.com/7070854", "http://vimeo.com/7071476", "http://vimeo.com/7071672", "http://vimeo.com/7072165", "http://vimeo.com/7072261", "http://vimeo.com/7072423", "http://vimeo.com/70729887", "http://vimeo.com/7074282", "http://vimeo.com/7074377", "http://vimeo.com/7074624", "http://vimeo.com/7075172", "http://vimeo.com/7075602", "http://vimeo.com/7075804", "http://vimeo.com/ahmedeid/farazkha", "http://vimeo.com/cococarbomb/reelalligat", "http://vimeo.com/nathicastro/babyturtle", "http://vimeo.com/pixle/foldif", "http://vimeo.com/shainblum/mirro", "https://vimeo.com/5701800", "https://vimeo.com/6161531", "https://vimeo.com/7071812", "https://vimeo.com/70718125beni", "https://vimeo.com/7073957", "http://www.dailymotion.com/video/x125nx4_20130722", "http://www.dailymotion.com/video/x11pxzc_eng-sub-130707-exo-1000-songs-challenge-cut_music", "http://www.dailymotion.com/video/xkpyum_ya-nebi-selam-aleyke-mahir-zain-turkce_music", "http://www.dailymotion.com/video/xuaey2_lana-del-rey-ride-official-video-hd-1080p_music", "http://www.dailymotion.com/video/xf0160_lezginka_music", "http://www.dailymotion.com/video/xrjczm_yasar-kurt-ver-bana-duslerimi-2012-cover_music", "http://www.dailymotion.com/video/xugq3j_coskun-yildiz-bugun-benim-olum-degil-dugun-gunum-anne-siir-erkan-celik_music", "http://www.dailymotion.com/video/x11m6yi_firuze-2013-tarkan_music", "http://www.dailymotion.com/video/x123wb5_engsub-130719-sehun-chanyeol-royal-villa-sitcom_shortfilms", "http://www.dailymotion.com/video/x12549v_gumulcine-sel-video-2_news", "http://www.dailymotion.com/video/x1256yf_sibel-mustafaoglu-melekli-koyunde_news", "http://www.dailymotion.com/video/xrjf5c_firat-med-roboski_music", "http://www.dailymotion.com/video/x12549v_gumulcine-sel-video-2_news", "http://www.dailymotion.com/video/x1256yf_sibel-mustafaoglu-melekli-koyunde_news", "http://www.dailymotion.com/video/xrho9u_bizim-gencler-yilmaz-yilmaz_music", "http://www.dailymotion.com/video/x1256yf_sibel-mustafaoglu-melekli-koyunde_news", "http://www.dailymotion.com/video/x125deo_2013-sgc-ftisland-cut_lifestyle", "http://www.dailymotion.com/video/xcufwd_collateral-murder-us-army-by-wikile_news", "http://www.dailymotion.com/video/xkjrls_galibi-zikri-berat-kandili-2011_shortfilms", "http://www.dailymotion.com/video/xcufwd_collateral-murder-us-army-by-wikile_news", "http://www.dailymotion.com/video/x11dnga_yasmin-levy-sevda-2013-hd-klip-by-meleklererkekolur_shortfilms", "http://www.dailymotion.com/video/x4etz3_ezginin-gunlugu-eksik-bir-sey_music", "http://www.dailymotion.com/video/xdyafr_martha-wainwright-chante-la-foule-d_music", "http://www.dailymotion.com/video/xf0dp6_omer-faruk-tekbilek-last-moments-of_music", "http://www.dailymotion.com/video/xe148n_dino-le-daye_music", "http://www.dailymotion.com/video/xid9yz_halit-bilgic-2011-album-dil-dixwaze-here-cenge-21-nisan-2011_music", "http://www.dailymotion.com/video/xdynvl_halit-bilgic-ozgurluk-cicegimsin_music", "http://www.dailymotion.com/video/x11xi6r_wearerdogan_webcam?start=5", "http://www.dailymotion.com/video/xlz57f_candan-ercetin-bahane-kedi_animals", "http://www.dailymotion.com/video/xuekqf_koma-roj-diren-ha-diyarbekir-diren_music", "http://www.dailymotion.com/video/xlz57f_candan-ercetin-bahane-kedi_animals", "http://www.dailymotion.com/video/x122oj5_bi-denge-servaneke-ypg-serekaniye-ypg-hat-ji-te-re-mizgin-e_news", "http://www.dailymotion.com/video/xue5lw_koma-awaze-ciya-pkk-ne-", "http://www.dailymotion.com/video/xkeop2_ozan-dogulu-feat-atiye-askistan-2011-yeni_music", "http://www.dailymotion.com/video/xum5si_www-halkseslide-com-zap-zap-zape_music", "http://www.dailymotion.com/video/xctdjr_moby-in-my-heart-live_music", "http://www.dailymotion.com/video/x11r09j_jay-z-holy-grail-featuring-justin-timberlake_music", "http://touch.dailymotion.com/video/x26fd7_madonna-take-a-bow_music", "http://www.dailymotion.com/video/x19i2f_ilhan-sesen-sarilinca-sana_music", "http://www.dailymotion.com/video/x94rmi_cuppeli-ahmet-hoca-ali-riza-demirca_news", "http://www.dailymotion.com/video/x124nwy_star-king-hugh-jackman-sistar-loving-u_shortfilms", "http://www.dailymotion.com/video/xfnmbu_meyan-gitme-sana-muhtacim_music", "http://www.dailymotion.com/video/xzq1ph_mabel-matiz-matizin-sarkisi_music", "http://touch.dailymotion.com/video/xadixl_seni-andim-bu-gece-kulaklarin-cinla_music", "http://www.dailymotion.com/video/xd55nk_kahreks-fizyoterapistler-meslek-yas_lifestyle", "http://www.dailymotion.com/video/xjd7ik_son-nefesim-kolpa_fun", "http://www.dailymotion.com/video/xkcqvc_kayserispor-org-kayserispor-5-6-trabzonspor-1997-98_sport", "http://www.dailymotion.com/video/xbz80i_ibrahim-erkal-gulum_music", "http://www.dailymotion.com/video/x125pnu_gulsah-tan-can-a-dogum-gunu-kutlamasi_people", "http://www.dailymotion.com/video/xkcqvc_kayserispor-org-kayserispor-5-6-trabzonspor-1997-98_sport", "http://www.dailymotion.com/video/xuqgfi_ne-zaman-didim-haciiiii_fun", "http://touch.dailymotion.com/video/xdc1h9_ozgun-zilli-2009_music", "http://www.dailymotion.com/video/x100njv_wahabies-bomb-blast-on-mazar-and-masjid-of-sahabi-hazrat-khalid-bin-waleed_news", "http://www.dailymotion.com/video/xmzayx_ankarali-coskun-ankaranin-baglari-orjinal-klip_music", "http://www.dailymotion.com/video/xblufi_osman-ozbek-skandal-aciklamalarda-b_news", "http://www.dailymotion.com/video/xxt37h_lana-del-rey-summertime-sadness-cedric-gervais-remix_music", "http://www.dailymotion.com/video/xdt8uw_ezginin-gunlugu-kanto-bana-bir-koca_music", "http://www.dailymotion.com/video/xvv61k_yalin-olmasa-da-olur_music", "http://www.dailymotion.com/video/xtg5n1_sami-yusuf-mother_music", "http://touch.dailymotion.com/video/x2lmzc_pink-floyd-learning-to-fly_music", "http://www.dailymotion.com/video/x1o87v_tina-turner-what-s-love-got-to-do-w_music", "http://www.dailymotion.com/video/x121a5t_flas-bu-konusmadan-sonra-meclis-tatilini-yarida-kesti-acil-toplanm", "http://www.dailymotion.com/video/x1254tj_goal-wesley-sneijder-vs-malaga_sport", "http://touch.dailymotion.com/video/x7x12q_yilmaz-celik-biya-duri_shortfilms", "http://www.dailymotion.com/video/xdvqdl_ezginin-gunlugu-sehir_music", "http://www.dailymotion.com/video/xl0k9b_mehmet-erdem-haydi-gidelim-eski-gunlere_music", "http://www.dailymotion.com/video/xcqeg3_mehmet-emin-tokadi-hazretleri-nin-d_lifestyle", "http://www.dailymotion.com/video/xhvcu7_resime-montaj-yapmak_shortfilms", "http://www.dailymotion.com/video/xo32y1_pinhani-ben-ki-sevmekten-hic-usanmam_music", "http://www.dailymotion.com/video/xmpurb_emre-behrem-bir-sana-kyzamadym_music", "http://www.dailymotion.com/video/xmpurb_emre-behrem-bir-sana-kyzamadym_music", "http://www.dailymotion.com/video/xmpurb_emre-behrem-bir-sana-kyzamadym_music", "http://www.dailymotion.com/video/xmpurb_emre-behrem-bir-sana-kyzamadym_music", "http://www.dailymotion.com/video/xmpurb_emre-behrem-bir-sana-kyzamadym_music", "http://www.dailymotion.com/video/xmpurb_emre-behrem-bir-sana-kyzamadym_music", "http://www.dailymotion.com/video/xmpurb_emre-behrem-bir-sana-kyzamadym_music", "http://www.dailymotion.com/video/xmpurb_emre-behrem-bir-sana-kyzamadym_music", "http://www.dailymotion.com/video/xmpurb_emre-behrem-bir-sana-kyzamadym_music", "http://www.dailymotion.com/video/xmpurb_emre-behrem-bir-sana-kyzamadym_music", "http://www.dailymotion.com/video/x125yy7_eglencenin-dibi-biz-laz-lar-heryer-de_people", "http://www.dailymotion.com/video/x8gqvl_volkan-konak-yarim-yarim-2009_music", "http://www.dailymotion.com/video/x6o2uu_talking-heads-psycho-killer-1984_music", "http://www.dailymotion.com/video/xjef9e_tara-jaff-aynur-doyan-xewn-ruya-dream_music", "http://www.dailymotion.com/video/x125j8c_we-said-goodbye-dave-maclean_music", "http://www.dailymotion.com/video/xz9eh2_eylul-yanginlari_music", "http://www.dailymotion.com/video/x125im9_higher-love-steve-winwood_music", "http://www.dailymotion.com/video/xl0k9b_mehmet-erdem-haydi-gidelim-eski-gunlere_music", "http://www.dailymotion.com/video/x124c9c_emperyal-oteli_music", "http://www.dailymotion.com/video/x125i54_every-time-you-go-away-paul-young_music", "http://www.dailymotion.com/video/xa3fb3_muazzez-ersoy-sevemez-kimse-seni_music", "http://www.dailymotion.com/video/x125gsp_as-rosas-nao-falam-fagner_music", "http://www.dailymotion.com/video/x125ghp_black-orchid-stevie-wonder_music", "http://www.dailymotion.com/video/x11fhlv_artik-yeter-film-fragmani_shortfilms", "http://www.dailymotion.com/video/x8w1tt_yildiz-tilbe-askin-benden-de-ote_music", "http://www.dailymotion.com/video/x125ga8_chris-norman-bonnie-bianco-send-a-sign-to-my-heart_music", "http://www.dailymotion.com/video/xdq083_soner-arica-devlerin-aski_music", "http://www.dailymotion.com/video/x125fwi_glenn-mederios-nothing-gonna-change-my-love-for-you_music", "http://www.dailymotion.com/video/x125ffp_love-is-all-marc-anthony_music", "http://www.dailymotion.com/video/x1258i8_you-are-my-love-liverpool-express_music", "http://touch.dailymotion.com/video/xcy3e4_happy-birthday-to-you_shortfilms"]


var tags = [{key: 'Flaş', value: 122}, {key: 'Turkey', value: 118}, {key: 'SonDakika', value: 113}, {key: 'Syria', value: 70}, {key: 'BaskbakanlikYanGorsume', value: 80}, {key: 'ArakanicinELELE', value: 68}, {key: 'AirCrash', value: 48}, {key: 'Crysis', value: 48}, {key: 'korkanCNNTURK', value: 40}, {key: 'Ceylo', value: 31}];
var tags = [{"key": "YeniBirDünya", "value": "590452"}, {"key": "TürkçeOlimpiyatları", "value": "131318"}, {"key": "EvrenselBarış", "value": "74517"}, {"key": "nazar", "value": "61070"}, {"key": "naatgecesi", "value": "48737"}, {"key": "hooooop", "value": "47318"}, {"key": "sağduyu", "value": "30682"}, {"key": "doksanlar", "value": "30388"}, {"key": "GelinTanışOlalım", "value": "28858"}, {"key": "DERS", "value": "25106"}, {"key": "sağduyu", "value": "18620"}, {"key": "MelihGökçekeSorun", "value": "17429"}, {"key": "survivorfinal", "value": "16976"}, {"key": "hayalimdekitatil", "value": "13717"}, {"key": "istersen", "value": "13453"}, {"key": "çayerdalbakkaldaiçilir", "value": "10320"}, {"key": "TahtEldenGidiyor", "value": "10030"}, {"key": "oyunbitti", "value": "9894"}, {"key": "üçartıbir", "value": "9502"}, {"key": "sağduyu", "value": "9437"}, {"key": "üçartıbir", "value": "9153"}, {"key": "sağduyu", "value": "8682"}, {"key": "benokuldayken", "value": "5429"}, {"key": "sonarzum", "value": "5120"}, {"key": "benimhalaumudumvar", "value": "5027"}, {"key": "yakışır", "value": "4953"}, {"key": "karadayı", "value": "4902"}, {"key": "sağduyu", "value": "4421"}, {"key": "son20dakika", "value": "3940"}, {"key": "guzelcirkin", "value": "3066"}, {"key": "NikahMasası", "value": "3023"}, {"key": "benimkararım", "value": "3000"}, {"key": "leylailemecnun", "value": "2891"}, {"key": "sinsiplan", "value": "2554"}, {"key": "beniböylesev", "value": "2483"}, {"key": "3artı1", "value": "2359"}, {"key": "32", "value": "2107"}, {"key": "KalbiminSahibi", "value": "1910"}, {"key": "seksenler", "value": "1667"}, {"key": "aşkiçin", "value": "1329"}, {"key": "seksenler", "value": "1268"}, {"key": "GeziSonrası", "value": "1167"}, {"key": "3artı1", "value": "1151"}, {"key": "seksenler", "value": "1143"}, {"key": "ucartıbir", "value": "1058"}, {"key": "uzlaşı", "value": "976"}, {"key": "kardeşlikzamanı", "value": "942"}, {"key": "evlenirkenmutlaka", "value": "880"}, {"key": "sosyalmedya", "value": "861"}, {"key": "gerçeğinpeşinde", "value": "851"}, {"key": "arkasokaklar", "value": "798"}, {"key": "hasrettürküleri", "value": "745"}, {"key": "ÖtekiGündem", "value": "710"}, {"key": "siznedersiniz", "value": "693"}, {"key": "tatarramazan", "value": "691"}, {"key": "yerindeolsam", "value": "691"}, {"key": "tatarramazan", "value": "667"}, {"key": "tatarramazan", "value": "639"}, {"key": "DavutoğlunaSorun", "value": "556"}, {"key": "ÖtekiGündem", "value": "503"}, {"key": "şiddetekarşı", "value": "500"}, {"key": "herşeyyolundamerkez", "value": "449"}, {"key": "benimiçinüzülme", "value": "383"}, {"key": "buhafta", "value": "359"}, {"key": "BöyleBitmesin", "value": "352"}, {"key": "gıcıkolduklarımız", "value": "348"}, {"key": "pisyedili", "value": "338"}, {"key": "BizOsmanlıTokadıyız", "value": "319"}, {"key": "SakaryaFırat", "value": "314"}, {"key": "uefanınkararı", "value": "309"}, {"key": "sanskapıda", "value": "290"}, {"key": "kardeslikzamani", "value": "276"}, {"key": "kardeşlikzamani", "value": "276"}, {"key": "kardeşlikzamani", "value": "276"}, {"key": "kardeslikzamani", "value": "276"}, {"key": "kardeslikzamani", "value": "276"}, {"key": "ZenginKızFakirOğlan", "value": "275"}, {"key": "sanskapida", "value": "230"}, {"key": "yakıştık", "value": "229"}, {"key": "butatilde", "value": "225"}, {"key": "neolacak", "value": "215"}, {"key": "tatildemek", "value": "208"}, {"key": "OsmanlıTokadınıEnÇok", "value": "188"}, {"key": "kardeşlikzamanı", "value": "182"}, {"key": "kardeslikzamani", "value": "182"}, {"key": "kardeşlikzamanı", "value": "182"}, {"key": "galipdervis", "value": "177"}, {"key": "galipdervis", "value": "177"}, {"key": "delirmemekiçin", "value": "163"}, {"key": "ZenginKızFakirOğlan", "value": "140"}, {"key": "ÜniversiteMedya", "value": "131"}, {"key": "ÜniversiteMedya", "value": "130"}, {"key": "AnneOlmak", "value": "121"}, {"key": "yazsıcağı", "value": "117"}, {"key": "ÜniversiteMedya", "value": "115"}, {"key": "birfikrinmivar", "value": "106"}, {"key": "KarneHediyesi", "value": "101"}, {"key": "sanskapida", "value": "94"}, {"key": "ÜniversiteMedya", "value": "87"}, {"key": "ÜniversiteMedya", "value": "84"}, {"key": "ailemiçin", "value": "83"}, {"key": "sanskapıda", "value": "77"}, {"key": "ÜniversiteMedya", "value": "60"}, {"key": "salihkuşu", "value": "60"}, {"key": "sanskapida", "value": "59"}, {"key": "diyolog", "value": "57"}, {"key": "YolAyrımı", "value": "54"}, {"key": "salihkuşu", "value": "47"}, {"key": "Gürbüzüyedirtmeyiz", "value": "37"}, {"key": "YaEvdeYoksan", "value": "31"}, {"key": "cemalnursargutasorun", "value": "31"}, {"key": "yabanciceği", "value": "25"}, {"key": "yabanciceği", "value": "25"}, {"key": "nerdeoeski", "value": "22"}, {"key": "aramizdaengelyok", "value": "18"}, {"key": "yabançiçeği", "value": "16"}, {"key": "yabançiçeği", "value": "16"}, {"key": "aramizdaengelyok", "value": "15"}, {"key": "yakıstık", "value": "14"}, {"key": "mutfagım", "value": "14"}, {"key": "YolAyrımı", "value": "14"}, {"key": "YolAyrımı", "value": "13"}, {"key": "YolAyrımı", "value": "11"}, {"key": "gcseffafoda", "value": "11"}, {"key": "bencenostalji", "value": "11"}, {"key": "haydispora", "value": "9"}, {"key": "ZamanımOlsa", "value": "9"}, {"key": "aslindagüzellik", "value": "8"}, {"key": "bodrumdancanli", "value": "7"}, {"key": "zamanımolsa", "value": "7"}, {"key": "MagnumPink", "value": "7"}, {"key": "zamanımolsa", "value": "7"}, {"key": "mutluyasamak", "value": "6"}, {"key": "mutluyasamak", "value": "6"}, {"key": "ZamanımOlsa", "value": "6"}, {"key": "bencenostalji", "value": "6"}, {"key": "mutluyasamak", "value": "5"}, {"key": "sonkuzyguneyaksami", "value": "5"}, {"key": "bencenostalji", "value": "5"}, {"key": "isteyinsöyliyelim", "value": "5"}, {"key": "mutluyasamak", "value": "5"}, {"key": "bodrumdancanli", "value": "4"}, {"key": "banaherşeyyakişir", "value": "4"}, {"key": "MagnumPink", "value": "4"}, {"key": "birfikrinmivar", "value": "4"}, {"key": "bodrumdancanli", "value": "3"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyaşamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "TadiDamagimda", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "MagnumPink", "value": "1"}, {"key": "MagnumPink", "value": "1"}, {"key": "MagnumPink", "value": "1"}, {"key": "bodrumdancanli", "value": "1"}, {"key": "32gun", "value": "1"}, {"key": "hergünyenibirsen", "value": "0"}, {"key": "sadeceerkekleriçin", "value": "0"}, {"key": "MagnumPink", "value": "0"}, {"key": "sadeceerkeklericin", "value": "0"}, {"key": "sadeceerkeklericin", "value": "0"}, {"key": "MagnumPink", "value": "0"}, {"key": "malıniyisi", "value": "0"}, {"key": "sadeceerkeklericin", "value": "0"}, {"key": "herguneyenibirsen", "value": "0"}, {"key": "ÜniversiteMadya", "value": "0"}, {"key": "sadeceerkeklericin", "value": "0"}, {"key": "asksenindeetrafinisarsin", "value": "0"}, {"key": "kardeşikzamanı", "value": "0"}, {"key": "asksenindeetrafinisarsın", "value": "0"}, {"key": "taksicimuhabbeti", "value": "0"}, {"key": "ÜniversiteMedya", "value": "0"}];
var tags = [{"key": "YeniBirDünya", "value": "590452"}, {"key": "TürkçeOlimpiyatları", "value": "131318"}, {"key": "EvrenselBarış", "value": "74517"}, {"key": "nazar", "value": "61070"}, {"key": "naatgecesi", "value": "48737"}, {"key": "hooooop", "value": "47318"}, {"key": "sağduyu", "value": "30682"}, {"key": "doksanlar", "value": "30388"}, {"key": "GelinTanışOlalım", "value": "28858"}, {"key": "DERS", "value": "25106"}, {"key": "sağduyu", "value": "18620"}, {"key": "MelihGökçekeSorun", "value": "17429"}, {"key": "survivorfinal", "value": "16976"}, {"key": "hayalimdekitatil", "value": "13717"}, {"key": "istersen", "value": "13453"}, {"key": "çayerdalbakkaldaiçilir", "value": "10320"}, {"key": "TahtEldenGidiyor", "value": "10030"}, {"key": "oyunbitti", "value": "9894"}, {"key": "üçartıbir", "value": "9502"}, {"key": "sağduyu", "value": "9437"}, {"key": "üçartıbir", "value": "9153"}, {"key": "sağduyu", "value": "8682"}, {"key": "benokuldayken", "value": "5429"}, {"key": "sonarzum", "value": "5120"}, {"key": "benimhalaumudumvar", "value": "5027"}, {"key": "yakışır", "value": "4953"}, {"key": "karadayı", "value": "4902"}, {"key": "sağduyu", "value": "4421"}, {"key": "son20dakika", "value": "3940"}, {"key": "guzelcirkin", "value": "3066"}, {"key": "NikahMasası", "value": "3023"}];//, {"key": "benimkararım", "value": "3000"}, {"key": "leylailemecnun", "value": "2891"}, {"key": "sinsiplan", "value": "2554"}, {"key": "beniböylesev", "value": "2483"}, {"key": "3artı1", "value": "2359"}, {"key": "32", "value": "2107"}, {"key": "KalbiminSahibi", "value": "1910"}, {"key": "seksenler", "value": "1667"}, {"key": "aşkiçin", "value": "1329"}, {"key": "seksenler", "value": "1268"}, {"key": "GeziSonrası", "value": "1167"}, {"key": "3artı1", "value": "1151"}, {"key": "seksenler", "value": "1143"}, {"key": "ucartıbir", "value": "1058"}, {"key": "uzlaşı", "value": "976"}, {"key": "kardeşlikzamanı", "value": "942"}, {"key": "evlenirkenmutlaka", "value": "880"}, {"key": "sosyalmedya", "value": "861"}, {"key": "gerçeğinpeşinde", "value": "851"}, {"key": "arkasokaklar", "value": "798"}, {"key": "hasrettürküleri", "value": "745"}, {"key": "ÖtekiGündem", "value": "710"}, {"key": "siznedersiniz", "value": "693"}, {"key": "tatarramazan", "value": "691"}, {"key": "yerindeolsam", "value": "691"}, {"key": "tatarramazan", "value": "667"}, {"key": "tatarramazan", "value": "639"}, {"key": "DavutoğlunaSorun", "value": "556"}, {"key": "ÖtekiGündem", "value": "503"}, {"key": "şiddetekarşı", "value": "500"}, {"key": "herşeyyolundamerkez", "value": "449"}, {"key": "benimiçinüzülme", "value": "383"}, {"key": "buhafta", "value": "359"}, {"key": "BöyleBitmesin", "value": "352"}, {"key": "gıcıkolduklarımız", "value": "348"}, {"key": "pisyedili", "value": "338"}, {"key": "BizOsmanlıTokadıyız", "value": "319"}, {"key": "SakaryaFırat", "value": "314"}, {"key": "uefanınkararı", "value": "309"}, {"key": "sanskapıda", "value": "290"}, {"key": "kardeslikzamani", "value": "276"}, {"key": "kardeşlikzamani", "value": "276"}, {"key": "kardeşlikzamani", "value": "276"}, {"key": "kardeslikzamani", "value": "276"}, {"key": "kardeslikzamani", "value": "276"}, {"key": "ZenginKızFakirOğlan", "value": "275"}, {"key": "sanskapida", "value": "230"}, {"key": "yakıştık", "value": "229"}, {"key": "butatilde", "value": "225"}, {"key": "neolacak", "value": "215"}, {"key": "tatildemek", "value": "208"}, {"key": "OsmanlıTokadınıEnÇok", "value": "188"}, {"key": "kardeşlikzamanı", "value": "182"}, {"key": "kardeslikzamani", "value": "182"}, {"key": "kardeşlikzamanı", "value": "182"}, {"key": "galipdervis", "value": "177"}, {"key": "galipdervis", "value": "177"}, {"key": "delirmemekiçin", "value": "163"}, {"key": "ZenginKızFakirOğlan", "value": "140"}, {"key": "ÜniversiteMedya", "value": "131"}, {"key": "ÜniversiteMedya", "value": "130"}, {"key": "AnneOlmak", "value": "121"}, {"key": "yazsıcağı", "value": "117"}, {"key": "ÜniversiteMedya", "value": "115"}, {"key": "birfikrinmivar", "value": "106"}, {"key": "KarneHediyesi", "value": "101"}, {"key": "sanskapida", "value": "94"}, {"key": "ÜniversiteMedya", "value": "87"}, {"key": "ÜniversiteMedya", "value": "84"}, {"key": "ailemiçin", "value": "83"}, {"key": "sanskapıda", "value": "77"}, {"key": "ÜniversiteMedya", "value": "60"}, {"key": "salihkuşu", "value": "60"}, {"key": "sanskapida", "value": "59"}, {"key": "diyolog", "value": "57"}, {"key": "YolAyrımı", "value": "54"}, {"key": "salihkuşu", "value": "47"}, {"key": "Gürbüzüyedirtmeyiz", "value": "37"}, {"key": "YaEvdeYoksan", "value": "31"}, {"key": "cemalnursargutasorun", "value": "31"}, {"key": "yabanciceği", "value": "25"}, {"key": "yabanciceği", "value": "25"}, {"key": "nerdeoeski", "value": "22"}, {"key": "aramizdaengelyok", "value": "18"}, {"key": "yabançiçeği", "value": "16"}, {"key": "yabançiçeği", "value": "16"}, {"key": "aramizdaengelyok", "value": "15"}, {"key": "yakıstık", "value": "14"}, {"key": "mutfagım", "value": "14"}, {"key": "YolAyrımı", "value": "14"}, {"key": "YolAyrımı", "value": "13"}, {"key": "YolAyrımı", "value": "11"}, {"key": "gcseffafoda", "value": "11"}, {"key": "bencenostalji", "value": "11"}, {"key": "haydispora", "value": "9"}, {"key": "ZamanımOlsa", "value": "9"}, {"key": "aslindagüzellik", "value": "8"}, {"key": "bodrumdancanli", "value": "7"}, {"key": "zamanımolsa", "value": "7"}, {"key": "MagnumPink", "value": "7"}, {"key": "zamanımolsa", "value": "7"}, {"key": "mutluyasamak", "value": "6"}, {"key": "mutluyasamak", "value": "6"}, {"key": "ZamanımOlsa", "value": "6"}, {"key": "bencenostalji", "value": "6"}, {"key": "mutluyasamak", "value": "5"}, {"key": "sonkuzyguneyaksami", "value": "5"}, {"key": "bencenostalji", "value": "5"}, {"key": "isteyinsöyliyelim", "value": "5"}, {"key": "mutluyasamak", "value": "5"}, {"key": "bodrumdancanli", "value": "4"}, {"key": "banaherşeyyakişir", "value": "4"}, {"key": "MagnumPink", "value": "4"}, {"key": "birfikrinmivar", "value": "4"}, {"key": "bodrumdancanli", "value": "3"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyaşamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "TadiDamagimda", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "mutluyasamak", "value": "2"}, {"key": "MagnumPink", "value": "1"}, {"key": "MagnumPink", "value": "1"}, {"key": "MagnumPink", "value": "1"}, {"key": "bodrumdancanli", "value": "1"}, {"key": "32gun", "value": "1"}, {"key": "hergünyenibirsen", "value": "0"}, {"key": "sadeceerkekleriçin", "value": "0"}, {"key": "MagnumPink", "value": "0"}, {"key": "sadeceerkeklericin", "value": "0"}, {"key": "sadeceerkeklericin", "value": "0"}, {"key": "MagnumPink", "value": "0"}, {"key": "malıniyisi", "value": "0"}, {"key": "sadeceerkeklericin", "value": "0"}, {"key": "herguneyenibirsen", "value": "0"}, {"key": "ÜniversiteMadya", "value": "0"}, {"key": "sadeceerkeklericin", "value": "0"}, {"key": "asksenindeetrafinisarsin", "value": "0"}, {"key": "kardeşikzamanı", "value": "0"}, {"key": "asksenindeetrafinisarsın", "value": "0"}, {"key": "taksicimuhabbeti", "value": "0"}, {"key": "ÜniversiteMedya", "value": "0"}];
