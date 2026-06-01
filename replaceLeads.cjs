const fs = require('fs');
const file = 'frontend/src/pages/admin/Leads.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Search logic
content = content.replace(
  /const carsArr = lead\.carsOfInterest\?\.length > 0 \? lead\.carsOfInterest : \(lead\.carOfInterest \? \[lead\.carOfInterest\] : \[\]\);\s*if \(carsArr\.some\(c => \`\$\{c\.make\} \$\{c\.model\} \$\{c\.year\}\`\.toLowerCase\(\)\.includes\(q\)\) \|\| customCarStr\.toLowerCase\(\)\.includes\(q\) \|\| \(lead\.interestedBrand && lead\.interestedBrand\.toLowerCase\(\)\.includes\(q\)\) \|\| \(lead\.interestedModel && lead\.interestedModel\.toLowerCase\(\)\.includes\(q\)\)\) \{/,
  `const carsArr = lead.carsOfInterest?.length > 0 ? lead.carsOfInterest : (lead.carOfInterest ? [lead.carOfInterest] : []);
    const carMastersArr = lead.interestedCarMasters || [];
    if (
      carsArr.some(c => \`\${c.make} \${c.model} \${c.year}\`.toLowerCase().includes(q)) || 
      carMastersArr.some(c => \`\${c.brand} \${c.model}\`.toLowerCase().includes(q)) ||
      customCarStr.toLowerCase().includes(q) || 
      (lead.interestedBrand && lead.interestedBrand.toLowerCase().includes(q)) || 
      (lead.interestedModel && lead.interestedModel.toLowerCase().includes(q))
    ) {`
);

// 2. Filter logic
content = content.replace(
  /const matchesCar = !filterCarStr \|\| \(\s*\(lead\.carsOfInterest\?\.length > 0 && lead\.carsOfInterest\.some\(c => \`\$\{c\.make\} \$\{c\.model\} \(\$\{c\.year\}\)\`\.toLowerCase\(\)\.includes\(filterCarStr\)\)\) \|\|\s*\(lead\.carOfInterest && \(\s*\`\$\{lead\.carOfInterest\.make\} \$\{lead\.carOfInterest\.model\} \(\$\{lead\.carOfInterest\.year\}\)\`\s*\.toLowerCase\(\)\s*\.includes\(filterCarStr\)\s*\)\) \|\|\s*\(lead\.interestedBrand && lead\.interestedBrand\.toLowerCase\(\)\.includes\(filterCarStr\)\) \|\|\s*\(lead\.interestedModel && lead\.interestedModel\.toLowerCase\(\)\.includes\(filterCarStr\)\) \|\|\s*\(customCarString && customCarString\.toLowerCase\(\)\.includes\(filterCarStr\)\) \|\|\s*\(customCarString && filterCarStr === 'custom car'\)\s*\);/,
  `const carMastersArr = lead.interestedCarMasters || [];
      const matchesCar = !filterCarStr || (
        (lead.carsOfInterest?.length > 0 && lead.carsOfInterest.some(c => \`\${c.make} \${c.model} (\${c.year})\`.toLowerCase().includes(filterCarStr))) ||
        (carMastersArr.some(c => \`\${c.brand} \${c.model}\`.toLowerCase().includes(filterCarStr))) ||
        (lead.carOfInterest && (
          \`\${lead.carOfInterest.make} \${lead.carOfInterest.model} (\${lead.carOfInterest.year})\`
            .toLowerCase()
            .includes(filterCarStr)
        )) ||
        (lead.interestedBrand && lead.interestedBrand.toLowerCase().includes(filterCarStr)) ||
        (lead.interestedModel && lead.interestedModel.toLowerCase().includes(filterCarStr)) ||
        (customCarString && customCarString.toLowerCase().includes(filterCarStr)) ||
        (customCarString && filterCarStr === 'custom car')
      );`
);

// 3. Export logic
content = content.replace(
  /('Car Make': lead\.interestedBrand \|\| \(lead\.carsOfInterest\?\.length > 0 \? lead\.carsOfInterest\.map\(c => c\.make\)\.join\(', '\) : lead\.carOfInterest\?\.make\) \|\| customCarString \|\| '',\s*)'Car Model': lead\.interestedModel \|\| \(lead\.carsOfInterest\?\.length > 0 \? lead\.carsOfInterest\.map\(c => c\.model\)\.join\(', '\) : lead\.carOfInterest\?\.model\) \|\| '',(\s*)'Fuel Type': lead\.interestedFuelType \|\| '',(\s*)'Transmission': lead\.interestedTransmission \|\| '',/,
  `'Car Make': lead.interestedCarMasters?.length > 0 ? lead.interestedCarMasters.map(c => c.brand).filter(Boolean).join(', ') : (lead.interestedBrand || (lead.carsOfInterest?.length > 0 ? lead.carsOfInterest.map(c => c.make).join(', ') : lead.carOfInterest?.make) || customCarString || ''),
        'Car Model': lead.interestedCarMasters?.length > 0 ? lead.interestedCarMasters.map(c => c.model).filter(Boolean).join(', ') : (lead.interestedModel || (lead.carsOfInterest?.length > 0 ? lead.carsOfInterest.map(c => c.model).join(', ') : lead.carOfInterest?.model) || ''),
        'Fuel Type': lead.interestedCarMasters?.length > 0 ? lead.interestedCarMasters.map(c => c.fuelType).filter(Boolean).join(', ') : (lead.interestedFuelType || ''),
        'Transmission': lead.interestedCarMasters?.length > 0 ? lead.interestedCarMasters.map(c => c.transmission).filter(Boolean).join(', ') : (lead.interestedTransmission || ''),`
);

// 4. Display logic
content = content.replace(
  /if \(lead\.interestedBrand \|\| hasCars \|\| customCarStr\) \{/g,
  `if (lead.interestedCarMasters?.length > 0 || lead.interestedBrand || hasCars || customCarStr) {`
);

content = content.replace(
  /\{lead\.interestedBrand && \(\s*<span className="(.*?)">\s*\{lead\.interestedBrand\} \{lead\.interestedModel \|\| ''\} \{\(lead\.interestedFuelType \|\| lead\.interestedTransmission\) \? \`\(\$\{\[lead\.interestedFuelType, lead\.interestedTransmission\]\.filter\(Boolean\)\.join\(', '\)\}\)\` : ''\}\s*<\/span>\s*\)\}/g,
  `{lead.interestedCarMasters?.map((c, i) => (
                                        <span key={'cm'+i} className="$1">
                                          {c.brand} {c.model} {(c.fuelType || c.transmission) ? \`(\${[c.fuelType, c.transmission].filter(Boolean).join(', ')})\` : ''}
                                        </span>
                                      ))}
                                      {(!lead.interestedCarMasters || lead.interestedCarMasters.length === 0) && lead.interestedBrand && (
                                        <span className="$1">
                                          {lead.interestedBrand} {lead.interestedModel || ''} {(lead.interestedFuelType || lead.interestedTransmission) ? \`(\${[lead.interestedFuelType, lead.interestedTransmission].filter(Boolean).join(', ')})\` : ''}
                                        </span>
                                      )}`
);

// 5. Line 1517 Print Logic
content = content.replace(
  /if \(lead\.interestedBrand\) carStrings\.push\(\`\$\{lead\.interestedBrand\} \$\{lead\.interestedModel \|\| ''\} \$\{\(lead\.interestedFuelType \|\| lead\.interestedTransmission\) \? \`\(\$\{\[lead\.interestedFuelType, lead\.interestedTransmission\]\.filter\(Boolean\)\.join\(', '\)\}\)\` : ''\}\`\);/,
  `if (lead.interestedCarMasters && lead.interestedCarMasters.length > 0) {
                              lead.interestedCarMasters.forEach(c => {
                                carStrings.push(\`\${c.brand} \${c.model} \${(c.fuelType || c.transmission) ? \`(\${[c.fuelType, c.transmission].filter(Boolean).join(', ')})\` : ''}\`);
                              });
                            } else if (lead.interestedBrand) {
                              carStrings.push(\`\${lead.interestedBrand} \${lead.interestedModel || ''} \${(lead.interestedFuelType || lead.interestedTransmission) ? \`(\${[lead.interestedFuelType, lead.interestedTransmission].filter(Boolean).join(', ')})\` : ''}\`);
                            }`
);

content = content.replace(
  /if \(cars\.length > 0 \|\| customCarStr \|\| lead\.interestedBrand\) \{/g,
  `if (cars.length > 0 || customCarStr || lead.interestedBrand || lead.interestedCarMasters?.length > 0) {`
);

fs.writeFileSync(file, content);
console.log('Replacements done');
