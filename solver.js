import m from 'mithril';
import Typo from 'typo-js';
//import dictionary from 'dictionary-de';

const { sqrt, trunc, min, max } = Math;

import aff from './de-DE.aff';
import dic from './de-DE.dic';

console.log(aff, dic)

let dictionary = null;
let typo_dict = {};
let words = null;


const toTrie = (list) => {
    const trie = { isWord: list.some(e => e.length === 0) };
    list = list.filter(e => e.length > 0)

    const wordsByLetter =
        list.reduce((acc, word) => {
            let nList = acc[word[0]] || [];
            nList.push(word.substring(1, word.length));
            acc[word[0]] = nList;
            return acc;
        }, {});

    trie.words = {};
    Object.keys(wordsByLetter).forEach(letter => trie.words[letter] = toTrie(wordsByLetter[letter]))

    return trie;
};


//console.log(toTrie(['ab', 'aber', 'beo']))


const rangeIncl = (S, E) => {
    const result = [];
    for (let i = S; i <= E; i++) {
        result.push(i);
    }
    return result;
};

const use = (v, f) => f(v)

const flatMap = (arr, f = e => e) => arr.reduce((acc, x) => acc.concat(f(x)), []);

const equalPos = xy1 => xy2 => xy1.x === xy2.x && xy1.y === xy2.y;

const contains = (positions, xy) => positions.some(equalPos(xy));
const without = (positions, alreadyContained) =>
    positions.filter(pos => !contains(alreadyContained, pos));

const neighbors = ({ x, y }, N) =>
    flatMap(rangeIncl(max(0, x - 1), min(x + 1, N - 1))
        .map(nx =>
            rangeIncl(max(0, y - 1), min(y + 1, N - 1))
            .map(ny => { return { x: nx, y: ny } })
        ))
    .filter(e => !(e.x === x && e.y === y));



const onTrack = (pathLetters, subTrie = words) => {
    if (pathLetters.length === 0)
        return subTrie;
    const next = pathLetters.shift();
    if (subTrie.words[next])
        return onTrack(pathLetters, subTrie.words[next]);
    return false;
};

fetch(aff)
    .then(json => (json.text().then(
        aff_text => {
            fetch(dic).then(json => (json.text().then(
                dic_text => {
                    dictionary = new Typo("de_DE", aff_text, dic_text)

                    words = toTrie(Object
                        .keys(dictionary.dictionaryTable)
                        .map(e => e.toLowerCase())
                        .map(e => e.replace('-', '')));

                    console.log(onTrack(['a', 'b', 'e', 'r', 'g', 'l']))

                    m.redraw();
                }
            )))
        })));

const xyFromIdx = (idx, N) => { return { x: (idx % N), y: trunc(idx / N) } };
const idxFromXY = (xy, N) => xy.y * N + xy.x;

const resolve = (dices, path, N) =>
    path.map(p => idxFromXY(p, N)).map(idx => dices[idx]);






const solve = dices => {
    const N = sqrt(dices.length);
    const solutions = [];


    const solveRec = (N, path, solutions) => {

        /*
        
        if (path.length === N * N)
            return;
*/
        let pathWord = resolve(dices.map(e => e.toLowerCase()), path, N);
        let trie = onTrack(pathWord.map(e => e));

        if (!trie)
            return;

        if (path.length > 2 && trie.isWord) {
            solutions.push(pathWord)
        }

        let myNeighbors = without(neighbors(path[path.length - 1], N), path);
        myNeighbors.forEach(neighbor => solveRec(N, [...path, neighbor], solutions))
    };

    dices.forEach((dice, idx) => solveRec(N, [xyFromIdx(idx, N)], solutions));

    return Object.keys(solutions.reduce((acc, v) => {
        acc[v.join('').toUpperCase()] = 1;
        return acc;
    }, {}));
};

export default {
    solve,
    ready: () => !!dictionary
}