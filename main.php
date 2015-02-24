<?php
//header("Location: maintanance.php");
//exit;

require("lib/generalConfiguration.php");


if (isset($_SESSION['surum'])) {
    if ($_SESSION['surum'] == 'guncel') {
        loggerD($_SESSION[$system], $_SESSION['kullanici'], 'login.php', 'modules.php', 'REDIRECT');
        header("Location: modules.php");
        exit;
    }
}



$act = isset($_POST['act']) ? $_POST['act'] : false;
$err = false;

if ($act) {
    $k = strtolower(trim(secPass($_POST['kullanici'])));
    $s = strtolower(trim(secPass($_POST['sifre'])));

    // IMPORTANT: The old log system was removed. 
    // Now, all log is written in "detailed_log" table by the function loggerD()

    $q1 = $db->getQ("Select * from users where user_name='$k' and password='$s'");
    $id = $q1[0]['id'];


    if (!$q1) {
        loggerD($_SESSION[$system], $k, 'login.php', 'login.php', 'LOGINERR(' . $k . "::" . $s . ")");
        $err = $langArr['err'];
    } else if ($q1[0]['active'] == '0') {
        loggerD($_SESSION[$system], $k, 'login.php', 'login.php', 'LOGINERRA(' . $k . "::" . $s . ")");
        $err = $langArr['erra'];
    } else if ($q1[0]['max_sessions'] <= $q1[0]['curr_sessions']) {
        loggerD($_SESSION[$system], $k, 'login.php', 'login.php', 'LOGINERRO(' . $k . "::" . $s . ")");
        $err = $langArr['erro'];
    } else if (!tarih_kontrol($id)) {
        loggerD($_SESSION[$system], $k, 'login.php', 'login.php', 'LOGINERRT(' . $k . "::" . $s . ")");
        $err = $langArr['errt'];
    } else {
        $_SESSION[$system] = $q1[0][0];
        $db->setQ("Update users set curr_sessions=curr_sessions+1 where id={$q1[0][0]}");
        $sid = session_id();
        $db->setQ("Insert into sessions values (0,'{$q1[0][0]}','$sid',now(),'" . getIP() . "')");

        $_SESSION['surum'] = $_POST['surum'];
        $_SESSION['kullanici'] = $_POST['kullanici'];
        $_SESSION['lang'] = $q1[0]['lang'];
        $_SESSION['restricted'] = $q1[0]['restricted'];
        header("Location: modules.php");
        loggerD($_SESSION[$system], $k, 'login.php', 'anlikWeb/manager.php', 'LOGINOK');
    }
} else {
    loggerM($sid, 'login.php', 'LOGINOK');
}
session_write_close();
?>

