<?php
//header("Location: maintanance.php");
//exit;

require("lib/generalConfiguration.php");

if(isset($_SESSION['hostname']) && $_SESSION['hostname'] == "sorate"){
    header('Location: main.php');
    exit;
}

if (isset($_SESSION['surum'])) {
    if ($_SESSION['surum'] == 'guncel') {
        loggerD($_SESSION[$system], $_SESSION['kullanici'], 'login.php', 'modules.php', 'REDIRECT');
        header("Location: modules.php");
        exit;
    }
}



$act = isset($_POST['act']) ? $_POST['act'] : false;
$err = false;

if ($act) {
    $k = strtolower(trim(secPass($_POST['kullanici'])));
    $s = strtolower(trim(secPass($_POST['sifre'])));

    // IMPORTANT: The old log system was removed. 
    // Now, all log is written in "detailed_log" table by the function loggerD()

    $q1 = $db->getQ("Select * from users where user_name='$k' and password='$s'");
    $id = $q1[0]['id'];


    if (!$q1) {
        loggerD($_SESSION[$system], $k, 'login.php', 'login.php', 'LOGINERR(' . $k . "::" . $s . ")");
        $err = $langArr['err'];
    } else if ($q1[0]['active'] == '0') {
        loggerD($_SESSION[$system], $k, 'login.php', 'login.php', 'LOGINERRA(' . $k . "::" . $s . ")");
        $err = $langArr['erra'];
    } else if ($q1[0]['max_sessions'] <= $q1[0]['curr_sessions']) {
        loggerD($_SESSION[$system], $k, 'login.php', 'login.php', 'LOGINERRO(' . $k . "::" . $s . ")");
        $err = $langArr['erro'];
    } else if (!tarih_kontrol($id)) {
        loggerD($_SESSION[$system], $k, 'login.php', 'login.php', 'LOGINERRT(' . $k . "::" . $s . ")");
        $err = $langArr['errt'];
    } else {
        $_SESSION[$system] = $q1[0][0];
        $db->setQ("Update users set curr_sessions=curr_sessions+1 where id={$q1[0][0]}");
        $sid = session_id();
        $db->setQ("Insert into sessions values (0,'{$q1[0][0]}','$sid',now(),'" . getIP() . "')");

        $_SESSION['surum'] = $_POST['surum'];
        $_SESSION['kullanici'] = $_POST['kullanici'];
        $_SESSION['lang'] = $q1[0]['lang'];
        $_SESSION['restricted'] = $q1[0]['restricted'];
        header("Location: modules.php");
        loggerD($_SESSION[$system], $k, 'login.php', 'anlikWeb/manager.php', 'LOGINOK');
    }
}
session_write_close();
?>
<!DOCTYPE html>
<html lang="tr-TR">
    <head>
        <meta charset="UTF-8">
        <title> <?php echo $langArr['title_' . $_SESSION['hostname']]; ?> </title>
        <link rel="stylesheet" href="css/reset.css" />
        <link rel="stylesheet" href="css/main.css" />
        <link rel="stylesheet" href="css/<?php echo $_SESSION['hostname'] ?>_login.css"/>
        <style type="text/css"></style>
        <link rel="icon" type="image/png"  href="img/favicon.png">
    </head>
    <script src="js/jquery-1.9.0/jquery.min.js"></script>
    <script src="js/jquery.transit-0.9.9/jquery.transit.min.js"></script>
    <body>

        <?php
        if ($err) {
            echo "<div id='report_box'><div><span> $err </span></div></div>";
        }
        ?> 


        <div id="main_wrapper"  <?php
        if ($err) {
            echo ' class="blur"';
        }
        ?> >
            <div id="content_box"></div>
            <div id="form_box">
                <div id="logo"> </div>
                <form action="?" method="post" name="f">
                    <input type="hidden" name="act" value="1" />
                    <input type="hidden" name="surum" value="guncel" />

                    <div id="inputs">
                        <input type="text" name="kullanici" id="kullanici" class="login_input" autocomplete="off" placeholder="<?php echo $langArr['user_name']; ?>">
                        <input type="password" name="sifre" id="sifre" class="login_input" autocomplete="off" placeholder="<?php echo $langArr['password']; ?> ">
                    </div>

                    <input type="submit" class="login_button" value="<?php echo $langArr['login']; ?> ">
                </form>

            </div>
        </div>

        <div id="info_text"> </div>


        <footer>
            <?php print_subfooter(); ?>
        </footer>

        <script type="text/javascript">


            $('#report_box, #report_box div, #report_box di span').click(function() {
                $('#main_wrapper').transition({filter: 'blur(0px)', duration: 500}, function() {
                    $(this).removeClass('blur');
                });

                $('#report_box').transition({opacity: 0, duration: 500}, function() {
                    $(this).hide();
                });


            });


            $(window).resize(function() {
                if ($(window).width() < 680) {

                } else {

                }

            });

            $(function() {

                $(window).resize();
            });


        </script>
    </body>
</html>