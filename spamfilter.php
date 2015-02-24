<?php
require("lib/generalConfiguration.php");
sessCtrl();
?>
<!--
<!DOCTYPE html>
<html  lang="tr-TR">
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <link rel="stylesheet" href="css/reset.css"/>
        <link rel="stylesheet" href="css/anims.css"/>
        <link rel="stylesheet" href="css/common.css"/>
        <link rel="stylesheet" href="css/colorpicker/colorpicker.css"/>
        <link rel="stylesheet" href="css/jquery.tagsinput/jquery.tagsinput.css"/>
        <link rel="stylesheet" href="css/jquery-ui/jquery-ui-1.10.1.custom.min.css" />
        <link rel="stylesheet" href="css/spamfilter.css"/>
        <link rel="stylesheet" href="css/icons/style.css"/>
        <link rel="stylesheet" href="css/jquery.timepicker/jquery-ui-timepicker-addon.css" />

        <script src="js/Modules/settings.js"></script>
        <script src="js/jquery-1.9.0/jquery.min.js"></script>
        <script src="js/jqueryui-1.10.0/jquery-ui-1.10.3.custom.min.js"></script>
        <script src="js/input.js"></script>
        <script src="js/helper.js"></script>
        <script src="js/colorpicker/jscolor.js"></script>
        <script src="js/jquery.tagsinput/jquery.tagsinput.min.js"></script>
        <script src="js/jquery.transit-0.9.9/jquery.transit.min.js"></script>
        <script src="js/moment/moment.min.js"></script>
        <script src="js/jqueryui-1.10.0/jquery-ui-1.10.3.custom.min.js"></script>
        <script src="js/jquery.timepicker/jquery-ui-timepicker-addon.js"></script>
        <script src="js/Modules/Common.js"></script>
        <script src="js/subModule.js"></script>
        <script src="js/Modules/spamfilter.js"></script>
        <script src="js/jquery.dragsort-0.5.1/jquery.dragsort-0.5.1.min.js"></script>
        <script src="js/packery/packery.pkgd.min.js"></script>

        <script src="js/canvg/StackBlur.js?1.2"></script>
        <script src="js/canvg/canvg.js?1.2"></script>
        <script src="js/canvg/rgbcolor.js?1.2"></script>
    </head>

    <body> -->
        <div class="spamfilter_container">
            <div class="dialog container">
                <div class="dialog_overlay icon-preview"></div>
                <div class="container_header"> <?php echo $langArr['preview'] ?> </div>
                <div class="dialog_content"><span> Önizlemeyi kullanmak için fareyi bir resim veya kullanıcı linki üzerine getirin. </span></div>

            </div>
            <div class="loading_overlay">
                <div class="loading icon-spinner"></div>
            </div>
            <div class="export_container"></div>
            <div class="shadow"></div>

            <div class="header container">
                <div class="selection_container">
                <!--<input type="text" name="daypicker" readonly/>-->
                    <input type="text" name="timepicker_start" placeholder="<?php echo date('H:i:s'); ?>" readonly/>
                <!--    <input type="text" name="enddate" readonly/> -->
                    <input type="text" name="timepicker_end" placeholder="<?php echo date('H:i:s'); ?>" readonly/>
                    <button class="preview icon-preview" title="Önizleme"> </button>
                </div>

            </div>

            <div class="submodule-container left"> <div class="packery clearfix"> </div> </div>
            <div class="submodule-container right"> <div class="packery clearfix"> </div> </div>
        </div>
<!--
        <script>
            var spamfitler;
            $().ready(function() {
                spamfilter = new Spamfilter($('body'));
                spamfilter.initialize();
            });
        </script>
    </body>

</html> 
-->