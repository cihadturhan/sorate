<?php
require("lib/generalConfiguration.php");
?>
<!-- 
<!DOCTYPE html>
<html  lang="tr-TR">
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link rel="stylesheet" href="css/reset.css"/>
        <link rel="stylesheet" href="css/common.css"/>
        <link rel="stylesheet" href="css/jquery.tagsinput/jquery.tagsinput.css"/>
        <link rel="stylesheet" href="css/jquery-ui/jquery-ui-1.10.1.custom.min.css" />
        <link rel="stylesheet" href="css/geotweet.css"/>
        <link rel="stylesheet" href="css/icons/style.css"/>
        <link rel="stylesheet" href="css/anims.css"/>

        <link rel="stylesheet" href="css/leaflet/leaflet.css" />
        <link rel="stylesheet" href="css/leaflet/plugins/leaflet-markercluster/MarkerCluster.css" />

        <script src="js/moment/moment.min.js"></script>
        <script src="js/jquery-1.9.0/jquery.min.js"></script>
        <script src="js/helper.js"></script>
        <script src="js/jquery.tagsinput/jquery.tagsinput.min.js"></script>
        <script src="js/jquery.transit-0.9.9/jquery.transit.min.js"></script>
        <script src="js/jqueryui-1.10.0/jquery-ui-1.10.3.custom.min.js"></script>
        <script src="js/Modules/Common.js"></script>

        <script src="js/tweetBlock.js"></script>
        <script src="js/jquery.highlight/jquery.highlight.js"></script>


        <script src="js/leaflet/leaflet5.1.js"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB85xCCAVvyMsfMKwnmyI_pqlEKcrxRSL0&sensor=false"></script>
        <script src="js/leaflet/plugins/Google.js"></script>
        <script src="js/leaflet/plugins/leaflet-markercluster/leaflet.markercluster-src.js"></script>
        <script src="js/leaflet/plugins/heatmap/heatmap.js"></script>
        <script src="js/leaflet/plugins/heatmap/heatmap-leaflet.js"></script>
        <script src="js/Modules/geotweet.js"></script>




    </head>

    <body> 
-->
<div class="geotweet_container">

    <div class="loading_overlay"> <?php echo $langArr['precalculate']; ?> </div>
    <div class="header container">
        <div class="selection_container">
            <div class="date_select">
                <input type="text" name="daypicker" value="" placeholder="<?php echo $langArr['choose_date']; ?>" />
            </div>
        </div>

        <div class="popular_container"> 
            <span class="header" style="opacity: 1;"><?php echo $langArr['trending_topics_in']; ?></span>
            <div class="hashtag_container"> 
                <a class="prior0"> 1 </a>
                <a class="prior1"> 2 </a>
                <a class="prior2"> 3 </a>
                <a class="prior3"> 4 </a>
                <a class="prior4"> 5 </a>
            </div>
        </div>

        <div class="map_mode">
            <span class="maptype header"><?php echo $langArr['map_type']; ?></span>
            <div class="button_container">
                <button class="mode_select selected" data-mode="cluster"><?php echo $langArr['cluster']; ?></button><button class="mode_select" data-mode="heatmap"><?php echo $langArr['heatmap']; ?></button>
            </div>
        </div>

    </div>
    <div class="map">

    </div>

    <div class="tweet_container container"> 
        <div class="general_tweet_container">
            <div class="buttons"><div class="down_tweets icon-spinner" style="display: none;"> </div></div>
            <ul></ul>
        </div>
    </div>
</div>

<!-- 
       <script>
           var geotweet;
           //TO-D0: Delete lang_array
           var lang_array = {"user_name": "User Name", "password": "Password", "login": "LOGIN", "is_a": " is a registered trademark of SBT. All rights reserved.  ", "type_to": "Type to add.", "last": "Last", "hour": "hour", "time_interval": "Time Interval", "minute": "minute", "new_tweets": "new tweets.", "auto_update": "Auto Update", "hi": "Hi", "new_report": "New Report", "ad_interval": "Ad Interval", "cumulative": "cumulative", "tweet_broadcast": "Tweet Broadcast", "choose_date": "Choose Date", "choose_channel": "Choose Channel", "color": "Color", "group_name": "Group Name", "words": "Words", "tweets": "tweets", "remove": "Remove", "lang": "en", "choose_program": "Choose Program", "m": "m", "hr": "hr", "all": "All", "total_tweets": "Total Tweets", "unique_users": "Unique Users", "rank": "Rank", "logout": "Logout", "feedback": "Feedback", "user": "User", "comment": "Comment", "attach_pictures": "Attach pictures (jpeg, png ve gif):", "send": "Send", "sending": "Sending...", "sent": "Sent!", "series": "Series", "news": "News", "entertainment": "Entertainment", "sport": "Sport", "categories": "Categories", "columns": "Columns", "selected": "Selected", "reach": "Reach", "retweets": "Retweets", "list": "LIST", "programs": "Programs", "topics": "Topics", "popular_tv": "Popular TV Programs", "hourly": "Hourly", "daily": "Daily", "weekly": "Weekly", "monthly": "Monthly", "listing_criteria": "Listing Criteria", "trending_topics": "Trending Topics", "html_lang": "en", "title": "soRate - Social Rating Measure Platform", "err": "User name or password is wrong.", "erra": "User is not active.", "erro": "Session limit is full.", "errt": "You have no permission in this time period.", "no_tweet": "No tweet sent in this time period.", "new_keyword": "New Keyword", "hashtags": "Hashtags", "channels": "Channels", "choose_time": "Choose Time Interval", "no_program": "No program found.", "trending_topics_in": "Trending Topics in Here"};
           $().ready(function() {
               geotweet = new GeoTweet($('.geotweet_container'));
               geotweet.initialize();
           });
       </script>

   </body>

</html> -->