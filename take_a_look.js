app.get("/check_python",function (req, res, next) {
	
	console.log("inside check_python backend");
	
	let temp_pipe_content = fsr.readFileSync('./pipelinejson/Pipeline1.json',{encoding:'utf8', flag:'r'});
	let pipe_content = JSON.parse(temp_pipe_content);
	
	console.log(pipe_content["totalTask"]);
	console.log(pipe_content["taskList"][0].Name);
	
	let input_csv_path = "./upload_csv/"+pipe_content["input_csv_name"];
	let output_csv_path;
	
	for( let i=0;i<pipe_content["totalTask"];i++){
	
	
	let temp_task_content = fsr.readFileSync("./taskjson/"+pipe_content["taskList"][i].Name+".json",{encoding:'utf8', flag:'r'}); 
	let task_content = JSON.parse(temp_task_content);
	
	console.log(task_content["inputName"]);
	
	let flag = false;
	
	output_csv_path = './run_info/Pipeline1/'+pipe_content["taskList"][i].Name
	
	fsr.mkdirSync(output_csv_path,{recursive: true});
	
	
	
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python',["./uploads/"+task_content["executor"], input_csv_path, output_csv_path+'/output.csv']);
    
	pythonProcess.stdout.on('data', (data) => {
    // Do something with the data returned from python script]
	
		console.log(flag);
	
		let mydata = data.toString();
		
		//fsr.mkdirSync('./run_info/Pipeline1/'+pipe_content["taskList"][i].Name,{recursive: true});
		
		fsr.writeFileSync('./run_info/Pipeline1/'+pipe_content["taskList"][i].Name+'/'+pipe_content["taskList"][i].Name+'.txt', mydata);
		
		input_csv_path = './run_info/Pipeline1/'+pipe_content["taskList"][i].Name+"/output.csv";
		
		console.log(data.toString());
		
        //res.write(data);
        //res.end('end');
	})
	
	

	pythonProcess.stderr.on('data', (data) => {
    // Do something with the data returned from python script
		let mydata = data.toString();
		
		//fsr.mkdirSync('./run_info/Pipeline1/'+pipe_content["taskList"][i].Name,{recursive: true});
		
		fsr.writeFileSync('./run_info/Pipeline1/'+pipe_content["taskList"][i].Name+'/'+pipe_content["taskList"][i].Name+'.txt', mydata);
	
	
		console.log(data.toString());
		flag = true;
        //res.write(data);
        //res.end('end');
	});
	
	console.log("outside err: "+ flag);

	
	
	
	
}
	
res.send("end");
    
})