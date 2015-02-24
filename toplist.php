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
        <link rel="stylesheet" href="css/jquery.timepicker/jquery-ui-timepicker-addon.css" />
        <link rel="stylesheet" href="css/main.css"/>
        <link rel="stylesheet" href="css/toplist.css"/>
        <link rel="stylesheet" href="css/common.css"/>
        <link rel="stylesheet" href="css/icons/style.css"/>

        <script src="js/jquery-1.9.0/jquery.min.js"></script>
        <script src="js/input.js"></script>
        <script src="js/helper.js"></script>
        <script src="js/colorpicker/jscolor.js"></script>
        <script src="js/jquery.tagsinput/jquery.tagsinput.min.js"></script>
        <script src="js/jquery.transit-0.9.9/jquery.transit.min.js"></script>
        <script src="js/jqueryui-1.10.0/jquery-ui-1.10.3.custom.min.js"></script>
        <script src="js/highcharts-3.0.1/highcharts.js"></script>
        <script src="js/moment/moment.dev.min.js"></script>
        <script src="js/moment/tr.js"></script>
        <script src="js/jquery.scrollTo-1.4.3.1/jquery.scrollTo-1.4.3.1-min.js"></script>
        <script src="js/jquery.mousewheel/jquery.mousewheel.js"></script>
        <script src="js/jquery.tablesorter/jquery.tablesorter.min.js"></script>
        <script src="js/Modules/Common.js"></script>
        <script src="js/Modules/toplist.js"></script>
        <script src="js/jquery.timepicker/jquery-ui-timepicker-addon.js"></script>
    </head>
    <body>   
-->
        <div class="toplist_container">
            <div class="export_container"> </div>
            <div class="acordion_container container"> 
                <div class="acordion" data-id="program">
                    <button class="header selected"> Program </button>
                    <div class="body"> 
                        <div class="title">
                            <h1 class="subtitle"> <?php echo $langArr['time_interval']; ?> </h1>
                            <div class="time_select_container">
                                <button class="time_select" data-id="week"> <?php echo $langArr['weekly']; ?> </button><button class="time_select" data-id="month">  <?php echo $langArr['monthly']; ?> </button>
                            </div>
                            <label class="program_start"> <?php echo $langArr['choose_time']; ?> </label>
                            <label class="program_end"> </label>
                            <div class="program_date"> </div>
                        </div>
                        <div class="title">
                            <h1 class="subtitle"> <?php echo $langArr['categories']; ?> <span> </span></h1>

                            <input type="checkbox" name="s1" checked><span> <?php echo $langArr['series']; ?> </span>
                            <input type="checkbox" name="s2" checked><span> <?php echo $langArr['news']; ?> </span><br/>
                            <input type="checkbox" name="s3" checked><span> <?php echo $langArr['entertainment']; ?> </span>
                            <input type="checkbox" name="s4" checked><span> <?php echo $langArr['others']; ?> </span><br/>
                        </div>
                        <div class="title"> 
                            <h1 class="subtitle"> <?php echo $langArr['columns']; ?> </h1>
                            <table>
                                <thead><tr> <th> </th><th> <?php echo $langArr['selected']; ?> </th><th> <?php echo $langArr['listing_criteria']; ?> </th></tr><thead>
                                <tbody data-type="program">

                                <tbody>
                            </table>
                        </div>
                        <div class="list_container"> <button class="list_button" disabled="disabled"> <?php echo $langArr['list']; ?> </button> </div>
                    </div>


                </div>

                <div class="acordion" data-id="topic">
                    <button class="header"> <?php echo $langArr['topics']; ?> </button>
                    <div class="body">
                        <div class="title">
                            <h1 class="subtitle"> <?php echo $langArr['time_interval']; ?> </h1>
                            <div class="time_select_container">
                                <button class="time_select" data-id="hour"> <?php echo $langArr['hourly']; ?> </button><button class="time_select" data-id="day"> <?php echo $langArr['daily']; ?> </button><button class="time_select" data-id="week"> <?php echo $langArr['weekly']; ?> </button><button class="time_select" data-id="month"> <?php echo $langArr['monthly']; ?> </button>
                            </div>
                            <label class="topic_start"> <?php echo $langArr['choose_time']; ?> </label>
                            <label class="topic_end"> </label>
                            <div class="topic_date"> </div>
                        </div>

                        <div class="title"> <h1 class="subtitle"> <?php echo $langArr['columns']; ?> </h1>
                            <table>
                                <thead><tr> <th> </th><th> <?php echo $langArr['listing_criteria']; ?> </th></tr><thead>
                                <tbody data-type="topic"></tbody>
                            </table>
                        </div>
                        <div class="list_container"> <button class="list_button" disabled="disabled" > <?php echo $langArr['list']; ?> </button> </div>
                    </div>
                </div>

            </div>
            <div class="result_table_container">
                <div class="container p_table_container">
                    <div class="table_header"><h1> <?php echo $langArr['popular_tv']; ?> </h1> 
                        <h2> </h2> <h3> </h3> 
                    </div>
                    <div class="result"> </div>
                </div>
                <div class="container t_table_container">
                    <div class="table_header"> <h1> <?php echo $langArr['trending_topics']; ?> </h1> 
                        <h2> </h2> <h3> </h3> 
                    </div>
                    <div class="result"> </div>
                </div>
            </div>
        </div>
<!-- 
        <script>
            var toplist;
            $().ready(function() {
                toplist = new Toplist($('.toplist_container'));
                toplist.start();
                toplist.initialize();
            });
        </script>
    </body>



</html>
 -->