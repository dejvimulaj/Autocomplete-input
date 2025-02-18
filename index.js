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

const colors = [...new Set(data.map(item => item.color))];
const shapes = [...new Set(data.map(item => item.shape))];

const allTags = [
    ...colors.map(color => ({ type: "color", value: color })),
    ...shapes.map(shape => ({ type: "shape", value: shape }))
];


const displayGrid = () => {
    gridContainer.innerHTML = "";

    let filteredData = data.filter(item => {
        const nameMatch = selectedNames.length === 0 || selectedNames.includes(item.name);
        const colorMatch = selectedTags.color.length === 0 || selectedTags.color.includes(item.color);
        const shapeMatch = selectedTags.shape.length === 0 || selectedTags.shape.includes(item.shape);

      
        return selectedNames.length === 0 && selectedTags.color.length === 0 && selectedTags.shape.length === 0
            ? true
            : nameMatch && colorMatch && shapeMatch;
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
    currentIndex = -1;

    if (search) {
        const nameResults = data
            .filter(item => item.name.toLowerCase().includes(search))
            .map(item => ({ type: "name", value: item.name, id: item.id }));

        const tagResults = allTags.filter(tag => tag.value.toLowerCase().includes(search));

        const combinedResults = [...nameResults, ...tagResults];

        if (combinedResults.length > 0) {
            optionsList.style.display = "block";
            inputBox.classList.add("active");

            combinedResults.forEach((item, index) => {
                const li = document.createElement("li");
                li.textContent = item.type === "name" ? item.value : `${item.value} (${item.type})`;
                li.dataset.index = index;
                li.dataset.type = item.type;
                li.dataset.id = item.id || null;

                li.addEventListener("click", () => {
                    if (item.type === "name") {
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
            if (currentIndex < listItems.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateActiveItem(listItems);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = listItems.length - 1;
            }
            updateActiveItem(listItems);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (currentIndex >= 0 && listItems[currentIndex]) {
                listItems[currentIndex].click();
            }
        }
      else if (e.key === "Backspace" && input.value === "") {
        const lastTag = inputBox.querySelector(".tag:last-of-type");
        if (lastTag) {
            const lastItem = selectedTags[selectedTags.length - 1];
            // console.log(lastItem)
            if (lastItem) {
                input.value = lastItem.name; 
                removeTag(lastItem.id, lastTag);
            }
        }
    }
    displayGrid();
});

document.addEventListener("click", function (e) {
    if (!inputBox.contains(e.target)) {
        optionsList.style.display = "none";
        inputBox.classList.remove("active"); 
    }
});

// const displayGrid = () => {
//     gridContainer.innerHTML = "";

//     let filteredData = data.filter(item => {
//         const nameMatch = selectedNames.length === 0 || selectedNames.includes(item.name);
//         const colorMatch = selectedTags.color.length === 0 || selectedTags.color.includes(item.color);
//         const shapeMatch = selectedTags.shape.length === 0 || selectedTags.shape.includes(item.shape);

//         return nameMatch || (colorMatch && shapeMatch);
//     });

//     filteredData.forEach(item => {
//         const card = document.createElement("div");
//         card.classList.add("card");
//         card.innerHTML = `
//             <h3>${item.name}</h3>
//             <p>Color: ${item.color}</p>
//             <p>Shape: ${item.shape}</p>
//             <p>Price: $${item.price.toFixed(2)}</p>
//         `;
//         gridContainer.appendChild(card);
//     });
// };



// const updateActiveItem = (listItems) => {
//     listItems.forEach((item, index) => {
//         if (index === currentIndex) {
//             item.classList.add("active-option");
//         } else {
//             item.classList.remove("active-option");
//         }
//     });
// };

// document.addEventListener("click", function (e) {
//     if (!inputBox.contains(e.target)) {
//         optionsList.style.display = "none";
//         inputBox.classList.remove("active");
//     }
// });

// input.addEventListener("keydown", function (e) {
//     const listItems = optionsList.querySelectorAll("li");

//     if (e.key === "ArrowDown") {
//         e.preventDefault();
//         if (currentIndex < listItems.length - 1) {
//             currentIndex++;
//         } else {
//             currentIndex = 0;
//         }
//         updateActiveItem(listItems);
//     } else if (e.key === "ArrowUp") {
//         e.preventDefault();
//         if (currentIndex > 0) {
//             currentIndex--;
//         } else {
//             currentIndex = listItems.length - 1;
//         }
//         updateActiveItem(listItems);
//     } else if (e.key === "Enter") {
//         e.preventDefault();
//         if (currentIndex >= 0 && listItems[currentIndex]) {
//             listItems[currentIndex].click();
//         }
//     }
// });