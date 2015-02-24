<?php
require_once('lib/generalConfiguration.php');
session_write_close();

$MY_GET = $_GET;

unset($MY_GET['module']);
unset($MY_GET['mod']);

if (!isset($_GET['mod'])) {
    echo 'mod is not defined.';
    exit;
}


$queryArr = $_GET;
$url = '';
$ip = $_SERVER['REMOTE_ADDR'] == '192.168.1.184' ? '192.168.1.184' : '46.4.132.166';
$servlet = 'WebiaSocialMedia';

//error_reporting(E_ALL);

function fileExists($path) {
    return (@fopen($path, "r") == true);
}

switch ($_GET['mod']) {
    case 'main':
        unset($queryArr['mod']);
        $get_query_arr = Array('first');
        control_get_arr($get_query_arr);

        $url = "http://$ip:8080/$servlet/LoginServlet";
        $result = post($url, $queryArr);
        break;
    default:
        echo 'Mod is not known (' . $_GET['mod'] . ')';
        exit;
}

echo $result;
?>
