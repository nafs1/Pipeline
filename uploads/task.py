#!/usr/bin/env python
# coding: utf-8

# In[10]:


import json
import pandas as pd
import os

class Task:
    def __init__(self,task_json,task_dir):
        print(task_dir)
        self.input_csv = os.path.join(task_dir,"input.csv")
        self.dataset = pd.read_csv(self.input_csv,index_col=False)
        self.task = json.load(open(task_json,'r'))
        self.inputs = [ip for ip in self.task['input']]
        self.task_dir = task_dir 
        
    def verify_datatype(self):    
        for ip in self.inputs:
            name = ip['name']
            datatype=ip['Data_type']        
            if name in self.dataset.columns:
                if not  datatype in self.dataset[name].dtype.__str__():
                    print("datatype mismatch for {}".format(name))
        return  True
    
 
            

    


# In[ ]:





# In[ ]:





# In[ ]:




