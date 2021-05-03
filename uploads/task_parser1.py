#!/usr/bin/env python
# coding: utf-8

# In[22]:


import xmltodict


# In[29]:


with open('task4.xml') as fd:
    doc = xmltodict.parse(fd.read())


# In[32]:


input_list = doc['taskgenerator']['input']
input_name = doc['taskgenerator']['inputName']
executor =  doc['taskgenerator']['executor']
output_name = doc['taskgenerator']['outputName']
output_list = doc['taskgenerator']['output']


# In[60]:


print(input_name)
print(input_list)
print(executor)
print(output_list)


# In[ ]:





# In[ ]:




