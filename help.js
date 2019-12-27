import { button, p } from "./tags";
import m from 'mithril';

let visible = false;

const toggleVisibility = () => visible = !visible;

const helpText = [
    'Es gilt möglichst viele und lange Wörter zu finden.',
    'Schnappt Euch jeder einen Zettel und einen Stift und "ab geht die wilde Fahrt"!',
    'Mit Klicken auf "Neu" werden neue Kombinationen erzeugt (An die alten kommt ihr nicht mehr ran.).',
    'Von da ab läuft die Zeit (Die mit Klicken auf den "Zeit"-Knopf eingestellt werden kann.',
    'Jeder schreibt ungesehen von den anderen möglichst viele Wörter auf, die er nach folgender Regel findet:',
    `Startet bei einem beliebigen Buchstaben. Von dort aus könnt ihr in jede beliebige Richtung laufen und diese 
  auch in jedem Schritt ändern. Die möglichen Richtungen sind horizontal, vertikal und diagonal (8er Nachbarschaft).`,
    'Für jedes Wort darf jeder Buchstabe nur einmal besucht werden.',
    'Wenn die Zeit abgelaufen ist, verschwinden die Buchstaben und alle legen die Stifte weg.',
    'Dann wird gezählt, dazu können die letzten Buchstaben wieder durch Klicken auf "Lösung" sichtbar gemacht werden.',
    `Reihum werden die Wörter vorgelesen. Wenn zwei oder mehr Spieler dasselbe Wort gefunden haben,
    bekommt keiner von ihnen einen Punkt dafür. Für jedes allein gefundene Wort gibt es Punkte wie folgt:`,
    '3 Buchstaben &rarr; 1 Punkt',
    '4 Buchstaben &rarr; 2 Punkte',
    '5 Buchstaben &rarr; 3 Punkte',
    '...',
    'n Buchstaben &rarr; n-2 Punkte',
    'Nach mehreren Runden gewinnt, wer die meisten Punkte in Summe gesammelt hat.',
    `Viel Spaß und ACHTUNG: Kann süchtig machen. In dem Fall bitte an die 
    <a href="https://www.gluecksspielsucht.de/">zuständige Hilfeeinrichtung</a> wenden.
    `
];

export default {
    view: vnode => [
        button({ onclick: toggleVisibility }, 'Regeln'),
        visible ? helpText.map(l => p(m.trust(l))) : null
    ]
}