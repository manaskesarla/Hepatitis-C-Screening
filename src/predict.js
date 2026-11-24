export function predictScore(model, panel) {
  // scikit-learn converts inputs to float32 before traversing the trees.
  const input = panel.map(value => Math.fround(value));
  let total = 0;

  for (const tree of model.trees) {
    let index = 0;
    let node = tree[index];

    while (Array.isArray(node)) {
      const [feature, threshold, left, right] = node;
      index = input[feature] <= threshold ? left : right;
      node = tree[index];
    }

    total += node;
  }

  return total / model.trees.length;
}
