import os
import json
import sys

# permutates all possible features to build the initial aggregate tree
# sets all the values to zero
def buildSkelFlare2(depth, features):
	if depth == 0:
		return
	else:
		nodeList = []
		for feature in features:
			leafNode = {'ook':0, 'bpsk':0, 'oqpsk':0, 'bfskA':0, 'bfskB':0, 
									'bfskR2':0} 
			cumCl = {'ook':0, 'bpsk':0, 'oqpsk':0, 'bfskA':0, 'bfskB':0, 
									'bfskR2':0}
			tempDict = {'name':feature, 'less':0, 'greater':0, 
									'classes':leafNode, 'cumCl':cumCl}
			tempDict['type'] = 'split'
			tempDict['children'] = buildSkelFlare2(depth-1, features)
			nodeList.append(tempDict)
		return nodeList	

def main():
	input1 = int(sys.argv[1])
#
	workDir = 'C:\Users\Ken\Google_Drive\School\cpsc547\project'
	os.chdir(workDir + '\data')
#
	features = ['m1', 'm2', 'm3', 'm4', 'm5']
#	
	if input1 > 7:
		return
#	
	skelTree = {'name':'start', 'children': buildSkelFlare2(input1, features)}
#	
	for idx,val in enumerate(features):
		skelTree['children'][idx]['type'] = 'root'
#	
	out_file = open("skelTree.json", "w")
	json.dump(skelTree, out_file)
	out_file.close()		
	
if __name__ == "__main__":
	main()


#def buildSkelFlare(depth):
#	if depth == 0:
#		leafNode = [{'name':'ook', 'count':0}, {'name':'bpsk', 'count':0}, 
#							{'name':'oqpsk', 'count':0}, {'name':'bfskA', 'count':0},
#							{'name':'bfskB', 'count':0}, {'name':'bfskR2', 'count':0}]
#		return leafNode
#	else:
#		nodeList = []
#		for feature in features:
#			tempDict = {'name':feature, 'less':0, 'greater':0}
#			tempDict['children'] = buildSkelFlare(depth-1)
#			nodeList.append(tempDict)
#		return nodeList	
#skelTree = {'name':'start', 'children': buildSkelFlare(3)}

