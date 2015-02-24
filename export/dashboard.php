<?php

$width = 735;
$height = 315;

function print_header() {
    global $excel, $data;
    $h_data = $data['general'];
    $scount = $excel->getSheetCount();

    for ($i = 0; $i < $scount; $i++) {

        $worksheet = $excel->getSheet($i);

        $gname = $h_data['groupName'] == '' ? '-' : $h_data['groupName'];


        $worksheet->setCellValueByColumnAndRow(2, 6, $h_data['queryDate'][0])
                ->setCellValueByColumnAndRow(6, 6, $h_data['queryDate'][1])
                ->setCellValueByColumnAndRow(2, 8, $gname);

        $col = '2';

        foreach ($h_data['keywords'] as $value) {
            $value = $value == '' ? '-' : $value;
            $worksheet->setCellValueByColumnAndRow($col++, 10, $value);
        }
    }
}

function print_body() {

    global $excel, $data;
    $scount = $excel->getSheetCount();

    for ($i = 0; $i < $scount; $i++) {
        $b_data = $data[$i];
        $worksheet = $excel->getSheet($i);
        $excel->setActiveSheetIndex($i);

        if ($i == 0) {
            print_image($b_data['picture'], 'A16');
            $cstart = 2;
            $rstart = 49;
            $count = 1;
            $length = count($b_data['rawData']);

            copy_row_styles($worksheet, 'C' . $rstart, 'C' . ($rstart + 1) . ':H' . ($rstart + $length - 1), 'D:G');


            foreach ($b_data['rawData'] as $value) {
                $worksheet->setCellValueByColumnAndRow($cstart, $rstart, $count++)
                        ->setCellValueByColumnAndRow($cstart + 1, $rstart, $value['key'])
                        ->setCellValueByColumnAndRow($cstart + 5, $rstart, $value['value']);

                $rstart++;
            }
        }

        if ($i == 1) {
            $cstart = 0;
            $rstart = 17;
            $length = count($b_data['rawData']);
            copy_row_styles($worksheet, 'A' . $rstart, 'A' . ($rstart + 1) . ':J' . ($rstart + $length - 1), 'D:E,G:J');

            foreach ($b_data['rawData'] as $key => $value) {
                $worksheet->setCellValueByColumnAndRow($cstart, $rstart, $value['userId'])
                        ->setCellValueByColumnAndRow($cstart + 1, $rstart, $value['userName'])
                        ->setCellValueByColumnAndRow($cstart + 2, $rstart, $value['fullName'])
                        ->setCellValueByColumnAndRow($cstart + 3, $rstart, $value['tweetTime'])
                        ->setCellValueByColumnAndRow($cstart + 5, $rstart, $value['count'])
                        ->setCellValueByColumnAndRow($cstart + 6, $rstart, $value['tweetText']);

                $rstart++;
            }
        }

        if ($i == 2) {
            $cstart = 1;
            $rstart = 17;
            $count = 1;
            $length = count($b_data['rawData']);
            copy_row_styles($worksheet, 'B' . $rstart, 'B' . ($rstart + 1) . ':I' . ($rstart + $length - 1), 'C:H');


            foreach ($b_data['rawData'] as $key => $value) {
                $worksheet->setCellValueByColumnAndRow($cstart, $rstart, $count++)
                        ->setCellValueByColumnAndRow($cstart + 1, $rstart, $value[0])
                        ->setCellValueByColumnAndRow($cstart + 7, $rstart, $value[1]);
                $rstart++;
            }
        }


        if ($i == 3) {
            print_image($b_data['picture'], 'A16');

            $cstart = 0;
            $rstart = 47;
            $count = 1;
            $length = count($b_data['rawData']);

            copy_row_styles($worksheet, 'A' . $rstart, 'A' . ($rstart + 1) . ':J' . ($rstart + $length - 1), 'C:D,E:I');

            foreach ($b_data['rawData'] as $key => $value) {
                $worksheet->setCellValueByColumnAndRow($cstart, $rstart, $count++)
                        ->setCellValueByColumnAndRow($cstart + 1, $rstart, $value['id'])
                        ->setCellValueByColumnAndRow($cstart + 2, $rstart, $value['key'])
                        ->setCellValueByColumnAndRow($cstart + 4, $rstart, 'http://twitter.com/intent/user?user_id=' . $value['id'])
                        ->setCellValueByColumnAndRow($cstart + 9, $rstart, $value['value']);
                $rstart++;
            }
        }
    }
    $excel->setActiveSheetIndex(0);
}

?>