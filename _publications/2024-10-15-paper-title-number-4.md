---
title: "One-shot Human Motion Transfer via Occlusion-Robust Flow Prediction and Neural Texturing"
collection: publications
category: manuscripts
permalink: /publication/2024-10-15-paper-title-number-4
excerpt: ''
date: 2024-10-15
venue: 'IEEE Transactions on Multimedia'
slidesurl: ''
paperurl: 'https://andrewchiyz.github.io/vision.ohmt.rfnt/'
citation: 'Ji, Yuzhu, Chuanxia Zheng, and Tat-Jen Cham. "One-shot Human Motion Transfer via Occlusion-Robust Flow Prediction and Neural Texturing." arXiv preprint arXiv:2412.06174 (2024).'
---

Human motion transfer aims at animating a static source image with a driving video. While recent advances in one-shot human motion transfer have led to significant improvement in results, it remains challenging for methods with 2D body landmarks, skeleton and semantic mask to accurately capture correspondences between source and driving poses due to the large variation in motion and articulation complexity. In addition, the accuracy and precision of DensePose degrade the image quality for neural-rendering-based methods. To address the limitations and by both considering the importance of appearance and geometry for motion transfer, in this work, we proposed a unified framework that combines multi-scale feature warping and neural texture mapping to recover better 2D appearance and 2.5D geometry, partly by exploiting the information from DensePose, yet adapting to its inherent limited accuracy. Our model takes advantage of multiple modalities by jointly training and fusing them, which allows it to robust neural texture features that cope with geometric errors as well as multi-scale dense motion flow that better preserves appearance. Experimental results with full and half-view body video datasets demonstrate that our model can generalize well and achieve competitive results, and that it is particularly effective in handling challenging cases such as those with substantial self-occlusions.