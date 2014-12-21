
all: data/skelTree.json data/rawTree/*.json data/aggTree.json

clean:
	rm -f data/skelTree.json data/rawTree/*.json data/aggTree.json
	
.PHONY: all clean
.DELETE_ON_ERROR:
.SECONDARY:

data/skelTree.json:
	C:/Python27/python code/RandomForestVisProcessor/buildSkelTree.py 5

data/rawTree/*.json: data/datTrn.txt
	C:/Python27/python code/RandomForestVisProcessor/extractTrees.py 500
	
data/aggTree.json: data/skelTree.json data/rawTree/*.json
	C:/Python27/python code/RandomForestVisProcessor/parseRawTree.py





