const fs = require('fs');

fetch('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json')
    .then(res => res.json())
    .then(data => {
        const list = data.elements.slice(0, 118).map(el => {
            let cat = el.category;
            if (cat.includes('unknown')) cat = 'unknown';
            else if (el.group === 17) cat = 'halogen';
            else if (cat.includes('alkali metal')) cat = 'alkali';
            else if (cat.includes('alkaline earth')) cat = 'alkaline';
            else if (cat.includes('noble gas')) cat = 'noble-gas';
            else if (cat.includes('transition metal') || cat.includes('post-transition metal')) cat = 'metal';
            else if (cat.includes('lanthanide')) cat = 'lanthanide';
            else if (cat.includes('actinide')) cat = 'actinide';
            else if (cat.includes('metalloid')) cat = 'metalloid';
            else if (cat.includes('polyatomic nonmetal') || cat.includes('diatomic nonmetal')) cat = 'nonmetal';

            const mass = typeof el.atomic_mass === 'number' ? el.atomic_mass.toFixed(3) : el.atomic_mass;
            return `{ number: ${el.number}, symbol: "${el.symbol}", name: "${el.name}", mass: "${mass}", category: "${cat}" }`;
        });
        fs.writeFileSync('elements.txt', list.join(',\n  '));
    });
