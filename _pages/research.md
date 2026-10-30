---
layout: scifi
title: "Research"
permalink: /research/
author_profile: true
toc: true
toc_label: "Papers"
sims: true
tagline: "memory in noisy neural networks · cosmic rays · live toy models of each paper"
redirect_from:
  - /publications/
---

My research was in theoretical neuroscience and, before that, high-energy astrophysics. The
common thread is how noisy, high-dimensional systems can still hold on to information: how a
network of neurons keeps a memory for seconds or for a lifetime, and what that predicts about
behavior. You can also find my papers on
[Google Scholar](http://scholar.google.com/citations?user=FB-PaskAAAAJ&hl=en).

## Stabilization of memory on neural manifolds through multiple synaptic time scales

**G. Chechelnizki, N. Shaham, A. Salhov, Y. Burak** · *bioRxiv*, 2025 ·
[Preprint](https://doi.org/10.1101/2025.01.30.635710)

<figure class="sim" data-sim="ring"><figcaption>Two copies of a ring network each hold an angle as a bump of activity. With fast synapses only (violet) the stored angle wanders; adding slow synapses (cyan) anchors it. A toy illustration, not the paper's model or figures; see the <a href="https://doi.org/10.1101/2025.01.30.635710">preprint</a> for those.</figcaption></figure>

Many memories, such as the direction you are facing or a position in space, are thought to be
stored as a point on a continuous "manifold" of stable network states. Such memories are fragile:
noise and imperfections in the connections make the stored value drift. This work shows that
synapses that change on several time scales at once, fast and slow, can anchor the activity and
greatly slow that drift, making memory on neural manifolds robust.

## Stochastic consolidation of lifelong memory

**N. Shaham, J. Chandra, G. Kreiman, H. Sompolinsky** · *Scientific Reports* 12, 13107 (2022) ·
[Paper](https://www.nature.com/articles/s41598-022-16407-9)

<figure class="sim" data-sim="consolidation"><figcaption>Each line is one memory. Its strength decays, random reactivations kick it up, and memories that cross the threshold are consolidated (green). A toy version of the idea; the real results are in <a href="https://www.nature.com/articles/s41598-022-16407-9">Figs. 2–4 of the paper</a> (open access, CC BY 4.0).</figcaption></figure>

How can the brain keep learning for a lifetime without new memories overwriting old ones? We built
a recurrent neural network model in which memories are first stored quickly and then consolidated
stochastically into long-term storage. The model has a high storage capacity for continual,
lifelong learning, and it reproduces well-known features of human memory, such as gradual
forgetting and the way older memories become more resistant to damage. Presented at COSYNE 2020
and ISFN 2020.

## Fixational drift is driven by diffusive dynamics in central neural circuitry

**N. Ben-Shushan, N. Shaham, M. Joshua, Y. Burak** · *Nature Communications* 13, 1697 (2022) ·
[Paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC8971408/)

<figure class="sim" data-sim="drift"><figcaption>Gaze position (green) diffuses around a fixation target, with an occasional corrective jump. A toy random walk for illustration; the measured drift and the model fits are in <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8971408/">the paper</a> (open access, CC BY 4.0).</figcaption></figure>

Even when we fixate on a point, our eyes keep drifting slowly and randomly. This paper asks where
that drift comes from. Combining a neural network model with eye-movement recordings, we show that
the statistics of the drift match diffusion generated inside the brain's own circuits for holding
eye position, rather than noise in the muscles or the periphery. Presented at COSYNE 2018 and 2020.

## Slow diffusive dynamics in a chaotic balanced neural network

**N. Shaham, Y. Burak** · *PLoS Computational Biology* 13(5), e1005505 (2017) ·
[Paper](https://doi.org/10.1371/journal.pcbi.1005505) ·
[arXiv](https://arxiv.org/abs/1508.06944)

<figure class="sim" data-sim="balanced"><figcaption>Irregular spiking in a network that remembers an angle: neurons near the remembered angle fire more, and that angle (amber) diffuses slowly. A cartoon of the setup; the analysis is in <a href="https://doi.org/10.1371/journal.pcbi.1005505">the paper</a> (open access, CC BY 4.0).</figcaption></figure>

Cortical networks are "balanced": strong excitation and inhibition cancel on average, and the
activity they produce is irregular and chaotic. Can such a network still hold a continuous value,
like a remembered angle, in working memory? We show that it can: the chaotic fluctuations make the
stored value diffuse, but that diffusion is slow and can be calculated analytically, so a balanced
network can serve as a working memory despite its own internal noise. Presented at COSYNE 2016.

## Implications of the penetration depth of ultrahigh-energy cosmic rays on physics at 100 TeV

**N. Shaham, T. Piran** · *Physical Review Letters* 110, 021101 (2013) ·
[Paper](https://doi.org/10.1103/PhysRevLett.110.021101) ·
[arXiv](https://arxiv.org/abs/1204.1488)

<figure class="sim" data-sim="shower"><figcaption>A cosmic ray hits the top of the atmosphere and cascades into a shower of particles. How deep the shower peaks (Xmax) is the measurement the paper is about. A cartoon, not a physics simulation; see the <a href="https://arxiv.org/abs/1204.1488">arXiv version</a>.</figcaption></figure>

From my MSc in high-energy astrophysics. Measurements of how deep the highest-energy cosmic rays
penetrate the atmosphere seemed to say they are heavy nuclei, while other evidence pointed to
protons. We showed that if they are protons, the data require a change in how protons interact
with air at center-of-mass energies around 100 TeV, far above what particle accelerators reach.
In other words, cosmic rays may be hinting at new particle physics.

## Other work

- A noise-resilience mechanism for neural networks holding working memory (PhD work, presented at
  COSYNE 2019, preprint).
- Optimal control and deep learning combined with network dynamics to model fish behavior in a
  stream (Harvard).
- Neural network dynamics with reinforcement learning to model online fear learning (supervising
  a Harvard applied-math graduate student, presented at COSYNE 2021).
- An LSTM model that learns to mimic natural animal vocalization sequences (Harvard).

## Academic background

- **2018 – 2021**: Swartz postdoctoral fellow, Center for Brain Science, Harvard University.
  Advisors: Prof. Haim Sompolinsky and Prof. Gabriel Kreiman.
- **2012 – 2018**: PhD in physics (theoretical neuroscience), Hebrew University of Jerusalem.
  Thesis: *Working memory of continuous parameters in noisy neural networks*. Advisor: Dr. Yoram
  Burak.
- **2010 – 2012**: MSc in physics (high-energy astrophysics), Hebrew University of Jerusalem.
  Advisor: Prof. Tsvi Piran.
- **2007 – 2010**: BSc in physics and mathematics, Hebrew University of Jerusalem, magna cum laude.

**Teaching.** Teaching fellow at Harvard for Computational Neuroscience (Neuro 131), Introductory
Computational Neuroscience (Neuro 120) and Artificial and Biological Intelligence (Neuro 140).
Teaching assistant at the Racah Institute of Physics for eight years, in analytical mechanics,
electricity and magnetism, and physics courses for biology students.

**Selected awards.** Brains, Minds and Machines award for best poster (2020); Harvard distinguished
teachers list (2019); Swartz postdoctoral fellowship (2018 – 2020); ELSC postdoctoral scholarship
(2018); Physics department award for excellence in teaching (2012, 2018); Rudin foundation
scholarship (2010 – 2015).

**Selected talks.** Gatsby tri-center meeting, London (2019, 2021); Systems Club, Harvard Medical
School (2018, 2020); MIT Center for Brains, Minds and Machines (2019); Simons Institute workshop on
neural circuits, Berkeley (2018); Israeli Society for Neuroscience (2017).

I also co-founded a weekly joint MIT–Harvard theoretical neuroscience journal club, and supervised
undergraduate and graduate students on research projects at Harvard and the Hebrew University.
