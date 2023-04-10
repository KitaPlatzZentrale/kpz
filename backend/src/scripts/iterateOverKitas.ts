import { Kita } from '../type';

const kitas: Kita[] = require('../../data/kitas_berlin.json');

function printKitaNames(): void {
    for (const kita of kitas) {
        console.log(kita);
    }
}

printKitaNames();