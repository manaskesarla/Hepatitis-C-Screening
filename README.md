# Team A-9 Community Project

**BCP308 · Project 9 · Hepatitis C Screening from a Liver Panel**

This research prototype tests whether ten laboratory measurements can distinguish the hepatitis, fibrosis and cirrhosis categories from blood donors in the public UCI HCV dataset. A second experiment keeps all five source categories, including suspect donors. The notebook is for coursework and retrospective evaluation. It does not diagnose hepatitis C or determine eligibility to donate blood.

## Run the project

1. Open the [notebook in Colab](https://colab.research.google.com/github/manaskesarla/community-project-sem-3/blob/a9-hcv-prototype/A9%20HCV%20Screening.ipynb).
2. Choose **Runtime → Run all** with a CPU runtime. The notebook downloads the original UCI archive, trains the models and displays the evaluation and demonstration examples.
3. Review the [evaluation report](docs/evaluation-report.md) and use the [demo guide](docs/demo-guide.md) to prepare for the review.

The notebook includes outputs from an end-to-end local run with the original UCI ZIP. To run locally in Jupyter, install `scikit-learn`, `pandas`, `numpy`, `matplotlib` and `ipykernel`. If the UCI archive is already downloaded, set `A9_HCV_ZIP` to its path before starting the kernel.

## Collaboration

The prototype lives on the `a9-hcv-prototype` branch. Review it before merging into the default branch. Record feedback and changes in GitHub; avoid simultaneous edits to the same notebook. The synopsis is kept separately because it contains student IDs. The [field record template](docs/field-interaction.md) is ready for the team's real consultation.

**Data:** Lichtinghagen, Klawonn & Hoffmann (2020), [UCI HCV Data](https://doi.org/10.24432/C5D612), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
