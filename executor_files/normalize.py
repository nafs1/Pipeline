from sklearn import  preprocessing

import pandas as pd
from task import Task
import os
import argparse

task_jsons_dir = "./taskjson"

class Normalise(Task):
    def __init__(self,task_json,task_dir):
        super().__init__(task_json,task_dir)
    
    

    def normalise_input(self,columns):
        dataset = pd.read_csv(self.input_csv,index_col=False)
        inputs = dataset[columns].values
        colums = columns
        
        scaler = preprocessing.StandardScaler()
        transformed = scaler.fit_transform(inputs)
        transformed_df = pd.DataFrame(transformed,columns=columns)
        dataset[columns] = transformed_df
        return dataset
    
    def run(self):
        print("processing  inputs... {}".format(self.input_csv))
        output_csv = "output.csv"
        print(self.inputs)
        input_columns = [ip['name'] for ip in self.inputs]
        print(input_columns)
        normalised_input = self.normalise_input(input_columns)
        normalised_input.to_csv(os.path.join(self.task_dir,output_csv),index=False)   #Retain other columns
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
    normalise = Normalise(task_json,task_dir)
    normalise.run()
