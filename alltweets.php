<?
require("lib/generalConfiguration.php");
sessCtrl();
?>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!-- Disable page zoom in ipad -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        <link rel="stylesheet" href="css/fonts.css"/>
        <link rel="stylesheet" href="css/reset.css"/>
        <link rel="stylesheet" href="css/jquery-ui/jquery-ui-1.10.1.custom.min.css" />
        <link rel="stylesheet" href="css/main.css"/>
        <link rel="stylesheet" href="css/common.css"/>
        <link rel="stylesheet" href="css/anims.css"/>
        <link rel="stylesheet" href="css/icons/style.css"/>
        <link rel="stylesheet" media="screen and (max-width: 1200px)" href="css/main1200w.css"/> 
        <link rel="stylesheet" media="screen and (max-width: 900px)" href="css/main900w.css"/> 
        <link rel="stylesheet" media="screen and (max-width: 600px)" href="css/main600w.css"/> 
        <link rel="stylesheet" media="screen and (max-width: 400px)" href="css/main400w.css"/> 

        <script src="js/jquery-1.9.0/jquery.min.js"></script>
        <script src="js/helper.js"></script>
        <script src="js/lazyload/lazyload.js"></script>
        <script src="js/modernizr-2.6.2/modernizr.min.js"></script>
        <script src="js/jqueryui-1.10.0/jquery-ui-1.10.3.custom.min.js"></script>
        <script src="js/jqueryui-1.10.0/ui.tabs.closable.min.js"></script>
        <script src="js/jquery.transit-0.9.9/jquery.transit.min.js"></script>
        <script src="js/upload/upload.js"></script>
        <script src="js/jquery.dragsort-0.5.1/jquery.dragsort-0.5.1.min.js"></script>
        <script src="js/cookieManager.js"></script>
        <script src="js/moment/moment.dev.min.js"></script>
        <script src="js/moment/tr.js"></script>
        <script src="js/tweetBlock.js?12312"></script>
        <script src="js/jquery.highlight/jquery.highlight.js"></script>
        <script src="js/jquery.jsstepper/jquery.jstepper.min.js"></script>

        <script>
            var keepAliveTimer = setInterval(function() {
                $.get('data_manager.php');
            }, 45000);

            tweetList = {};
            xlsdata = {};
            avgtime = 0;

            /*$('.general_tweet_container .buttons .icon-spinner').show();
             $('.general_tweet_container .buttons .numOfTweetContainer').hide();
             $('.general_tweet_container .export_container').hide();
             $('.general_tweet_container ul').html('');*/

            pushRecursively = function() {
                time = avgtime;
                var end = Math.min(Object.keys(tweetList).length, 50);
                if (end === 0) {
                    return false;
                }

                if (time < 10) {
                    for (var i = 0; i < end; i++) {
                        selectAndPush(time);
                    }
                } else {
                    var i = 0;
                    var timer = setInterval(function() {
                        if (i >= end) {
                            clearInterval(timer);
                            return;
                        }
                        selectAndPush(time);
                        i++;
                    }, time);
                }
            };

            $(window).on('scroll', function() {
                if (($('body').innerHeight() + $(this).scrollTop()) >= $('.main').outerHeight() - 50) {
                    pushRecursively();
                }
            })

            function selectAndPush(time) {
                var keys = Object.keys(tweetList);
                var key = keys.sort()[0];
                var data = tweetList[key];
                data.tweetId = key;

                pushBack(data, time);
                delete tweetList[key];
            }
            ;

            $().ready(function() {
                $('input[type=submit]').click(function() {
                    var sentence = $('#input').val();
                    if (sentence === '') {
                        $('#input').stop().transition({'border-color': SBTRED, duration: 300}).transition({'border-color': '', duration: 1000});
                        return;
                    }

                    $('.general_tweet_container .buttons .numOfTweetContainer').hide();
                    $('.general_tweet_container .buttons .icon-spinner').show();
                    $('.general_tweet_container .export_container').hide();
                    $('.general_tweet_container ul').html('');


                    $.ajax({
                        url: "data_manager.php",
                        type: "GET",
                        dataType: "json",
                        timeout: 120000,
                        data: {mod: 'first', sentence: sentence},
                        success: function(data) {
                            generateXLSData(data);
                            tweetList = data;
                            $('.general_tweet_container .buttons .icon-spinner').hide();
                            $('.general_tweet_container .buttons .numOfTweets').html(Object.keys(data).length);
                            $('.general_tweet_container .buttons .numOfTweetContainer').show();
                            $('.general_tweet_container .export_container').show();
                            var maxTime = 100;
                            var minTime = 5;
                            var keys = Object.keys(data);

                            avgtime = parseInt(600 / keys.length);
                            avgtime = Math.min(avgtime, maxTime);
                            avgtime = Math.max(avgtime, minTime);

                            pushRecursively();

                        },
                        error: function(x, t, m) {
                            console.log('error');
                        }
                    });
                });

                $('textarea#input').jStepper({minValue: 0});
                $('textarea#input').keydown(function(event) {
                    if (event.which === 13) {
                        $('input[type=submit]').click();
                        return false;
                    }
                });

                $('.export_container button').click(function() {
                    xlsdata.filetype = $(this).attr('class');
                    $.post('phpexcel/print_excel.php', {data: JSON.stringify(xlsdata)}, function(url) {
                        if (url) {
                            var hiddenIFrameID = 'hiddenDownloader', iframe = document.getElementById(hiddenIFrameID);
                            if (iframe === null) {
                                iframe = document.createElement('iframe');
                                iframe.id = hiddenIFrameID;
                                iframe.style.display = 'none';
                                document.body.appendChild(iframe);
                            }
                            iframe.src = url;
                        } else {
                            alert('Something went wrong');
                        }
                    }, 'text');
                });

            });
            pushFront = function(data, time) {
                var sentence = [$('#input').val()];
                var newTweet = createFullTweetBlock(data, JSON.stringify(sentence), 'DD MMMM HH:mm');
                var tweetContainer = $('.general_tweet_container ul');
                var lastTweet = tweetContainer.find('li:first');

                if (!lastTweet.hasClass('even'))
                    newTweet.addClass('even');
                tweetContainer.prepend(newTweet);
                if (time < 10) {
                    newTweet.css({opacity: 1, height: "80px"});
                    return;
                }
                newTweet.css({opacity: 0}).transition({opacity: 1, height: "80px", duration: time ? time : 250});
            };

            pushBack = function(data, time) {
                var sentence = [$('#input').val()];
                var newTweet = createFullTweetBlock(data, JSON.stringify(sentence), 'DD MMMM HH:mm');
                var tweetContainer = $('.general_tweet_container ul');
                var lastTweet = tweetContainer.find('li:last');

                if (!lastTweet.hasClass('even'))
                    newTweet.addClass('even');
                tweetContainer.append(newTweet);
                if (time < 10) {
                    newTweet.css({opacity: 1, height: "80px"});
                    return;
                }
                newTweet.css({opacity: 0}).transition({opacity: 1, height: "80px", duration: time ? time : 250});
            };

            generateXLSData = function(data) {
                var first = data[Object.keys(data)[0]];
                xlsdata = {
                    file_name: verify(first.userName),
                    filetype: 'xlsx',
                    data: {
                        title: [
                            ['Kullanıcı ID', 'Tam İsim', 'Profil İsmi', 'Rapor Tarihi'],
                            [first.userId, verify(first.fullName), verify(first.userName), moment().format('LLL')]
                        ],
                        header: ['Sıra', ' Tarih', 'Tweet'],
                        rows: []
                    }
                };
                var count = 1;
                for (var key in data) {
                    var elem = data[key];
                    xlsdata.data.rows.push([count, moment(elem.tweetTime).format('LLL'), elem.tweetText]);
                    count++;
                }
            };

            verify = function(val) {
                return(val ? val : 'protected user');
            };

        </script>
        <style>

            textarea{
                padding-top: 12px;
                font-size: 17px;
                font-family: Arial Helvetica Calibri;
            }

            body{
                overflow: auto;
                background-image: none;
                background-color: rgb(247, 247, 247);
            }

            .analyze_container{
                text-align: center;
            }

            .analyze_container div.tweet_container {
                margin: auto;
                padding: 25px 15px 50px 15px;
                display: inline-block;
                width: 100%;
                min-width: 350px;
                min-height: 30px;
                position: relative;
                top: auto;
                left: auto;
                right: auto;
                bottom: auto;
                z-index: 8;
            }

            .analyze_container .general_tweet_container {
                width: 100%;
            }

            .analyze_container .general_tweet_container ul {
                list-style: none;
                text-align: left;
                padding: 0 5px 0 5px;
                overflow-y: auto;
            }

            .analyze_container .general_tweet_container ul li {
                margin: 1px 0 7px 0;
                -moz-box-shadow: inset 0 1px 3px hsl(0, 6%, 47%);
                -webkit-box-shadow: inset 0 1px 3px hsl(0, 6%, 47%);
                box-shadow: inset 0 1px 3px hsl(0, 6%, 47%);
                padding: 1px 0 0 0;
                -moz-box-sizing: content-box;
                box-sizing: content-box;
                -moz-border-radius: 3px;
                -webkit-border-radius: 3px;
                border-radius: 3px;
                background-color: hsl(0, 0%, 99%);
                height: 0;
                overflow: hidden;
                display: block;
                -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
                filter: alpha(opacity=0);
                opacity: 0;
            }

            .analyze_container .general_tweet_container ul li.even {
                background-color: hsl(192, 24%, 95%);}


            .analyze_container li div.content {
                padding: 12px;
            }

            .analyze_container .stream-item-header {
                margin-top: 4px;
                display: inline;
            }

            .analyze_container .avatar {
                display: inline;
                width: 48px;
                height: 48px;
                float: left;
                margin: 2px 12px 0 0;
                -moz-border-radius: 4px;
                -webkit-border-radius: 4px;
                border-radius: 4px;
                border: 1px solid hsl(0, 0%, 60%);
                -moz-box-shadow: 0 1px 2px hsl(0, 5%, 84%);
                -webkit-box-shadow: 0 1px 2px hsl(0, 5%, 84%);
                box-shadow: 0 1px 2px hsl(0, 5%, 84%)
            }

            .analyze_container .tweet_time {
                text-align: right;
                display: block
            }

            .analyze_container .fullname {
                float: left;
                margin-top: 0;
                margin-right: 20px;
                color: hsl(0, 0%, 33%);
                font-weight: normal;
                font-family: Arial, Tahoma, Verdana;
                font-size: 12px;}

            .analyze_container .js-tweet-text {
                margin: 5px 0 0 0;
                font-size: 12px;
                color: hsl(0, 0%, 40%);
                font-weight: normal;
                font-family: Helvetica, Arial;
                text-decoration: none;
                text-align: left;
                line-height: 1.4em;
                display: block;
                overflow: hidden;
            }

            .analyze_container .general_tweet_container ul li:hover .js-tweet-text {
                color: hsl(0, 0%, 0%) !important;
                text-shadow: 0 0 1px hsl(0, 0%, 89%);
            }

            .analyze_container .emphasized {
                font-weight: bold;
                color: hsl(0, 40%, 42%);
                text-shadow: 0 0 1px hsl(0, 0%, 83%)
            }

            .analyze_container .username {
                float: left;
                margin-right: 10px;
                color: #333;
                font-weight: bold;
                font-size: 12px;
                font-family: Arial, Tahoma;}

            .analyze_container .tweet-timestamp {
                font-weight: normal;
                text-decoration: none;
                font-style: normal;
                font-size: 11px;
                color: hsl(0, 0%, 38%);
                font-family: Helvatica, Arial, Tahoma
            }

            .analyze_container .permalink-link {
                color: #333;
                text-decoration: none;
                display: none
            }

            .analyze_container .metadata > span {
                margin-right: 5px;
                display: block;
                font-family: Helvetica, Arial;
                font-size: 0.75em
            }

            .analyze_container .tweet-counter {
                font-weight: bold;
                float: left
            }

            .analyze_container .time_and_date {
                text-align: right;
                display: block
            }

            .analyze_container div.buttons {
                width: 100%;
                text-align: center;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                height: 20px;
            }

            .analyze_container div.icon-spinner {
                -webkit-animation: rotateCW 1.2s infinite;
                -moz-animation: rotateCW 1.2s infinite;
                -ms-animation: rotateCW 1.2s infinite;
                -o-animation: rotateCW 1.2s infinite;
                animation: rotateCW 1.2s infinite;
                -moz-transform-origin: center;
                -ms-transform-origin: center;
                -o-transform-origin: center;
                -webkit-transform-origin: center;
                transform-origin: center;
                display: inline-block;
                color: hsl(198, 76%, 52%);
                font-size: 16px;
                -webkit-backface-visibility: hidden;
                -moz-backface-visibility: hidden;
                padding-top: 0px;
                text-align: center;
                width: 16px;
                display: none;
                margin: 0 auto 0 auto;
            }

            .numOfTweetContainer{
                display: none;
                background-color: transparent;
            }

            .export_container{
                margin: 10px;
                text-align: center;
                display: none;
            }

            .pdf {
                display: none;
            }

        </style>
    </head>
    <body>
        <div class="main" style="margin:auto; width:40%; padding: 20px;">
            <div style="margin: 10px;">
                <textarea id="input" placeholder="" style="width:100%;height:50px"></textarea>
            </div>
            <div style="text-align: center; margin: 10px;">
                <input type="submit" value="GÖNDER"/>
            </div>



            <div class="analyze_container">
                <div class="tweet_container container p_righttop"> 
                    <div class="general_tweet_container">
                        <div class="export_container">
                            <button class="xls"> XLS </button>
                            <button class="xlsx"> XLSX </button>
                            <button class="pdf"> PDF </button>
                        </div>
                        <div class="buttons"><div class="numOfTweetContainer"> <span class="numOfTweets"> 0 </span> tweet.</div> <div class="down_tweets icon-spinner" style="display: none;"> </div></div>
                        <ul>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
