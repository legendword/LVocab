<?php
include('config.php');

if ($_SERVER['REQUEST_METHOD']!='POST') exit("wrong method");


if (!file_exists($base.$uid."-index.csv")) {
	file_put_contents($base.$uid."-index.csv","Default#0\n");
}
echo file_get_contents($base.$uid."-index.csv");
?>