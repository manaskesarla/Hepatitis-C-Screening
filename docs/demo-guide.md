# Review demonstration

1. Open the notebook and run it before the presentation. Keep the saved notebook available as a fallback.
2. Explain the five source labels and show the class counts. For the binary task, the seven suspect donor records are excluded because their status is ambiguous.
3. Explain why the majority baseline misses every disease-category record and why precision and recall are more useful here than overall accuracy. Point to the held-out confusion matrix and compare the number of flagged disease cases, misses and false flags.
4. Show the five-class matrix. Point out how little evidence a single suspect donor in the test split provides.
5. Show the example outcomes and the missing ALT check. Explain that a score is a ranking signal for the coursework exercise and cannot diagnose active HCV.
6. Present the field workflow and resulting design change only after the team records a real consultation. Close with what would be needed to assess performance in a different facility.

**Team rehearsal:** Assign one member each to the problem and workflow, data and safeguards, validation and results, and the live notebook. Each member should be able to explain why the test set never determines the threshold.
