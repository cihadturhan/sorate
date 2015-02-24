<?php

require_once('../lib/generalConfiguration.php');

$user_ = 0;

$u_list = $db->getQKeyValue("SELECT id, kullaniciAdi FROM kullanicilar");
$user_list = Array();
foreach ($u_list as $key) {
    $user_list[$key['id']] = $key['kullaniciAdi'];
}

$data = $db->getQKeyValue("SELECT kullanici,id, data FROM log2 LIMIT");

$key = 1;
foreach ($data as $value) {
    $sifre = '';
    if ($value['kullanici'] == '0') {
        $data_arr = explode('::', $value['data']);
        $k_adi = trim($data_arr[0]);
        $sifre = trim($data_arr[1]);
    } else {
        $k_adi = $user_list[$value['kullanici']];
    }

    //$db->setQ('UPDATE log2 SET kullaniciAdi=\'' . $k_adi . '\', data=\''. $sifre .'\' WHERE id=' . trim($value['id']));
    echo 'UPDATE log2 SET kullaniciAdi=\'' . $k_adi . '\', data=\''. $sifre .'\' WHERE id=' . trim($value['id']).'<br/>';
    if ($key % 1 == 0)
        echo $key++ .  "\n";
}
?>