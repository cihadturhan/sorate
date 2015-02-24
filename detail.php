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
        <link rel="stylesheet" href="css/detail.css"/>
        <link rel="stylesheet" href="css/icons/style.css"/>
        <link rel="stylesheet" href="css/anims.css"/>

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
        <script src="js/detail/detail.js"></script>
        <script src="js/jquery.dragsort-0.5.1/jquery.dragsort-0.5.1.min.js"></script>
        <script src="js/tweetBlock.js"></script>
        <script src="js/jquery.highlight/jquery.highlight.js"></script>
</head>

<body>
-->
<div class="detail_container">
    <div class="export_container"></div>
    <div class="header container"> 
        <div class="new_report">
            <input type="text" name="daypicker" placeholder="<?php echo $langArr['choose_date']; ?>" readonly/> 

            <div class="channel_select">
                <input type="text" name="channel_input" placeholder="<?php echo $langArr['choose_channel']; ?>" readonly> 
                <button name="list_kw" class="icon-uniF48B"> </button>

                <div class="channel_list list" style=>
                    <ul>
                    </ul>
                </div>
            </div>

            <div class="group_select">
                <input type="text" name="program_input" placeholder="<?php echo $langArr['choose_program']; ?>" readonly> 
                <button name="list_kw" class="icon-uniF48B"> </button>

                <div class="program_list list">
                    <ul>
                    </ul>
                </div>
            </div>

            <div class="add_settings_container"> 
                <label> <?php echo $langArr['color']; ?>: </label> <input class="color">
                <button name="add_current" class="icon-plus" disabled="disabled"> </button> 
            </div>
        </div>
        <div class="detail_settings"> <div class="table_container"> <div class="table_cell_container"> 
                    <?php echo $langArr['ad_interval']; ?> <div class="cb_container" > <input name="ads" type="checkbox" checked /> <label>.</label> </div> 
                    <?php echo $langArr['tweet_broadcast']; ?> <div class="cb_container"> <input name="tweet_launch" type="checkbox"  checked/> <label>.</label></div> </div> </div> </div> 
    </div>           
    <ul class="detail_wrapper">

    </ul>

    <div class="tweet_container container"> 
        <div class="general_tweet_container">
            <div class="buttons"><div class="down_tweets icon-spinner"> </div></div>
            <ul></ul>
        </div>
    </div>


    <!-- 

    <script>
        var detail;
        $().ready(function() {
            detail = new Detail($('body'));
            detail.initialize();
        });
    </script>
</body>



</html>
    -->