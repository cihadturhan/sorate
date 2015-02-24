<?php

// input: user_id={1-9*} & mode = get
//                             | set & data={a-z*}
//                             | add & data={a-z*}
//                             | rem & user={a-z0-9*}

require_once('lib/generalConfiguration.php');
sessCtrl();
$user_id = $_GET['user_id'];
$table = 'keygroup';
$data = isset($_GET['data']) ? $_GET['data'] : false;

$get_query_arr = Array('mode', 'user_id');
foreach ($get_query_arr as $query) {
    control_get($query);
}



switch ($_GET['mode']) {
    case 'add':
        control_get('data');
        $name_str = 'user_id, data';
        $value_str = "$user_id, '$data'";
        $db->setQ("INSERT INTO $table ( $name_str ) VALUES ($value_str)");
        break;
    case 'get':
        $result = $db->getQKeyValue("SELECT * FROM $table WHERE user_id=$user_id");
        if ($result[0]['data'])
            echo $result[0]['data'];
        else
            echo '{}';
        break;
    case 'set':
        control_get('data');
        $name_str = 'user_id, data';
        $value_str = "$user_id, '$data'";
        $db->setQ("REPLACE INTO $table ( $name_str ) VALUES ($value_str)");
        break;
    case 'rem':
        $db->setQ("DELETE FROM $table WHERE user_id = $user_id");
        break;
}
?>