<!DOCTYPE html>
<html lang="tr-TR">
    <head>
        <meta charset="UTF-8">
        <title> <?php echo $langArr['title_' . $_SESSION['hostname']]; ?> </title>
        <link rel="stylesheet" href="css/reset.css" />
        <link rel="stylesheet" href="css/common.css" />
        <link rel="stylesheet" href="css/main_login.css" />
        <link rel="stylesheet" href="css/<?php echo $_SESSION['hostname'] ?>_login.css"/>
        <link href='css/fonts/fira.css' rel='stylesheet' type='text/css'>

        <link rel="icon" type="image/png"  href="img/favicon.png">


        <script> var lang_array = <?php echo json_encode($langArr); ?>;</script>
        <!-- <script src="http://code.highcharts.com/stock/highstock.js"></script>
        <script src="http://code.highcharts.com/stock/modules/exporting.js"></script> -->



        <script src="js/main.js"></script>
        <script src="js/highstock-1.3.1/highstock.js"></script>
        <script src="js/tr.js"></script>

        <script>
            $().ready(function() {
                var requesting = false;
                Highcharts.setOptions({
                    global: {
                        useUTC: false
                    },
                    lang: highchartsLang[lang_array['lang']]
                });

                subModule.prototype.generateXLSData = function() {
                };
                subModule.parentModule = {keylist: []};

                videos = new subModule({
                    title: lang_array['related_videos'],
                    resize: 'es',
                    default: '22',
                    data: [],
                    type: 'videoPlayer',
                    container: $('#video'),
                    options: {
                        mode: 'top_videos',
                        size: 10
                    }
                });

                rt = new subModule({
                    title: lang_array['top_retweets'],
                    resize: 's',
                    default: '24',
                    data: [],
                    type: 'tweetTable',
                    container: $('#retweet'),
                    options: {
                        mode: 'top_rt',
                        size: 10,
                        export: true,
                        exportOrder: 1
                    }
                });

                hashtags = new subModule({
                    title: lang_array['related_hashtags'],
                    resize: 's',
                    default: '22',
                    data: [],
                    type: 'chart',
                    subtype: 'bar',
                    container: $('#hashtag'),
                    options: {
                        mode: 'related_htags',
                        size: 10,
                        export: true,
                        exportOrder: 0
                    }
                });

                hour = new subModule({
                    title: lang_array['related_hashtags'],
                    resize: 's',
                    default: '22',
                    data: [],
                    type: 'chart',
                    subtype: 'areaspline',
                    container: $('#hour'),
                    options: {
                        mode: 'related_htags',
                        size: 10,
                        export: true,
                        exportOrder: 0
                    },
                    chartOptions: {
                        tooltip: {
                            formatter: function() {
                                var borderColor = this.series.color;
                                if (this.series.options.borderColor && this.series.options.borderColor !== '#FFFFFF') {
                                    borderColor = this.series.options.borderColor;
                                }
                                return ("<div class='tooltip' style='border-color:" + borderColor + "'> <strong>" + this.series.options.name + '</strong><br/> ' + this.y + ' ' + lang_array['tweets'] + "</div>");
                            }
                        }
                    }
                });

                subModule.prototype.custombar = function(contentWrapper) {
                    var This = this;
                    return new Highcharts.Chart($.extend(true, {}, subModule.chartTemplate, {
                        chart: {
                            renderTo: contentWrapper[0],
                            type: this.subtype,
                            events: {
                                load: function() {
                                    // set up the updating of the chart each second
                                    var chart = this;
                                    var series = this.series;

                                    setInterval(function() {
                                        var allTimes = Object.keys(This.data);
                                        var currTime = allTimes[0];
                                        var currMoment = moment(currTime);
                                        if (typeof currTime === 'undefined') {
                                            if (!requesting)
                                                This.getInstantData();
                                            return;
                                        }
                                        console.log(This.data[currTime][series[0].name], This.data[currTime][series[1].name], This.data[currTime][series[2].name]);

                                        for (var i = 0; i < series.length; i++) {
                                            var before = series[i].data[0].y;
                                            if (currMoment.second() === 0) {
                                                if (hour.obj)
                                                    hour.obj.series[i].addPoint([currMoment.valueOf(), before], false, true);
                                                before = 0;
                                            }
                                            var current = before + This.data[currTime][series[i].name];
                                            series[i].data[0].update(current, false, true);
                                        }
                                        if (currMoment.second() === 0 && hour.obj) {
                                            hour.obj.redraw();
                                        }
                                        delete This.data[currTime];
                                        chart.redraw();
                                        chart.setTitle({text: currMoment.format('HH:mm:ss')});

                                        if (allTimes.length === 3) {
                                            This.getInstantData();
                                        }
                                    }, 1000);

                                }
                            }
                        },
                        series: this.generatecustomBarData()
                    }, this.generateChartOptions(), {
                        title: {
                            enabled: true,
                            text: 'Lorem Ipsum'
                        },
                        plotOptions: {
                            column: {
                                dataLabels: {
                                    enabled: true,
                                    formatter: function() {
                                        return this.y;
                                    }
                                }
                            }
                        },
                        tooltip: {
                            formatter: function() {
                                var borderColor = this.series.color;
                                if (this.series.options.borderColor && this.series.options.borderColor !== '#FFFFFF') {
                                    borderColor = this.series.options.borderColor;
                                }
                                return ("<div class='tooltip' style='border-color:" + borderColor + "'> <strong>" + this.series.options.name + '</strong><br/> ' + this.y + ' ' + lang_array['tweets'] + "</div>");
                            }
                        }

                    }));

                    // set up the updating of the chart each second

                };

                subModule.prototype.generatecustomBarData = function() {
                    function hexToRgb(hex) {
                        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                        return result ? {
                            r: parseInt(result[1], 16),
                            g: parseInt(result[2], 16),
                            b: parseInt(result[3], 16)
                        } : null;
                    }

                    var This = this;
                    return (function() {
                        var series = [];
                        var keys = Object.keys(This.data[Object.keys(This.data)[0]]);


                        for (var i = 0; i < keys.length; i++) {
                            var color = [SBTRED, SBTDBLUE, SBTLBLUE][i];
                            var rgba = hexToRgb(color);
                            var softColor = 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',0.1)';
                            series[i] = {
                                borderColor: color,
                                color: softColor,
                                borderWidth: 2,
                                data: [],
                                name: keys[i]
                            };
                            var first = Object.keys(This.data)[0];
                            series[i].data = [
                                This.data[first][keys[i]]
                            ];

                            var $itemBox = $('<div>').addClass('legend_box').css({'border-color': color, 'background-color': softColor});
                            var $itemText = $('<span>').addClass('legend_text').html(keys[i]).attr('title', keys[i]);
                            var $item = $('<div>').addClass('legend_item').append($itemBox, $itemText);
                            $('#legend').append($item);
                        }
                        delete This.data[first];
                        return series;
                    })();
                };


                live = new subModule({
                    title: lang_array['related_hashtags'],
                    resize: 's',
                    default: '22',
                    data: [],
                    type: 'custombar',
                    subtype: 'column',
                    container: $('#live'),
                    options: {
                        mode: 'related_htags',
                        size: 10,
                        export: true,
                        exportOrder: 0
                    }
                });

                subModule.prototype.getInstantData = function() {
                    requesting = true;
                    $.ajax({
                        type: 'GET',
                        url: 'login_manager.php',
                        data: {mod: 'main', first: 0},
                        timeout: 60000,
                        async: true,
                        dataType: 'json',
                        success: function(data) {
                            $.extend(live.data, data.live);
                        },
                        error: function(data, textStatus) {
                            console.log("Error in instant data");
                        },
                        complete: function() {
                            requesting = false;
                        }
                    });

                };

                $.get('login_manager.php', {mod: 'main', first: 1}, function(data) {
                    console.log(data['live']);
                    for (var key in data) {
                        if (window[key]) {
                            window[key].data = data[key];
                            window[key].createSubView();
                        }
                    }
                }, 'json');

                $('#report_box, #report_box div, #report_box div span').click(function() {
                    $('#main_wrapper').removeClass('blur');
                    $('#report_box').hide();
                });

            });




        </script>
    </head>

    <body>

        <?php
        if ($err) {
            echo "<div id='report_box'><div><span> $err </span></div></div>";
        }
        ?> 


        <div id="overlay"> </div>
        <header> <a href="#"></a>  
            <div id="login_box">
                <form action="?" method="post" name="f">
                    <input type="hidden" name="act" value="1" />
                    <input type="hidden" name="surum" value="guncel" />
                    <div id="inputs">
                        <input type="text" name="kullanici" id="kullanici" class="login_input" autocomplete="off" autofocus placeholder="<?php echo $langArr['user_name']; ?>">
                        <input type="password" name="sifre" id="sifre" class="login_input" autocomplete="off" placeholder="<?php echo $langArr['password']; ?> ">
                        <input type="submit" class="login_button" value="<?php echo $langArr['login']; ?> ">
                    </div>
                </form>
            </div> 
        </header>

        <div id="main_wrapper"  <?php
        if ($err) {
            echo ' class="blur"';
        }
        ?> >
            <div id="main" class="vert_new vert_old">

                <section>
                    <div class="header bborder_red"> Canlı </div>
                    <div class="container triple">  <div class="container_header"> Son Yarım saat</div> 
                        <div id="hour" class="chart hourly_chart"> <div class="graph"> </div> </div>
                        <div id="live" class="chart live_chart"> <div class="graph"> </div> </div>
                        <div id="legend"> </div>
                    </div>
                </section>

                <section>
                    <div class="header"> Dün en çok paylaşılanlar </div>
                    <div id="video" class="container"> <div class="graph"> </div> <div class="container_header"> Video </div> </div>
                    <div id="retweet" class="container"> <div class="graph"> </div> <div class="container_header"> Retweet </div> </div>
                    <div id="hashtag" class="container w4 h4"> <div class="graph"> </div> <div class="container_header"> Hashtag </div> </div>
                </section>

                <div style="display: none"> 
                    <section>
                        <div class="header bborder_red"> Daha fazlası? </div>
                        <div class="more"> </div>
                    </section>

                    <section id="instant" class="item"><div> </div> <span> Anlık data analizi. </span> </section>
                    <section id="report" class="item"> <span> Anlık data analizi. </span> </section>
                    <section id="map" class="item"> <span> Anlık data analizi. </span> </section>
                </div>
            </div>
        </div>

        <footer>
            <?php print_subfooter(); ?>
            <div itemscope itemtype="http://schema.org/CreativeWork" class="microdata">
                <div>Name: <div itemprop="name">so-Rate</div> </div>
                <div>Url: <span itemprop="url">www.so-rate.com</span></div>
                <div>About: <span itemprop="about"> soRate is a social rating platform which currently based on twitter and youtube. </span></div>
                <div>Provider: <span itemprop="provider">SBT</span></div>
            </div>
        </footer>

    </body>
</html>
