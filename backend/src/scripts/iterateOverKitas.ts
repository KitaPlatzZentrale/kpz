import * as data from '../../data/kitas_berlin.json';

console.log(data);

interface Kita {
    name: string;
    // add other properties here if needed
}

function printKitaNames(): void {
    const kitas: Kita[] = (data as any).einrichtungen;
    for (const kita of kitas) {
        console.log(kita.name);
    }
}

printKitaNames();