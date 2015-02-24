<?php
require_once("lib/generalConfiguration.php");
sessCtrl();
session_write_close();

echo file_get_contents("http://91.93.132.76/getHashCategory.php");

?>
