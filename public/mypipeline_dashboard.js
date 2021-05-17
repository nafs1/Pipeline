
function run_python() {
    console.log("inside run_python frontend");
	
	let run_pipe = document.getElementById("pipe").value;
	let csv_path = document.getElementById("csv_path").value;
	
	console.log(run_pipe);
	
	$.post('/run_python', { run_pipe: run_pipe, csv_path: csv_path}, function(response){ 
      console.log(response);
	  console.log(run_pipe);
	  
	  let linkpath = "pipeline_output.csv"
	  console.log(linkpath);
	  
	  if(response.mydata === "")
	  {
		  console.log("style change");
		  document.getElementById("link_id").style.display = "block";
		  document.getElementById("myhref").setAttribute("href", linkpath);
		  window.alert("Pipeline Run Successful....Check Status");
	  }
	  else
	  {
		var para = document.createElement("P");
		var para = document.createElement("P");
		var t = document.createTextNode("Error :====> "+ response.mydata);
		para.appendChild(t);
		document.getElementById("mydiv").appendChild(para);
		window.alert("Error while running the executor file....Check Status");
	  }

	  
	  
})
	
	
	


}



function check_python() {
    console.log("inside check_python frontend");
	
	$.get('/check_python', function(data, status){
	   console.log("Data fetched "+ data); 
	   
  });
}


function check_status() {
    console.log("inside check_status frontend");
	
	$.get('/check_status', function(data, status){
	   console.log("Data fetched "+ data);
	   
	   
	    var para = document.createElement("P");
		var t = document.createTextNode("Log :====> "+ data);
		para.appendChild(t);
		document.getElementById("mydiv").appendChild(para);
	   
	   

		/*
		for( let i = 0;i<data.length;i++){

		var para = document.createElement("P");
		var t = document.createTextNode("Task :" + data[i].TaskName+"=======>Log :"+ data[i].Log);
		para.appendChild(t);
		document.getElementById("mydiv").appendChild(para);
		}*/
		
	   
	   
  });
  
  $("#myModal").modal();
}

function fetch_pipeline(){
  $.get('/fetch_pipes', function(pipes, status){
	   console.log("Data fetched"+ pipes[0].Name); 
		var select = document.createElement("select");
			select.name = "pipe";
			select.id = "pipe";      
		//Add the Options to the DropDownList.
			for (var i = 0; i < pipes.length; i++) {
			  var option = document.createElement("OPTION");
		 
			  //Set Pipe Name in Text part.
			  option.text = pipes[i].Name;
		 
			  //Set Pipe in Value part.
			  option.value = pipes[i].Name;
		 
			  //Add the Option element to DropDownList.
			  select.appendChild(option);
			}
		  var label = document.createElement("label");
		  label.innerHTML = "Select your Pipeline to Run &emsp;";
		  label.htmlFor = "pipe";
		  document.getElementById("select_pipe").appendChild(label).appendChild(select);
      
  
  	});
}

function upload_csv(){
	console.log("Inside upload_csv");
	
	var csv_file_upload = document.getElementById("input_csv").value;
	
	let file = csv_file_upload;	
	file = file.replace('C:\\fakepath\\','');
	
	console.log(file);
	
	document.getElementById("csv_path").value = file;
	
	console.log(csv_file_upload);
	
	$.post('/upload_csv', { file_upload: csv_file_upload });
	
}
