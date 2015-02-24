<?php

//require 'excel_printer.php';
$width = 735;
$height = 315;

function print_header() {
    global $excel, $data;
    //create as many sheets we need
    foreach ($data as $key => $value) {
        if ($key != 0) {
            $newSheet = clone $excel->getSheet(0);
            $newSheet->setTitle('a' . ($key + 1));
            $excel->addSheet($newSheet, NULL);
        }
    }

    foreach ($data as $key => $value) {
        $worksheet = $excel->getSheet($key);
        if ($worksheet) {
            $title = iconv('UTF-8',  "UTF-8//IGNORE", substr($value['programName'], 0, 30));
            $worksheet->setTitle($title);
        }
        $excel->setActiveSheetIndex($key);

        $worksheet->setCellValueByColumnAndRow(2, 6, $value['channelName'])
                ->setCellValueByColumnAndRow(2, 8, $value['programName'])
                ->setCellValueByColumnAndRow(5, 8, $value['keywords'][0])
                ->setCellValueByColumnAndRow(2, 10, $value['queryDate'][0])
                ->setCellValueByColumnAndRow(6, 10, $value['queryDate'][1]);
        /*
          $col = '2';
          copy_row_styles($worksheet, 'C10', 'C10:' . num2char(2 + count($value['keywords']) - 1) . '10', false);

          foreach ($value['keywords'] as $value) {
          $worksheet->setCellValueByColumnAndRow($col++, 10, $value);
          } */
    }
}

function print_body() {

    global $excel, $data;
    foreach ($data as $key => $value) {
        $worksheet = $excel->getSheet($key);
        $excel->setActiveSheetIndex($key);

        $sdata = $value['summaryData'];

        $worksheet->setCellValueByColumnAndRow(2, 14, $sdata['tweetCount'])
                ->setCellValueByColumnAndRow(2, 15, $sdata['uniqueUser'])
                ->setCellValueByColumnAndRow(2, 16, $sdata['share'])
                ->setCellValueByColumnAndRow(2, 17, $sdata['socialRating'])
                ->setCellValueByColumnAndRow(2, 18, $sdata['socialReach'])
                ->setCellValueByColumnAndRow(2, 19, $sdata['interactionRatio'])
                ->setCellValueByColumnAndRow(2, 20, $sdata['totalEngagement']);
        $worksheet->getStyle('c16')->getNumberFormat()->setFormatCode('0.000');
        $worksheet->getStyle('c17')->getNumberFormat()->setFormatCode('0.000');
        $worksheet->getStyle('c18')->getNumberFormat()->setFormatCode('0.000');
        $worksheet->getStyle('c19')->getNumberFormat()->setFormatCode('0.000');

        $worksheet->setCellValueByColumnAndRow(2, 23, '-')
                ->setCellValueByColumnAndRow(2, 24, '-')
                ->setCellValueByColumnAndRow(3, 23, '-')
                ->setCellValueByColumnAndRow(3, 24, '-');

        if (isset($sdata['rating'][0])) {
            $worksheet->setCellValueByColumnAndRow(2, 23, $sdata['rating'][0]['position'])
                    ->setCellValueByColumnAndRow(3, 23, $sdata['rating'][0]['date']);
        }
        if (isset($sdata['rating'][1])) {
            $worksheet->setCellValueByColumnAndRow(2, 24, $sdata['rating'][1]['position'])
                    ->setCellValueByColumnAndRow(3, 24, $sdata['rating'][1]['date']);
        }

        print_image($value['picture'], 'A30');

        $g_data = $value['graphData'];

        $cstart = 3;
        $rstart = 49;
        $length = count($g_data);

        copy_row_styles($worksheet, 'D' . $rstart, 'D' . ($rstart + 1) . ':G' . ($rstart + $length - 1), 'D:F');

        foreach ($g_data as $key => $value) {
            $worksheet->setCellValueByColumnAndRow($cstart, $rstart, $key)
                    ->setCellValueByColumnAndRow($cstart + 3, $rstart, $value['list']);
            $rstart++;
        }
    }
    $excel->setActiveSheetIndex(0);
}

?>
