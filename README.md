Indented Aggregate Tree
=======================================

CPSC 547 Project
Ken Lau
Department of Statistics, UBC

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

[report](http://kenlau177.github.io/Indented-Agg-Tree/cpsc547-writeup-final2.pdf)


