
import numpy as np
import pandas as pd
import os
import json
from sklearn import tree as skTree
import pprint
import scipy.stats as ss

#workDir = 'C:\Users\Ken\Google_Drive\School\cpsc547\project'
#os.chdir(workDir + '\data')

#classes = ['ook', 'bpsk', 'oqpsk', 'bfskA', 'bfskB', 'bfskR2']

#infs = ["rawTree//"+fName for fName in os.listdir("rawTree")]

#fOpen = open(infs[0], 'r')
#treej = json.loads(fOpen.read())
#fOpen.close()

# Note: Documentations lacking

# helper function that computes class count distribution for 
# an individual tree
def computeCumCl(treeDat):
	if not treeDat.has_key('children'):
		return map(int, map(float, treeDat['cumCl']))
	else:
		cumCl = map(int, map(float, treeDat['cumCl']))
		cumClLeft = computeCumCl(treeDat['children'][0])
		cumClRight = computeCumCl(treeDat['children'][1])
		cumChildren = [x+y for x,y in zip(cumClLeft, cumClRight)]
		return [x+y for x,y in zip(cumCl, cumChildren)]

# helper function that computes class count distribution at 
# nodes traversed so far to raw tree
def buildCumClRawTree(treeDat):
	if not treeDat.has_key('children'):
		return treeDat
	else:
		newTreeDict = {}
		newTreeDict['name'] = treeDat['name']
		newTreeDict['label'] = treeDat['label']
		newTreeDict['type'] = treeDat['type']
		newTreeDict['infoGain'] = treeDat['infoGain']
		newTreeDict['cumCl'] = computeCumCl(treeDat)
		newTreeDict['children'] = [buildCumClRawTree(treeDat['children'][0]), 
																buildCumClRawTree(treeDat['children'][1])]
		return newTreeDict

# helper function that appends the class count distribution 
# info from the classification to the aggregated tree
def addCumCl(aggCumCl, treeCumCl):
	return {'ook': aggCumCl['ook']+treeCumCl[0], 
		'bpsk': aggCumCl['bpsk']+treeCumCl[1], 
		'oqpsk': aggCumCl['oqpsk']+treeCumCl[2], 
		'bfskA': aggCumCl['bfskA']+treeCumCl[3], 
		'bfskB': aggCumCl['bfskB']+treeCumCl[4], 
		'bfskR2': aggCumCl['bfskR2']+treeCumCl[5]}

# appends feature variable and class prediction information from 
# classification tree to the aggregated tree.		
def buildConsTree(aggDat1, treeDat, classes):
	if not treeDat.has_key('children'):
		return
	elif aggDat1['children'] is None:
		#infoGain = round(float(treeDat['infoGain']),2)
		labelOp = treeDat['label']
		aggDat1[labelOp] = aggDat1[labelOp] + 1
		#
		childName1 = treeDat['children'][0]['name']
		if childName1 in classes:	
			aggDat1['classes'][childName1] = aggDat1['classes'][childName1] + 1
		childName2 = treeDat['children'][1]['name']
		if childName2 in classes:
			aggDat1['classes'][childName2] = aggDat1['classes'][childName2] + 1
		aggDat1['cumCl'] = addCumCl(aggDat1['cumCl'], treeDat['cumCl']) 
		#print(childName1)
		#print('childName2: ' + childName2)
		return
	else:
		#infoGain = round(float(treeDat['infoGain']),2)
		labelOp = treeDat['label']
		aggDat1[labelOp] = aggDat1[labelOp] + 1
		#
		childName1 = treeDat['children'][0]['name']
		if childName1 in classes:	
			aggDat1['classes'][childName1] = aggDat1['classes'][childName1] + 1
		childName2 = treeDat['children'][1]['name']
		if childName2 in classes:
			aggDat1['classes'][childName2] = aggDat1['classes'][childName2] + 1
		aggDat1['cumCl'] = addCumCl(aggDat1['cumCl'], treeDat['cumCl'])
		idxList1 = [idx for idx,val in enumerate(aggDat1['children']) if val['name'] == childName1]
		idxList2 = [idx for idx,val in enumerate(aggDat1['children']) if val['name'] == childName2]
		if len(idxList1) == 1:
			idx1 = idxList1[0]	
			buildConsTree(aggDat1['children'][idx1], treeDat['children'][0], classes)
		#
		if len(idxList2) == 1:
			idx2 = idxList2[0]
			buildConsTree(aggDat1['children'][idx2], treeDat['children'][1], classes)
		return

# appends the next tree to the aggregated tree
def appendAgg(aggDat, treeDat, classes):
	idx = [idx for idx,val in enumerate(aggDat['children']) if val['name'] == treeDat['name']][0]
	aggDat1 = aggDat['children'][idx]
	buildConsTree(aggDat1, treeDat, classes)	
	aggDat['children'][idx] = aggDat1
	return

# helper function that determines the ordering of feature 
# variables to display based on the number of appearances
def getOrderChildren(children):
	infoGains = [x['less']+x['greater'] for x in children]
	#print(infoGains)
	infoGains[:] = [-x for x in infoGains]
	idxs = [i[0] for i in sorted(enumerate(infoGains), 
												key=lambda x:x[1])]
	return idxs

# outputs a new nested dictionary with the feature variables
# ordered at each depth of the aggregated tree
def orderAgg(aggDat):
	if aggDat['children'] is None:
		return aggDat
	else:
		orderedDict = {}
		if aggDat['name'] == 'start':
			orderedDict['name'] = 'start'
		else:
			orderedDict['name'] = aggDat['name']
			orderedDict['greater'] = aggDat['greater']
			orderedDict['less'] = aggDat['less']
			orderedDict['classes'] = aggDat['classes']
			orderedDict['cumCl'] = aggDat['cumCl']
			orderedDict['type'] = aggDat['type']
		idxs = getOrderChildren(aggDat['children']) 
		#idxs = range(len(aggDat['children']))
		#print(idxs)
		orderedList = []
		#print(idxs)
		for k in idxs:
			orderedList.append(orderAgg(aggDat['children'][k]))
		orderedDict['children'] = orderedList
		return orderedDict

