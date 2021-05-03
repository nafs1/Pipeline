
	function construct()
	{   inputName = "";
		inputs = [];
		executor = "";
		outputName = "";
		outputs =[];

	}
	
	  function deleteRow(row) {
	  var i = row.parentNode.parentNode.rowIndex;
	  document.getElementById('inputTable').deleteRow(i);
	}


	function insRow() {
	  console.log('input insert row');
	  var x = document.getElementById('inputTable');
	  var new_row = x.rows[1].cloneNode(true);
	  var len = x.rows.length;
	  new_row.cells[0].innerHTML = len;

	  var inp1 = new_row.cells[1].getElementsByTagName('input')[0];
	  inp1.id += len;
	  inp1.value = '';
	  var inp2 = new_row.cells[2].getElementsByTagName('input')[0];
	  inp2.id += len;
	  inp2.value = '';
	  x.appendChild(new_row);
	}
	
	
	  function outdeleteRow(row) {
	  var i = row.parentNode.parentNode.rowIndex;
	  document.getElementById('outputTable').deleteRow(i);
	}


	function outinsRow() {
	  console.log('output insert row');
	  var x = document.getElementById('outputTable');
	  var new_row = x.rows[1].cloneNode(true);
	  
	  var len = x.rows.length;
	  new_row.cells[0].innerHTML = len;

	  var inp1 = new_row.cells[1].getElementsByTagName('input')[0];
	  inp1.id += len;
	  inp1.value = '';
	  var inp2 = new_row.cells[2].getElementsByTagName('input')[0];
	  inp2.id += len;
	  inp2.value = '';
	  x.appendChild(new_row);
	}
	
	
	function upload_fun(){
	console.log("Inside upload_fun");
	
	var file_upload = document.getElementById("file_upload").value;
	
	let file = file_upload;	
	file = file.replace('C:\\fakepath\\','');
	
	console.log(file);
	
	document.getElementById("executor").value = file;
	
	console.log(file_upload);
	
	$.post('/upload_exec', { file_upload: file_upload });
	
	}
	
	
	
	
  function fun()
  { 
  
	taskName = document.getElementById("task_name").value
    inputName = document.getElementById("input_name").value
	outputName = document.getElementById("output_name").value
	console.log("inside fun");
	var input_rows_len = document.getElementById("inputTable").rows.length;
	console.log(input_rows_len);
	
	for(i=1;i<input_rows_len;i++)
	{
		sr_no = document.getElementById("inputTable").rows[i].cells[0].innerHTML;
		name = document.getElementById("inputTable").rows[i].cells[1].children[0].value;
		d_type = document.getElementById("inputTable").rows[i].cells[2].children[0].value;
		default_val = document.getElementById("inputTable").rows[i].cells[3].children[0].value;
		
		input = {
				  "sr_no":sr_no,
				  "name":name,
				  "Data_type":d_type,
				  "default_val":default_val
				}
		
		inputs.push(input);
		
	}
	var executor = document.getElementById("executor").value
	var output_rows_length = document.getElementById("outputTable").rows.length;
	console.log(output_rows_length)
	for( i=1;i<output_rows_length;i++)
	{
		sr_no = document.getElementById("outputTable").rows[i].cells[0].innerHTML;
		name = document.getElementById("outputTable").rows[i].cells[1].children[0].value;
		d_type = document.getElementById("outputTable").rows[i].cells[2].children[0].value;
		default_val = document.getElementById("outputTable").rows[i].cells[3].children[0].value;
		
		output = {
				"sr_no":sr_no,
				  "name":name,
				  "Data_type":d_type,
				  "default_val":default_val
				}
	outputs.push(output)
	}
	
	console.log(taskName)
	console.log(inputName)
	console.log(inputs)
	console.log(outputName)
	console.log(outputs)
	
	
	
	$.post('/task',{taskName: taskName,
				  inputName:inputName,
                  task: inputs,
                  executor:executor,
                  outputName:outputName,
				  outputs:outputs})
	

	

}