<?php

require '../lib/generalConfiguration.php';
require_once '../phpexcel/Classes/PHPExcel.php';


error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
define('EOL', (PHP_SAPI == 'cli') ? PHP_EOL : '<br/>');

$data = json_decode($_POST['xlsdata'], true);

$file_type = $_POST['filetype'];
$module = $_POST['module'];
$excel = null;
$filename = '';
$name = 'export';




/* STYLES */


require $module . '.php';

create_file();
print_date();
print_header();
print_body();
set_properties();
output_file();
return_file();
exit;

function create_file() {
    global $excel, $lang, $module;
    $inputFileType = 'Excel2007';
    $inputFileName = $module . '_' . $lang . '_' . $_SESSION['hostname'] . '.xlsx';
    $objReader = PHPExcel_IOFactory::createReader($inputFileType);
    $excel = $objReader->load($inputFileName);
}

function print_date() {
    global $excel, $lang;
    $scount = $excel->getSheetCount();
    for ($i = 0; $i < $scount; $i++) {
        $worksheet = $excel->getSheet($i);
        $objRichText = new PHPExcel_RichText();
        if ($lang === 'tr') {
            setlocale(LC_ALL, 'TR');
        } else {
            setlocale(LC_ALL, "US");
        }
        $textBig = $objRichText->createTextRun(strftime('%d.%m.%Y %A') . "\n");
        $textBig->getFont()->setSize(14);
        $objRichText->createText(date('H:i:s'));
        $worksheet->setCellValue('H2', $objRichText);
    }
    //$excel->setSheetIndex(0);
}

function set_properties() {
    global $excel;
    $excel->getProperties()->setCreator("Untitled")
            ->setLastModifiedBy("Untitled")
            ->setTitle("Untitled")
            ->setSubject("Untitled")
            ->setDescription("Untitled")
            ->setKeywords("Untitled")
            ->setCategory("Untitled");
}

function output_file() {
    global $file_type, $name, $excel, $filename;

    switch ($file_type) {
// Save Excel 2007 file
        case 'xls':
            $filename = $name . '.xls';
            $objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel5');

            break;
        case 'xlsx':
            $filename = $name . '.xlsx';
            $objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
            break;
        case 'pdf':
            $filename = $name . '.pdf';
            require_once '../Classes/PHPExcel/IOFactory.php';

            $rendererName = PHPExcel_Settings::PDF_RENDERER_TCPDF;
            $rendererLibrary = 'tcpdf';

            if (!PHPExcel_Settings::setPdfRenderer(
                            $rendererName, $rendererLibrary
                    )) {
                die(
                        'NOTICE: Please set the $rendererName and $rendererLibraryPath values at the top of this script as appropriate for your directory structure'
                );
            }

            $objWriter = PHPExcel_IOFactory::createWriter($excel, 'PDF');
            $objWriter->setSheetIndex(0);
            break;
    }
    $objWriter->save($filename);
}

function return_file() {
    global $filename;
    $result = "http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/" . $filename;
    echo $result;
}

/* HELPERS */

function num2char($num) {
    return PHPExcel_Cell::stringFromColumnIndex($num);
}

function copy_row_styles(&$worksheet, $start, $pRange, $merged) {

    $xfIndex = $worksheet->getCell($start)->getXfIndex();

    $pRange = strtoupper($pRange);
    // Is it a cell range or a single cell?
    $rangeA = '';
    $rangeB = '';
    if (strpos($pRange, ':') === false) {
        $rangeA = $pRange;
        $rangeB = $pRange;
    } else {
        list($rangeA, $rangeB) = explode(':', $pRange);
    }

    // Calculate range outer borders
    $rangeStart = PHPExcel_Cell::coordinateFromString($rangeA);
    $rangeEnd = PHPExcel_Cell::coordinateFromString($rangeB);

    // Translate column into index
    $rangeStart[0] = PHPExcel_Cell::columnIndexFromString($rangeStart[0]) - 1;
    $rangeEnd[0] = PHPExcel_Cell::columnIndexFromString($rangeEnd[0]) - 1;

    // Make sure we can loop upwards on rows and columns
    if ($rangeStart[0] > $rangeEnd[0] && $rangeStart[1] > $rangeEnd[1]) {
        $tmp = $rangeStart;
        $rangeStart = $rangeEnd;
        $rangeEnd = $tmp;
    }

    if ($merged) {
        $mergedCells = explode(',', $merged);
    }

    // Loop through cells and apply styles
    for ($row = $rangeStart[1]; $row <= $rangeEnd[1]; ++$row) {
        for ($col = $rangeStart[0]; $col <= $rangeEnd[0]; ++$col) {
            $worksheet->getCell(num2char($col) . $row)->setXfIndex($xfIndex);
        }

        if ($merged) {
            foreach ($mergedCells as $currCell) {
                $range = explode(':', $currCell);
                $worksheet->mergeCells($range[0] . $row . ':' . $range[1] . $row);
            }
        }
    }
}

function print_table($start) {
    global $excel, $input;
    $count = 0;
    foreach ($input['data']['rows'] as $key) {
        $excel->setActiveSheetIndex(0)
                ->setCellValue('A' . ($count + 5), $key[0])
                ->setCellValue('B' . ($count + 5), $key[1])
                ->setCellValue('C' . ($count + 5), $key[2]);
        $count++;
    }
}

function print_image(&$picture, $coordinate) {
    global $excel;
    $decoded_data = base64_decode($picture);
    $image = imagecreatefromstring($decoded_data);
    if ($image == false) {
        echo 'An error occurred.';
    }
    //echo date('H:i:s'), " Add a drawing to the worksheet", EOL; 

    $objDrawing = new PHPExcel_Worksheet_MemoryDrawing();
    $objDrawing->setName('Chart');
    $objDrawing->setDescription('Chart');
    $objDrawing->setImageResource($image);
    $objDrawing->setRenderingFunction(PHPExcel_Worksheet_MemoryDrawing::RENDERING_PNG);
    $objDrawing->setMimeType(PHPExcel_Worksheet_MemoryDrawing::MIMETYPE_DEFAULT);
    $objDrawing->setWorksheet($excel->getActiveSheet());
    $objDrawing->setCoordinates($coordinate);
}

?>
