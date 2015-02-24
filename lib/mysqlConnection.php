<?php

class mysqlConn {

    var $db_host = "localhost:1000";
    var $db_user = "root";
    var $db_pass = "";
    var $db = "sorate";
    var $connID = NULL;
    var $errno = 0;
    var $connected = 0;
    var $secure = 0;

    function config($a, $b, $c, $d) {
        $this->db_host = $a;
        $this->db_user = $b;
        $this->db_pass = $c;
        $this->db = $d;
    }

    function connect() {
        if (!$this->connected) {
            $this->errno = 1;
            $conn = @mysql_pconnect($this->db_host, $this->db_user, $this->db_pass);
            if (!$conn)
                $this->showErr();
            $this->connID = $conn;
            $database = @mysql_select_db($this->db, $this->connID);
            $this->errno = 2;
            if (!$database)
                $this->showErr();
            mysql_query("SET NAMES UTF8");
            $this->connected = 1;
            //mysql_set_charset("utf8");
        }
    }

    function close() {
        if ($this->connected)
            mysql_close($this->connID);
        $this->connected = 0;
    }

    function showErr($qu) {
        if (!$this->secure) {
            $err = "<font size='2' face='Arial'><b> ERROR : " . $this->errno . " <br><br> <font color='#FF0000'>- Exception handled while database operation.</font></b> <br><br><font size=1 face=courier>- " . mysql_error() . '<br><br>- ' . $qu;
            echo $err;
        } else {
            $err = "<font size='2' face='Arial'><b> ERROR : " . $this->errno . " <br><br> <font color='#FF0000'>- Exception handled while INSECURE database operation.</font></b> <br><br><font size=1 face=courier>- " . mysql_error() . '<br><br>- ' . $qu;
            echo $err;
        }
        exit;
    }

    function getQ($q, &$n = 1) {
        if (!$this->connected)
            $this->connect();
        $this->errno = 3;
        $query = @mysql_query($q, $this->connID);
        if (!$query)
            $this->showErr($q);
        $i = 0;
        $ret = null;
        while ($result = mysql_fetch_array($query)) {
            $ret[$i] = $result;
            $i++;
        }
        //$n = mysql_num_rows($query);
        $n = $i;
        mysql_free_result($query);
        return $ret;
    }

    function getQKeyValue($q) {
        if (!$this->connected)
            $this->connect();
        $this->errno = 3;
        $query = @mysql_query($q, $this->connID);
        if (!$query)
            $this->showErr($q);
        $ret = null;
        $i = 0;
        while ($result = mysql_fetch_array($query, MYSQL_ASSOC)) {
            $ret[$i] = $result;
            $i++;
        }
        //$n = mysql_num_rows($query);
        //$n = $i;
        return $ret;
    }

    function setQ($q) {
        if (!$this->connected)
            $this->connect();
        $this->errno = 4;
        $query = @mysql_query($q, $this->connID);
        if (!$query)
            $this->showErr($q);
    }

    function id() {
        return mysql_insert_id($this->connID);
    }

}

?>