document.addEventListener('DOMContentLoaded', (event) => {

    let boxIdCounter = 0;
    let selectedBox = null;

    // Load saved boxes from local storage
    loadBoxesFromLocalStorage();

    // Event listener for the new box creation
    document.getElementById("newbox").addEventListener("click", function(){
        createNewBox();
    });

    // Event listener for updating the selected box content
    document.getElementById("updateBox").addEventListener("click", function(){
        if (selectedBox) {
            updateSelectedBox();
        } else {
            alert("Please select a box from the dropdown to update.");
        }
    });

    // Function to create a new box
    function createNewBox(boxData = null) {
        const newBox = document.createElement('div');
        newBox.classList.add('box');
        newBox.id = 'box-' + boxIdCounter++;
       
        const innerBox = document.createElement('div');
        innerBox.classList.add('inner-box');

        const frontFace = document.createElement('div');
        frontFace.classList.add('front');
        frontFace.textContent = boxData?.frontText || newBox.id;
        frontFace.style.backgroundColor = boxData?.frontColor || '#4CAF50';

        const backFace = document.createElement('div');
        backFace.classList.add('back');
        backFace.textContent = boxData?.backText || "Back of " + newBox.id;
        backFace.style.backgroundColor = boxData?.backColor || '#FF5733';

        innerBox.appendChild(frontFace);
        innerBox.appendChild(backFace);
        newBox.appendChild(innerBox);

        document.body.appendChild(newBox);

        // Add new box to the dropdown menu
        const dropdownContent = document.getElementById('boxDropdown');
        const newOption = document.createElement('a');
        newOption.href = '#';
        newOption.textContent = newBox.id;

        // Handle box selection 
        newOption.addEventListener('click', function(){
            selectedBox = newBox;
            document.getElementById("frontText").value = frontFace.textContent;
            document.getElementById("backText").value = backFace.textContent;
            document.getElementById("frontColor").value = rgbToHex(frontFace.style.backgroundColor);
            document.getElementById("backColor").value = rgbToHex(backFace.style.backgroundColor);
        });

        dropdownContent.appendChild(newOption);

        // Add flip functionality to the new box
        newBox.addEventListener("click", function(){
            this.classList.toggle('flipped');
        });

        if (!boxData) {
            saveBoxToLocalStorage({
                id: newBox.id,
                frontText: frontFace.textContent,
                backText: backFace.textContent,
                frontColor: frontFace.style.backgroundColor,
                backColor: backFace.style.backgroundColor
            });
        }
    }

    // Function to update the selected box
    function updateSelectedBox() {
        const frontText = document.getElementById("frontText").value;
        const backText = document.getElementById("backText").value;
        const frontColor = document.getElementById("frontColor").value;
        const backColor = document.getElementById("backColor").value;

        const frontFace = selectedBox.querySelector('.front');
        const backFace = selectedBox.querySelector('.back');

        if (frontText) {
            frontFace.textContent = frontText;
        }

        if (backText) {
            backFace.textContent = backText;
        }

        frontFace.style.backgroundColor = frontColor;
        backFace.style.backgroundColor = backColor;

        saveBoxToLocalStorage({
            id: selectedBox.id,
            frontText: frontFace.textContent,
            backText: backFace.textContent,
            frontColor: frontFace.style.backgroundColor,
            backColor: backFace.style.backgroundColor
        });
    }

    // Function to save a box to local storage
    function saveBoxToLocalStorage(boxData) {
        let boxes = JSON.parse(localStorage.getItem('boxes')) || [];
        const existingIndex = boxes.findIndex(box => box.id === boxData.id);

        if (existingIndex >= 0) {
            boxes[existingIndex] = boxData;
        } else {
            boxes.push(boxData);
        }

        localStorage.setItem('boxes', JSON.stringify(boxes));
    }

    // Function to load boxes from local storage
    function loadBoxesFromLocalStorage() {
        const boxes = JSON.parse(localStorage.getItem('boxes')) || [];
        boxes.forEach(boxData => {
            createNewBox(boxData);
        });
    }

    // Helper function to convert rgb to hex
    function rgbToHex(rgb) {
        if (!rgb) return "#ffffff"; // default color
        let rgbValues = rgb.match(/\d+/g);
        return "#" + rgbValues.map(value => {
            let hex = parseInt(value).toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }).join('');
    }
});