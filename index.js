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


const inputBox= document.getElementById("inputBox");
const input= document.getElementById("autocompleteInput");
const optionsList= document.getElementById("optionsList");
let selectedItems = [];
let currentIndex = -1;

const colors =[...new Set(data.map(item => item.color))]
const shapes =[...new Set(data.map(item => item.shape))]

const allTags = [...colors.map(color => ({
    type: 'color', value: color
})),...shapes.map(shape => ({
    type: 'shape', value: shape
}))]


const displayGrid = () => {
    gridContainer.innerHTML = "";
    const itemsToDisplay = selectedItems.length>0 ? selectedItems : data;
    itemsToDisplay.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>Color: ${item.color}</p>
            <p>Price: $${item.price.toFixed(2)}</p>
        `;
        gridContainer.appendChild(card);
    });
};

displayGrid();


input.addEventListener("input", () => {
  const search = input.value.toLowerCase();
//   console.log(input.value)
  optionsList.innerHTML="";
  currentIndex = -1;


if(search) {
    const filteredData= data.filter(item => item.name.toLowerCase().includes(search))
    if(filteredData.length>0){
        optionsList.style.display ="block";
        inputBox.classList.add("active");
        filteredData.forEach((item) => {
          const li= document.createElement('li');
          li.textContent = item.name;
          li.addEventListener('click', () => {
            addTag(item);
            // console.log(item)
            input.value="";
            optionsList.style.display = "none";
            inputBox.classList.remove("active");
          });
          optionsList.appendChild(li)
        }) 
    }  else {
        optionsList.style.display="none";
        inputBox.classList.remove("active");
    }
} else {
    optionsList.style.display="none";
    inputBox.classList.remove("active");
}
});

const addTag = (item) => {
  if(!selectedItems.some((selected) => {selected.id === item.id})){
    selectedItems.push(item);

    const tag= document.createElement('div');
    tag.classList.add('tag');
    tag.innerHTML = `${item.name} <span>&times;</span>`; 

    tag.addEventListener("click", function () {
        removeTag(item.id, tag);
    });
    inputBox.insertBefore(tag, input);
    input.focus();

    displayGrid();
    
  }

}

const removeTag = (id, tagElement) => {
    selectedItems = selectedItems.filter(item => item.id !== id);
    tagElement.remove();
    
    displayGrid();
}


const updateActiveItem = (listItems) => {
  listItems.forEach((item, index)=>{
    if(index=== currentIndex){item.classList.add('active-option')}
    else{item.classList.remove('active-option')}
  })
}

input.addEventListener("keydown", function (e) {
    const listItems= optionsList.querySelectorAll('li');
    if(e.key === "ArrowDown"){
        e.preventDefault()
        if(currentIndex< listItems.length-1){currentIndex++}
        else{currentIndex=0}
        updateActiveItem(listItems)
    } else if(e.key ==="ArrowUp"){
        e.preventDefault()
        if(currentIndex>0){
            currentIndex--
        }else{currentIndex= listItems.length}
        updateActiveItem(listItems)
    } else if(e.key==="Enter"){
        e.preventDefault();
        if(currentIndex>=0 && listItems[currentIndex]){
            listItems[currentIndex].click()
        }
    } else if (e.key === "Backspace" && input.value === "") {
        const lastTag = inputBox.querySelector(".tag:last-of-type");
        if (lastTag) {
            const lastItem = selectedItems[selectedItems.length - 1];
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

// filterCheckbox.addEventListener("change", () => {
//  displayGrid()
// });

