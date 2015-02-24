<?php
require("lib/generalConfiguration.php");
?>
<!DOCTYPE html>
<html  lang="tr-TR">
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <link rel="stylesheet" href="css/reset.css"/>
        <link rel="stylesheet" href="css/colorpicker/colorpicker.css"/>
        <link rel="stylesheet" href="css/jquery.tagsinput/jquery.tagsinput.css"/>
        <link rel="stylesheet" href="css/jquery-ui/jquery-ui-1.10.1.custom.min.css" />
        <link rel="stylesheet" href="css/evaluate.css"/>
        <link rel="stylesheet" href="css/common.css"/>
        <link rel="stylesheet" href="css/anims.css"/>
        <link rel="stylesheet" href="css/icons/style.css"/>

        <script src="js/jquery-1.9.0/jquery.min.js"></script>
        <script src="js/Modules/Common.js"></script>
        <script src="js/input.js"></script>
        <script src="js/helper.js"></script>
        <script src="js/jquery.transit-0.9.9/jquery.transit.min.js"></script>
        <script src="js/jqueryui-1.10.0/jquery-ui-1.10.3.custom.min.js"></script>
        <script src="js/moment/moment.min.js"></script>
        <script src="js/moment/tr.js"></script>
        <script src="js/jquery.highlightRegex/highlightRegex.min.js"></script>
        <script src="js/tweetBlock.js"></script>
        <script src="js/jquery.scrollTo-1.4.3.1/jquery.scrollTo-1.4.3.1-min.js"></script>
        <script src="js/Modules/evaluate.js"></script>

        <style>

            body,html{
                width:100%;
                height:100%;
                position: relative;
            }
        </style>
    </head>
    <body>
        <div class="evaluate_container">
            <div class="tweet_container container"> 
                <div class="general_tweet_container notevaluated" >
                    <div class="container_header"> Değerlendirilmemiş </div>
                    <div class="buttons"><div class="up_tweets icon-spinner" > </div></div>
                    <div class="new_tweets"><button name="show_tweets" > <span class="new_tweet_no">0</span> <span class="new_tweet_text"> <?php echo $langArr['new_tweets']; ?> </span> </button>
                        <div class="autoupdate"> <?php echo $langArr['auto_update']; ?>   <div class="cb_container"> <input name="autoupdate" type="checkbox"> <label>.</label></div> </div> 
                    </div>
                    <ul> </ul>
                    <div class="buttons"><div class="down_tweets icon-spinner" > </div></div>
                </div>
            </div>

            <div class="bottom_container">
                <div class="tweet_container container"> 
                    <div class="container_header"> Negatif </div>
                    <div class="general_tweet_container negative" >
                        <div class="buttons"><div class="up_tweets icon-spinner" > </div></div>
                        <div class="new_tweets"><button name="show_tweets" > <span class="new_tweet_no">0</span> <span class="new_tweet_text"> <?php echo $langArr['new_tweets']; ?> </span> </button>
                        </div>
                        <ul> </ul>
                        <div class="buttons"><div class="down_tweets icon-spinner" > </div></div>
                    </div>
                </div>
                <div class="tweet_container container">
                    <div class="container_header"> Nötr/Kararsız </div>
                    <div class="general_tweet_container notr" >
                        <div class="buttons"><div class="up_tweets icon-spinner" > </div></div>
                        <ul> </ul>
                        <div class="buttons"><div class="down_tweets icon-spinner" > </div></div>
                    </div>
                </div>
                <div class="tweet_container container">
                    <div class="container_header"> Pozitif </div>
                    <div class="general_tweet_container positive" >
                        <div class="buttons"><div class="up_tweets icon-spinner" > </div></div>
                        <ul> </ul>
                        <div class="buttons"><div class="down_tweets icon-spinner" > </div></div>
                    </div>
                </div>
            </div>
        </div>
        <script>

            var evaluate;
            user_id = 63;
            $().ready(function() {
                evaluate = new Evaluate($('body'));
                evaluate.initialize();
            });
        </script>
    </body>



</html>