<?php

require_once('../lib/generalConfiguration.php');
// IP MODE
// 1: tum ip adresleri
// 2: ip adresi 'ip1' degeri olan sonuclar
// 3: ip adresi ip1 ile ip2 arasinda olan sonuclar
$ip_mode = $_GET['ip_mode'];
$ip1 = $_GET['ip1'];
$ip2 = $_GET['ip2'];


// USER MODE
// 1: tum kullanicilar
// 2: kullanicilar tablosunda kayitli olmayan tum sonuclar
// 3: kullanici adi user1 icinde olan veya kullanici adi user2 icinde olmayan sonuclar
// 4: kullanici adi user1'e benzer olan user2'den de farkli olan tum sonuclar
$user_mode = $_GET['user_mode'];
$user1 = $_GET['user1'];
$user2 = $_GET['user2'];

// TIME MODE
// time1 ile time2 arasindaki zaman diliminde bulunan sonuclar
$time1 = $_GET['time1'];
$time2 = $_GET['time2'];

// STATUS MODE
// 1: tum islemler
// 2: status dizesi icindeki tum islemler
//  - 1: login
//  - 2: logout
//  - 3: login error
//  - 4: redirect ve load

$status_mode = $_GET['status_mode'];
$status = $_GET['status'];


// REGION MODE
// Uygun database veya API olamdigi icin su an kullanimda degildir
// 1: tum bolgeler
// 2: IP adresi yalnizca Istanbul'da bulunan sonuclar
// 3: IP adresi yalnizca Ankara'da bulunan sonuclar
// 4: IP adresinen bulunan ISP (Internet Service Provider) Turkcell, Avea veya Vodafone olan sonuclar
// 5: bunlarin haricindeki tum sonuclar
$region_mode = $_GET['region_mode'];
$region = $_GET['region'];

// SUSPECT MODE
// 0: tum sonuclar
// 1: suspect icin bulunan sonuclar
//  - 1: uzun sifreler (script ihtimali bulunan sonuclar)
//  - 2: kullanici adi veya sifre girilmeden yapilan tum islemler
$suspect_mode = $_GET['suspect_mode'];
$suspect = $_GET['suspect'];

// OFTEN MODE
// 0: tum sonuclar
// 1: 1 dakikadan daha cabuk giris yapanlar
// 2: 5 dakikadan daha cabuk giris yapanlar
$often_mode = $_GET['often_mode'];

// OLD MODE
// Yeni log sistemi duzgun olarak 30.11.12 tarihinde calismaya baslamistir.
// Bundan once baska bir log tablosu kullaniliyordu.
// 0: Sadece yeni sonuclar 
// 1: Eski ve yeni sonuclar beraber
$old_mode = $_GET['old_mode'];
$old_mode = ($old_mode || $old_mode == '1');


if ($old_mode && strtotime($time1) > strtotime('2012-11-30')) {
    $old_mode = 0;
}

if ($old_mode) {
    $time_old1 = $time1;
    $time_old2 = '2012-11-30 00:00';
    $time1 = '2012-11-30 00:00';
}



$selector_list = Array();
$selector_list2 = Array();

if ($ip_mode == '1') {
    $ip_selector = '';
} else if ($ip_mode == '2') {
    $ip_selector = " INET_ATON(ip) = INET_ATON('$ip1')";
} else if ($ip_mode == '3') {
    $ip_selector = " INET_ATON(ip) BETWEEN INET_ATON('$ip1') AND INET_ATON('$ip2')";
}

$ip_selector2 = $ip_selector;



array_push($selector_list, $ip_selector);
array_push($selector_list2, $ip_selector2);


