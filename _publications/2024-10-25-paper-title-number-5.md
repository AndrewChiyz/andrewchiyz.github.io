---
title: "CPNet: 3D Semantic Relation and Geometry Context Prior Network for Multi-organ Segmentation"
collection: publications
category: conferences
permalink: /publication/2024-10-25-paper-title-number-5
excerpt: ''
date: 2024-10-25
venue: 'GitHub Journal of Bugs'
paperurl: 'https://andrewchiyz.github.io/vision.medseg.cpnet/'
citation: 'Yuzhu Ji, Mingshan Sun, Yiqun Zhang, Haijun Zhang. CPNet: 3D Semantic Relation and Geometry Context Prior Network for Multi-Organ Segmentation. ECAI 2024: 153-160.'
---

Automatic multi-organ segmentation of the abdominal region is a critical yet challenging task in computer-aided medical image analysis. Recent advances in CNN- and Transformer-based encoder-decoder models tend to implicitly learn context features by using enhanced effective receptive fields to capture local and global range dependencies. However, due to the complex anatomical structure, those models cannot recover the anatomical topology properly and result in broken organs with inaccurate semantic labels. Therefore, in this paper, by considering the anatomy priors of multi-organs, we propose a Context Prior Network, namely CPNet, which integrates the 3D context semantic relations and geometry priors as explicit anatomical constraints. Specifically, a Semantic Relation Prior Propagation (SRPP) module is designed to propagate the semantic relations between voxels progressively. Moreover, a Multiple Context Prior Prediction (MCPP) module is adopted to preserve the accurate shape and topology by recovering 3D contours and surface normal. Experimental results demonstrate our proposed model outperforms state-of-the-art models for multi-organ segmentation on Abdomen CT and MRI datasets, especially for recovering organs with correct semantic labels and anatomical structures.