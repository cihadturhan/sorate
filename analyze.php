<?php
require("lib/generalConfiguration.php");
?>

<!-- 
<!DOCTYPE html>
<html  lang="tr-TR">
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <link rel="stylesheet" href="css/reset.css"/>
        <link rel="stylesheet" href="css/jquery-ui/jquery-ui-1.10.1.custom.min.css" />
        <link rel="stylesheet" href="css/common.css"/>
        <link rel="stylesheet" href="css/colorpicker/colorpicker.css"/>
        <link rel="stylesheet" href="css/jquery.tagsinput/jquery.tagsinput.css"/>
        <link rel="stylesheet" href="css/jquery.timepicker/jquery-ui-timepicker-addon.css" />
        <link rel="stylesheet" href="css/analyze.css"/>
        <link rel="stylesheet" href="css/icons/style.css"/>
        <link rel="stylesheet" href="css/anims.css"/>
        <link rel="stylesheet" href="css/swiper/idangerous.swiper.css"/>


        <script src="js/jquery-1.9.0/jquery.min.js"></script>
        <script src="js/swiper/idangerous.swiper-2.1.js"></script>

        <script src="js/input.js"></script>
        <script src="js/helper.js"></script>
        <script src="js/colorpicker/jscolor.js"></script>
        <script src="js/jquery.tagsinput/jquery.tagsinput.min.js"></script>
        <script src="js/jquery.transit-0.9.9/jquery.transit.min.js"></script>
        <script src="js/highstock-1.3.1/highstock.js"></script>
        <script src="js/moment/moment.min.js"></script>
        <script src="js/jquery.scrollTo-1.4.3.1/jquery.scrollTo-1.4.3.1-min.js"></script>
        <script src="js/jquery.mousewheel/jquery.mousewheel.js"></script>
        <script src="js/jqueryui-1.10.0/jquery-ui-1.10.3.custom.min.js"></script>
        <script src="js/Modules/Common.js"></script>
        <script src="js/Modules/analyze.js"></script>
        <script src="js/jquery.dragsort-0.5.1/jquery.dragsort-0.5.1.min.js"></script>
        <script src="js/tweetBlock.js"></script>
        <script src="js/jquery.highlight/jquery.highlight.js"></script>
        <script src="js/jquery.timepicker/jquery-ui-timepicker-addon.js"></script>

        <script src="js/canvg/StackBlur.js?1.2"></script>
        <script src="js/canvg/canvg.js?1.2"></script>
        <script src="js/canvg/rgbcolor.js?1.2"></script>


    </head>

    <body>
-->

<div class="analyze_container">
    <div class="export_container"></div>
    <div class="header container"> 
        <div class="new_report">

            <div class="selection_container">
            </div>
            <input type="text" name="timepicker_start" placeholder="<?php echo $langArr['choose_date']; ?>" readonly/> 
            <input type="text" name="timepicker_end" placeholder="<?php echo $langArr['choose_date']; ?>" readonly/> 
        </div>

    </div>

    <ul class="detail_wrapper">

    </ul>

    <div class="tweet_container container"> 
        <div class="general_tweet_container">
            <div class="buttons">
                <div class="widget_export_container"><button class="icon-export widget_export"> </button> <span class="numOfTweets">0</span> <?php echo $langArr['tweets']; ?> </div>
                <div class="down_tweets icon-spinner"> </div></div>
            <ul>
            </ul>
        </div>
    </div>

</div>
<!--
        <script>



            var analyze;
            $().ready(function() {
                analyze = new Analyze($('body'));
                analyze.initialize();
            });



        </script>
    </body>



</html>
-->