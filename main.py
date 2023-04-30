import numpy as np
import pandas as pd
import math 

#Load in 2023 NFL Prospect Data
data = np.array(pd.read_csv(r'.\2023 Prospect Age Database.csv'))
# get mode for each feature in each input and replace nan values with modes
prospect_modes = dict()
for i in range(4, 11) :
    arr, counts = np.unique(data[:, i], return_counts=True)
    prospect_modes[i] = arr[np.argmax(counts)]
# now replace nan with mode
for a in data :
    for i in range(4, 11) :
        if math.isnan(float(a[i])):
            a[i] = prospect_modes[i]
print(data)