# checks whether a specific node contains any information 
# on the feature variables and class predictions
def checkEmpty(node):
	infoGain = node['less'] + node['greater']
	sumClasses = sum(node['classes'].values())
	sumCumCl = sum(node['cumCl'].values())
	if infoGain == 0 and sumClasses == 0 and sumCumCl == 0:
		return True
	else:
		return False 

# get the indices of the children nodes that contains information
def getNotEmptyChildren(children):
	out = [idx for idx,val in enumerate(children) if not checkEmpty(val)]
	return(out)

# recurse through aggregated tree and remove any nodes 
# with no information
def filterAgg(aggOrdered):
	if aggOrdered['children'] is None:
		if not checkEmpty(aggOrdered):
			return aggOrdered
	else:
		filteredDict = {}
		if aggOrdered['name'] == 'start':
			filteredDict['name'] = 'start'
		else:
			# this checks the nodes at the first depth
			#if not checkEmpty(aggOrdered):
			filteredDict['name'] = aggOrdered['name']
			filteredDict['greater'] = aggOrdered['greater']
			filteredDict['less'] = aggOrdered['less']
			filteredDict['classes'] = aggOrdered['classes']
			filteredDict['cumCl'] = aggOrdered['cumCl']
			filteredDict['type'] = aggOrdered['type']
		#print(aggOrdered['name'])
		idxs = getNotEmptyChildren(aggOrdered['children'])
		#print(idxs)
		filteredList = []
		for k in idxs:
			filteredList.append(filterAgg(aggOrdered['children'][k]))
		filteredDict['children'] = filteredList
		return filteredDict

# this function is used to define a domain scale for d3 for
# colour encoding the feature appearance attribute
def computeMaxDomainIG(aggFiltered, key):
	if aggFiltered['children'] is None:
		return aggFiltered[key] 
	else:
		temp = []
		idxs = range(len(aggFiltered['children']))
		# handle the first case
		if aggFiltered['name'] == 'start':	
			nodeVal = [0]
		else:
			nodeVal = [aggFiltered[key]]
		for k in idxs:
			temp.append(computeMaxDomainIG(aggFiltered['children'][k], key))
		# the '+' is concatenation for lists
		return max(nodeVal+temp)

# this function is used to define a domain scale for d3 for 
# colour encoding the class prediction distribution.
def computeMaxDomainCl(aggFiltered, key):
	if aggFiltered['children'] is None:
		return max(aggFiltered[key].values())
	else:
		temp = []
		idxs = range(len(aggFiltered['children']))
		if aggFiltered['name'] == 'start':
			nodeVal = [0]
		else:
			nodeVal = [max(aggFiltered[key].values())]
		for k in idxs:
			temp.append(computeMaxDomainCl(aggFiltered['children'][k], key))
		return max(nodeVal+temp)

def main():
	workDir = 'C:\Users\Ken\Google_Drive\School\cpsc547\project'
	os.chdir(workDir + '\data')
#
#	features = ['m1', 'm2', 'm3', 'm4', 'm5']
	classes = ['ook', 'bpsk', 'oqpsk', 'bfskA', 'bfskB', 'bfskR2']
#	
	fOpen = open('skelTree.json', 'r')
	skelTree = json.loads(fOpen.read())
	fOpen.close()
#
	aggDat = skelTree
#
	infs = ["rawTree//"+fName for fName in os.listdir("rawTree")]
	#infs = infs[0:2] + [infs[12]]
	#infs = infs[0:30]
#
	for idx,val in enumerate(infs):
		fOpen = open(val, 'r')
		treej = json.loads(fOpen.read())
		fOpen.close()
		treej = buildCumClRawTree(treej)
		appendAgg(aggDat, treej, classes)
#		
	aggOrdered = orderAgg(aggDat)
#	
	aggFiltered = filterAgg(aggOrdered)		
#		
	maxIG = max([computeMaxDomainIG(aggFiltered, 'less'), 
						computeMaxDomainIG(aggFiltered, 'greater')])
	maxCl = computeMaxDomainCl(aggFiltered, 'classes')
	maxCumCl = computeMaxDomainCl(aggFiltered, 'cumCl')
	domainIG = [0, maxIG + 1]
	domainCl = [0, maxCl + 1]
	domainCumCl = [0, maxCumCl + 1]
#
	aggFiltered['domainIG'] = domainIG
	aggFiltered['domainCl'] = domainCl
	aggFiltered['domainCumCl'] = domainCumCl
#
	outfAgg = open("aggTree.json", "w")
	json.dump(aggFiltered, outfAgg)
	outfAgg.close()

if __name__ == "__main__":
	main()


#aggFiltered['children'][1]['children'][1]['less']

#treeDat = tree0
#idx = [idx for idx,val in enumerate(aggDat['children']) if val['name'] == treeDat['name']][0]
#aggDat1 = aggDat['children'][idx]
#
#

#def extractLabel(label):
#	labelOp = label.split()[1];
#	labelOp = labelOp.replace("=", "")
#	if labelOp == "<":
#		return "less"
#	elif labelOp == ">":
#		return "greater"
#	else:
#		print("Err: error in label of tree")
#		raise 

#def pretty_print(data, indent=4):
#	if type(data) == dict:
#		print json.dumps(data, indent=indent, sort_keys=False)
#	else:
#		print data

