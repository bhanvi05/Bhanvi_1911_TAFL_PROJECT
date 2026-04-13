const EXAMPLES = {
    1: {
        grammar: 'S -> aSb | ab',
        target: 'aaabbb',
        label: 'aⁿbⁿ language'
    },
    2: {
        grammar: 'S -> AB\nA -> aA | a\nB -> bB | b',
        target: 'aabb',
        label: 'Multi-rule grammar'
    },
    3: {
        grammar: 'S -> aSa | bSb | a | b',
        target: 'ababa',
        label: 'Odd-length palindromes'
    },
    4: {
        grammar: 'E -> TA\nA -> +TA | ε\nT -> FB\nB -> *FB | ε\nF -> (E) | i',
        target: 'i+i*i',
        label: 'Arithmetic expressions'
    }
};

const elGrammar   = document.getElementById('grammar');
const elTarget    = document.getElementById('target');
const elGenerate  = document.getElementById('generate');
const elError     = document.getElementById('error');
const elOutput    = document.getElementById('output');
const elLeftmost  = document.getElementById('leftmost');
const elRightmost = document.getElementById('rightmost');
const elCanvas    = document.getElementById('parse-tree');

document.querySelectorAll('.btn-example').forEach(btn => {
    btn.addEventListener('click', () => {
        const ex = EXAMPLES[btn.dataset.example];
        if (ex) {
            elGrammar.value = ex.grammar;
            elTarget.value = ex.target;
        }
    });
});

document.querySelectorAll('.btn-symbol').forEach(btn => {
    btn.addEventListener('click', () => {
        const sym = btn.dataset.symbol;
        const ta = elGrammar;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        ta.value = ta.value.substring(0, start) + sym + ta.value.substring(end);
        ta.selectionStart = ta.selectionEnd = start + sym.length;
        ta.focus();
    });
});

elGenerate.addEventListener('click', generate);
elGrammar.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') generate();
});
elTarget.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') generate();
    if (e.key === 'Enter') generate();
});

function generate() {
    hideError();
    elOutput.classList.add('hidden');

    try {
        const grammar = Grammar.parse(elGrammar.value);
        const target = elTarget.value.replace(/\s+/g, '');
        const root = Derivation.parse(grammar, target);

        if (!root) {
            showError(
                `The string "${target || 'ε'}" cannot be derived from this grammar.\n` +
                'Check the grammar rules and the input string.'
            );
            return;
        }

        const leftSteps  = Derivation.extractLeftmost(root);
        const rightSteps = Derivation.extractRightmost(root);
        renderDerivation(leftSteps, elLeftmost);
        renderDerivation(rightSteps, elRightmost);
        const renderer = new TreeRenderer(elCanvas);
        renderer.render(root);

        elOutput.classList.remove('hidden');
    } catch (err) {
        showError(err.message);
    }
}

function renderDerivation(steps, container) {
    container.innerHTML = '';
    const compact = document.createElement('div');
    compact.className = 'derivation-compact';
    compact.innerHTML = steps.map((s, i) => {
        const arrow = i > 0 ? '<span class="arrow"> ⇒ </span>' : '';
        return arrow + formatForm(s.form);
    }).join('');
    container.appendChild(compact);
    const detailed = document.createElement('div');
    detailed.className = 'derivation-steps';

    steps.forEach((step, i) => {
        const row = document.createElement('div');
        row.className = 'derivation-step';

        const num = document.createElement('span');
        num.className = 'step-num';
        num.textContent = `Step ${i + 1}`;

        const form = document.createElement('span');
        form.className = 'step-form';
        form.innerHTML = formatForm(step.form);

        row.appendChild(num);
        row.appendChild(form);

        if (step.production) {
            const prod = document.createElement('span');
            prod.className = 'step-prod';
            prod.textContent = `[${step.production}]`;
            row.appendChild(prod);
        }

        detailed.appendChild(row);
    });

    container.appendChild(detailed);
}

function formatForm(form) {
    if (form === 'ε') return '<span class="eps">ε</span>';
    return form.split('').map(ch => {
        if (/[A-Z]/.test(ch)) return `<span class="nt">${escapeHtml(ch)}</span>`;
        return `<span class="t">${escapeHtml(ch)}</span>`;
    }).join('');
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showError(msg) {
    elError.textContent = msg;
    elError.classList.remove('hidden');
}

function hideError() {
    elError.classList.add('hidden');
}
