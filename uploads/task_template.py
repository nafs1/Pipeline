from sklearn import  preprocessing

import pandas as pd
from task import Task
import os
import argparse

task_jsons_dir = "./taskjson"

class SampleTask(Task):
    def __init__(self,task_json,task_dir):
        super().__init__(task_json,task_dir)
    
    

    def sample_task(self,columns):
        df = pd.read_csv(self.input_csv,index_col=False)
        print(self.inputs)
        print(dataset)
        transformed_df = df
        return transformed_df
    
    def run(self):
        print("processing  inputs... {}".format(self.input_csv))
        output_csv = "output.csv"
        print(self.inputs)
        input_columns = [ip['name'] for ip in self.inputs]
        print(input_columns)
        normalised_input = self.sample_task(input_columns)
        normalised_input.to_csv(os.path.join(self.task_dir,output_csv),index=False)   #TODORetain other columns
        return output_csv

if __name__ == "__main__":
    print("calling task")
    
    parser = argparse.ArgumentParser()
    parser.add_argument("task_name")
    parser.add_argument("task_dir")
    args = parser.parse_args()
    task_name = args.task_name
    task_json_name = "%s.json" % task_name
    task_json = os.path.join(task_jsons_dir,task_json_name)
    task_dir = args.task_dir
    print(task_json)
    print(task_dir)
    SampleTask = SampleTask(task_json,task_dir)
    SampleTask.run()
