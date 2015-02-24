<?php

require('../lib/generalConfiguration.php');

$user_name = $_GET['kul_adi'];

$mod = $_GET['mod'];
if ($_GET['id']) {
    $id = $_GET['id'];
} else {
    $id = $db->getQ("SELECT id FROM $t_users WHERE user_name='$user_name'");
}

$zaman_id = $_GET['z_id'];

if ($id || $zaman_id) {

    $hourMin = 60;
    $dayMin = $hourMin * 24;
    $weekMin = $dayMin * 7;
    $start_date = '1990-01-01 00:00';
    $start_time = mktime(0, 0, 0, 1, 1, 1990);

    $hr1 = intval(substr($_GET['saat1'], 0, 2));
    $min1 = intval(substr($_GET['saat1'], 3, 5)); 
    $hr2 = intval(substr($_GET['saat2'], 0, 2));
    $min2 = intval(substr($_GET['saat2'], 3, 5));

    $total_min1 = $hr1 * $hourMin + $min1;
    $total_min2 = $hr2 * $hourMin + $min2;

    $baslangic = $_GET['baslangic'];
    $bitis = $_GET['bitis'];
    $zaman = $_GET['zaman'];
    $time = ($_GET['zaman'] == '1') ? (true) : (false);
    $tekrarli = ($_GET['tekrarli'] == 'true') ? (1) : (0);

    if ($mod == 'ekle') {


        if ($tekrarli) {
            if (!$time) {
                $total_min1 += intval($_GET['gun1']) * $dayMin;
                $total_min2 += intval($_GET['gun2']) * $dayMin;
            }
            $db->setQ("INSERT $t_permissions VALUES($id, '$baslangic', '$bitis' , $tekrarli, $zaman, $total_min1, $total_min2,0)");
        } else {
            $db->setQ("INSERT $t_permissions VALUES($id, '$baslangic','$bitis',$tekrarli,0,0,0,0)");
        }
    } elseif ($mod == 'duzenle') {
        if ($tekrarli) {
            if (!$time) {
                $total_min1 += intval($_GET['gun1']) * $dayMin;
                $total_min2 += intval($_GET['gun2']) * $dayMin;
            }
            $db->setQ("UPDATE $t_permissions SET id=$id, `start`='$baslangic', `end`='$bitis', `repeat`=$tekrarli, daily=$zaman, interval_start=$total_min1, interval_end = $total_min2 WHERE time_id = $zaman_id");
        } else {
            $db->setQ("UPDATE $t_permissions SET id=$id, `start`='$baslangic', `end`='$bitis', `repeat`=$tekrarli, daily=0, interval_start=0, interval_end = 0 WHERE time_id = $zaman_id");
        }
    } elseif ($mod == 'sil') {
        $zaman_id = $_GET['z_id'];
        echo $db->setQ("DELETE FROM $t_permissions WHERE time_id=$zaman_id");
    } elseif ($mod == 'get') {
        $id = $data[0]['id'];
        $zaman_id = $_GET['z_id'];
        $data = $db->getQ("SELECT * FROM $t_permissions WHERE time_id = $zaman_id");
        $kullanici = $db->getQ("SELECT user_name FROM $t_users where id= $id");
        $data[0]['kullaniciAdi'] = $kullanici[0]['user_name'];
        echo utf8_encode(json_encode($data));
    } else if ($mod == 'uget') {
        $data = $db->getQ("SELECT * FROM $t_permissions WHERE id = $id");
        echo json_encode($data);
    } else {
        echo 'wrong mode';
    }
}
?>
