
import numpy as np
import pandas as pd
import os
import json
from sklearn import tree as skTree
from sklearn.ensemble import RandomForestClassifier
from export_json import export_json
import sys

def main():
	ntree = int(sys.argv[1])
	#ntree = 100
#	
	workDir = 'C:\Users\Ken\Google_Drive\School\cpsc547\project'
#
	os.chdir(workDir + '\data')
#
	datTrn = pd.read_csv('datTrn.txt', sep=",")
	datTrn = datTrn[datTrn.snrdB == 2]
	#X = datTrn.drop(['cl','snrdB'], axis=1).values
	#feature_names = list(datTrn.drop(['cl','snrdB'],axis=1).columns.values)
#	
	clfRf = RandomForestClassifier(n_estimators=ntree, 
						criterion="entropy")
	feature_names = ['m1','m2','m3','m4','m5']
	X = datTrn[feature_names]
	y = datTrn.loc[:,['cl']].values.ravel()
	clfRf.fit(X, y)
#
	for idx,val in enumerate(clfRf.estimators_):
		outfj = "rawTree\\rawTree" + str(idx) + ".json"
		export_json(val, out_file=outfj, feature_names=feature_names)

if __name__ == "__main__":
	main()

