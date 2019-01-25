<?php
include('config.php');

if ($_SERVER['REQUEST_METHOD']!='POST') exit("wrong method");

if (isset($_POST['list'])) $lt = trim(trim($_POST['list'],'/'),'.');
else exit("missing");

if ($lt=="index") exit("invalid list name");

if (!file_exists($base.$uid."-".$lt.".csv")) {
	exit("no such list");
}
echo file_get_contents($base.$uid."-".$lt.".csv");
?>