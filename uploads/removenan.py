from sklearn import  preprocessing

import pandas as pd
from task import Task
import os
import argparse

task_jsons_dir = "./taskjson"

class RemoveNan(Task):
    def __init__(self,task_json,task_dir):
        super().__init__(task_json,task_dir)
    
    


    def remove_nan(self,columns):
        dataset = pd.read_csv(self.input_csv,index_col=False)
        input_df = dataset[columns]
        df_columns = dataset.columns
        output_df = dataset.dropna()
        return output_df
        
    
    def run(self):
        print("processing  inputs... {}".format(self.input_csv))
        output_csv = "output.csv"
        #print(self.inputs)
        input_columns = [ip['name'] for ip in self.inputs]
        print(input_columns)
        new_df = self.remove_nan(input_columns)
        output_path = os.path.join(self.task_dir,output_csv)
        print("Task output is in {}\n".format(output_path))
        new_df.to_csv(output_path,index=False)   #Retain other columns
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
    print("Executing task with json {}\n ".format(task_json))
    print("Executing task with task dir {}\n ".format(task_dir))
    removenan= RemoveNan(task_json,task_dir)
    removenan.run()
