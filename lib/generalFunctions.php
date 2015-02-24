<?php

function tarih2date($t) {
    return substr($t, 6, 4) . '-' . substr($t, 3, 2) . '-' . substr($t, 0, 2);
}

function date2tarih($t) {
    return substr($t, 8, 2) . '.' . substr($t, 5, 2) . '.' . substr($t, 0, 4);
}

function getIP() {
    if (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"), "unknown"))
        $ip = getenv("HTTP_CLIENT_IP");
    else if (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown"))
        $ip = getenv("HTTP_X_FORWARDED_FOR");
    else if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown"))
        $ip = getenv("REMOTE_ADDR");
    else if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown"))
        $ip = $_SERVER['REMOTE_ADDR'];
    else
        $ip = "unknown";
    return($ip);
}

function utf2tr(&$arr) {
    foreach ($arr as $i => $a)
        $arr["$i"] = mb_convert_encoding($a, 'ISO-8859-9', 'UTF8');
}

function tr2en($txt) {
    $trch = array("�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�");
    $ench = array("i", "I", "s", "S", "c", "C", "o", "O", "u", "U", "g", "G");

    return str_replace($trch, $ench, $txt);
}

function loggerD($id, $user_name, $from, $to, $status) {
    global $db;
//                                                  id  | user_name |time  | page_current | page_from | info | IP adress | session_id
    $db->setQ("INSERT INTO log VALUES (0,'$id','$user_name', NOW(),'$from','$to','$status', '" . getIP() . "','" . session_id() . "')");
}

function loggerM($id, $from, $to) {
    global $db, $t_mainlog, $sid, $browser;
    $ip = getIP();
    $brwsr = $browser->Name;
    $db->setQ("INSERT INTO $t_mainlog VALUES (0, NOW(),'$sid','$ip','$brwsr')");
}

function secPass($str) {
    $zararli = array("'", '<', '>', '"', ';', '%', "\\");
    $str = str_replace($zararli, '', $str);
    return $str;
}

function sessCtrl() {
    global $db;
    if (!isLoggedOut()) {
        header('Location: login.php');
        exit;
    } else {
        $sid = session_id();
        $db->setQ("UPDATE sessions SET last_act=now() WHERE sess='$sid'");
    }
}

function updateSession() {
    global $db;
    $sid = session_id();
    $db->setQ("UPDATE sessions SET last_act=now() WHERE sess='$sid'");
}

function isLoggedOut() {
    global $system;
    return isset($_SESSION[$system]);
}

function tarih_kontrol($id) {
    global $db, $t_permissions;

    $included = $db->getQ("SELECT * FROM $t_permissions WHERE id=" . $id);
    if (!$included) {
        return 1;
    }

    $hourMin = 60;
    $dayMin = $hourMin * 24;
    $weekMin = $dayMin * 7;
    $start_date = '1990-01-01 00:00';
    $start_time = mktime(0, 0, 0, 1, 1, 1990);
    $curr_time_inStr = date('Y-m-d H:i');

    $servDiff = $db->getQ("SELECT TIMESTAMPDIFF (minute, '" . $start_date . "','" . $curr_time_inStr . "')");
    $dateDiff = $servDiff[0][0]; //floor((unixtojd($curr_time) - unixtojd($start_time))/60);

    $remWeek = $dateDiff % $weekMin;
    $remDay = $dateDiff % $dayMin;

    $res_val = $db->getQ("SELECT time_id FROM $t_permissions WHERE (
    ('" . $curr_time_inStr . "'>start AND '" . $curr_time_inStr . "'<end AND `repeat`=0) OR
    ('" . $curr_time_inStr . "'>start AND '" . $curr_time_inStr . "'<end AND " . $remWeek . ">=interval_start AND " . $remWeek . "<=interval_end AND `repeat`=1 AND daily = 0) OR
    ('" . $curr_time_inStr . "'>start AND '" . $curr_time_inStr . "'<end AND " . $remDay . ">=interval_start AND " . $remDay . "<=interval_end AND `repeat`=1 AND daily = 1)) AND id=" . $id);

    return $res_val[0][0];
}

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

function floatArrayVal($arr) {
    $ret = Array();
    foreach ($arr as $key) {
        array_push($ret, floatval($key));
    }
    return $ret;
}

function parseInt(&$data, $list) {
    if ($data) {
        foreach ($data as $key => $val1) {
            foreach ($list as $keylist => $val2) {
                $data[$key][$list[$keylist]] = intval($data[$key][$list[$keylist]]);
            }
        }
    }
}

function post($url, $queryArr) {
    //var_dump($queryArr) ; exit;
    $queryStr = http_build_query($queryArr);

    $opts = array(
        'http' => array(
            'method' => "POST",
            'header' => "Connection: close\r\n" .
            "Content-type: application/x-www-form-urlencoded\r\n" .
            "Content-Length: " . strlen($queryStr) . "\r\n",
            'content' => $queryStr
        )
    );

    $context = stream_context_create($opts);
    return file_get_contents($url, false, $context);
}

function getTarget($target_key) {
    $targetStrList = Array(
        0 => '11111111111111111111111111111111111111111111111111111111',
        1 => '11111111111111111111111111111111111111111111111110001111',
        2 => '11100011111111111111111111111111111111111111111111001111'
    );
    return $targetStrList[$target_key];
}

function getChannel($channel) {
    $channStr = '';
    for ($i = 0; $i < 31; $i++) {
        $channStr .= ($i == $channel || $i == 29) ? ('0') : ('1');
    }
    return $channStr;
}

function control_get($name) {
    if (!isset($_GET[$name])) {
        echo '<strong>' . $name . ' </strong> is not defined.';
        exit;
    }
}

function control_get_arr($arr) {
    foreach ($arr as $value) {
        control_get($value);
    }
}

function getLang($lang) {
    global $db, $t_lang;
    $result = $db->getQKeyValue("SELECT name, $lang FROM $t_lang");
    return toAssocArray($result, 'name', $lang);
}

function toAssocArray($arr, $elem, $other_elem = null) {
    $retArr = Array();
    for ($i = 0; $i < count($arr); $i++) {
        $key = $arr[$i][$elem];
        unset($arr[$i][$elem]);

        if ($other_elem)
            $retArr[$key] = $arr[$i][$other_elem];
        else
            $retArr[$key] = $arr[$i];
    }
    return $retArr;
}

function logRequest($module, $mode, $request, $response) {
    global $db, $uid, $sid, $t_request_log;
    $date = date("Y-m-d H:i:s");
    $request = mysql_real_escape_string($request);

    $db->setQ("INSERT INTO $t_request_log VALUES(0,'$date',$uid,'$sid','$module','$mode','$request','$response')");
    return $db->id();
    //echo  "INSERT INTO $name VALUES(0,'$date',$uid,'$sid','$module','$mode','$request')";
}

function get_host() {
    if (isset($_SERVER['HTTP_X_FORWARDED_HOST']) && $host = $_SERVER['HTTP_X_FORWARDED_HOST']) {
        $elements = explode(',', $host);

        $host = trim(end($elements));
    } else {
        if (!$host = $_SERVER['HTTP_HOST']) {
            if (!$host = $_SERVER['SERVER_NAME']) {
                $host = !empty($_SERVER['SERVER_ADDR']) ? $_SERVER['SERVER_ADDR'] : '';
            }
        }
    }

    // Remove port number from host
    $host = preg_replace('/:\d+$/', '', $host);

    return trim($host);
}

function addHostName() {
    if (!isset($_SESSION['hostname'])) {

        $host_name = get_host();

        if (strpos($host_name, 'so-rate.com') !== false) { //
            $_SESSION['hostname'] = "sorate";
        } else if (strpos($host_name, 'sosyalimm.com') !== false) {
            $_SESSION['hostname'] = "sosyalim";
        } else {
            $_SESSION['hostname'] = "sorate";
        }
    }
}

function getAllowedModules() {
    global $db, $uid, $file_list, $t_files, $t_users, $t_utypes, $t_modules, $modules;
    if (!$uid)
        return;

    $file_list = $db->getQKeyValue("SELECT * FROM $t_files");

    $module_ids = $db->getQKeyValue("SELECT modules FROM $t_users u, $t_utypes ut WHERE u.id = $uid AND u.user_type = ut.id");
    $module_ids = $module_ids[0]['modules'];

    $modules = $db->getQKeyValue("SELECT * from $t_modules WHERE id IN ($module_ids)");

    foreach ($modules as $i => $module) {
        $modules[$i]['thumbnailImg'] = $module['name'] . '.png';
        $modules[$i]['className'] = ucfirst($module['name']);
        $modules[$i]['jsFiles'] = Array();
        $modules[$i]['cssFiles'] = Array();
        $depArr = explode(',', $module['dependencies']);
        foreach ($file_list as $file) {
            if (in_array($file['belongsTo'], $depArr)) {
                $modules[$i][$file['type'] . 'Files'][] = $file['filename'];
            }
        }
        unset($modules[$i]['dependencies']);
    }

    //var_dump($file_list);
    /* $modules = $db->getQKeyValue('SELECT * FROM modules');
      if (isset($_SESSION['restricted'])) {
      $restricted = count($_SESSION['restricted']) === 0 ? false : explode(',', $_SESSION['restricted']);
      if (!$restricted) {
      return $modules;
      }
      foreach ($modules as $key => $value) {
      if (in_array($value['name'], $restricted)) {
      unset($modules[$key]);
      }
      }
      }
     */
    return $modules;
}

function checkBrowser() {
    global $browser, $allowed_browsers;
    if (!in_array($browser->Name, $allowed_browsers) && basename($_SERVER['REQUEST_URI'], '.php') != 'upgrade') {
        header('Location: upgrade.php');
        exit;
    }
}

?>