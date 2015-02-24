<?php

$list = Array('Kullanıcı Yönetim', 'Rapor ve İstatistik', 'Denetleme');
$href_list = Array('manager_module.php', 'report_module.php');//, 'inspector_module.php');
$icons = Array('ico-users', 'ico-newspaper', 'ico-document');

function printHeader($index = 0) {
    global $list;
    $returnStr = "<div id='header'> 
                        <div id='logo'> </div>
                        <div class='vert_sep'> </div>
                        <div id='main_heading'> Yönetici arayüzü </div>
                        <div class='vert_sep'> </div>
                        <div id='sub_heading'>  " . $list[$index] . " </div>
                        <div class='vert_sep'> </div>
                     </div>";
    return $returnStr;
}

function printNav($pageNum = 0) {
    global $href_list, $icons;
    $returnStr = "<div id='nav'> ";
    foreach ($href_list as $key => $value) {
        $selected = "";
        if ($key == $pageNum)
            $selected = "selected_nav";
        $returnStr .=
                "<a href='" . $href_list[$key] . "' class='sub_nav $selected' id='$value' >
            <div class='$icons[$key]' ></div> 
        </a>";
    }
    $returnStr.= "</div>";
    return $returnStr;
}

function printJS() {
    $returnStr = "  <script type='text/javascript' src='../js//jquery-1.9.0/jquery.min.js'> </script>
                    <script type='text/javascript' src='../js/jqueryui-1.10.0/jquery-ui-1.10.3.custom.min.js'></script>
                    <script type='text/javascript' src='../js/jquery.timepicker/jquery-ui-timepicker-addon.js'></script>
                    <script type='text/javascript' src='../js/highstock-1.3.1/highstock.js'> </script>
                    <script type='text/javascript' src='js/generalFunctions.js'> </script>
                    ";
    return $returnStr;
}

function printCss() {
    $returnStr = "<style type='text/css'>
                    @import 'css/reset.css';
                    @import 'css/table_style.css';
                    @import 'css/moduleStyle.css';
                    @import 'css/fontstyle.css';
                    @import 'dp/jquery-ui-1.8.16.custom.css';
                </style>";
    return $returnStr;
}

function printUserlist() {
    global $kullanicilar, $clicked_id;

    $returnStr = '<div id="name_container">
                        <table id="hor-zebra" class="name_table">
                            <tr> <th> ID </th> <th> Kullanıcı </th> </tr>';
    foreach ($kullanicilar as $val) {
        $selected_id = '';

        if ($val['id'] == $clicked_id) {
            $selected_id = ' id="clicked_obj" ';
        }

        $returnStr .= '<tr ' . $selected_id . ' > 
                            <td>' . $val['id'] . '</td> 
                            <td>' . $val['user_name'] . '</td>
                       </tr>';
    }

    $returnStr.="</table></div>";
    return $returnStr;
}

function printUserJsonList() {
    global $kullanicilar;
    $returnStr = "";
    $formatted = Array();
    foreach ($kullanicilar as $val) {
        $curr = Array();
        $curr['id'] = $val['id'];
        $curr['name'] = $val['user_name'];
        array_push($formatted, $curr);
    }
    $returnStr .= "<script type='text/javascript'>";
    $returnStr .= "var userlist = ";
    $returnStr .= json_encode($formatted);
    $returnStr .= "; </script>";
    return $returnStr;
}

?>
