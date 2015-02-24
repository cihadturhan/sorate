<?php

require 'lib/generalConfiguration.php';
$allIndividuals = 0;


$date = $_GET['date'];
$partStr = $_GET['partStr'];
$mod = isset($_GET['mod'])?$_GET['mod']:'both';
echo encodeResult($mod, $allIndividuals);

function encodeResult($mod, $target) {
    global $date, $partStr;
    $result = Array();
    switch ($mod) {
        case 'amr':
            $result = calculateRating('amr', $date, $partStr, getTarget($target));
            break;
        case 'shr':
            $result = calculateRating('shr', $date, $partStr, getTarget($target));
            break;
        default:
            $result['shr'] = calculateRating('shr', $date, $partStr, getTarget($target));
            $result['amr'] = calculateRating('amr', $date, $partStr, getTarget($target));
            break;
    }
    return json_encode($result);
}

function calculateRating($type, $date, $partstr, $target) {
    $ip = '176.53.127.164';
    $amr_page = 'wProgramRating.php';
    $shr_page = 'wProgramShare.php';

    $queryArr = array(
        'dynamic' => 0,
        'target' => $target,
        'date' => $date,
        'pcount' => 1,//TODO
        'id' => $_SERVER['SERVER_ADDR'],
        'parts' => $partstr
    );

    //var_dump($queryArr);
    if ($type == 'amr') {
        $page = $amr_page;
    } else {
        $page = $shr_page;
    }

    $url = "http://$ip/$page";
    $result = post($url, $queryArr);
    
    return parseRating($result);
}

function parseRating($str) {
    $float = '\d*+.\d+';
    if (preg_match('/OK\d+\+' . $float . '\$(\d+=' . $float . '#)+/', $str) == 1) {
        $matches = Array();
        preg_match_all('/\d+=(' . $float . ')/', $str, $matches);
        return $matches[1][0];
    } else {
        return false;
    }
}
?>

