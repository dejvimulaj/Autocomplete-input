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

let selectedTags = { color: [], shape: [] };
let selectedNames = [];
let currentIndex = -1;

const filterIcon = document.getElementById("filterIcon");
const filterSettings = document.getElementById("filterSettings");
let filterMode = "strict"; 

filterIcon.addEventListener("click", () => {
    filterSettings.style.display = filterSettings.style.display === "block" ? "none" : "block";
});

document.querySelectorAll("input[name='filterMode']").forEach(input => {
    input.addEventListener("change", (e) => {
        filterMode = e.target.value;
        displayGrid();
    });
});

const colors = [...new Set(data.map(item => item.color))];
const shapes = [...new Set(data.map(item => item.shape))];

const generateCombinations = () => {
    const combinations = [];
    colors.forEach(color => {
        shapes.forEach(shape => {
            combinations.push({ type: "combination", value: `${color} & ${shape}` });
            combinations.push({ type: "combination", value: `${color} | ${shape}` });
        });
    });
    return combinations;
};

const allTags = [...data.map(item => ({ type: "name", value: item.name })),
    ...colors.map(color => ({ type: "color", value: color })),
    ...shapes.map(shape => ({ type: "shape", value: shape })),
    ...generateCombinations()];



    const displayGrid = () => {
        gridContainer.innerHTML = "";
    
        let filteredData = data.filter(item => {
            const nameMatch = selectedNames.length === 0 || selectedNames.some(name => {
                if (name.includes("AND") || name.includes("OR")) {
                    const [tag1, operator, tag2] = name.split(" ");
                    const colorMatch = item.color.toLowerCase() === tag1 || item.shape.toLowerCase() === tag1;
                    const secondMatch = item.color.toLowerCase() === tag2 || item.shape.toLowerCase() === tag2;
                    return operator === "AND" ? colorMatch && secondMatch : colorMatch || secondMatch;
                }
                return item.name.toLowerCase() === name.toLowerCase();
            });
    
            const colorMatch = selectedTags.color.length === 0 || selectedTags.color.includes(item.color);
            const shapeMatch = selectedTags.shape.length === 0 || selectedTags.shape.includes(item.shape);
    
            return selectedNames.length === 0 && selectedTags.color.length === 0 && selectedTags.shape.length === 0 ? true : (filterMode === "strict" ? nameMatch && colorMatch && shapeMatch : nameMatch || (colorMatch && shapeMatch));
        });
    
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
    const search = input.value.toLowerCase();
    optionsList.innerHTML = "";

    if (search) {
        const results = allTags.filter(tag => tag.value.toLowerCase().includes(search));

        if (results.length > 0) {
            optionsList.style.display = "block";
            inputBox.classList.add("active");
            results.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item.value;
                li.addEventListener("click", () => {
                    if (item.type === "combination") {
                        handleCombination(item.value);
                    } else if (item.type === "name") {
                        addNameFilter(item);
                    } else {
                        addTag(item);
                    }
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

    const addNameFilter = (item) => {
        if (!selectedNames.includes(item.value)) {
            selectedNames.push(item.value);
    
            const tagElement = document.createElement("div");
            tagElement.classList.add("tag");
            tagElement.innerHTML = `${item.value} <span>&times;</span>`;
    
            tagElement.addEventListener("click", function () {
                removeNameFilter(item.value, tagElement);
            });
    
            inputBox.insertBefore(tagElement, input);
            input.focus();
    
            displayGrid();
        }
    }; 

const removeNameFilter = (value, tagElement) => {
    selectedNames = selectedNames.filter(name => name !== value);
    tagElement.remove();
    displayGrid();
};

const addTag = (tag) => {
    if (!selectedTags[tag.type].includes(tag.value)) {
        selectedTags[tag.type].push(tag.value);

        const tagElement = document.createElement("div");
        tagElement.classList.add("tag");
        tagElement.innerHTML = `${tag.value} <span>&times;</span>`;

        tagElement.addEventListener("click", function () {
            removeTag(tag.type, tag.value, tagElement);
        });

        inputBox.insertBefore(tagElement, input);
        input.focus();

        displayGrid();
    }
};

const removeTag = (type, value, tagElement) => {
    selectedTags[type] = selectedTags[type].filter(tag => tag !== value);
    tagElement.remove();
    displayGrid();
};


const handleCombination = (inputValue) => {
    const combinationMatch = inputValue.match(/([a-zA-Z]+)\s*(&|\|)\s*([a-zA-Z]+)/);
    if (combinationMatch) {
        const tag1 = combinationMatch[1].toLowerCase();
        const operator = combinationMatch[2] === "&" ? "AND" : "OR";
        const tag2 = combinationMatch[3].toLowerCase();

        const combinationTag = `${tag1} ${operator} ${tag2}`;
        if (!selectedNames.includes(combinationTag)) {
            selectedNames.push(combinationTag);

            const tagElement = document.createElement("div");
            tagElement.classList.add("tag");
            tagElement.innerHTML = `${combinationTag} <span>&times;</span>`;

            tagElement.addEventListener("click", function () {
                removeNameFilter(combinationTag, tagElement);
            });

            inputBox.insertBefore(tagElement, input);
            input.focus();
            displayGrid();
        }
    }
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
        } else {
            handleInvalidInput(input.value)
        }
    } else if (e.key === "Backspace" && input.value === "") {
        const lastTag = inputBox.querySelector(".tag:last-of-type");
        if (lastTag) {
            const tagText = lastTag.textContent.replace(" ×", "");
            lastTag.remove();

            if (selectedNames.includes(tagText)) {
                selectedNames = selectedNames.filter(name => name !== tagText);
            } else if (selectedTags.color.includes(tagText)) {
                selectedTags.color = selectedTags.color.filter(color => color !== tagText);
            } else if (selectedTags.shape.includes(tagText)) {
                selectedTags.shape = selectedTags.shape.filter(shape => shape !== tagText);
            }

            input.value = tagText;
            input.focus();

            displayGrid();
        }
    }
});

const handleInvalidInput = (inputValue) => {
    if (!inputValue.trim()) return;

    const isNameMatch = data.some(item => item.name.toLowerCase() === inputValue.toLowerCase());
    const isColorMatch = colors.some(color => color.toLowerCase() === inputValue.toLowerCase());
    const isShapeMatch = shapes.some(shape => shape.toLowerCase() === inputValue.toLowerCase());
    const isCombinationMatch = /([a-zA-Z]+)\s*(&|\|)\s*([a-zA-Z]+)/.test(inputValue);

    if (!isNameMatch && !isColorMatch && !isShapeMatch && !isCombinationMatch) {
        showErrorMessage("No match found");
        input.value = "";
    }
};

const searchIcon = document.querySelector(".search-icon"); 

const showErrorMessage = (message) => {
    let errorDiv = document.getElementById("error-message");
    
    if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.id = "error-message";
        errorDiv.style.color = "red";
        errorDiv.style.fontSize = "16px";
        errorDiv.style.fontWeight= "bold";
        inputBox.appendChild(errorDiv);
    }

    errorDiv.textContent = message;
    searchIcon.style.display = "none";

    setTimeout(() => {
        if (errorDiv) {
            errorDiv.remove();
        }
        searchIcon.style.display = "inline-block";
    }, 2000);
};

document.addEventListener("click", function (e) {
    if (!inputBox.contains(e.target)) {
        optionsList.style.display = "none";
        inputBox.classList.remove("active"); 
    }
});
