import pandas as pd
import sys


arg1 = sys.argv[1]
arg2 = sys.argv[2]

df = pd.read_csv(arg1)

df.to_csv(arg2)

print("program terminated succesfully")

sys.stdout.flush()