const data = [
    { id: 1, name: "Apple", category: "Fruit", color: "Red",shape: "Round", price: 1.2 },
    { id: 2, name: "Banana", category: "Fruit", color: "Yellow",shape: "Long", price: 0.5 },
    { id: 3, name: "Cherry", category: "Fruit", color: "Red", shape: "Round", price: 2.0 },
    { id: 4, name: "Date", category: "Fruit", color: "Brown",shape: "Round", price: 3.0 },
    { id: 5, name: "Elderberry", category: "Fruit", color: "Purple", shape: "Round", price: 4.0 },
    { id: 6, name: "Fig", category: "Fruit", color: "Purple",shape: "Oval", price: 2.5 },
    { id: 7, name: "Grape", category: "Fruit", color: "Green",shape: "Round", price: 1.8 },
    { id: 8, name: "Honeydew", category: "Fruit", color: "Green",shape: "Oval", price: 3.5 },
    { id: 9, name: "Kiwi", category: "Fruit", color: "Brown",shape: "Oval", price: 1.7 },
    { id: 10, name: "Lemon", category: "Fruit", color: "Yellow",shape: "Oval", price: 0.9 },
    { id: 11, name: "Mango", category: "Fruit", color: "Orange",shape: "Round", price: 1.5 },
    { id: 12, name: "Nectarine", category: "Fruit", color: "Orange",shape: "Round", price: 1.6 },
    { id: 13, name: "Orange", category: "Fruit", color: "Orange",shape: "Round", price: 1.2 },
    { id: 14, name: "Papaya", category: "Fruit", color: "Orange",shape: "Long", price: 2.8 },
    { id: 15, name: "Quince", category: "Fruit", color: "Yellow",shape: "Long", price: 3.2 }
];

const inputBox = document.getElementById("inputBox");
const input = document.getElementById("autocompleteInput");
const optionsList = document.getElementById("optionsList");
const gridContainer = document.getElementById("gridContainer");

let selectedFilters = [];
let currentIndex = -1;

// Get all available filters
const generateBaseOptions = () => {
    const names = [...new Set(data.map(item => item.name))];
    const colors = [...new Set(data.map(item => item.color))];
    const shapes = [...new Set(data.map(item => item.shape))];

    return [
        ...names.map(name => ({ type: 'name', value: name })),
        ...colors.map(color => ({ type: 'property', value: color })),
        ...shapes.map(shape => ({ type: 'property', value: shape }))
    ];
};

let allTags = generateBaseOptions();

const isValidFilter = (value) => {
    const colors = new Set(data.map(item => item.color));
    const shapes = new Set(data.map(item => item.shape));

    if (value.includes('|')) {
        const parts = value.split('|');
        if (parts.length < 2) return false;
        return parts.every(part => {
            const trimmedPart = part.trim();
            return [...colors, ...shapes].some(prop => 
                prop.toLowerCase() === trimmedPart.toLowerCase()
            );
        });
    } else {
        return [...colors, ...shapes].some(prop => 
            prop.toLowerCase() === value.toLowerCase()
        );
    }
};

const getDisplayText = (item) => {
    const normalizedValue = normalizeFilterValue(item.value);
    if (item.type === 'name') {
        return `${normalizedValue} (fruit)`;
    } else if (item.type === 'property') {
        const isColor = data.some(d => d.color.toLowerCase() === item.value.toLowerCase());
        return `${normalizedValue} (${isColor ? 'color' : 'shape'})`;
    } else {
        return normalizedValue;
    }
};

