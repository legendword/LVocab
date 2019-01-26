<?php
include('config.php');

if ($_SERVER['REQUEST_METHOD']!='POST') exit("wrong method");

if (isset($_POST['name'])) $lt = str_replace('.','',str_replace('/','',$_POST['name']));
else exit("missing");

if ($lt=="index") exit("invalid list name");

if (strlen($lt)>50) exit("list name too long");

if (file_exists($base.$uid."-".$lt.".csv")) {
	exit("list already exists");
}
else {
	//create new list
	$hd = fopen($base.$uid."-index.csv","a");
	fputcsv($hd, array($lt,0), "#");
	fclose($hd);
}
echo "success";

function parseCSV($fl,$dl) {
	$Data = str_getcsv(file_get_contents($fl), "\n"); //parse the rows 
	foreach($Data as &$Row) $Row = str_getcsv($Row, $dl); //parse the items in rows 
	return $Data;
}
?>