import m from 'mithril';
import { h1, div, button, ul, li } from './tags';
import help from './help';
import solver from './solver';
const { trunc, random, round } = Math;

let N = 4;

/**
 * - 0 -
 * 1 2 3
 * - 4 -
 * - 5 -
 */
const dices = N => {
    let result = [
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

    if (N > 4) {
        [
            ['O', 'T', 'E', 'K', 'U', 'N'],

            ['Z', 'A', 'N', 'E', 'V', 'D'],
            ['S', 'N', 'E', 'D', 'T', 'O'],
            ['R', 'I', 'A', 'S', 'M', 'O'],
            ['I', 'V', 'N', 'T', 'E', 'G'],

            ['E', 'H', 'E', 'F', 'I', 'S'],
            ['H', 'N', 'I', 'R', 'S', 'E'],
            ['L', 'E', 'U', 'R', 'W', 'I'],
            ['P', 'E', 'D', 'A', 'C', 'M'],
        ].forEach(e => result.push(e));
    }

    return result;
};

const randomIdx = N => trunc(random() * N);
const randomSide = dice => dice[randomIdx(dice.length)];
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
        result.push(arr.splice(randomIdx(arr.length), 1)[0]);
    }
    return result;
};

let currentSample = [];
let stashedSample = [];
let timeOut = 1.5;
let tHandle = null;
let words = [];
let showSolver = false;

const startTimer = () => {
    if (tHandle) clearTimeout(tHandle);
    tHandle = setTimeout(
        () => {
            stashedSample = currentSample.map(e => e);
            currentSample = [];
            m.redraw();
        }, timeOut * 60000);
};
const newGame = () => {
    currentSample = shuffle(dices(N).map(randomSide));
    stashedSample = [];
    startTimer();
};
const increaseTimeout = () => {
    timeOut += .5;
    timeOut %= 5;
    timeOut += timeOut === 0 ? 1 : 0
};
const toggle4And5 = () => N === 4 ? N = 5 : N = 4;

newGame();

m.mount(document.body, {
    view: vnode => div.container([
        h1('Wortpfadfinder'),
        (
            range(N).map(i =>
                div.wrapper(
                    range(N).map(j => div.box(currentSample[i * N + j]))
                )
            )
        ),
        div.mt15(
            button({ disabled: stashedSample.length === 0, onclick: e => currentSample = stashedSample }, 'Lösung'),
            button({ onclick: newGame }, 'Neu'),
            button({
                    onclick: () => {
                        toggle4And5();
                        newGame();
                    }
                },
                '4 oder 5'),
            button({ onclick: increaseTimeout }, 'Zeit: ' + timeOut + ' min'),
            m(help),
            showSolver ? [button({ disabled: !solver.ready(), onclick: e => words = solver.solve(currentSample) },
                    'Brute-force Angriff'
                ),
                ul(words.map(word => li(word))),
            ] : null,
            div.h5p.w100p({ onclick: e => showSolver = !showSolver }, m.trust('&nbsp;')))
    ])
})