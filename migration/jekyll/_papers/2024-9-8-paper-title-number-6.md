---
paper_id: "2024-9-8-paper-title-number-6"
order: 12
title: "QGRL: Quaternion Graph Representation Learning for Heterogeneous Feature Data Clustering"
citation: "Junyang Chen, Yuzhu Ji, Rong Zou, Yiqun Zhang, Yiu-ming Cheung. QGRL: Quaternion Graph Representation Learning for Heterogeneous Feature Data Clustering. Proceedings of the 30th ACM SIGKDD Conference on Knowledge Discovery and Data Mining, KDD 2024, Barcelona, Spain, August 25-29, 2024, 297–306, 2024."
venue: "Proceedings of the 30th ACM SIGKDD Conference on Knowledge Discovery and Data Mining, KDD 2024, Barcelona, Spain, August 25-29, 2024"
paper_url: "https://github.com/Juny-Chen/QGRL"
year: 2024
type: "conference"
short: "KDD"
authors: "Junyang Chen, Yuzhu Ji, Rong Zou, Yiqun Zhang, Yiu-ming Cheung"
selected: true
source: {"provider":"Author-provided BibTeX","file":"mypapers.bib","record":"https://dblp.org/rec/conf/kdd/ChenJZ0C24.bib"}
pages: "297--306"
publisher: "ACM"
doi: "10.1145/3637528.3671839"
selectedOrder: 5
detail_url: "/publication/2024-9-8-paper-title-number-6"
---

Clustering is one of the most commonly used techniques for unsupervised data analysis. As real data sets are usually composed of numerical and categorical features that are heterogeneous in nature, the heterogeneity in the distance metric and feature coupling prevents deep representation learning from achieving satisfactory clustering accuracy. Currently, supervised Quaternion Representation Learning (QRL) has achieved remarkable success in efficiently learning informative representations of coupled features from multiple views derived endogenously from the original data. To inherit the advantages of QRL for unsupervised heterogeneous feature representation learning, we propose a deep QRL model that works in an encoder-decoder manner. To ensure that the implicit couplings of heterogeneous feature data can be well characterized by representation learning, a hierarchical coupling encoding strategy is designed to convert the data set into an attributed graph to be the input of QRL. We also integrate the clustering objective into the model training to facilitate a joint optimization of the representation and clustering. Extensive experimental evaluations illustrate the superiority of the proposed Quaternion Graph Representation Learning (QGRL) method in terms of clustering accuracy and robustness to various data sets composed of arbitrary combinations of numerical and categorical features. The source code is opened at https://github.com/Juny-Chen/QGRL.git.
