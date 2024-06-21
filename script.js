let excelData = [];
let columnNames = [];
const useless = "4321"; 

function authenticate() {
    const pin = document.getElementById('pinInput').value;
    const authError = document.getElementById('authError');
    if (pin === useless) {
        document.getElementById('authLayer').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    } else {
        authError.textContent = 'Incorrect PIN. Please try again.';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('./example_data.xlsx')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            columnNames = excelData[0];
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            alert('Error: ' + error.message);
        });
});

function showNameSuggestions() {
    const input = document.getElementById('nameSearch').value.toLowerCase();
    const suggestionsBox = document.getElementById('nameSuggestions');
    suggestionsBox.innerHTML = '';
    if (input) {
        const suggestions = excelData.slice(1).filter(row => row[0].toLowerCase().startsWith(input));
        suggestions.forEach(row => {
            const suggestion = document.createElement('div');
            suggestion.textContent = row[0];
            suggestion.onclick = () => {
                document.getElementById('nameSearch').value = row[0];
                suggestionsBox.innerHTML = '';
            };
            suggestionsBox.appendChild(suggestion);
        });
    }
}

function showParameterSuggestions() {
    const suggestionsBox = document.getElementById('parameterSuggestions');
    suggestionsBox.innerHTML = '';
    columnNames.forEach(name => {
        const suggestion = document.createElement('div');
        suggestion.textContent = name;
        suggestion.onclick = () => {
            document.getElementById('parameterSearch').value = name;
            suggestionsBox.innerHTML = '';
        };
        suggestionsBox.appendChild(suggestion);
    });
}

function retrieveData() {
    const name = document.getElementById('nameSearch').value.toLowerCase();
    const parameter = document.getElementById('parameterSearch').value;
    const resultBox = document.getElementById('result');

    const row = excelData.find(row => row[0].toLowerCase() === name);
    if (!row) {
        resultBox.textContent = 'Name not found.';
        return;
    }

    const colIndex = columnNames.indexOf(parameter);
    if (colIndex === -1) {
        resultBox.textContent = 'Parameter not found.';
        return;
    }

    const value = row[colIndex];
    resultBox.textContent = value !== undefined ? value : 'Data not available.';
}
