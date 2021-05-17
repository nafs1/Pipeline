const express = require("express")
const path = require("path")
const cors =require("cors")
const bodyParser = require("body-parser")
const jsontoxml  = require("jsontoxml")
const fs = require("fs")
const fsr = require("fs")
const multer = require("multer")
const process = require('process')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, "./uploads/")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

const maxSize = 1 * 1000 * 1000;
    
var upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize }
	
// mypic is the name of file attribute
}).single("myfile");



app.post("/upload_exec",function (req, res, next) {
        
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
	
	console.log(req.file);
	console.log(req.body);
	
	console.log("inside upload_exec");
	
    upload(req,res,function(err) {
  
        if(err) {
  
            // ERROR occured (here it can be occured due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {
  
            // SUCCESS, image successfully uploaded
			
            res.send("Success, File uploaded!")
        }
    })
})



app.get("/fetch_task",function (req, res, next) {
	
	console.log("inside fetch");
    
	const directoryPath = path.join(__dirname, 'taskjson');
	
	let myarr = [];
	let temp_obj;
	let i = 1;
	files = fs.readdirSync(directoryPath);
	files.forEach(file => {
		file = file.replace('.json','');
		temp_obj ={TaskId: i, Name: file}
		myarr.push(temp_obj);
		i=i+1;
	})
	console.log(myarr);
    res.send(myarr);
    
})



//CSV storage
var csv_storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, "upload_csv")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
//CSV file upload
var csv_upload = multer({ 
    storage: csv_storage,
    limits: { fileSize: maxSize }
}).single("mycsvfile");

app.post("/upload_csv",function (req, res, next) {
    console.log("inside upload_csv");    
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    csv_upload(req,res,function(err) {
  
        if(err) {
  
            // ERROR occured (here it can be occured due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {
  
            // SUCCESS, image successfully uploaded
			
            res.send("Success,CSV File uploaded!")
        }
    })
})


app.get("/fetch_pipes",function (req, res, next) {
	
	console.log("inside fetch pipeline");
    
	const directoryPath = path.join(__dirname, 'pipelinejson');
	
	let myarr_pipe = [];
	let temp_obj_pipe;
	let i = 1;
	pfiles = fs.readdirSync(directoryPath);
	pfiles.forEach(pfile => {
		pfile = pfile.replace('.json','');
		temp_obj_pipe ={PipeId: i, Name: pfile}
		myarr_pipe.push(temp_obj_pipe);
		i=i+1;
	})
	console.log(myarr_pipe);
    res.send(myarr_pipe);
    
})




app.post('/run_python',(req,res)=>{
	
	console.log("inside run_python backend");
	
	run_pipe = req.body.run_pipe;
    csv_path = req.body.csv_path;
	
	console.log(run_pipe)
	console.log(csv_path)
	
	run_pipe = "./pipelinejson/"+run_pipe+".json";
	
	const spawn = require("child_process").spawnSync;
	const pythonProcess = spawn('python',["pipeline.py", run_pipe, csv_path]);
    /*
	pythonProcess.stdout.on('data', (data) => {
    // Do something with the data returned from python script
		console.log(data.toString());
        
		//alert("Pipeline Run Successful...Check Status")
})
	
	
	
	pythonProcess.stderr.on('data', (data) => {
    // Do something with the data returned from python script
		console.log(data.toString());
		
		//alert("Pipeline Run Unsuccessful...Check Status")
        
});*/

	let savedOutput = '';
	//let curr_dir = fsr.readFileSync('latest.txt');

	
	savedOutput = pythonProcess.stderr;
	console.log(String(savedOutput));
	
	//curr_dir = curr_dir+'/'+'pipeline_output'+'.csv'
	curr_dir =  process.cwd();
	
	let obj = {
		"output_csv_path": curr_dir,
        "mydata": String(savedOutput)
    }
	
	res.send(obj);
	
})
	






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
	
	console.log(input_csv_path);	
	
	
	
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






app.get("/check_status",function (req, res, next) {
	
	console.log("inside check_status backend");
	let curr_dir = fsr.readFileSync('latest.txt');
	
	
	console.log(curr_dir+'/'+'status'+'.txt');
	let status_data = fsr.readFileSync(curr_dir+'/'+'status'+'.txt',{encoding:'utf8', flag:'r'});
	
	
	res.send(status_data);
	
	
	
	
	
	/*
	
	let directoryPath = './run_info/Pipeline1';
	files = fsr.readdirSync(directoryPath);
	let count = files.length;
	console.log(count);
	
	let temp_pipe_content = fsr.readFileSync('./pipelinejson/Pipeline1.json',{encoding:'utf8', flag:'r'});
	let pipe_content = JSON.parse(temp_pipe_content);
	
	console.log(pipe_content["totalTask"]);
	console.log(pipe_content["taskList"][0].Name);
	
	let data;
	let myarr = [];
	let temp_obj;
	
	for( let i=0;i<count;i++)
	{
		data = fs.readFileSync('./run_info/Pipeline1/'+pipe_content["taskList"][i].Name+'/'+pipe_content["taskList"][i].Name+'.txt',{encoding:'utf8', flag:'r'});
		temp_obj = {TaskName: pipe_content["taskList"][i].Name, Log: data};
		myarr.push(temp_obj);
	}

	console.log(myarr);
	
    res.send(myarr);
	*/

    
})





app.post('/post_pipe',(req,res)=>{
	
	
    pipelineName = req.body.pipelineName;
    taskList = req.body.taskList;
	totalTask = req.body.totalTask;
	
    let obj = {
		"pipelineName": pipelineName,
        "taskList": taskList,
		"totalTask": totalTask
    }	
	
	console.log(obj)
	
	let data = JSON.stringify(obj,null,4)	
	
	  
    fs.writeFile("pipelinejson/"+pipelineName+".json",data,(err)=>{
        if(err)
        return console.log(err)
        return console.log("Successful")

    })
	
		
    res.send("HI")
})






let inputs,inputName,outputName,outputs,executor
app.use(express.static('public'))
app.post('/task',(req,res)=>{
	
	
    taskName = req.body.taskName
    inputName = req.body.inputName
    inputs = req.body.task
    executor = req.body.executor
    outputName =req.body.outputName
    outputs = req.body.outputs
    let obj = {
		"taskName": taskName,
        "inputName":inputName,
    
    }
	
	
	
	obj["input"]=inputs
	
	console.log("inside app "+obj["input"])
	
    obj["executor"] = executor
    obj["outputName"] = outputName
	obj["output"]=outputs	
	
	
	console.log(obj)
	
	let data = JSON.stringify(obj,null,4)	
	
	  
    fs.writeFile("taskjson/"+taskName+".json",data,(err)=>{
        if(err)
        return console.log(err)
        return console.log("Successful")

    })
	
		
    res.send("HI")
})


app.use('/',(req,res)=>{
    var request_method = req.method;
    // console.log(req.method)
    // console.log(req.body.inputs)

    res.sendFile(path.join(__dirname,'public','index.html'))
  })


app.listen(4000,()=>{
    console.log("Server is up and running")
})