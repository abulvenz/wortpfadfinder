import m from 'mithril';
import { h1, div, button } from './tags';
import help from './help';
const { trunc, random, round } = Math;

/**
 * - 0 -
 * 1 2 3
 * - 4 -
 * - 5 -
 */
const dices = [
    // 0    1    2    3    4    5
    ['A', 'I', 'E', 'A', 'O', 'T'],
    ['S', 'E', 'R', 'A', 'C', 'L'],
    ['E', 'P', 'S', 'L', 'U', 'T'],
    ['B', 'M', 'A', 'Q', 'J', 'O'],

    ['A', 'F', 'O', 'R', 'X', 'I'],
    ['T', 'L', 'I', 'B', 'R', 'A'],
    ['G', 'L', 'E', 'N', 'Y', 'U'],
    ['O', 'T', 'E', 'K', 'U', 'N'],

    ['Z', 'A', 'N', 'E', 'V', 'D'],
    ['S', 'N', 'E', 'D', 'T', 'O'],
    ['R', 'I', 'A', 'S', 'M', 'O'],
    ['I', 'V', 'N', 'T', 'E', 'G'],

    ['E', 'H', 'E', 'F', 'I', 'S'],
    ['H', 'N', 'I', 'R', 'S', 'E'],
    ['L', 'E', 'U', 'R', 'W', 'I'],
    ['P', 'E', 'D', 'A', 'C', 'M'],
];

const randomIdx = N => trunc(random() * N);
const chooseSide = dice => dice[randomIdx(dice.length)];
const range = N => {
    const result = [];
    for (let i = 0; i < N; i++) {
        result.push(i);
    }
    return result;
};
const shuffle = arr => {
    const result = [];
    while (arr.length > 0) {
        const idx = randomIdx(arr.length);
        result.push(arr.splice(idx, 1)[0]);
    }
    return result;
};

let cThrow = [];
let solution = [];
let timeOut = 1;
let tHandle = null;

const startTimer = () => {
    if (tHandle) clearTimeout(tHandle);
    tHandle = setTimeout(
        () => {
            solution = cThrow.map(e => e);
            cThrow = [];
            m.redraw();
        }, timeOut * 60000);
};
const newGame = () => {
    cThrow = shuffle(dices.map(chooseSide));
    solution = [];
    startTimer();
};
const increaseTimeout = () => {
    timeOut += .5;
    timeOut %= 5;
    timeOut += timeOut === 0 ? 1 : 0
};

m.mount(document.body, {
    view: vnode => div.container([
        h1('Wortpfadfinder'),
        div.wrapper(
            range(4).map(i =>
                range(4).map(j => div.box(cThrow[i * 4 + j]))
            )
        ),
        button({ disabled: solution.length === 0, onclick: e => cThrow = solution }, 'Lösung'),
        button({ onclick: newGame }, 'Neu'),
        button({ onclick: increaseTimeout }, 'Zeit: ' + timeOut + ' min'),
        m(help)
    ])
})