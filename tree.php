<?php

$id = isset($_GET['id']) ? $_GET['id'] : ""; 
$select = isset($_GET['act']) ? $_GET['act'] : ""; 

if( $id!="" ){
	if( $id>40 ){
		$data = '{"status":1}';
	}else{
		$data = '{"status":1,"data":[
			{"id":'.($id+11).',"text":"test'.($id+11).'","parent":'.$id.'},
			{"id":'.($id+21).',"text":"test'.($id+11).'","parent":'.$id.'}
		]}';
	}
}else{
	$data = '{"status":1,"data":[
		'. ($select=="select" ? '{"id":"","text":"请选择1","parent":-1},' : "") .'
		{"id":1,"text":"test1","parent":-1},
		{"id":2,"text":"test2","parent":-1},
		{"id":3,"text":"test3","parent":-1},
		{"id":4,"text":"test4","parent":-1},
		{"id":5,"text":"test5","parent":-1}
	]}';
}

echo $data;



