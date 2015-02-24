<?php

function getChannels() {
    $oracle_channels = file_get_contents('http://91.93.132.76/aGetChannels.php');
    $arrStrings = explode("\n", trim($oracle_channels));
    foreach ($arrStrings as $val) {
        $tempArr = explode("\t", $val);
        $key = $tempArr[0];
        unset($tempArr[0]);
        $retArr[$key] = $tempArr;
    }
    return $retArr;
}

?>
