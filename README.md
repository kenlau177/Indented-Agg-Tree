
Indented Aggregate Tree
=======================================

<<<<<<< HEAD
- CPSC 547 Project
- Ken Lau
- Department of Statistics, UBC

The full [report](http://kenlau177.github.io/Indented-Agg-Tree/cpsc547-writeup-final2.pdf).

The [visualization](http://kenlau177.github.io/Indented-Agg-Tree/).

### Visualization Description
=======
CPSC 547 Project
Ken Lau
Department of Statistics, UBC
>>>>>>> 00224346e7f55704149179bc541844b0c2881998

Intro:
- The random forest model have become a popular data mining algorithm for supervised machine learning tasks. The model is easy implement, and generally has high predictive performance. The downside is that interpretation of resutls is difficult. The model consists of an ensemble of classification trees. 

Info:
- 5 feature variables: m1, m2, ..., m5
- 1 class prediction variable with 6 classes labelled with integers 1 to 6.
- 600 observations
- 500 trees fitted

Goal:
- Provide a visualization on an ensembles of classification trees.
- Reduce or extract only relevant information.

Criteria:
- We're interested feature importance and multiple feature interaction.
- class prediction count distribution

Components of the Visualization:
- Initially, 5 feature variables are shown on the screen. These features correspond to the root nodes of classification trees. Red color saturation was used to encode the number of feature appeareances of feature variables in the ensemble of trees. For example, m5 is the root node of 172 classification trees.
- At the same level, the class prediction count distribution is color encoded with orange saturation. For example, for m5, this tells us the number class predictions made for all trees that had a root node of m5.

<<<<<<< HEAD
### File Descriptions:

#### Model fitting, information extraction, and aggregation:
The files here are under python-code

- Data Input: datTrn.txt
- Data Output: aggTree_5_500.json

- buildSkelTree.py : permutates all possible combinations of feature variables
- export_json.py : converts classification tree to JSON
- extractTrees.py : fits random forest and exports trees to JSON files
- parseRawTree.py : aggregation process

Makefile that runs the python scripts above:
- Makefile

Code used from blog post to extract classification tree info:
- https://gist.github.com/pprett/3813537

All libraries used in Python:
- os - I/O
- json
- sys - I/O
- numpy - array manipulation
- pandas - data frame manipulation
- sklearn - machine learning library

#### Indented Aggregate Tree Visulization:
D3, Javascript Files:

Input data: aggTree_5_500.json

indexAgg.html - displays the visualization

- d3TreeAgg.js - d3 indented tree and additional encoding
- Mike Bostock's implenentation: http://bl.ocks.org/mbostock/1093025
- Colour Scale: http://synthesis.sbecker.net/articles/2012/07/16/learning-d3-part-6-scales-colors

All other libraries used:
- bootstrap
- jquery
- d3


=======
[report](http://kenlau177.github.io/Indented-Agg-Tree/cpsc547-writeup-final2.pdf)
>>>>>>> 00224346e7f55704149179bc541844b0c2881998