const displayGrid = () => {
    gridContainer.innerHTML = "";
    
    let filteredData = data;
    
    if (selectedFilters.length > 0) {
        const nameFilters = selectedFilters.filter(f => f.type === 'name');
        const propertyFilters = selectedFilters.filter(f => f.type === 'property');
        const concatFilters = selectedFilters.filter(f => f.type === 'concat');

        filteredData = data.filter(item => {
            const matchesName = nameFilters.some(filter => 
                item.name.toLowerCase() === filter.value.toLowerCase()
            );

            const matchesProperty = propertyFilters.some(filter => 
                item.color.toLowerCase() === filter.value.toLowerCase() || 
                item.shape.toLowerCase() === filter.value.toLowerCase()
            );

            const allConcatAttributes = concatFilters.flatMap(filter => 
                filter.value.split('|').map(part => part.trim())
            );
            const matchesConcat = allConcatAttributes.some(attr => 
                item.color.toLowerCase() === attr.toLowerCase() || 
                item.shape.toLowerCase() === attr.toLowerCase()
            );

            return matchesName || matchesProperty || matchesConcat;
        });
    }
    
    filteredData.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>Color: ${item.color}</p>
            <p>Shape: ${item.shape}</p>
            <p>Price: $${item.price.toFixed(2)}</p>
        `;
        gridContainer.appendChild(card);
    });
};

displayGrid();

input.addEventListener("input", () => {
    const search = input.value;
    optionsList.innerHTML = "";

    if (search) {
        let results = [];
        
        // Check if input is a valid filter
        if (isValidFilter(search)) {
            if (!selectedFilters.some(f => f.value === search)) {
                results.push({
                    type: search.includes('|') ? 'concat' : 'property',
                    value: search,
                    isNew: search.includes('|')
                });
            }
        } else {
            
            results = allTags.filter(tag => 
                !selectedFilters.some(selected => selected.value === tag.value) &&
                tag.value.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (results.length > 0) {
            optionsList.style.display = "block";
            inputBox.classList.add("active");
            results.forEach(item => {
                const li = document.createElement("li");
                const displayText = getDisplayText(item);
                if (item.type === 'concat' && item.isNew) {
                    li.innerHTML = `<i class="fa fa-plus"></i> ${displayText}`;
                } else {
                    li.textContent = displayText;
                }
                li.addEventListener("click", () => {
                    addFilter(item);
                    input.value = "";
                    optionsList.style.display = "none";
                    inputBox.classList.remove("active");
                });
                optionsList.appendChild(li);
            });
        } else {
            optionsList.style.display = "none";
            inputBox.classList.remove("active");
        }
    } else {
        optionsList.style.display = "none";
        inputBox.classList.remove("active");
    }
});

const normalizeFilterValue = (value) => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    
    if (value.includes('|')) {
        return value.split('|')
            .map(part => part.trim())
            .map(capitalize)
            .join(' | ');
    }
    return capitalize(value);
};

const addFilter = (filter) => {
    const normalizedValue = normalizeFilterValue(filter.value);
    if (!selectedFilters.some(f => normalizeFilterValue(f.value) === normalizedValue)) {
        selectedFilters.push({
            ...filter,
            value: normalizedValue
        });
        
        const tagElement = document.createElement("div");
        tagElement.classList.add("tag");
        tagElement.innerHTML = `${normalizedValue} <span>&times;</span>`;
        
        tagElement.addEventListener("click", function() {
            removeFilter(filter, tagElement);
        });
        
        inputBox.insertBefore(tagElement, input);
        input.focus();
        
        displayGrid();
    }
};

const removeFilter = (filter, tagElement) => {
    const normalizedValue = normalizeFilterValue(filter.value);
    selectedFilters = selectedFilters.filter(f => normalizeFilterValue(f.value) !== normalizedValue);
    tagElement.remove();
    displayGrid();
};

const updateActiveItem = (listItems) => {
    listItems.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add("active-option");
        } else {
            item.classList.remove("active-option");
        }
    });
};

input.addEventListener("keydown", function (e) {
    const listItems = optionsList.querySelectorAll("li");

    if (e.key === "ArrowDown") {
        e.preventDefault();
        currentIndex = (currentIndex < listItems.length - 1) ? currentIndex + 1 : 0;
        updateActiveItem(listItems);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : listItems.length - 1;
        updateActiveItem(listItems);
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentIndex >= 0 && listItems[currentIndex]) {
            listItems[currentIndex].click();
        } else if (isValidFilter(input.value)) {
            addFilter({
                type: input.value.includes('|') ? 'concat' : 'property',
                value: input.value,
                isNew: input.value.includes('|')
            });
            input.value = "";
            optionsList.style.display = "none";
            inputBox.classList.remove("active");
        } else {
            handleInvalidInput(input.value);
        }
    } else if (e.key === "Backspace" && input.value === "") {
        const lastTag = inputBox.querySelector(".tag:last-of-type");
        if (lastTag) {
            const tagText = lastTag.textContent.replace(" ×", "");
            const normalizedText = normalizeFilterValue(tagText);
            lastTag.remove();
            selectedFilters = selectedFilters.filter(f => normalizeFilterValue(f.value) !== normalizedText);
            input.value = tagText;
            input.focus();
            displayGrid();
        }
    }
});

const handleInvalidInput = (inputValue) => {
    if (!inputValue.trim()) return;

    const isNameMatch = data.some(item => item.name.toLowerCase() === inputValue.toLowerCase());
    const isValidFilterMatch = isValidFilter(inputValue);

    if (!isNameMatch && !isValidFilterMatch) {
        showErrorMessage("No match found");
        input.value = "";
    }
};

const showErrorMessage = (message) => {
    let errorDiv = document.getElementById("error-message");
    
    if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.id = "error-message";
        errorDiv.style.color = "red";
        errorDiv.style.fontSize = "16px";
        errorDiv.style.fontWeight = "bold";
        inputBox.appendChild(errorDiv);
    }

    errorDiv.textContent = message;

    setTimeout(() => {
        if (errorDiv) {
            errorDiv.remove();
        }
    }, 2000);
};

document.addEventListener("click", function (e) {
    if (!inputBox.contains(e.target)) {
        optionsList.style.display = "none";
        inputBox.classList.remove("active"); 
    }
});
