<?php

require_once('../lib/generalConfiguration.php');

$mod = $_GET['mod'];
$id = $_GET['kull_id'];
$start = $_GET['start'];
$end = $_GET['end'];
$user_name = $_GET['kull_adi'];

$sifre = $_GET['sifre'];
$aktif = $_GET['aktif'];
$admin = $_GET['admin'];
$maxOturum = $_GET['maxOturum'];
$kullaniciTipi = $_GET['kullaniciTipi'];
$lang = $_GET['lang'];

// 
$error = $_GET['error'] == 'true';
$login = $_GET['login'] == 'true';
$logout = $_GET['logout'] == 'true';
$load = $_GET['load'] == 'true';



if ($id) {
    if ($mod) {
        if ($mod == 'get') {
            $data = $db->getQ("SELECT * FROM $t_users WHERE id = $id");
            echo json_encode($data);
            exit;
        }
    }
}

if ($mod == 'logd') {
    if ($user_name) {
        $filter_str = "";

        if ($login && $logout && $error && $load) {
            $filter_str = "";
        } else {
            $filter_arr = Array(
                0 => "status LIKE '%LOGINOK%' ",
                1 => "status LIKE  '%LOGOUT%' ",
                2 => "status LIKE '%LOGINERR%' ",
                3 => "status LIKE '%REDIRECT%' ",
                4 => "status LIKE  '%redirect%' ",
                5 => "status LIKE  '%LOAD%' ");

            $filter_str .= ' AND (';
            if (!$login)
                unset($filter_arr[0]);
            if (!$logout)
                unset($filter_arr[1]);
            if (!$error)
                unset($filter_arr[2]);
            if (!$load) {
                unset($filter_arr[3]);
                unset($filter_arr[4]);
                unset($filter_arr[5]);
            }
            $filter_str .= implode('OR ', $filter_arr);
            $filter_str .= ') ';

            if ($filter_arr == null) {
                $filter_str = '';
            }
        }

        $data = $db->getQ("SELECT time, page_from, page_to, status, ip, sess_id FROM $t_log where user_name like '%$user_name%' AND time BETWEEN '$start' AND '$end' $filter_str");
        //echo "SELECT time, page_from, page_to, status, ip, sess_id FROM log where user_name like '%$user_name%' AND time BETWEEN '$start' AND '$end' $filter_str";
        echo json_encode($data);
    }
} else if ($mod == 'set') {
    if ($id) {
        echo $db->setQ("UPDATE $t_users SET
            user_name = '$user_name',
            password = '$sifre',
            active = $aktif,
            max_sessions = $maxOturum,
            user_type = 1,
            admin = $admin,
            lang = '$lang'
                WHERE id = $id");
    } else {
        echo "error: no ID";
    }
} else if ($mod == 'add') {

    //Yeni kullanici ekleme
    // Elinizde kullanici adi, sifre, aktif, maximum oturum, kullanici tipi (aslinda kullanilmiyor) ve admin degerleri olmasi gerekir
    // digerleri (kullanici ID(otomatik), aciklama, songab, songab, songabc20+ and current session) degerleri 0 veya NULL string'dir.
    echo $db->setQ("INSERT $t_users VALUES
            (0,
            '$user_name',
            '$sifre',
            $aktif,
            $maxOturum,
            0,
            1,
            $admin, 
            '$lang', '')");
} else if ($mod == 'rem') {
    if ($id) {
        echo $db->setQ("DELETE FROM $t_users WHERE id = $id");
    }
} else if ($mod == 'gra') {
    if ($user_name) {
        $rawData = $db->getQ("SELECT time, page_from, page_to, status, ip, sess_id FROM $t_log where user_name like '%$user_name%' AND time BETWEEN '$start' AND '$end' ORDER BY time ASC");
        if (!$rawData) {
            exit;
        }
        $lineData = Array();
        $barData = Array(0 => 1, 1 => 1, 2 => 1, 3 => 1, 4 => 1, 5 => 1, 6 => 1, 7 => 1);
        $return_data = Array();
        $currSessionList = Array();
        $index = -1;
        $end_time = strtotime($end) + 2 * 60 * 60; // TODO: otomatik zamani ileri geri ayarlama
        $max_idle_time = 12 * 60 * 60;

        foreach ($rawData as $currData) {
            if ($currData['sess_id'] && $currData['sess_id'] != '') {
                if (!in_array($currData['sess_id'], $currSessionList)) {
                    $index++;
                    $currSessionList[$index] = $currData['sess_id'];
                }
                $sess_no = array_search($currData['sess_id'], $currSessionList);
                $date = strtotime($currData['time']) + 7200;
                $date_prev = $date - 1;
//                $date = $currData['time'];
//                $date2 = date_create($currData['time']);
//                $date2->sub(new DateInterval('PT1S'));
//                $date_prev = $date2->format('Y-m-d H:i:s');

                if (strpos($currData['status'], 'LOGOUT') !== false) {
                    $lineData[$sess_no][$date] = 'login.php';
                } elseif (strpos($currData['status'], 'LOGINOK') !== false) {
                    $lineData[$sess_no][$date_prev] = trim($currData['page_from']);
                    $lineData[$sess_no][$date] = trim($currData['page_to']);
                } else {
                    $lineData[$sess_no][$date] = trim($currData['page_to']);
                }

                if (strpos($currData['status'], 'LOGOUT') !== false) {
                    unset($currSessionList[$sess_no]);
                }
            }
        }
        //var_dump($lineData);
        if (count($currSessionList)) {
            foreach ($currSessionList as $key => $sess) {
                $last_time = array_pop(array_keys($lineData[$key]));
                $last_val = $lineData[$key][$last_time];
                $time_diff = $end_time - $last_time;
                if ($time_diff > $max_idle_time) {
                    $temp_end_time = $last_time + $max_idle_time;
                    $last_val = "login.php";
                }
                else
                    $temp_end_time = $end_time;

                //echo $key . " " . $last_time . " " . $last_val . ' ' . $time_diff . ' ' . $temp_end_time . "<br/>";
                $lineData[$key][$temp_end_time] = $last_val;
            }
        }
    }


    convertPagesToInt($lineData);

    foreach ($lineData as $sess) {
        $prev_time = 0;
        $prev_page = -1;
        $max_login_wait = 5 * 60 * 60;
        foreach ($sess as $curr_time => $curr_page) {

            if ($prev_page != -1) {
                $time_diff = $curr_time - $prev_time;
                if ($prev_page == 'index.php' && $curr_page == 'index.php') {
                    $time_diff = max_login_wait;
                }
                $barData[$prev_page] += $time_diff;
            }
            $prev_page = $curr_page;
            $prev_time = $curr_time;
        }
    }

    $return_data['line'] = $lineData;
    $return_data['bar'] = $barData;

//      var_dump($lineData);
//    var_dump($return_data);
    echo json_encode($return_data);
} else if ($mod == 'cur') {
    $data = $db->getQ("SELECT kid,ip,sess FROM $t_sessions");

    $sess_list = myImplode($data, 'sess');
    $online_id_list = myImplode($data, 'kid', true);

    $maxSess = $db->getQ("SELECT user_name, max_sessions, curr_sessions FROM $t_users WHERE id IN ($online_id_list)");

    $places = $db->getQ("SELECT f.ip, f.user_name, f.page_to, f.status, substring(f.time, 12,8) AS hour, f.sess_id FROM(
	SELECT  sess_id, MAX(time) AS maxtime FROM $t_log WHERE sess_id 
	IN ($sess_list) 
	GROUP BY sess_id
        ) AS x INNER JOIN $t_log AS f ON f.sess_id=x.sess_id AND f.time=x.maxtime ORDER BY user_name");
    $result_data = Array();
    foreach ($places as $place) {
        $kull_adi = strtolower($place['user_name']);
        $ip = $place['ip'];
        $sess_id = $place['sess_id'];

        $result_data[$kull_adi][$ip][$sess_id]['page_to'] = $place['page_to'];
        $result_data[$kull_adi][$ip][$sess_id]['time'] = $place['hour'];
    }

    foreach ($maxSess as $key) {
        $kull_adi = $key['user_name'];
        $result_data[$kull_adi]['curr_sessions'] = $key['curr_sessions'];
        $result_data[$kull_adi]['max_sessions'] = $key['max_sessions'];
    }

    echo json_encode($result_data);
} else if ($mod == 'ler') {
    $data = $db->getQ("SELECT SUBSTR(time,12, 8) AS hour, log_id, user_name, status, ip FROM $t_log WHERE status like 'LOGINERR%' ORDER BY time DESC LIMIT 5");
    $return_data = Array();

    foreach ($data as $key) {
        $data = Array();
        $info = fetchStatus($key['status']);

        $data['log_id'] = $key['log_id'];
        $data['time'] = $key['hour'];
        $data['user_name'] = $key['user_name'];
        $data['ip'] = $key['ip'];
        $data['status'] = $info['status'];
        $data['explanation'] = $info['explanation'];
        array_push($return_data, $data);
    }
    echo json_encode($return_data);
} else {
    echo "error: no MODE";
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

function fetchStatus($status_str) {
    $retArr = Array();
    if (strpos($status_str, "OGINERR(") == 1) {
        $retArr['status'] = 0;
        $startPos = strpos($status_str, '::');
        $endPos = strpos($status_str, ')') - 2;
        $retArr['explanation'] = substr($status_str, $startPos + 2, $endPos - $startPos);
    } else if (strpos($status_str, "OGINERRA") == 1) {
        $retArr['status'] = 1;
        $retArr['explanation'] = "";
    } else if (strpos($status_str, "OGINERRO") == 1) {
        $retArr['status'] = 2;
        $retArr['explanation'] = "";
    } else if (strpos($status_str, "OGINERRT") == 1) {
        $retArr['status'] = 3;
        $retArr['explanation'] = "";
    }
    return $retArr;
}

function convertPagesToInt(&$arr) {
    foreach ($arr as $key1 => $value1) {
        foreach ($value1 as $key2 => $elem) {
            switch ($elem) {
                case 'login.php':
                case 'index.php':
                    $elem = 0;
                    break;
                case 'anlikWeb/index.php':
                    $elem = 1;
                    break;
                case 'anlikWeb/line_bar.php' :
                    $elem = 2;
                    break;
                case 'anlikWeb/share.php' :
                    $elem = 3;
                    break;
                case 'anlikWeb/anlikhedef.php' :
                    $elem = 4;
                    break;
                case 'anlikWeb/peaklist.php' :
                    $elem = 5;
                    break;
                case 'anlikWeb/anlik_ekran.php' :
                    $elem = 6;
                    break;
                case 'anlikWeb/logout.php' :
                    $elem = 6;
                    break;
                default:
                    $elem = 7;
            }
            $arr[$key1][$key2] = $elem;
        }
    }
}

?>
