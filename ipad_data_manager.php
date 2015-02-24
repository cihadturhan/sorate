<?php

require_once('lib/ipadGeneralConfiguration.php');
require('tweetdata.php');

if (!isset($_GET['mod'])) {
    echo 'mod is not defined.';
    exit;
}


$queryArr = $_GET;
$url = '';
$ip = '37.59.14.11';
$servlet = 'WebiaSocialMedia';
error_reporting(E_ALL);


switch ($_GET['mod']) {
    case 'instant':
        unset($queryArr['mod']);

        $get_query_arr = Array('keylist', 'timeInterval', 'timeMultiplier');
        control_get_arr($get_query_arr);

        $url = "http://$ip:8080/$servlet/TwitterChartServlet";

        $result = post($url, $queryArr);
        break;

    case 'tweet':
        unset($queryArr['mod']);

        $get_query_arr = Array('keylist', 'tweet_id', 'direction', 'viewport_size');
        control_get_arr($get_query_arr);

        $url = "http://$ip:8080/$servlet/TwitterListServlet";

        $result = post($url, $queryArr);
        break;

    case 'count':
        unset($queryArr['mod']);

        $get_query_arr = Array('keylist', 'tweet_id');
        control_get_arr($get_query_arr);

        $url = "http://$ip:8080/$servlet/TwitterCountServlet";

        $result = post($url, $queryArr);
        break;

    case 'detail':
        unset($queryArr['mod']);
        $get_query_arr = Array('keylist', 'starttime', 'endtime', 'datatype');
        control_get_arr($get_query_arr);

        $url = "http://$ip:8080/$servlet/TwitterCountWithTimeServlet";

        $result = post($url, $queryArr);
        break;
    case 'tweetinterval':
        unset($queryArr['mod']);

        $get_query_arr = Array('keylist', 'starttime', 'endtime');

        control_get_arr($get_query_arr);

        //var_dump($queryArr);

        $url = "http://$ip:8080/$servlet/TweetListWithTimeServlet";
        $result = post($url, $queryArr);
        break;
    case 'table':
        unset($queryArr['mod']);
        $get_query_arr = Array('starttime', 'endtime', 'category', 'columns');
        control_get_arr($get_query_arr);

        $url = "http://$ip:8080/$servlet/TopListServlet";

        $result = post($url, $queryArr);
        /* $res = json_decode( file_get_contents($_GET['category'] != '0000' ? $ptableData : $ttableData),true);
          $result = json_encode($res['result']) ; */
        break;
    case 'first':
        unset($queryArr['mod']);
        $get_query_arr = Array('sentence');
        control_get_arr($get_query_arr);
        $url = "http://$ip:8080/$servlet/FirstTweetServlet";

        $result = post($url, $queryArr);
        //$result = $firstTweetData;
        break;
    case 'tile':
        unset($queryArr['mod']);
        $result = $tileData;
        break;
    case 'map':
        unset($queryArr['mod']);
        $get_query_arr = Array('startX', 'startY', 'endX', 'endY', 'zoom'); //TODO - mode
        control_get_arr($get_query_arr);
        $url = 'http://localhost:8080/ClusterServer/ClusterServlet';
        $result = post($url, $queryArr);
        break;
    default:
        echo 'Mod is not known (' . $_GET['mod'] . ')';
        exit;
}
echo $result;
?>
