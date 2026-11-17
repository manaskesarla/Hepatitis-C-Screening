# Project report

**BCP308 · Team A-9 · Project 9 · Hepatitis C Screening from a Liver Panel**

**Status:** Model evaluation completed on the public dataset. Field consultation and the live team demonstration remain pending.

## Problem and community relevance

An abnormal lab result is useful only if someone reviews it, communicates it and arranges appropriate follow-up. This project explores whether patterns in ten laboratory measurements can separate groups already labeled in the UCI HCV dataset, and plans to document how a local blood bank or lab actually handles abnormal results. The prototype does not diagnose hepatitis C. WHO describes HCV-specific testing, including RNA testing following a reactive antibody result to establish active infection.

Hoffmann et al. explored how decision trees might support laboratory pathway design for fibrosis and cirrhosis. This project emphasizes the tradeoff between missed cases and false alerts, then asks which measurements and follow-up steps are actually available locally. A staff consultation can inform the workflow and demo wording; it cannot measure clinical model performance.

## Data and method

The public UCI file contains 615 records: 533 blood donors, 7 suspect donors, 24 hepatitis, 21 fibrosis and 30 cirrhosis. Seven exact repeats of the ten laboratory inputs had matching labels; removing the extra copies left 608 panels. The binary task excludes suspect donors and combines the three disease groups. The separate five-class task retains suspect donors. Only ALB, ALP, ALT, AST, BIL, CHE, CHOL, CREA, GGT and PROT are model inputs.

We used a single stratified 80:20 holdout and five-fold training validation with seed 42. The training pipeline fits median imputation and, for logistic regression, scaling within each fold. We compared a majority classifier with class-weighted logistic regression and a class-weighted random forest. Model selection and threshold fitting used training predictions only. The selected binary model had the higher validation average precision; its cutoff maximized precision subject to recall of at least 80%. The five-class model was selected by validation macro F1, which gives each class equal weight.

## Held-out results

| Binary model | Precision | Recall | Average precision | Correct donor | False flag | Missed disease group | Flagged disease group |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Majority baseline | 0.0%¹ | 0.0% | 0.124 | 106 | 0 | 15 | 0 |
| Random forest | 100.0% | 93.3% | 1.000 | 106 | 0 | 1 | 14 |

¹ The majority model did not flag any record; precision is reported as zero by convention.

The random forest achieved 80.0% recall and 92.3% precision in training validation at the chosen cutoff of approximately 0.4891. One fibrosis record fell below that cutoff in the holdout. Average precision evaluates ranking over all cutoffs, so it can be 1.000 in this split even though the fixed cutoff missed a case. With just 15 disease-group records, each miss changes recall by about 6.7 percentage points.

| Five-class label | Precision | Recall | Test support |
| --- | ---: | ---: | ---: |
| Blood donor | 1.000 | 0.972 | 106 |
| Suspect donor | 0.500 | 1.000 | 1 |
| Hepatitis | 0.286 | 0.400 | 5 |
| Fibrosis | 0.000 | 0.000 | 4 |
| Cirrhosis | 0.625 | 0.833 | 6 |

Logistic regression had the strongest five-class validation macro F1 (0.613) and reached 0.540 on the holdout, versus 0.186 for the majority baseline. It correctly identified none of the four fibrosis records as fibrosis. The result for the single suspect donor does not establish reliable performance on that class.

## Verification and limitations

The notebook checks the labels, exact repeats, disjoint split, validation threshold and that confusion counts sum to the test size. Replacing ALT with a missing value in one test record verifies that both fitted pipelines can still produce output. The evaluation does not establish performance on local patients, on donors undergoing routine screening, or across clinical settings with different measurements and units. Donor and clinical patient cohorts may differ in ways the model picks up. The notebook is a coursework demonstration and uses scores that are not calibrated probabilities of infection.

## Cost and sustainability

The prototype uses CPU models on existing equipment with public data and open-source software. The saved local run took about four seconds from data load through evaluation and plots, excluding package imports and setup. This is a runtime observation, not an energy measurement. It required no new test kits, hardware or paid compute. The synopsis estimates incremental field travel and printing at ₹0–400; confirm actual costs and variance after the field component. The project is aligned with SDG 3, Target 3.3. Indicator 3.3.4 is for hepatitis B incidence, so it is not a measure of this HCV prototype.

## Field record and final review

Complete the [field interaction record](field-interaction.md) after the team speaks to a blood bank or diagnostic lab. Add who was consulted, what was learned, which design or demo detail changed, and the actual project costs. Follow the [demo guide](demo-guide.md) and record which team members presented each part.

## References

- [UCI HCV Data, Lichtinghagen, Klawonn and Hoffmann, 2020](https://doi.org/10.24432/C5D612)
- [Hoffmann et al., Laboratory diagnostic pathways, 2018](https://doi.org/10.21037/jlpm.2018.06.01)
- [WHO, Hepatitis C fact sheet](https://www.who.int/news-room/fact-sheets/detail/hepatitis-c)
- [WHO, Operational guide for hepatitis testing services, 2024](https://www.who.int/publications/i/item/9789240104082)
- [United Nations, Sustainable Development Goal 3](https://sdgs.un.org/goals/goal3)
