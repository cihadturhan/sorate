<?php

require("../lib/generalConfiguration.php");
sessCtrl();

//TODO Include generalConfiguration.php for safety issues ... DONE

error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

$input = json_decode($_POST['data'], true);
/*
  $input = Array();
  $input['file_name'] = 'username';
  $input['filetype'] = 'xlsx';
  $input['data'] = Array();
  $input['data']['title'] = Array();
  $input['data']['title'][0] = Array('Kullanıcı ID', 'Kullanıcı Adı', 'Twitter ismi', 'Rapor Tarihi');
  $input['data']['title'][1] = Array('123123123', 'User Name', '@UserName', '10 Mayıs 2012');
  $input['data']['rows'] = Array();
  $input['data']['header'] = Array();
  $input['data']['header'] = Array('Sıra', ' Tarih', 'Tweet');
  $input['data']['rows'][0] = Array(1, '2012-10-10 10:10', 'Bu örnek bir tweet olup hiçbir değeri yoktur');
  $input['data']['rows'][1] = Array(2, '2012-10-10 10:10', 'Bu örnek bir tweet olup hiçbir değeri yoktur');
  $input['data']['rows'][2] = Array(3, '2012-10-10 10:10', 'Bu örnek bir tweet olup hiçbir değeri yoktur');
 */

define('EOL', (PHP_SAPI == 'cli') ? PHP_EOL : '<br />');


/** Include PHPExcel */
require_once 'Classes/PHPExcel.php';

//STYLES
$header = new PHPExcel_Style();
$header->getFont()
        ->setName('Arial')
        ->setSize(10)
        ->setBold(true)
        ->setColor(new PHPExcel_Style_Color(PHPExcel_Style_Color::COLOR_BLACK));
$header->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
$header->getFill()->applyFromArray(
        array(
            'type' => PHPExcel_Style_Fill::FILL_SOLID,
            'startcolor' => array('rgb' => 'E9E9E9'),
        )
);

$table_header = new PHPExcel_Style();
$table_header->getFont()
        ->setName('Arial')
        ->setSize(10)
        ->setBold(true)
        ->setColor(new PHPExcel_Style_Color(PHPExcel_Style_Color::COLOR_BLACK));
$table_header->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
$table_header->getFill()->applyFromArray(
        array(
            'type' => PHPExcel_Style_Fill::FILL_SOLID,
            'startcolor' => array('rgb' => 'E9E9E9'),
        )
);

// Create new PHPExcel object
$objPHPExcel = new PHPExcel();
$worksheet = $objPHPExcel->getActiveSheet(0);

// Set document properties
$objPHPExcel->getProperties()->setCreator("Varsayılan")
        ->setLastModifiedBy("Varsayılan")
        ->setTitle("")
        ->setSubject("")
        ->setDescription("")
        ->setKeywords("")
        ->setCategory("Arşiv");


// Add header
$worksheet->setCellValue('A1', $input['data']['title'][0][0]);
$worksheet->setCellValue('B1', $input['data']['title'][0][1]);
$worksheet->setCellValue('C1', $input['data']['title'][0][2]);
$worksheet->setCellValue('D1', $input['data']['title'][0][3]);
$worksheet->duplicateStyle($header, 'A1:D1');
$worksheet->setCellValue('A2', $input['data']['title'][1][0]);
$worksheet->setCellValue('B2', $input['data']['title'][1][1]);
$worksheet->setCellValue('C2', $input['data']['title'][1][2]);
$worksheet->setCellValue('D2', $input['data']['title'][1][3]);

// Add table header
$worksheet
        ->setCellValue('A4', $input['data']['header'][0])
        ->setCellValue('B4', $input['data']['header'][1])
        ->setCellValue('C4', $input['data']['header'][2]);
$worksheet->duplicateStyle($table_header, 'A4:C4');


$count = 0;
foreach ($input['data']['rows'] as $key) {
    $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue('A' . ($count + 5), $key[0])
            ->setCellValue('B' . ($count + 5), $key[1])
            ->setCellValue('C' . ($count + 5), $key[2]);
    $count++;
}

// Rename worksheet
$objPHPExcel->getActiveSheet()->setTitle(' ');


// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);
$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setAutoSize(true);
$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setAutoSize(true);
$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(80);
$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setAutoSize(true);

$filename = '';
switch ($input['filetype']) {
// Save Excel 2007 file
    case 'xls':
        $filename = $input['file_name'] . '.xls';
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save($filename);
        break;
    case 'xlsx':
        $filename = $input['file_name'] . '.xlsx';
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter->save($filename);
        break;
    case 'pdf':
        $filename = $input['file_name'] . '.pdf';
        require_once '../Classes/PHPExcel/IOFactory.php';

        $rendererName = PHPExcel_Settings::PDF_RENDERER_TCPDF;
        $rendererLibrary = 'tcpdf';

        if (!PHPExcel_Settings::setPdfRenderer(
                        $rendererName, $rendererLibrary
                )) {
            die(
                    'NOTICE: Please set the $rendererName and $rendererLibraryPath values' .
                    EOL .
                    'at the top of this script as appropriate for your directory structure'
            );
        }

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'PDF');
        $objWriter->setSheetIndex(0);
        $objWriter->save($filename);
        break;
}


//header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//header('Content-Disposition: attachment;filename="01simple.xlsx"');
//header('Cache-Control: max-age=0');
//
//$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
//$objWriter->save('php://output');

$result = "http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/" . $filename;
echo $result;
?>
