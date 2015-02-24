<?php

require_once('lib/generalConfiguration.php');
sessCtrl();

$new_lang = $_GET['lang'];
if (isset($new_lang, $uid)) {
    global $db;
    $db->setQ("UPDATE users SET lang='$new_lang' WHERE id=$uid");
    $_SESSION['lang'] = $new_lang;
    session_write_close();
} else {
    echo 'something is missing';
}
?>
