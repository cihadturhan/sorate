<?php

function print_header() {
    global $excel, $data;
    $worksheet = $excel->getActiveSheet();

    $gname = $data['groupName'] == '' ? '-' : $data['groupName'];


    $worksheet->setCellValueByColumnAndRow(2, 6, $data['queryDate'][0])
            ->setCellValueByColumnAndRow(6, 6, $data['queryDate'][1])
            ->setCellValueByColumnAndRow(2, 8, $gname);

    $col = '2';

    foreach ($data['keywords'] as $value) {
        $value = $value == '' ? '-' : $value;
        $worksheet->setCellValueByColumnAndRow($col++, 8, $value);
    }
}

function print_body() {
    global $excel, $data;
    $worksheet = $excel->getActiveSheet();

    $cstart = 0;
    $rstart = 15;
    $length = count($data['rawData']);
    copy_row_styles($worksheet, 'A' . $rstart, 'A' . ($rstart + 1) . ':J' . ($rstart + $length - 1), 'D:E,F:J');

    foreach ($data['rawData'] as $key => $value) {
        $value['userName'] = isset($value['userName']) ? $value['userName'] : 'protected';
        $value['fullName'] = isset($value['fullName']) ? $value['fullName'] : 'protected';

        $worksheet->setCellValueByColumnAndRow($cstart, $rstart, $value['userId'])
                ->setCellValueByColumnAndRow($cstart + 1, $rstart, $value['userName'])
                ->setCellValueByColumnAndRow($cstart + 2, $rstart, $value['fullName'])
                ->setCellValueByColumnAndRow($cstart + 3, $rstart, $value['tweetTime'])
                ->setCellValueByColumnAndRow($cstart + 5, $rstart, $value['tweetText']);

        $rstart++;
    }
}
