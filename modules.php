<?
require("lib/generalConfiguration.php");
sessCtrl();
checkBrowser();
getAllowedModules();
?>

<!DOCTYPE html>

<?php print_brand(); ?>


<html lang="<?php echo $langArr['html_lang']; ?>" manifest="manifest.appcache">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title> <?php echo $langArr['title_' . $_SESSION['hostname']]; ?> </title>
        <!-- Disable page zoom in ipad -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        <link rel="stylesheet" href="css/fonts.css?1.2"/>
        <link rel="stylesheet" href="css/reset.css?1.2"/>
        <link rel="stylesheet" href="css/jquery-ui/jquery-ui-1.10.1.custom.min.css?1.2" />
        <link rel="stylesheet" href="css/main.css?1.2"/>
        <link rel="stylesheet" href="css/common.css?1.21"/>
        <link rel="stylesheet" href="css/<?php echo $_SESSION['hostname']; ?>.css"/>
        <link rel="stylesheet" media="screen and (max-width: 1200px)" href="css/main1200w.css?1.2"/> 
        <link rel="stylesheet" media="screen and (max-width: 900px)" href="css/main900w.css?1.2"/> 
        <link rel="stylesheet" media="screen and (max-width: 600px)" href="css/main600w.css?1.2"/> 
        <link rel="stylesheet" media="screen and (max-width: 400px)" href="css/main400w.css?1.2"/> 

        <script src="js/jquery-1.9.0/jquery-1.8.3.min.js?1.2"></script>
        <script src="js/helper.js?1.2"></script>
        <script src="js/lazyload/lazyload.js?1.2"></script>
        <script src="js/modernizr-2.6.2/modernizr.min.js?1.2"></script>
        <script src="js/jqueryui-1.10.0/jquery-ui-1.10.3.custom.min.js?1.2"></script>
        <script src="js/jqueryui-1.10.0/ui.tabs.closable.min.js?1.2"></script>
        <script src="js/jquery.transit-0.9.9/jquery.transit.min.js?1.2"></script>
        <script src="js/upload/upload.js?1.2"></script>
        <script src="js/Modules/Modules.js?1.2"></script>
        <script src="js/DashboardWrapper.js?1.2"></script>
        <script src="js/jquery.dragsort-0.5.1/jquery.dragsort-0.5.1.min.js?1.2"></script>
        <script src="js/cookieManager.js"></script>
        <script src="js/moment/moment.dev.min.js?1.2"></script>
        <script src="js/moment/<?php echo $langArr['lang']; ?>.js?1.2"></script>
        <script src="js/Modules/Common.js?1.2"></script>
        <script src="js/jquery.livequery/jquery.livequery.js?1.2"></script>

        <script src="js/stacktrace/stacktrace.js"></script>

        <script src="js/canvg/StackBlur.js?1.2"></script>
        <script src="js/canvg/canvg.js?1.2"></script>
        <script src="js/canvg/rgbcolor.js?1.2"></script>

        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB85xCCAVvyMsfMKwnmyI_pqlEKcrxRSL0&sensor=false&language=<?php echo $langArr['lang']; ?>"></script>
        <script>


            var instant, analyze, detail, toplist, alarm, dialog, actual, dashboard, geotweet, help, $parentObj;
            var allModuleList = [], allChannels = [], categoryList;
            var addTab, tabs;
            var MDATETIME = 'YYYY-MM-DD HH:mm:ss', MDATETIMET = 'YYYY-MM-DDTHH:mm:ss.000Z';
            var tabTemplate = "<li> <a href='#{href}' id= '#{id}'> #{label} <span> #{no} </span> </a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
            var tabLoadingTemplate = "<div class='progress-container'><div class='before'></div><div class='progress-bar'><span></span></div></div>";
            var user_id = <?php echo $uid; ?>;
            var user_name = '<?php echo $_SESSION['kullanici']; ?>';
            var lang_array = <?php echo json_encode($langArr); ?>;
            var diff = <?php echo $current_seconds; ?> - moment().unix();
            var current = function() {
                return moment().add(diff, 'seconds');
            };

            dateLang = {tr: {
                    closeText: 'Kapat',
                    prevText: '&#x3c;geri',
                    nextText: 'ileri&#x3e;',
                    monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                    monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
                        'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
                    dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
                    dayNamesShort: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
                    dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
                    currentText: 'Güncel Zaman',
                    timeOnlyTitle: 'Zamanı Seçin',
                    timeText: 'Zaman',
                    hourText: 'Saat',
                    minuteText: 'Dakika',
                    weekHeader: 'Hf'
                },
                en: {}
            };
            highchartsLang = {tr: {
                    months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                    shortMonths: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağs', 'Eyl', 'Eki', 'Kas', 'Ara'],
                    weekdays: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
                    downloadJPEG: 'JPEG olarak kaydet',
                    loading: 'Yükleniyor',
                    downloadPDF: 'PDF olarak kaydet',
                    downloadPNG: 'PNG olarak kaydet',
                    downloadSVG: 'SVG olarak kaydet',
                    exportButtonTitle: 'Vektör veya resim formatında kaydet',
                    printButtonTitle: 'Grafiği yazdır',
                    rangeSelectorFrom: '',
                    rangeSelectorTo: '-',
                    rangeSelectorZoom: 'Aralık:'
                },
                en: {}
            };
            $.get('channel_manager.php', {},
                    function(data) {
                        allChannels = data;
                    }, 'json').fail(function(data) {
                console.error('A problem occured, channel data is not retrived' + data.statusText);
            });
            $.get('category_manager.php', {},
                    function(data) {
                        categoryList = data;
                    }, 'json').fail(function(data) {
                console.error('A problem occured, channel data is not retrived' + data.statusText);
            });
            function findModuleByTab(obj) {
                if (obj.length === 0)
                    return null;
                var module_attrs = obj.children('a').attr('id').split('-');
                return window[module_attrs[0]].modules[module_attrs[1]];
            }

            function getActiveModule() {
                var number = tabs.tabs('option', 'active');
                if (number !== false)
                    return findModuleByTab(tabs.find('ul li:eq(' + number + ')')).obj;
                else
                    return false;
            }

            // Check if a new cache is available on page load.
            window.addEventListener('load', function(e) {

                window.applicationCache.addEventListener('updateready', function(e) {
                    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                        // Browser downloaded a new app cache.
                        // Swap it in and reload the page to get the new hotness.
                        window.applicationCache.swapCache();
                        if (confirm('A new version of this site is available. Load it?')) {
                            window.location.reload();
                        }
                    } else {
                        // Manifest didn't changed. Nothing new to server.
                    }
                }, false);

            }, false);

            $().ready(function() {
                tabs = $("#tabs").tabs();
                tabs.on("tabsactivate", function(event, ui) {
                    var newModule = findModuleByTab(ui.newTab);
                    var oldModule = findModuleByTab(ui.oldTab);
                    if (oldModule)
                        oldModule.stop();
                    if (newModule.obj.ready)
                        newModule.resume();
                });
                ModuleList.$parentObj = $('aside ul');


<?php
foreach ($modules as $key => $value) {
    $name = $value['name'];
    if ($name === 'help') {
        $value['disabled'] = true;
    }

    echo "$name = new " . ($name == 'dashboard' ? 'DashboardWrapper(' : 'ModuleList(') . json_encode($value) . "); \n";
    echo "$name.initialize();\n";



    if ($name === 'dashboard') {
        echo 'setTimeout(function() {
                    dashboard.$obj.click();
                    lock();
                }, 500)' . PHP_EOL;
    }
}
?>

                // close icon: removing the tab on click
                tabs.delegate("span.ui-icon-close", "click", function() {
                    var panelId = $(this).closest("li").remove().attr("aria-controls");
                    $("#" + panelId).remove();
                    tabs.tabs("refresh");
                });

                $('body').delegate('#main_wrapper, .highcharts-container > *', 'click', function() {
                    $('#feedback_form').transition({opacity: 0, y: 30, scale: 0.4, duration: 500}).transition({display: "none", duration: 0});
                    $('#account_flyout').myHide();
                });

                $('button[name=show_aside]').click(function() {
                    if ($('aside').css('z-index') === '-1') {
                        $('aside').css('z-index', '1');
                    } else {
                        $('aside').css('z-index', '-1');
                    }
                });

                $('aside ul li').css('transform', 'rotateY(-90deg)');
                setTimeout(function() {
                    setTransition($('aside ul li'), {'transform': 'rotateY(0deg)'}, 200, 50, 0.9);
                }, 300);

                $('#lang_select_container button:not(.selected)').click(function() {
                    setLang($(this).attr('data-value'));
                });

                $('#user_name').click(function() {
                    $('#account_flyout').myShow();
                });

                $('#Help').click(function() {
                    if ($('#help_container').find('iframe').length > 0) {
                        $('#help_container').show();
                    } else
                        $('#help_container').append($('<iframe>').addClass('help-frame').attr('src', 'help/tr.pdf')).show();
                    ;
                });
                $('#help_container').click(function() {
                    $(this).hide();
                });

                var newFlag = readCookie('ver.9');
                if (!newFlag) {
                    createCookie('ver.9', 1);
                    addNewFlags();
                } else {
                    var count = parseInt(newFlag);
                    if (count <= 3) {
                        addNewFlags();
                    }
                    createCookie('ver.9', count + 1);
                }

                var offlineStart, offlineEnd, reloadConfirm = false;

                var offlineFunc = function() {
                    offlineStart = current().format(MDATETIME);
                    reloadConfirm = window.confirm(lang_array['online_confirm']);
                };

                var onlineFunc = function() {
                    offlineEnd = current().format(MDATETIME);

                    var errorObj = {
                        type: 'network down-up',
                        detail: 'disconnected',
                        starttime: offlineStart,
                        endtime: offlineEnd
                    };

                    logError(prepareErrorQuery(errorObj), function() {
                        if (reloadConfirm) {
                            window.location.reload();
                        }
                    });
                };

                networkListener(offlineFunc, 'offline');
                networkListener(onlineFunc, 'online');

                window.onerror = function(message, url, lineNumber) {
                    var errorObj = {
                        type: 'javascript uncatched',
                        detail: JSON.stringify({message: message, url: url, lineNumber: lineNumber}),
                        starttime: current().format(MDATETIME),
                        endtime: current().format(MDATETIME)
                    };

                    logError(prepareErrorQuery(errorObj), function() {
                        if (window.confirm(lang_array['error_occured'])) {
                            window.location.reload();
                        }
                    });

                };

            });

            function onCatchableError(message) {
                var errorObj = {
                    type: 'javascript catched',
                    detail: JSON.stringify({message: message}),
                    starttime: current().format(MDATETIME),
                    endtime: current().format(MDATETIME)
                };
                logError(prepareErrorQuery(errorObj), function() {
                    if (window.confirm(lang_array['error_occured'])) {
                        window.location.reload();
                    }
                });
            }


            function prepareErrorQuery(query) {
                query.active_module = getActiveModule() ? getActiveModule().name : 'dashboard';
                return query;
            }

            function logError(data, callback) {
                $.get('error_manager.php', data, function() {
                    if (callback)
                        callback();
                });
            }



            function show_feedback() {
                $('#feedback_form').css({display: 'block', duration: 0}).transition({opacity: 1, y: 0, scale: 1, duration: 500});
            }

            var keepAliveTimer = setInterval(function() {
                $.get('data_manager.php', {module: 'main', mod: 'control'});
            }, 45000);

            function setLang(new_lang) {
                createCookie('lang', new_lang);
                $.get('lang_manager.php', {lang: new_lang}, function(data) {
                    document.location.reload(true);
                });
            }

            function lock() {
                $('#overlay').show();
            }

            function unlock() {
                $('#overlay').hide();
            }

            function addNewFlags() {
                /*    $('#Alert, #GeoTweet, button.export, .acordion[data-id=topic] button.header').livequery(function() {
                 $(this).addClass('new-flag');
                 $(this).click(function() {
                 $(this).removeClass('new-flag');
                 });
                 });*/
            }

        </script>


    </head>
    <body>
        <div id="overlay"> </div>
        <canvas id="canvas" style="display:none"> </canvas>
        <header> <a href="#"></a>  
            <div id="login_box"> 
                <span id="hello_text"> <?php echo $langArr['hi']; ?>, </span> <a id="user_name"> <?php echo $_SESSION['kullanici'] ?><span style="font-size: 9px;padding-top: 3px;display: inline-block;vertical-align: top;">▼</span>
                    <div id="account_flyout" class="container"> 
                        <div id="lang_select_container">
                            <?php
                            $sel = 'class="selected"';
                            $c1 = "";
                            $c2 = "";
                            ($langArr['lang'] == 'en') ? $c1 = $sel : $c2 = $sel;
                            ?>
                            <button data-value="en" <?php echo $c1; ?> >EN</button><button data-value="tr" <?php echo $c2; ?> >TR</button>
                        </div>
                        <form action="logout.php?" method="post"> 
                            <input type="submit" value="<?php echo $langArr['logout']; ?>"> 
                            <input type="hidden" name="page" value="modules.php">
                        </form>

                    </div>
                </a>
            </div> 
        </header>
        <div id="dashboard"></div>
        <div id="help_container"></div>

        <div id="main_wrapper">

            <button name="show_aside"> = </button>
            <aside>
                <ul></ul>
            </aside>
            <div id="main" class="vert_new vert_old">
                <div id="tabs">
                    <ul>
                    </ul>
                </div>
            </div>

        </div>

        <footer>
            <div id="feedback">
                <button id="feedback_button" onclick="show_feedback();"> <?php echo $langArr['feedback']; ?> </button>

                <div id="feedback_form">
                    <input id="feedback_user_id" type="hidden" value="<?php echo $uid; ?>" />
                    <span > <?php echo $langArr['user_name']; ?>: </span> <br/>
                    <input type="text"  id="feedback_user"  disabled value="<?php echo $_SESSION['kullanici']; ?>"/> 

                    <br/>
                    <span id="feedback_user_info" disabled> <?php echo $langArr['comment']; ?>: </span> <br/>
                    <textarea id="user_info"> </textarea>


                    <span class="fileinput-span">
                        <span id="feedback_image" disabled> <?php echo $langArr['attach_pictures']; ?> </span> <br/>
                        <input type="file" name="images" id="images" multiple="multiple" />
                    </span><br/>

                    <span id="feedback_user_info" style="display:none"> Teknik Bilgi: </span> <br/>

                    <textarea id="technical_info" disabled style="display:none"> </textarea>
                    <button id="submit_feedback" onclick="sendFeedback();"> <?php echo $langArr['send']; ?> </button>
                    <span id="sent_info"> <?php echo $langArr['sent']; ?> </span>

                </div>

            </div>

            <?php print_subfooter(); ?>
        </footer>

    </body>
</html>
