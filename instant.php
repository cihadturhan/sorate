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
        <link rel="stylesheet" href="css/colorpicker/colorpicker.css"/>
        <link rel="stylesheet" href="css/jquery.tagsinput/jquery.tagsinput.css"/>
        <link rel="stylesheet" href="css/jquery-ui/jquery-ui-1.10.1.custom.min.css" />
        <link rel="stylesheet" href="css/instant.css"/>
        <link rel="stylesheet" href="css/common.css"/>
        <link rel="stylesheet" href="css/anims.css"/>
        <link rel="stylesheet" href="css/slider/slider.css"/>
        <link rel="stylesheet" href="css/icons/style.css"/>

        <script src="js/test.js"></script>
        <script src="js/Modules/Common.js"></script>
        <script src="js/jquery-1.9.0/jquery.min.js"></script>
        <script src="js/helper.js"></script>
        <script src="js/colorpicker/jscolor.js"></script>
        <script src="js/jquery.tagsinput/jquery.tagsinput.min.js"></script>
        <script src="js/jquery.transit-0.9.9/jquery.transit.min.js"></script>
        <script src="js/jqueryui-1.10.0/jquery-ui-1.10.3.custom.min.js"></script>
        <script src="js/highstock-1.3.1/highstock.js"></script>
        <script src="js/moment/moment.min.js"></script>
        <script src="js/moment/tr.js"></script>
        <script src="js/jquery.scrollTo-1.4.3.1/jquery.scrollTo-1.4.3.1-min.js"></script>
        <script src="js/jquery.mousewheel/jquery.mousewheel.js"></script>
        <script src="js/jquery.highlight/jquery.highlight.js"></script>
        <script src="js/tweetBlock.js"></script>
        <script src="js/Modules/instant.js"></script>

        <style>

            body,html{
                width:100%;
                height:100%;
                position: relative;
            }
        </style>
    </head>
    <body>
 -->
<div class="general_container">
    <div class="top_container">
        <div class="selection_container">
            
            <div class="settings_container">
                <button type="button" name="show_sett" class="icon-cog"> </button>

                <div class="settings_popup">
                    <span> <?php echo $langArr['time_interval']; ?> </span>
                    <div class="time_select_container">
                        <button class="time_select selected">1</button><button class="time_select">3</button><button class="time_select">5</button>
                    </div>
                </div>
            </div>

        </div>

        <div class="main_graph_container container"  >
            <div class="container_header"> <?php echo $langArr['last']; ?> <span class="multiplier"> 1</span>  <?php echo $langArr['hour']; ?>  </div>
            <div class="main_highcharts_container"> </div> </div>
        <div class="detail_graph_container container"> 
            <div class="container_header"> <?php echo $langArr['last']; ?> <span class="multiplier"> 1</span> <?php echo $langArr['minute']; ?>, <?php echo $langArr['cumulative']; ?> </div> 
            <div class="detail_highcharts_container"> </div> </div>

    </div>

    <div class="tweet_section">
        <div class="legend_container container">
            <div class="container_header"> <?php echo $langArr['selected_groups'];  ?></div>
            <div class="legend_main">    
                <ul>

                </ul>
            </div><div class="legend_sub">
                <ul>
                   
                </ul>
            </div>
        </div>

        <div class="tweet_container container"> 
            <div class="general_tweet_container" >
                <div class="buttons"><div class="up_tweets icon-spinner" > </div></div>
                <div class="new_tweets"><button name="show_tweets" > <span class="new_tweet_no">0</span> <span class="new_tweet_text"> <?php echo $langArr['new_tweets']; ?> </span> </button>
                    <div class="autoupdate"> <?php echo $langArr['auto_update']; ?>   <div class="cb_container"> <input name="autoupdate" type="checkbox"> <label>.</label></div> </div> 
                </div>
                <ul> </ul>
                <div class="buttons"><div class="down_tweets icon-spinner" > </div></div>
            </div>
        </div>
    </div>
</div>
 <!-- 
        <script>
            
            var instant;
            user_id = 63;
            $().ready(function() {
                instant = new Instant($('body'));
                instant.initialize();
            });
        </script>
    </body>



</html>
 -->