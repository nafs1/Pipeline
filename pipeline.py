import json
import os
import glob
import time
from datetime import datetime
import shutil
import argparse
import pdb

run_dir = "./run_info"
uploads_dir = "./uploads"
data_dir = "./upload_csv"

def extract_pipeline_info(pipeline_json=None):

    #pipeline_json = "./pipelinejson/Pipeline1.json"  #get Pipeline name from arg
    try:
        pipeline_data = json.load(open(pipeline_json,'r'))
        print(pipeline_data.keys())
    except FileNotFoundError as error:
        print(error)
        print("Invalid pipeline json path")
        exit()
    try:
        pipeline_info = {}
        pipeline_info['name'] = pipeline_data['pipelineName']
    except KeyError as error:
        print(error)
        print("Invalid pipeline json: {}".format(pipeline_json))
        exit()



    now=datetime.now()
    pipeline_name = pipeline_info['name'] +'_'+ now.strftime("%Y_%m_%d_%H_%M_%S") #Use this pipelineName
    #pipeline_name = "test_pipeline"
    pipeline_dir = os.path.join(run_dir,pipeline_name)
    if not  os.path.exists(pipeline_dir):
        os.mkdir(pipeline_dir)
    pipeline_info['pipeline_dir'] = pipeline_dir

    pipeline_tasks= [task for task in pipeline_data['taskList']]
    pipeline_info['tasks'] = pipeline_tasks
    return pipeline_info

def run_task(task_info,task_dir):

    task_name = task_info['Name']

    ##load task_json
    task_json_path = os.path.join("./taskjson","%s.json"%task_name)
    task_json = json.load(open(task_json_path,'r'))

    executor = task_json["executor"] 
    #script_name = task_name + '.py'
    
    script_name = os.path.join(uploads_dir,executor)
    print("Executing task ..{}.. by calling {}".format(task_name,script_name))
    command = "python %s" % script_name
    command = "python %s %s %s" % (script_name,task_name,task_dir)
    print("Executing ...", command)
    print(os.getcwd())
    try:
        os.system(command)
    except Exception as e:
        print("Error while executing {} ".format(task_name))
   
    
    



def run_pipeline(pipeline_json,input_csv):

    pipeline_info = extract_pipeline_info(pipeline_json)
    pipeline_dir = pipeline_info['pipeline_dir']
    pipeline_tasks = pipeline_info['tasks']
    first_task_input = input_csv
    prev_task = None
    latest_file = open('latest.txt','w')
    status = "%s" % pipeline_dir
    latest_file.write(status)
    latest_file.close()
    status_file = open(os.path.join(pipeline_dir,'status.txt'),'w')
    status = "Starting pipeline...%s\n" % pipeline_info['name']
    status_file.write(status)
    num_tasks = len(pipeline_tasks)
    for i,task_info in enumerate(pipeline_tasks):
        if i == 0:
            input_source = os.path.join(data_dir,first_task_input)
            shutil.copy(input_source,os.path.join(pipeline_dir,"pipeline_input.csv"))
        else:
            input_source = os.path.join(prev_task_dir,"output.csv")
        
        task_id = int(task_info['TaskId'])
        task_name ="%d_%s"%(task_id,task_info['Name'])
        status = "Task {}/{}:{} started\n".format(i+1,num_tasks,task_name)
        status_file.write(status)
        task_dir = os.path.join(pipeline_dir,task_name)
        if not os.path.exists(task_dir):
            os.mkdir(task_dir)
        task_input = os.path.join(task_dir,"input.csv")
        shutil.copy(input_source,task_input)      #update iris.csv, iris.csv will be captured as arg and write else part for input.csv as o/p of prev 
        task_id = int(task_info['TaskId'])
        print("Calling ...task id: {},name:{}, with input: {} task_id".format(task_id,task_name,task_input))
        run_task(task_info,task_dir)
        prev_task_dir = task_dir
        status = "Task {}/{}:{} Completed\n".format(i+1,num_tasks,task_name)
        status_file.write(status)

    status = "Pipeline  Completed\n".format(i,task_name)
    status_file.write(status)
    status_file.close()
    shutil.copy(os.path.join(task_dir,"output.csv"),  os.path.join(pipeline_dir,"pipeline_output.csv"))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("pipelinejson",help="Input json to the pipeline")
    parser.add_argument("csvfile",help="Input csv to the pipeline")

    args = parser.parse_args()
    pipeline_json= args.pipelinejson 
    input_csv= args.csvfile

    print("pipeline called for {} with input {}".format(pipeline_json,input_csv))
    run_pipeline(pipeline_json,input_csv)
   
    
