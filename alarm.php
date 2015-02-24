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
        <link rel="stylesheet" href="css/anims.css"/>
        <link rel="stylesheet" href="css/common.css"/>
        <link rel="stylesheet" href="css/icons/style.css"/>
        <link rel="stylesheet" href="css/jquery-ui/jquery-ui-1.10.1.custom.min.css" />
        <link rel="stylesheet" href="css/main.css"/>
        <link rel="stylesheet" href="css/alert.css"/>
        <link rel="stylesheet" href="css/jquery.tagsinput/jquery.tagsinput.css"/>

        <script src="js/input.js"></script>
        <script src="js/jquery-1.9.0/jquery.min.js"></script>
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
        <script src="js/Modules/alert.js"></script>
        <script src="js/jquery.highlightRegex/highlightRegex.min.js"></script>
        <script src="js/tweetBlock.js"></script>
        <script src="js/d3/d3.v3.min.js"></script> 
    </head>

    <body>-->
<div class="alert_container">


    <!-- LEFT MAIN CONTAINER -->

    <div class ="left2_container">
        <div class="alert_link_label"><button class="alert_link icon-plus"> <span class="create_text"> <?php echo $langArr['new_alert']; ?> </span></button> </div>
        <div class="all_alerts_container container" > 
            <div class="container_header" > <?php echo $langArr['all_alerts']; ?> </div>
            <div class="header_settings icon-cog"> </div>
            <div class="alert_list_popup container" >
                <div class="blackout"> </div>
                <div class="container_header"></div>
                <div class="header"> </div>
                <div class="tablePop">  
                    <table class="table_still">
                        <thead>
                            <tr>
                                <th><span> <?php echo $langArr['alert_time']; ?> </span> </th>
                                <th><span> <?php echo $langArr['total_tweets']; ?> </span></th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
            <div class="legend_container"></div>
            <div class ="scrollbar_container container">
                <!-- sol alt menü popup -->    
                <!-- tüm alertlerin gösterildiği sol alt panel(heatmap) -->
                <div class="alerts">
                </div>
            </div>
        </div>
    </div>  


    <div class="left_container"> 
        <!-- yeni panel   --> 
        <div class="new_add_container container"><div class="container_header "> <?php echo $langArr['new_alert']; ?> </div>  
            <input type="hidden" value="0" name="alert_id"/>
            <div class="alert_list" > <span class="header"> <?php echo $langArr['alert_name']; ?> </span>
                <input type="text"  name ="alarmname" class="alertname_text"/> </div>
            <div class="alert_list" > <span class="header" > <?php echo $langArr['words']; ?></span>
                <input name ="alerttext" class="text_input" /></div>
            <!-- mail ve sms options -->
            <div class="alert_list" style="opacity: 1;"> <span class="header"  > <?php echo $langArr['email_adress']; ?> </span><br> <input  name ="emails" class="email_input"/></div>
            <div class="alert_list" style="opacity: 1;"> <span class="header"> <?php echo $langArr['telephone_number']; ?>  </span> <br> <input name="mobilenumbers" class="phone_input" value="" style="display: none; opacity: 1;"></div>  
            <!-- threshold&internal options -->
            <div align="center">
                <!-- threshold container -->
                <span class="header"> <?php echo $langArr['threshold']; ?>  </span>
                <div class="title">    
                    <div class="threshold_container">
                        <span class="h4" data-type='man' ><?php echo $langArr['manual']; ?> </span>  
                        <div class="cb_container"> <input name="ads" type="checkbox" checked=""> <label>.</label> </div> 
                        <span class="h4 selected" data-type='auto'><?php echo $langArr['automatic']; ?> </span> 
                    </div>
                    <div class="threshold_inputs">
                        <input class="threshold_text" type="text" name="manuel"/> 
                        <div class="threshold_select_container">
                            <button  data-id ="low" class="threshold_select "><?php echo $langArr['low']; ?> </button><button data-id ="medium" class="threshold_select selected"><?php echo $langArr['medium']; ?> </button><button data-id ="high"  class="threshold_select"><?php echo $langArr['high']; ?> </button>
                        </div>
                    </div>

                </div>
                <!-- time interval contaniner -->     
                <span class="header"> <?php echo $langArr['time_interval']; ?><span> </span></span>
                <div class="title">
                    <div class="settings_interval">
                        <div class="interval_select_container">
                            <button  class="interval_select" data-id="00-08"> <?php echo $langArr['night']; ?><br><span>00-08</span></button><button  class="interval_select selected" data-id="08-24"> <?php echo $langArr['day']; ?><br><span>08-24</span></button><button class="interval_select" data-id="00-24" > <?php echo $langArr['all_day']; ?><br><span>00-24</span></button>
                        </div> </div>
                </div> 
            </div>
            <!-- Button control -->
            <div class="button_size" >
                <button class ="icon-uniF489 close_panel" title="<?php echo $langArr['close_panel']; ?>"> </button>
                <button name="save_alert"  class="icon-save button_color" title="<?php echo $langArr['new_alert']; ?>" > <span class="button_still">  </span> </button>
                <button name="update_alert"  class="icon-edit button_color" title="<?php echo $langArr['save_changes']; ?>"><span class="button_still"></span></button>
                <button name="delete_alert"  class="icon-trash button_red" title="<?php echo $langArr['delete_alert']; ?>"><span class="button_still"> </span></button>
            </div>
        </div>  
    </div>







    <!-- RIGHT MAIN CONTAINER -->
    <div class="rght_container">
        <div class="rght_top_container container"> <div class="container_header "><?php echo $langArr['alert_details']; ?></div>

            <div class="charts-container">
                <div class="graph" data-highcharts-chart="6"> </div>
            </div>

            <div class="rght_bottom_container">

                <div class=" txt_container "> 
                    <div class="alertname">
                        <div class="alert_image_alert">
                            <span class="h1 "> <?php echo $langArr['alert_name']; ?>:</span>
                        </div>
                        <span class="h"> </span>
                        <div class="alert_image_time">
                            <span class="h1"> <?php echo $langArr['alert_time']; ?>:</span></div>
                        <span class="h"> </span>
                        <div class="alert_image_twitter">
                            <span class="h1"><?php echo $langArr['total_tweets']; ?> :</span></div>
                        <span class="h"> </span>
                    </div>
                    <br>

                </div>

                <div class="tweets_container container"><div class="container_header"><?php echo $langArr['tweets']; ?></div>
                    <div class="tweet_summary">
                        <div class="general_tweet_container">
                            <ul></ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>





</div>

<!--

        <script>
            var alrt;
            $().ready(function() {
                alrt = new Alert($('.alert_container'));
                alrt.initialize();
            });
        </script>
    </body>
</html>
-->