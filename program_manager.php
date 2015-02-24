<?php

require_once("lib/generalConfiguration.php");

if (!isSet($_GET['channel'], $_GET['date'])) {
    echo 'missing query. existing...';
    exit;
}


$query = '?date=' . $_GET['date'] . '&channel=' . $_GET['channel'];


$data = file_get_contents("http://91.93.132.76/getHashtags" . $query);
$result = explode('#####', $data);

$program_temp = json_decode($result[0], true);
$program_pdata = json_decode($result[1], true);
$program_hdata = json_decode($result[2], true);

parseInt($program_temp, Array('DURATION', 'ENDSECOND', 'STARTSECOND'));
parseInt($program_pdata, Array('DURATION', 'ENDSECOND', 'STARTSECOND'));
parseInt($program_hdata, Array('ENDSECOND', 'STARTSECOND'));

$program_data = Array();

//var_dump($program_hdata);

foreach ($program_temp as $key => $value) {
    $id = $program_temp[$key]['ID'];
    unset($program_temp[$key]['ID']);
    $program_data[$id] = $program_temp[$key];
}

//var_dump($program_data);

foreach ($program_pdata as $key => $value) {
    $id = $program_pdata[$key]['PROGRAMAIREDID'];
    $p_id = $program_pdata[$key]['ID'];
    unset($program_pdata[$key]['PROGRAMAIREDID']);
    unset($program_pdata[$key]['ID']);

    $program_data[$id]['parts'][$p_id] = $program_pdata[$key];
    unset($program_pdata[$key]);
}

if (isset($program_hdata)) {
    foreach ($program_hdata as $key => $value) {
        $id = $program_hdata[$key]['PROGRAMAIREDID'];
        unset($program_hdata[$key]['PROGRAMAIREDID']);

        if (!isset($program_data[$id]['hashtags'])) {
            $program_data[$id]['hashtags'] = Array();
        }
        array_push($program_data[$id]['hashtags'], $program_hdata[$key]);

        unset($program_hdata[$key]);
    }
}
//var_dump($program_data);
echo(json_encode($program_data));
?>