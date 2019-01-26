<?php
include('config.php');

if ($_SERVER['REQUEST_METHOD']!='POST') exit("wrong method");

if (isset($_POST['name'])) $lt = str_replace('.','',str_replace('/','',$_POST['name']));
else exit("missing");

if ($lt=="index") exit("invalid list name");

if (!file_exists($base.$uid."-".$lt.".csv")) {
	exit("list doesn't exist");
}
else {
	//delete list
	unlink($base.$uid."-".$lt.".csv");
	$ct = parseCSV($base.$uid."-index.csv","#");
	$ci = -1;
	foreach ($ct as $cp => $cc) {
		if ($cc[0]==$lt) {
			$ci = $cp;
		}
	}
	if ($ci==-1) {
		exit("no reference to list in list index");
	}
	$hd = fopen($base.$uid."-index.csv","w");
	foreach ($ct as $cp => $cc) {
		if ($cp==$ci) continue;
		fputcsv($hd, $cc, "#");
	}
	fclose($hd);
}
echo "success";

function parseCSV($fl,$dl) {
	$Data = str_getcsv(file_get_contents($fl), "\n"); //parse the rows 
	foreach($Data as &$Row) $Row = str_getcsv($Row, $dl); //parse the items in rows 
	return $Data;
}
?>