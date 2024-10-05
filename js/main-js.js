let elementCount = 0;
let selectedElement = null;

function addElement() {
    const content = document.getElementById('elementContent').value;
    const type = document.getElementById('elementType').value;

    if (!content) {
        alert('Please enter content for the element.');
        return;
    }

    const newElement = document.createElement('div');
    newElement.className = 'draggable-item';
    newElement.draggable = true;
    newElement.id = `element-${elementCount++}`;
    newElement.ondragstart = dragStart;
    newElement.ondragend = dragEnd;
    newElement.onclick = () => selectElement(newElement); // Select on click

    if (type === 'text') {
        newElement.innerHTML = `<p>${content}</p>`;
    } else if (type === 'image') {
        newElement.innerHTML = `<img src="https://via.placeholder.com/100" alt="Placeholder Image" class="img-fluid">`;
    } else if (type === 'button') {
        newElement.innerHTML = `<button class="btn">${content}</button>`;
    }

    document.getElementById('dragitemArea').appendChild(newElement);
    document.getElementById('elementContent').value = ''; // Clear input
}

function selectElement(element) {
    selectedElement = element;
    document.querySelectorAll('.draggable-item').forEach(item => item.classList.remove('selected'));
    selectedElement.classList.add('selected');
    document.getElementById('configForm').classList.remove('hidden');

    // Show configuration options based on the type of the selected element
    document.getElementById('textOptions').classList.add('hidden');
    document.getElementById('imageOptions').classList.add('hidden');
    document.getElementById('buttonOptions').classList.add('hidden');

    if (selectedElement.querySelector('p')) {
        document.getElementById('textOptions').classList.remove('hidden');
    } else if (selectedElement.querySelector('img')) {
        document.getElementById('imageOptions').classList.remove('hidden');
    } else if (selectedElement.querySelector('button')) {
        document.getElementById('buttonOptions').classList.remove('hidden');
    }
}

function updateElement() {
    if (!selectedElement) return;

    const newContent = document.getElementById('configContent').value;

    if (selectedElement.querySelector('p')) {
        const newColor = document.getElementById('textColorPicker').value;
        const newFontSize = document.getElementById('textFontSize').value;
        const newWidth = document.getElementById('textWidth').value;
        const customStyle = document.getElementById('textCustomStyle').value;

        const textElement = selectedElement.querySelector('p');
        textElement.textContent = newContent;
        textElement.style.color = newColor; // Change the color of the text
        textElement.style.fontSize = newFontSize; // Change font size
        selectedElement.style.width = newWidth; // Set width of the text container
        if (customStyle) {
            textElement.style.cssText += customStyle; // Apply custom CSS
        }
    } else if (selectedElement.querySelector('img')) {
        const imgSrc = selectedElement.querySelector('img').src;
        const newWidth = document.getElementById('imageWidth').value;
        const customStyle = document.getElementById('imageCustomStyle').value;

        selectedElement.querySelector('img').src = imgSrc; // Set to new image if needed
        selectedElement.querySelector('img').style.width = newWidth; // Set width of the image
        if (customStyle) {
            selectedElement.querySelector('img').style.cssText += customStyle; // Apply custom CSS
        }
    } else if (selectedElement.querySelector('button')) {
        selectedElement.querySelector('button').textContent = newContent;

        const buttonBackground = document.getElementById('buttonBackground').value;
        const buttonBorder = document.getElementById('buttonBorder').value;
        const buttonFontSize = document.getElementById('buttonFontSize').value;
        const buttonPadding = document.getElementById('buttonPadding').value;
        const customStyle = document.getElementById('buttonCustomStyle').value;

        const buttonElement = selectedElement.querySelector('button');
        buttonElement.style.backgroundColor = buttonBackground;
        buttonElement.style.border = `2px solid ${buttonBorder}`;
        buttonElement.style.fontSize = buttonFontSize;
        buttonElement.style.padding = buttonPadding;
        if (customStyle) {
            buttonElement.style.cssText += customStyle; // Apply custom CSS
        }
    }
}

function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = `<img src="${e.target.result}" alt="Uploaded Image" class="img-fluid">`;
            const currentSlot = selectedElement;
            if (currentSlot && currentSlot.querySelector('img')) {
                currentSlot.querySelector('img').src = e.target.result; // Change the image
            }
        }
        reader.readAsDataURL(file);
    }
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', this.id);
    this.classList.add('dragging');
}

function dragEnd() {
    this.classList.remove('dragging');
}

const slots = document.querySelectorAll('.template-slot');

slots.forEach(slot => {
    slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('dragover');
    });

    slot.addEventListener('dragleave', () => slot.classList.remove('dragover'));

    slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('dragover');
        const id = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(id);
        if (!slot.contains(draggedElement)) {
            slot.appendChild(draggedElement);
        }
    });
});