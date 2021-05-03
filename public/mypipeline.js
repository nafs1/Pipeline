 function myconstruct(){ 
		pipelineName = "";
		taskList = [];
	}

      
  function fetchtasks() {
    //Build an array containing Task records.
	
	$.get('/fetch_task', function(tasks, status){
	   console.log("Data fetched"+ tasks[0].Name);
    
		var tcount=tasks.length;
		var count=1; 
		
		while(count<=tcount){ 
		
			var select = document.createElement("select");
			select.name = "task"+count;
			select.id = "task"+count;      
		//Add the Options to the DropDownList.
			for (var i = 0; i < tasks.length; i++) {
			  var option = document.createElement("OPTION");
		 
			  //Set Task Name in Text part.
			  option.text = tasks[i].Name;
		 
			  //Set TaskId in Value part.
			  option.value = tasks[i].Name;
		 
			  //Add the Option element to DropDownList.
			  select.appendChild(option);
			}
		  var label = document.createElement("label");
		  label.innerHTML = "&emsp;Task"+count+":";
		  label.htmlFor = "task"+count;
		  count=count+1;
		  document.getElementById("selectask").appendChild(label).appendChild(select);
        }
  
  });

}

function pipegen(){

	let totalTask = document.getElementById("task1").options.length;
	let myobj;
	
	for(let i=0; i < totalTask; i++)
	{
		task_list = document.getElementById("task"+(i+1)).value;
		myobj ={TaskId: i+1, Name: task_list};
		taskList.push(myobj);
	}

	console.log("inside pipegen");
	pipelineName = document.getElementById("pipe_name").value;
	
	$.post('/post_pipe', { pipelineName: pipelineName, totalTask: totalTask, taskList: taskList})

}