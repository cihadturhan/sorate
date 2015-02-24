<?php
error_reporting(E_ALL);

header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: text/html; charset=UTF-8');

date_default_timezone_set('Europe/Istanbul');
set_time_limit(90);


require_once("mysqlConnection.php");
require_once("generalFunctions.php");
$conn = 'mysqlConn';
$db = new $conn;
$system = $db->db;

$t_permissions = 'permissions';
$t_users = 'users';
$t_lang = 'lang';
$t_sessions = 'sessions';
$t_log = 'log';


?>