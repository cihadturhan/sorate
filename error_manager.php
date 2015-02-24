<?php

require_once('lib/generalConfiguration.php');
$MY_GET = $_GET;
$MY_GET['servertime'] = date("Y-m-d H:i:s");

//logout olmuşsa database'den en son aynı session id ile giriş yapan kullanıcı bulunur
if(!$uid){
    $userInfo = $db->getQKeyValue("SELECT * FROM log WHERE sess_id='$sid' ORDER BY time limit 1");
    $uid = $userInfo[0]['id'];
    $user_name = $userInfo[0]['user_name'];
}else{
    $user_name = $_SESSION['kullanici'];
}
$MY_GET['user_id'] = $uid;
$MY_GET['sess_id'] = $sid;
$MY_GET['id'] = 0;

function prepareQuery($data) {
    $keys = implode(',', array_keys($data));
    $values = implode("','", array_values(replaceAll($data)));
    return "($keys) VALUES('$values')";
}

function replaceAll($arr) {
    foreach ($arr as $key => $val) {
        $arr[$key] = mysql_real_escape_string($arr[$key]);
    }
    return $arr;
}

$db->setQ("INSERT INTO $t_error_log " . prepareQuery($MY_GET));
//var_dump("INSERT INTO $t_error_log " . prepareQuery($MY_GET));

require_once './phpmailer/generalFailure.php';
?>

