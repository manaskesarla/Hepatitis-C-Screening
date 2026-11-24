# Team A-9 Community Project

**BCP308 · Project 9 · Hepatitis C Screening from a Liver Panel**

This research prototype tests whether ten laboratory measurements can distinguish the hepatitis, fibrosis and cirrhosis categories from blood donors in the public UCI HCV dataset. A second experiment keeps all five source categories, including suspect donors. The notebook is for coursework and retrospective evaluation. It does not diagnose hepatitis C or determine eligibility to donate blood.

## Run the website

Use Node.js 20.19+ on the Node 20 release line, or Node.js 22.12+.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. Drag the anatomy model to rotate it, load either sample, and adjust the sliders to see the model score and flag update. Predictions run in the browser. `npm run build` creates the static site in `dist/`.

The demo uses the [original ten-measurement random forest](https://github.com/manaskesarla/Hepatitis-C-Screening/blob/3c269e75b03eb1ffb5a8c09d912c785b20a794b6/A9%20HCV%20Screening.ipynb) evaluated in the [project report](docs/evaluation-report.md). The bundled tree export can be regenerated with `python scripts/export_model.py` using NumPy, pandas and scikit-learn 1.8.0. Set `A9_HCV_ZIP` to use a local UCI archive. Slider bounds are based on the dataset ranges.

**Liver mesh:** BodyParts3D, © The Database Center for Life Science, [FMA7197 STL](https://github.com/Kevin-Mattheus-Moerman/BodyParts3D/blob/main/assets/BodyParts3D_data/stl/FMA7197.stl), licensed under [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/). The viewer centers, scales and shades the mesh at runtime.

## Run the project notebook

1. Open the [notebook in Colab](https://colab.research.google.com/github/manaskesarla/community-project-sem-3/blob/a9-hcv-prototype/A9%20HCV%20Screening.ipynb).
2. Choose **Runtime → Run all** with a CPU runtime. The notebook downloads the original UCI archive, trains the models and displays the evaluation and demonstration examples.
3. Review the [evaluation report](docs/evaluation-report.md) and use the [demo guide](docs/demo-guide.md) to prepare for the review.

The notebook includes outputs from an end-to-end local run with the original UCI ZIP. To run locally in Jupyter, install `scikit-learn`, `pandas`, `numpy`, `matplotlib` and `ipykernel`. If the UCI archive is already downloaded, set `A9_HCV_ZIP` to its path before starting the kernel.

## Collaboration

The prototype lives on the `a9-hcv-prototype` branch. Review it before merging into the default branch. Record feedback and changes in GitHub; avoid simultaneous edits to the same notebook. The synopsis is kept separately because it contains student IDs. The [field record template](docs/field-interaction.md) is ready for the team's real consultation.

**Data:** Lichtinghagen, Klawonn & Hoffmann (2020), [UCI HCV Data](https://doi.org/10.24432/C5D612), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
