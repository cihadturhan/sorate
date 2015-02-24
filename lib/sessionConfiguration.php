<?php
error_reporting(E_ALL);

set_time_limit(0);

require_once("mysqlConnection.php");
$conn = 'mysqlConn';
$db = new $conn;
$system = $db->db;

require_once("generalFunctions.php");
?>
