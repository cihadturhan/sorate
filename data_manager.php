<?php

require_once('lib/generalConfiguration.php');
//require('tweetdata.php');
if (!isLoggedOut()) {
    echo '*';
    exit;
} else {
    sessCtrl();
}

session_write_close();

$MY_GET = $_GET;
$module = $MY_GET['module'];
$mode = $MY_GET['mod'];
$client_ip = getIP();

unset($MY_GET['module']);
unset($MY_GET['mod']);

$request = json_encode($MY_GET);

if (!isset($_GET['mod'])) {
    echo 'mod is not defined.';
    exit;
}
// Eger mod yanlis gelmisse request loglamasi yapilmayacaktir
$log_id = logRequest($module, $mode, $request, 0);

$log_vars = Array(
    'phpSendTime' => date("Y-m-d H:i:s"),
    'userId' => $uid,
    'userName' => $_SESSION['kullanici'],
    'ip' => $client_ip,
    'module' => $module,
    'mod' => $mode,
    'id' => $log_id
);

$MY_GET['log'] = json_encode($log_vars);

$url = '';
$ip = $_SERVER['REMOTE_ADDR'] == '10.10.10.105' ? '10.10.10.105' : '46.4.132.166';
//$ip = '46.4.132.166';
//$ip = 'localhost';
//$ip = '192.168.1.48';
$servlet = 'WebiaSocialMedia';

//error_reporting(E_ALL);

function fileExists($path) {
    return (@fopen($path, "r") == true);
}

switch ($mode) {
    case 'instant':
        $get_query_arr = Array('keylist', 'timeInterval', 'timeMultiplier');
        control_get_arr($get_query_arr);

        $url = "http://$ip:8080/$servlet/TwitterChartServlet";

        $result = post($url, $MY_GET);
        break;

    case 'tweet':
        $get_query_arr = Array('keylist', 'tweet_id', 'direction', 'viewport_size');
        control_get_arr($get_query_arr);

        $url = "http://$ip:8080/$servlet/TwitterListServlet";

        $result = post($url, $MY_GET);
        break;

    case 'count':
        $get_query_arr = Array('keylist', 'tweet_id');
        control_get_arr($get_query_arr);

        $url = "http://$ip:8080/$servlet/TwitterCountServlet";

        $result = post($url, $MY_GET);
        break;

    case 'detail':
        $get_query_arr = Array('keylist', 'starttime', 'endtime', 'datatype');
        control_get_arr($get_query_arr);

        $url = "http://$ip:8080/$servlet/TwitterCountWithTimeServlet";

        $result = post($url, $MY_GET);
        break;
    case 'tweetinterval':
        $get_query_arr = Array('keylist', 'starttime', 'endtime');

        control_get_arr($get_query_arr);

        //var_dump($MY_GET);

        $url = "http://$ip:8080/$servlet/TweetListWithTimeServlet";
        $result = post($url, $MY_GET);
        break;
    case 'table':
        $get_query_arr = Array('starttime', 'endtime', 'category', 'columns');
        control_get_arr($get_query_arr);

        $url = "http://$ip:8080/$servlet/TopListServlet";

        $result = post($url, $MY_GET);
        /* $res = json_decode( file_get_contents($_GET['category'] != '0000' ? $ptableData : $ttableData),true);
          $result = json_encode($res['result']) ; */
        break;
    case 'first':
        $get_query_arr = Array('sentence');
        control_get_arr($get_query_arr);
        $url = "http://$ip:8080/$servlet/FirstTweetServlet";
        $result = post($url, $MY_GET);
        //$result = $firstTweetData;
        break;
    case 'tile':
        $result = $tileData;
        break;
    case 'map':
        $get_query_arr = Array('startX', 'startY', 'endX', 'endY', 'starttime', 'endtime', 'zoom', 'mode', 'id', 'keylist');
        control_get_arr($get_query_arr);
        $url = "http://$ip:8080/$servlet/ClusterServlet";
        $result = post($url, $MY_GET);
        break;
    case 'tweetid':
        $get_query_arr = Array('mode');
        control_get_arr($get_query_arr);
        $url = "http://$ip:8080/$servlet/ClusterServlet";
        $result = post($url, $MY_GET);
        break;
    case 'dashboard':
        $get_query_arr = Array('starttime', 'endtime', 'keylist', 'mode', 'size');
        control_get_arr($get_query_arr);
        $url = "http://$ip:8080/$servlet/TopModulesServlet";
        $result = post($url, $MY_GET);
        if ($MY_GET['mode'] == 'top_pictures') {
            $links = json_decode($result, true);
            foreach ($links as $key => $value) {
                if (!fileExists($value[0])) {
                    unset($links[$key]);
                }
            }
            $result = json_encode(array_values($links));
        }
        break;
    case 'dashboard2':
        $get_query_arr = Array('starttime', 'endtime', 'keylist', 'mode', 'size');
        control_get_arr($get_query_arr);
        $url = "http://$ip:8080/$servlet/TopModulesServlet";
        $result = post($url, $MY_GET);
        break;
    case 'spamfilter':
        $get_query_arr = Array('query', 'starttime', 'endtime');
        control_get_arr($get_query_arr);
        $url = "http://$ip:8080/$servlet/DashboardServlet";
        $result = post($url, $MY_GET);
        json_encode($result);
        break;
    case 'spamAssign':
        $get_query_arr = Array('query', 'starttime', 'endtime', 'type');
        control_get_arr($get_query_arr);
        $url = "http://$ip:8080/$servlet/SpamServlet";
        $result = post($url, $MY_GET);
        break;
    case 'TweetWithServlet':
        $get_query_arr = Array('date', 'keylist', 'mode', 'size');
        break;
    case 'alert_list':
        $get_query_arr = Array('action');
        control_get_arr($get_query_arr);
        $url = "http://$ip:8080/$servlet/AlertServlet";
        $result = post($url, $MY_GET);
        break;
    case 'main':
        $get_query_arr = Array('first');
        control_get_arr($get_query_arr);
        $url = "http://$ip:8080/$servlet/LoginServlet";
        $result = post($url, $MY_GET);
        break;
    default:
        echo 'Mod is not known (' . $_GET['mod'] . ')';
        exit;
}
echo $result;
?>
