<?php

$map = Array('p' => 0, 't' => 1);

function print_header() {
    global $excel, $data, $map;


    foreach ($data as $key => $value) {
        $idx = $map[$key];
        $excel->setActiveSheetIndex($idx);
        $worksheet = $excel->getSheet($idx);

        $worksheet->setCellValueByColumnAndRow(2, 6, $value['queryData']['starttime'])
                ->setCellValueByColumnAndRow(6, 6, $value['queryData']['endtime']);
    }
}

function print_body() {
    global $excel, $data, $map;

    foreach ($data as $key => $value) {

        $idx = $map[$key];
        $worksheet = $excel->getSheet($idx);

        foreach ($value['head'] as $subkey => $subvalue) {
            $worksheet->setCellValueByColumnAndRow($subkey, 10, $subvalue);
        }

        $row = 11;
        foreach ($value['body'] as $subkey => $subvalue) {
            foreach ($subvalue as $subsubKey => $subsubValue) {
                $worksheet->setCellValueByColumnAndRow($subsubKey, $row, $subsubValue);
            }
            $row++;
        }


        copy_row_styles($worksheet, 'A10', 'B10' . ':' . num2char(count($value['head']) - 1) . '10', false);
        copy_row_styles($worksheet, 'A11', 'A11' . ':' . num2char(count($value['head']) - 1) . ($row - 1), false);
        $excel->setActiveSheetIndex($idx);
    }
}

?>
