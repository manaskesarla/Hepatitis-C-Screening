"""Rebuild the browser export of Team A-9's original binary random forest."""

import io
import json
import os
import sys
from pathlib import Path
from urllib.request import urlopen
from zipfile import ZipFile

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import confusion_matrix, precision_recall_curve
from sklearn.model_selection import StratifiedKFold, cross_val_predict, train_test_split
from sklearn.pipeline import make_pipeline

FEATURES = ["ALB", "ALP", "ALT", "AST", "BIL", "CHE", "CHOL", "CREA", "GGT", "PROT"]
DONOR = "Blood donor"
SUSPECT = "Suspect donor"
LABELS = {
    "0=Blood Donor": DONOR,
    "0s=suspect Blood Donor": SUSPECT,
    "1=Hepatitis": "Hepatitis",
    "2=Fibrosis": "Fibrosis",
    "3=Cirrhosis": "Cirrhosis",
}
SEED = 42
ROOT = Path(__file__).resolve().parents[1]
DATA_URL = "https://archive.ics.uci.edu/static/public/571/hcv+data.zip"


def read_panels():
    local_zip = os.environ.get("A9_HCV_ZIP")
    if local_zip:
        archive = Path(local_zip).read_bytes()
    else:
        with urlopen(DATA_URL, timeout=30) as response:
            archive = response.read()

    with ZipFile(io.BytesIO(archive)) as source, source.open("hcvdat0.csv") as csv:
        data = pd.read_csv(csv, index_col=0)

    # Keep the original notebook's order: deduplicate, stratify on all five labels,
    # then remove suspect donor records from each partition.
    return data.drop_duplicates(subset=FEATURES)


def fit_binary_model(panels):
    labels = panels["Category"].map(LABELS)
    train_ids, test_ids = train_test_split(
        labels.index, test_size=0.20, stratify=labels, random_state=SEED
    )
    binary_ids = labels.index[labels != SUSPECT]
    train_ids = pd.Index(train_ids).intersection(binary_ids)
    test_ids = pd.Index(test_ids).intersection(binary_ids)
    inputs = panels[FEATURES]
    target = labels.ne(DONOR).astype(int)

    pipeline = make_pipeline(
        SimpleImputer(strategy="median"),
        RandomForestClassifier(
            n_estimators=160, min_samples_leaf=2, class_weight="balanced",
            random_state=SEED, n_jobs=1,
        ),
    )
    folds = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    scores = cross_val_predict(
        pipeline, inputs.loc[train_ids], target.loc[train_ids],
        cv=folds, method="predict_proba",
    )[:, 1]
    precision, recall, cutoffs = precision_recall_curve(target.loc[train_ids], scores)
    eligible = np.flatnonzero(recall[:-1] >= 0.80)
    best = max(eligible, key=lambda i: (precision[i], recall[i], cutoffs[i]))
    threshold = float(cutoffs[best])

    pipeline.fit(inputs.loc[train_ids], target.loc[train_ids])
    held_out = inputs.loc[test_ids]
    truth = target.loc[test_ids]
    flags = pipeline.predict_proba(held_out)[:, 1] >= threshold
    counts = confusion_matrix(truth, flags, labels=[0, 1]).ravel().tolist()
    if counts != [106, 0, 1, 14] or round(threshold, 4) != 0.4891:
        raise ValueError(f"Export differs from notebook: cutoff={threshold}, counts={counts}")

    return pipeline, threshold, held_out.loc[truth.eq(flags)].dropna(), target


def export_tree(estimator):
    tree = estimator.tree_
    nodes = []
    for index, left in enumerate(tree.children_left):
        if left == -1:
            weights = tree.value[index, 0]
            nodes.append(float(weights[1] / weights.sum()))
        else:
            nodes.append([
                int(tree.feature[index]), float(tree.threshold[index]),
                int(left), int(tree.children_right[index]),
            ])
    return nodes


def main():
    panels = read_panels()
    pipeline, threshold, examples, target = fit_binary_model(panels)
    presets = {
        key: examples.loc[target.loc[examples.index] == category].iloc[0].tolist()
        for key, category in (("donor", 0), ("disease", 1))
    }
    features = []
    for key in FEATURES:
        column = panels[key]
        step = 0.01 if key in ("CHE", "CHOL") else 0.1
        features.append({
            "key": key,
            "min": float(np.floor(column.min())),
            "max": float(np.ceil(column.max())),
            "step": step,
        })

    forest = pipeline.named_steps["randomforestclassifier"]
    destination = ROOT / "public" / "assets" / "screening-model.json"
    model = {
        "threshold": threshold,
        "features": features,
        "presets": presets,
        "trees": [export_tree(tree) for tree in forest.estimators_],
    }
    destination.write_text(json.dumps(model, separators=(",", ":")) + "\n", encoding="utf-8")

    if len(sys.argv) == 2:
        # Optional reference cases for comparing browser and scikit-learn inference.
        complete = panels[FEATURES].dropna()
        random = np.random.default_rng(SEED)
        synthetic = pd.DataFrame(
            random.uniform(complete.min(), complete.max(), size=(500, len(FEATURES))),
            columns=FEATURES,
        )
        inputs = pd.concat([complete, synthetic], ignore_index=True)
        scores = pipeline.predict_proba(inputs)[:, 1]
        Path(sys.argv[1]).write_text(
            json.dumps({"inputs": inputs.values.tolist(), "scores": scores.tolist()}),
            encoding="utf-8",
        )

    print(f"Exported {len(forest.estimators_)} trees at cutoff {threshold:.4f}.")


if __name__ == "__main__":
    main()
