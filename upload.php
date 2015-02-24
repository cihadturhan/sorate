<?php

require_once('lib/generalConfiguration.php');
error_reporting(E_ALL);
sessCtrl();
$file_name = date('Ymd_His_') . $_POST['user_id'];
$count = 0;
 
if (isset($_FILES["images"])) {
    foreach ($_FILES["images"]["error"] as $key => $error) {
        if ($error == UPLOAD_ERR_OK) {
            $name = $_FILES["images"]["name"][$key];
            $tmp_name = $_FILES["images"]["tmp_name"][$key];

            $file_type_length = strlen($name) - 3;
            $file_type = substr($name, $file_type_length);

            echo  "feedbackImg/" . $file_name . '_' . $count . '.' . $file_type . '<br/>';
            move_uploaded_file($tmp_name, "feedbackImg/" . $file_name . '_' . $count . '.' . $file_type);
            $count++;
        }
    }
}

$date = date('Y-m-d H:i:s');

$db->setQ("INSERT INTO $t_feedback VALUES ("
        . '0'
        . ', ' . $_POST['user_id']
        . ", '" . $_POST['user'] . "'"
        . ", '" . $_POST['user_info'] . "'"
        . ", '" . str_replace('"', '\\"', $_POST['technical_info']) . "'"
        . ", '$date'"
        . ')');

require_once './phpmailer/feedback.php';