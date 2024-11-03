let items = []; // Variable global para almacenar los datos

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();

        // Leer solo archivos .txt
        if (fileExtension === 'txt') {
            readTextFile(file);
        } else {
            alert('Por favor sube un archivo de texto (.txt) únicamente.');
        }
    }
});

// Cambiar delimitador en tiempo real
document.getElementById('delimiter').addEventListener('input', function() {
    if (items.length > 0) { // Verificar si hay datos cargados
        const delimiter = this.value || ',';
        populateTable(items, delimiter);
    }
});

function readTextFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const delimiter = document.getElementById('delimiter').value || ',';
        items = content.split(new RegExp(`\\${delimiter}`)).map(item => item.trim()).filter(item => item !== '');
        populateTable(items);
        document.getElementById('resultBody').dataset.items = JSON.stringify(items);
    };
    reader.readAsText(file);
}

document.getElementById('sortButton').addEventListener('click', function() {
    if (items.length === 0) {
        alert('Por favor, carga un archivo primero.');
        return;
    }

    const sortType = document.getElementById('sortType').value;
    let sortedItems;

    switch (sortType) {
        case 'alphabetical':
            sortedItems = [...items].sort((a, b) => a.localeCompare(b));
            break;
        case 'reverseAlphabetical':
            sortedItems = [...items].sort((a, b) => b.localeCompare(a));
            break;
        case 'numeric':
            sortedItems = [...items].sort((a, b) => {
                const numA = parseFloat(a);
                const numB = parseFloat(b);
                return numA - numB; // Ordenar numéricamente
            });
            break;
        default:
            sortedItems = items;
    }

    populateTable(sortedItems);
});

function populateTable(items) {
    const resultBody = document.getElementById('resultBody');
    resultBody.innerHTML = ''; // Limpiar la tabla para nuevos datos

    const seen = new Set(); // Para rastrear elementos repetidos

    items.forEach(item => {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        
        // Verificar si el item ya ha sido visto
        if (seen.has(item)) {
            cell.classList.add('repeated'); // Añadir clase para elementos repetidos
        } else {
            seen.add(item); // Marcar el item como visto
        }
        
        cell.innerText = item;
        row.appendChild(cell);
        resultBody.appendChild(row);
    });
}