if ($user_mode == '1') {
    $user_selector = '';
    $user_selector2 = '';
} else if ($user_mode == '2') {
    // Kullanici listesini alma
    $user_list = $db->getQ("SELECT kullaniciAdi FROM kullanicilar");
    // Listeyi string'e donusturme
    $user_list_str = myImplode($user_list, 'kullaniciAdi');
    // Listede olmayanlari alma
    $user_selector = " user_name NOT IN ($user_list_str)";
    $user_selector2 = " kullaniciAdi NOT IN ($user_list_str)";
} else if ($user_mode == '3') {
    $include = json_decode($user1, true);
    $exclude = json_decode($user2, true);

    if ($user1) {
        //var_dump($user1);
        $include_str = "'" . implode('\', \'', $include) . "'";
        $user_selector = " user_name IN ($include_str)";
        $user_selector2 = " kullaniciAdi IN ($include_str)";
    } else if ($user2) {
        $exclude_str = "'" . implode('\', \'', $exclude) . "'";
        $user_selector = " user_name NOT IN ($exclude_str)";
        $user_selector2 = " kullaniciAdi NOT IN ($exclude_str)";
    }
} else if ($user_mode == '4') {
    if ($user1) {
        $user_selector = " user_name LIKE '%$user1%'";
        $user_selector2 = " kullaniciAdi LIKE '%$user1%'";
        if ($user2)
            $user_selector .= " AND user_name NOT LIKE '%$user2%'";
        $user_selector2 .= " AND kullaniciAdi NOT LIKE '%$user2%'";
    } else if ($user2) {
        $user_selector = " user_name NOT LIKE '%$user2%'";
        $user_selector2 = " kullaniciAdi NOT LIKE '%$user2%'";
    }
}



array_push($selector_list, $user_selector);
array_push($selector_list2, $user_selector2);

$time_selector = " time BETWEEN '$time1' AND '$time2'";
$time_selector2 = " tarih BETWEEN '$time_old1' AND '$time_old2'";
array_push($selector_list, $time_selector);
array_push($selector_list2, $time_selector2);


if ($status_mode == '1') {
    $status_selector = '';
    $status_selector2 = '';
} else if ($status_mode == '2') {
    $status_arr = json_decode($status, true);

    if ($status_arr) {
        $status_list = Array(
            1 => " '%LOGINOK%'",
            2 => " '%LOGOUT%'",
            3 => " '%LOGINERR%'",
            4 => Array(" '%REDIRECT%'", " '%redirect%'", " '%load%'")
        );

        $status_list2 = Array(
            1 => " '%LOGINOK%'",
            2 => " '%LOGOUT%'",
            3 => " '%LOGINERR%'",
            4 => " '%GETCH%'"
        );

        $status_selector = createStatusSelector($status_list, $status_arr, 'status');
        $status_selector2 = createStatusSelector($status_list2, $status_arr, 'islem');
    }
}

array_push($selector_list, $status_selector);
array_push($selector_list2, $status_selector2);

$query_string = createQuery($selector_list);
$query_string2 = createQuery($selector_list2);


//var_dump($query_string);
//var_dump($query_string2);

$data = $db->getQKeyValue('SELECT * FROM detailed_log' . $query_string);
if ($old_mode) {
    $data2 = $db->getQKeyValue('SELECT * FROM log' . $query_string2);
}

// $data degiskenine sifre degerini ekleyip duzenler ve $data2 ile birlestirir.
format_to_print($data, $data2);


if ($often_mode == '1') {
    removeNonFrequentEntries($data, 60);
} else if ($often_mode == '2') {
    removeNonFrequentEntries($data, 300);
}

if ($suspect_mode == '1') {
    if ($suspect == '1') {
        removeShortPasswordEntries($data);
    } else if ($suspect == '2') {
        removeFilledEntries($data);
    }
}


//var_dump($data);
if ($data) {
    utf8_encode_deep($data);
    usort($data, 'cmp');
    echo json_encode($data);
}
//  Yardimci fonksiyonlar
function cmp($a, $b)
{
    return strcmp($a['time'], $b['time']);
}

function myImplode($arr, $index = 0, $is_int = false) {
    $str = "";
    $idx = ($index) ? ($index) : (0);
    $first = true;
    foreach ($arr as $key) {
        if (!$first) {
            $str.=",";
        }
        if ($is_int)
            $str.= $key[$idx];
        else
            $str.= '\'' . $key[$idx] . '\'';
        $first = false;
    }
    return $str;
}

