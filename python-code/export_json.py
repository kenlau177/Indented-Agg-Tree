
# the code below makes extensive use of the code from this blog post:
# https://gist.github.com/pprett/3813537
# exports a classification tree object to relevant information in JSON
def export_json(decision_tree, out_file=None, feature_names=None):
	from sklearn.tree import _tree
	def arr_to_py(arr):
		arr = arr.ravel()
		wrapper = float
		if np.issubdtype(arr.dtype, np.int):
			wrapper = int
		return map(wrapper, arr.tolist())
	def node_to_str(tree, node_id, direction):
		value = tree.tree_.value[node_id]
		classes = ['ook', 'bpsk', 'oqpsk', 'bfskA', 'bfskB', 'bfskR2']
		if tree.tree_.n_outputs == 1:
			value = value[0, :]	
		#samples = '"samples": %d' % (tree.tree_.n_node_samples[node_id])
		#arr_to_py(tree.tree_.value[node_id])
		if tree.tree_.children_left[node_id] != _tree.TREE_LEAF:
			featureIdx = tree.tree_.feature[node_id]
			if feature_names is not None:
				feature = feature_names[featureIdx]
			else:
				feature = "X[%s]" % featureIdx
			name = '"name": "%s"' % (feature)
			#label = '"label": "%s <= %.2f"' % (feature, tree.tree_.threshold[node_id])
			label = '"label": "%s"' % (direction)
			node_type = '"type": "split"'
			infoGain = '"infoGain": "%.3f"' % (tree.tree_.impurity[node_id])
			cumCl = '"cumCl": ["%s", "%s", "%s", "%s", "%s", "%s"]' % \
								(value[0], value[1], value[2], value[3], value[4], value[5])
			node_repr = ", ".join((name, label, node_type, infoGain, cumCl))
		else:
			node_type = '"type": "leaf"'
			# value.argmax()+1
			cl = '"name": "%s"' % (classes[value.argmax()])
			cumCl = '"cumCl": ["%s", "%s", "%s", "%s", "%s", "%s"]' % \
								(value[0], value[1], value[2], value[3], value[4], value[5])
			node_repr = ", ".join((cl, node_type, cumCl))
		return node_repr
	def recurse(tree, node_id, parent=None, direction="less"):
		if node_id == _tree.TREE_LEAF:
			raise ValueError("Invalid node_id %s" % _tree.TREE_LEAF)
		left_child = tree.tree_.children_left[node_id]
		right_child = tree.tree_.children_right[node_id]
		# Open node with description
		out_file.write('{%s' % node_to_str(tree, node_id, direction))
		# write children
		if left_child != _tree.TREE_LEAF: # and right_child != _tree.TREE_LEAF
			out_file.write(', "children": [')
			direction = "less"
			recurse(tree, left_child, node_id, direction)
			out_file.write(', ')
			direction = "greater"
			recurse(tree, right_child, node_id, direction)
			out_file.write(']')
		# close node
		out_file.write('}')
	if out_file is None:
		out_file = open("tree.json", "w")
	elif isinstance(out_file, basestring):
		out_file = open(out_file, "w")
	recurse(decision_tree, 0)
	out_file.close()
	return out_file






