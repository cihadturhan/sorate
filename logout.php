<?php

require("lib/generalConfiguration.php");
sessCtrl();
$id = $_SESSION[$system];

$page = isset($_POST['page']) ? $_POST['page'] : ' ';

if ($_SESSION) {
    unset($_SESSION[$system]);
    unset($_SESSION['restricted']);
    header("Location: login.php");
    session_destroy();
}


$db->setQ("UPDATE users SET curr_sessions=curr_sessions-1 WHERE id='" . $id . "'");
$db->setQ("DELETE FROM sessions WHERE sess='$sid'");
loggerD($id, $_SESSION['kullanici'], $page, 'login.php', 'LOGOUT');

exit;
?>