function removeShortPasswordEntries(&$arr) {
    if ($arr) {
        $max_user_length = 30; //characters
        $max_pass_length = 20; //characters
        foreach ($arr as $key => $value) {
            if (strlen($value['user_name']) < $max_user_length && (strlen($value['password']) < $max_pass_length)) {
                unset($arr[$key]);
            }
        }
    }
}

function removeFilledEntries(&$arr) {
    if ($arr) {
        $str_tobe_replaced = Array("LOGINERR(", "LOGINERRO(", "LOGINERRA(", "LOGINERRT(", ")");

        foreach ($arr as $key => $value) {
            if (strlen($value['user_name']) != 0 && (strlen($value['password']) != 0)) {
                unset($arr[$key]);
            }
        }
    }
}

function removeNonFrequentEntries(&$arr, $seconds) {
    $prevError = Array();
    $prev_key = 0;
    foreach ($arr as $key => $value) {
        $name = $value['user_name'];
        $time = strtotime($value['time']);

        if ($prevError[$name]['time1'] &&
                ($time - $prevError[$name]['time1'] > $seconds)) {
            if ($prevError[$name]['time0'] &&
                    ($prevError[$name]['time1'] - $prevError[$name]['time0'] > $seconds)) {
                unset($arr[$prev_key]);
            }
        }

        $pprev_key = $prev_key;
        $prev_key = $key;
        $prevError[$name]['time0'] = $prevError[$name]['time1'];
        $prevError[$name]['time1'] = $time;
    }
}

function createStatusSelector($status_list, $status_arr, $field) {

    $filter_arr = Array();
    foreach ($status_arr as $key => $value) {
        if (count($status_list[$value]) > 1) {
            foreach ($status_list[$value] as $subvalue) {
                array_push($filter_arr, " $field LIKE" . $subvalue);
            }
        } else {
            array_push($filter_arr, " $field LIKE" . $status_list[$value]);
        }
    }

    $status_selector = " (" . implode(' OR', $filter_arr) . " )";
    if (!$filter_arr) {
        $status_selector = '';
    }
    return $status_selector;
}

function createQuery($selector_list) {

    foreach ($selector_list as $key => $currSelector) {

        if (!$currSelector || $currSelector == '') {
            unset($selector_list[$key]);
        }
    }
    if (count($selector_list) > 0) {
        $query_string = ' WHERE' . implode(' AND', $selector_list);
    } else {
        $query_string = '';
    }
    return $query_string;
}

function format_to_print(&$data, &$data2) {
    if (count($data) > 0) {
        foreach ($data as $key => $value) {
            $status_arr = explode('(', $data[$key]['status']);
            $userPass = explode('::', $status_arr[1]);
            $k_adi = trim($userPass[0]);
            $sifre = str_replace(')', '', trim($userPass[1]));
            $data[$key]['password'] = $sifre;
            $data[$key]['status'] = $status_arr[0];
        }
    }
    if ($data2) {
        if (!$data)
            $data = Array();
        foreach ($data2 as $key => $value) {
            $row = Array();
            $row['log_id'] = 'o' . $value['id'];
            $row['id'] = $value['kullanici'];
            $row['time'] = $value['tarih'];
            $row['status'] = $value['islem'];
            $row['ip'] = $value['ip'];
            $row['password'] = $value['data'];
            $row['user_name'] = $value['kullaniciAdi'];
            array_push($data, $row);
        }
    }
}

// The function
function utf8_encode_deep(&$input) {
    if (is_string($input)) {
        $input = iconv("ISO-8859-9", "UTF-8", $input);
    } else if (is_array($input)) {
        foreach ($input as &$value) {
            utf8_encode_deep($value);
        }

        unset($value);
    } else if (is_object($input)) {
        $vars = array_keys(get_object_vars($input));

        foreach ($vars as $var) {
            utf8_encode_deep($input->$var);
        }
    }
}

?>
