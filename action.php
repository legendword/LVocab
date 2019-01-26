<?php
include('config.php');

if ($_SERVER['REQUEST_METHOD']!='POST') exit("wrong method");

if (isset($_POST['list'])) $lt = str_replace('.','',str_replace('/','',$_POST['list']));
else exit("missing");
if (isset($_POST['id'])) $id = intval($_POST['id']);
else exit("missing");
if (!is_numeric($id)) exit("invalid id given");
if (isset($_POST['action'])) $ac = $_POST['action'];
else exit("missing");

if ($lt=="index") exit("invalid list name");

if (!file_exists($base.$uid."-".$lt.".csv")) {
	exit("no such list");
}
else {
	$ct = parseCSV($base.$uid."-".$lt.".csv", "#");
	switch ($ac) {
		case "delete":
			if ($id>count($ct)) {
				exit("id exceeds limit");
			}
			$hd = fopen($base.$uid."-".$lt.".csv","w");
			foreach ($ct as $ci => $cv) {
				if ($ci==$id-1) continue;
				fputcsv($hd, $cv, "#");
			}
			fclose($hd);
			//update index
			$nd = parseCSV($base.$uid."-index.csv", "#");
			foreach ($nd as &$cnd) {
				if ($cnd[0]==$lt) $cnd[1] = intval($cnd[1])-1;
			}
			$hd = fopen($base.$uid."-index.csv","w");
			foreach ($nd as $nv) {
				fputcsv($hd, $nv, "#");
			}
			fclose($hd);
			break;
		default:
			exit("unknown action");
			break;
	}
}
echo "success";

function parseCSV($fl,$dl) {
	$Data = str_getcsv(file_get_contents($fl), "\n"); //parse the rows 
	foreach($Data as &$Row) $Row = str_getcsv($Row, $dl); //parse the items in rows 
	return $Data;
}
?>