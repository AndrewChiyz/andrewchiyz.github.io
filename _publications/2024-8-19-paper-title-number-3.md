---
title: "CFNet: {A} Coarse-to-Fine Framework for Coronary Artery Segmentation"
collection: publications
category: conferences
permalink: /publication/2024-8-19-paper-title-number-3
excerpt: ''
date: 2024-8-19
venue: 'Pattern Recognition and Computer Vision, PRCV'
paperurl: ''
citation: 'Shiting He, Yuzhu Ji, Yiqun Zhang, An Zeng, Dan Pan, Jing Lin, Xiaobo Zhang: CFNet: A Coarse-to-Fine Framework for Coronary Artery Segmentation. PRCV (5) 2023: 431-442.'
---

Coronary Artery (CA) segmentation has become an important task to facilitate coronary artery disease diagnosis. However, existing methods have not effectively addressed the challenges posed by the thin and complex structure of CA, leading to unsatisfactory performance in grouping local detailed vessel structures. Therefore, we proposed a novel coarse-to-fine segmentation framework, namely CFNet, to refine the CA segmentation results progressively. The global structure targeting module aims to capture the spatial structure of the CA by introducing dilated pseudo labels as supervision. In addition, a lightweight transformer-based module is designed to refine the coarse results and produce more accurate segmentation results by capturing the long-range dependencies. Our model exploits both local and global contextual features by integrating a convolutional neural network and visual Transformer. These two modules are cascaded using a center-line patching strategy, which filters out unnecessary features and mitigates the sparsity of CA annotation. Experimental results demonstrate that our model performs well in CA segmentation, particularly in handling challenging cases for fine vessel structures, and achieves competitive results on a large-scale dataset, i.e., ImageCAS, in comparison to state-of-the-art methods.