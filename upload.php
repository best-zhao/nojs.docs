<?php

$F = $_FILES['filedata'];
$ajax = $_GET['ajax'];


//print_r($F); 
if( $ajax==1 && isset($_GET['uploadID']) ){
	//获取文件尺寸
	//$status = apc_fetch('upload_' . $_GET["uploadID"]);
	//apc_fetch('upload_'.$_GET['uploadID']);
	//$status['done'] = 1;
	//echo json_encode($status);
	
	$status = apc_fetch('upload_'.$_GET['uploadID']);
  	echo $status['total'];
	
	
}else{
	//apc_store('upload_' . $_GET["uploadID"], $F);
	//$status['done'] = 1;
	
	if( $F["error"]==0 ){
		//上传成功
		move_uploaded_file($F["tmp_name"],"upfile/" . $F["name"]);
		//print_r($F); 
		$data = "{'status':1,'msg':'上传成功!','uploadID':'".$_POST["uploadID"]."','file':'/upfile/" . $F["name"] . "'}";
		if( $_GET['jsoncallback'] ){//表单上传
			echo "<script>parent." . $_GET['jsoncallback'] . "(" . $data . ");</script>";
		}else{//xhr异步上传
			echo $data;
		}	
		
	}
}



