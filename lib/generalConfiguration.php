<?php

error_reporting(E_ALL);

header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: text/html; charset=UTF-8');

date_default_timezone_set('Europe/Istanbul');
$current_seconds = time();
set_time_limit(90);

$file_list = null;
$modules = null;

require_once("mysqlConnection.php");
$conn = 'mysqlConn';
$db = new $conn;
$system = $db->db;

session_name($system);
session_start();

$uid = isset($_SESSION[$system]) ? $_SESSION[$system] : null;
$sid = session_id();

if (isset($_SESSION['lang'])) {
    $lang = $_SESSION['lang'];
} else {
    if (isset($_COOKIE['lang']))
        $lang = $_COOKIE['lang'];
    else
        $lang = 'en';
}

//table names
$t_permissions = 'permissions';
$t_users = 'users';
$t_lang = 'lang';
$t_sessions = 'sessions';
$t_log = 'log';
$t_mainlog = 'mainlog';
$t_files = 'files';
$t_utypes = 'user_types';
$t_modules = 'modules';
$t_request_log = 'request_log';
$t_error_log = 'error_log';
$t_feedback = 'feedback';

require_once("generalFunctions.php");
require_once('Browser.php');
require_once('UI_print.php');

$allowed_browsers = Array('chrome');
$browser = new Browser;

$langArr = getLang($lang);
$modules = getAllowedModules();

addHostName();
?>
