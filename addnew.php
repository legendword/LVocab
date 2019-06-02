<?php
ini_set('auto_detect_line_endings',TRUE);
include("config.php");

if ($_SERVER['REQUEST_METHOD']!='POST') exit("wrong method");


$wd = "";
$mn = "";
$ts = "";
$lt = "";
if (isset($_POST['word'])) $wd = rem($_POST['word']);
else exit("missing word");
if (isset($_POST['list'])) $lt = str_replace('.','',str_replace('/','',$_POST['list']));
else $lt = "default";
if (isset($_POST['meaning'])) {
	$mn = rem($_POST['meaning']);
	if (isset($_POST['translation'])) $ts = rem($_POST['translation']);
}
else if (isset($_POST['translation'])) $ts = rem($_POST['translation']);
else exit("missing meaning/translation");

if ($lt=="index") exit("invalid list name");

if (strlen($wd)>100) exit("word too long (".strlen($wd).")");
if (strlen($mn)>100000) exit("meaning too long (".strlen($mn).")");
if (strlen($ts)>100000) exit("translation too long (".strlen($ts).")");

if (!file_exists($base.$uid."-index.csv")){
	//new user for lvocab
	//if (!is_dir($base.$uid)) mkdir($base.$uid);
	if ($lt=="default") file_put_contents($base.$uid."-index.csv","Default#1\n");
	else {
		file_put_contents($base.$uid."-index.csv","Default#0\n".$lt."#1");
	}
	file_put_contents($base.$uid."-".$lt.".csv",$wd."#".$mn."#".$ts."\n");
}
else{
	$ct = parseCSV($base.$uid."-index.csv","#");
	//print_r($ct);
	$found = false;
	foreach ($ct as &$c) {
		if ($c[0]==$lt) { //list exists
			if (intval($c[1])>$wordLimit) {
				exit("too many words");
			}
			//put vocab in file
			$hd = fopen($base.$uid."-".$lt.".csv","a");
			fputcsv($hd, array($wd, $mn, $ts), "#");
			$found = true;
			fclose($hd);
			//update index
			$c[1] = intval($c[1]) + 1;
			break;
		}
	}
	if (!$found) {
		//put vocab in file
		$hd = fopen($base.$uid."-".$lt.".csv","a");
		fputcsv($hd, array($wd, $mn, $ts), "#");
		fclose($hd);
		//update index
		$hd = fopen($base.$uid."-index.csv","a");
		fputcsv($hd, array($lt, 1), "#");
		fclose($hd);
	}
	else {
		//update index file
		$hd = fopen($base.$uid."-index.csv","w");
		foreach ($ct as $g) {
			fputcsv($hd, $g, "#");
		}
		fclose($hd);
	}
}
echo "success";

function parseCSV($fl,$dl) {
	$Data = str_getcsv(file_get_contents($fl), "\n"); //parse the rows 
	foreach($Data as &$Row) $Row = str_getcsv($Row, $dl); //parse the items in rows 
	return $Data;
}
function rem($aw) {
	return str_replace('#','',$aw);
}
?>