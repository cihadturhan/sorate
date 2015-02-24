<?php

require('../lib/generalConfiguration.php');
sessCtrl();

global $_SESSION;
$admin = $db->getQ("SELECT admin FROM $t_users WHERE id = " . $uid);



if ($admin[0][0] == '0') {
    echo "alert('Giriş zaman yönetimi için yönetici olmanız gerekmektedir.')";
    echo "window.location.href = 'index.php'; </script>";
}
$kullanicilar = $db->getQ("SELECT id, user_name FROM $t_users ORDER BY user_name");

$clicked_id = isset($_GET['id']) ? $_GET['id'] : false;
if ($clicked_id) {
    if ($clicked_id == 'otomatik') {
        $clicked_arr = max($kullanicilar);
        $clicked_id = $clicked_arr['id'];
    }
} else {
    $clicked_id = $uid;
}

require('UIPrint.php');
?>
