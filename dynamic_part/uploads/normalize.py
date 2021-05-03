from sklearn import  preprocessing

import pandas as pd
from task import Task
import os

class Normalise(Task):
    def __init__(self,task_json,task_dir):
        super().__init__(task_json,task_dir)
    
    

    def normalise_input(self,columns):
        dataset = pd.read_csv(self.input_csv,index_col=False)
        print(self.inputs)
        print(dataset)
        inputs = dataset[columns].values
        colums = columns
        
        scaler = preprocessing.StandardScaler()
        transformed = scaler.fit_transform(inputs)
        transformed_df = pd.DataFrame(transformed,columns=columns)
        return transformed_df
    
    def run(self):
        print("processing  inputs... {}".format(self.input_csv))
        output_csv = "output.csv"
        print(self.inputs)
        input_columns = [ip['name'] for ip in self.inputs]
        print(input_columns)
        normalised_input = self.normalise_input(input_columns)
        normalised_input.to_csv(os.path.join(self.task_dir,output_csv),index=False)
        return output_csv

if __name__ == "__main__":
    print("calling task")
    
    task_json = "./taskjson/Normalize.json"
    task_dir = "./run_info/test_pipeline/normalize"    
    normalise = Normalise(task_json,task_dir)
    normalise.run()