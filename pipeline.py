import json
import os
import glob
import time
from datetime import datetime
import shutil

pipeline_json = "./pipelinejson/Pipeline1.json"  #get Pipeline name from arg



pipeline_data = json.load(open(pipeline_json,'r'))
pipeline_data.keys()

run_dir ="./run_info/"
now=datetime.now()


pipeline_name = pipeline_data['pipelineName'] + now.strftime("%Y_%m_%d_%H_%M_%S") #Use this pipelineName
pipeline_name = "test_pipeline"

pipeline_dir = os.path.join(run_dir,pipeline_name)

if not  os.path.exists(pipeline_dir):
    os.mkdir(pipeline_dir)

pipeline_tasks= [task for task in pipeline_data['taskList']]


for one_task in pipeline_tasks:
    task_name = one_task['Name']
    task_dir = os.path.join(pipeline_dir,task_name)
    if not os.path.exists(task_dir):
        os.mkdir(task_dir)
    task_id = int(one_task['TaskId'])
    print(task_id)
    if task_id == 1:
        task_input = os.path.join(task_dir,"input.csv")
        print(task_input)
        shutil.copy("iris.csv",task_input)      #update iris.csv, iris.csv will be captured as arg and write else part for input.csv as o/p of prev 
   
    
    
    print(task_name)
    script_name = task_name + '.py'
    script_name = os.path.join("./uploads",script_name)
    print(script_name)
    command = "python %s" % script_name
    print(command)
    command = "python %s" % script_name
    print(command)
    print(os.getcwd())
    os.system(command)
   
    
