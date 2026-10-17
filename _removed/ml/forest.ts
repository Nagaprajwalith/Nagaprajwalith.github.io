// In-browser random forest for Crop Intellect.
// Trees are exported from scikit-learn as arrays: an internal node is
// [featureIndex, threshold, leftChild, rightChild]; a leaf is { v: { classIndex: probability } }.

type Leaf = { v: Record<string, number> }
type Split = [number, number, number, number]
export type CropModel = {
  features: string[]
  classes: string[]
  ranges: Record<string, [number, number, number]>
  importance: Record<string, number>
  metrics: {
    holdout_accuracy: number
    cv_mean: number
    cv_std: number
    rows: number
    n_classes: number
    n_trees: number
    max_depth: number
  }
  trees: (Leaf | Split)[][]
}

export type Prediction = { crop: string; confidence: number; ranking: { crop: string; p: number }[] }

export function predict(model: CropModel, x: number[]): Prediction {
  const totals = new Array(model.classes.length).fill(0)
  for (const tree of model.trees) {
    let node = tree[0]
    // same rule as scikit-learn: go left when value <= threshold
    while (Array.isArray(node)) node = tree[x[node[0]] <= node[1] ? node[2] : node[3]]
    for (const [k, p] of Object.entries(node.v)) totals[+k] += p
  }
  const n = model.trees.length
  const ranking = totals
    .map((t, i) => ({ crop: model.classes[i], p: t / n }))
    .sort((a, b) => b.p - a.p)
  return { crop: ranking[0].crop, confidence: ranking[0].p, ranking: ranking.slice(0, 3) }
}
