import './style.css';
import { predictScore } from './predict.js';

const modelUrl = import.meta.env.BASE_URL + 'assets/screening-model.json';

const names = {
  ALB: ['Albumin', 'g/L'],
  ALP: ['Alkaline phosphatase', 'U/L'],
  ALT: ['Alanine aminotransferase', 'U/L'],
  AST: ['Aspartate aminotransferase', 'U/L'],
  BIL: ['Bilirubin', 'µmol/L'],
  CHE: ['Cholinesterase', 'kU/L'],
  CHOL: ['Cholesterol', 'mmol/L'],
  CREA: ['Creatinine', 'µmol/L'],
  GGT: ['Gamma-glutamyl transferase', 'U/L'],
  PROT: ['Total protein', 'g/L'],
};

const result = document.querySelector('#prediction');
const resetButton = document.querySelector('#reset-panel');
const presetButtons = [...document.querySelectorAll('[data-preset]')];
const panelState = document.querySelector('#panel-state');
const scoreFill = document.querySelector('#score-fill');
const scoreValue = document.querySelector('#score-value');
const cutoffValue = document.querySelector('#cutoff-value');
const cutoffMarker = document.querySelector('#score-cutoff');
const controls = document.querySelector('#measurements');

function addMeasurement({ key, min, max, step }, onChange) {
  const [fullName, unit] = names[key];
  const row = document.createElement('div');
  row.className = 'measurement';

  const label = document.createElement('label');
  label.htmlFor = key;
  const abbreviation = document.createElement('strong');
  abbreviation.textContent = key;
  const name = document.createElement('span');
  name.textContent = fullName;
  label.append(abbreviation, name);

  const range = document.createElement('input');
  Object.assign(range, { type: 'range', id: key, min, max, step });

  const value = document.createElement('span');
  value.className = 'reading';
  value.setAttribute('aria-hidden', 'true');

  const update = () => {
    value.textContent = range.value + ' ' + unit;
    range.setAttribute('aria-valuetext', value.textContent);
    range.style.setProperty('--progress', ((range.valueAsNumber - min) / (max - min)) * 100 + '%');
  };

  range.addEventListener('input', () => {
    update();
    onChange();
  });

  row.append(label, value, range);
  controls.append(row);

  return {
    range,
    set(nextValue) {
      range.value = nextValue;
      update();
    },
  };
}

async function startDemo() {
  const response = await fetch(modelUrl);
  if (!response.ok) throw new Error('Could not load the screening model.');
  const model = await response.json();

  let activePreset = 'donor';
  let edited = false;

  function showPrediction() {
    const values = sliders.map(({ range }) => range.valueAsNumber);
    const score = predictScore(model, values);
    const flagged = score >= model.threshold;
    const label = flagged ? 'Disease-group pattern flagged' : 'Donor-like pattern';
    if (result.textContent !== label) result.textContent = label;
    result.dataset.flagged = String(flagged);
    scoreValue.textContent = score.toFixed(4);
    scoreFill.style.width = score * 100 + '%';
  }

  function setPanel(key) {
    activePreset = key;
    edited = false;
    sliders.forEach((slider, index) => slider.set(model.presets[key][index]));
    presetButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.preset === key));
    });
    panelState.textContent = '';
    resetButton.disabled = true;
    showPrediction();
  }

  const sliders = model.features.map(feature => addMeasurement(feature, () => {
    if (!edited) {
      edited = true;
      panelState.textContent = 'Modified sample';
      resetButton.disabled = false;
      presetButtons.forEach(button => button.setAttribute('aria-pressed', 'false'));
    }
    showPrediction();
  }));

  cutoffValue.textContent = model.threshold.toFixed(4);
  cutoffMarker.style.left = model.threshold * 100 + '%';
  presetButtons.forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => setPanel(button.dataset.preset));
  });
  resetButton.addEventListener('click', () => setPanel(activePreset));
  setPanel(activePreset);
}

startDemo().catch(error => {
  console.error(error);
  result.textContent = 'Prediction unavailable. Reload the page to try again.';
});

import('./viewer.js').then(({ mountLiver }) => mountLiver()).catch(error => {
  console.error(error);
  document.querySelector('#liver-status').textContent = 'The 3D view could not load on this device.';
  document.querySelector('#liver-instructions').hidden = true;
});
