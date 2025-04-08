let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    const offset = -currentSlide * 100;
    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}
// Initialize the carousel
showSlide(currentSlide);

// Product data
const products = {
    123456: {
        name: "Laptop XPS 13",
        brand: "Dell",
        price: 899.99
    },
    1235678: {
        name: "Keyboard Pro",
        brand: "Logitech",
        price: 39.99
    },
    139346: {
        name: "Monitor 27\"",
        brand: "Samsung",
        price: 299.99
    },
    1234675: {
        name: "Wireless Mouse Super",
        brand: "Microsoft",
        price: 29.99
    },
    123786: {
        name: "Smartphone Galaxy S21",
        brand: "Samsung",
        price: 799.99
    },
    145657: {
        name: "Noise Cancelling Headphones",
        brand: "Sony",
        price: 199.99
    },
    232355: {
        name: "External SSD 1TB",
        brand: "SanDisk",
        price: 149.99
    }
};

//From functionality

document.querySelector('.form-container').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get input values
    const productId = document.getElementById('product-id').value.trim();
    const productName = document.getElementById('product-name').value.trim();
    const brand = document.getElementById('brand').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value.trim(), 10);

    // Dynamically get the price per item from the field
    const pricePerItem = parseFloat(document.getElementById('price-per-item').textContent.replace('Price per Item: €', '').trim());

    // Calculate total price
    const priceTotal = (quantity * pricePerItem).toFixed(2);

    // Get the table body
    const tableBody = document.querySelector('table tbody');

    // Create a new row
    const newRow = document.createElement('tr');

    // Add cells to the row
    newRow.innerHTML = `
    <td>${productId}</td>
    <td>${productName}</td>
    <td>${brand}</td>
    <td>${quantity}</td>
    <td>€${priceTotal}</td>
    <td class="delete">X</td>
    `;

    // Append the new row to the table body
    tableBody.insertBefore(newRow, tableBody.querySelector('.sum-row'));

    // Update the sum row
    updateSumRow();

    // Clear the form inputs
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('brand').value = '';
    document.getElementById('quantity').value = '';
});

// Function to update the sum row
function updateSumRow() {
    const rows = document.querySelectorAll('table tbody tr:not(.sum-row)');
    let totalSum = 0;

    rows.forEach(row => {
        const priceCell = row.querySelector('td:nth-child(5)');
        const price = parseFloat(priceCell.textContent.replace('€', ''));
        totalSum += price;
    });

    const sumRow = document.querySelector('.sum-row td:last-child');
    sumRow.textContent = `€${totalSum.toFixed(2)}`;
}

// Event delegation for delete functionality
document.querySelector('table tbody').addEventListener('click', function (event) {
    if (event.target.classList.contains('delete')) {
        const row = event.target.closest('tr');
        row.remove();
        updateSumRow();
    }
});

document.querySelector('.order-now').addEventListener('click', function () {
    const sumRow = document.querySelector('.sum-row td:last-child');
    const totalPrice = sumRow.textContent;

    // Show the custom modal
    const modal = document.getElementById('confirmation-modal');
    const confirmationText = document.getElementById('confirmation-text');
    confirmationText.textContent = `Do you want to send your order now?\n\nTotal price of your order: ${totalPrice}`;
    modal.style.display = 'block';

    // Handle Yes button
    document.getElementById('confirm-yes').onclick = function () {
        const modal = document.getElementById('confirmation-modal');
        modal.style.display = 'none';

        // Show the success modal
        const successModal = document.getElementById('success-modal');
        successModal.style.display = 'block';
    };

    // Handle No button
    document.getElementById('confirm-no').onclick = function () {
        const modal = document.getElementById('confirmation-modal');
        modal.style.display = 'none';
    };
});

// Close the success modal when clicking the OK button
document.getElementById('success-ok').onclick = function () {
    const successModal = document.getElementById('success-modal');
    successModal.style.display = 'none';
};

// Close the modal when clicking outside of it
window.onclick = function (event) {
    const confirmationModal = document.getElementById('confirmation-modal');
    const successModal = document.getElementById('success-modal');
    if (event.target === confirmationModal) {
        confirmationModal.style.display = 'none';
    } else if (event.target === successModal) {
        successModal.style.display = 'none';
    }
};

// Track the selected brand
let selectedBrand = null;

// Show all brands in the dropdown when the brand input field is clicked
document.getElementById('brand').addEventListener('click', function () {
    const productIdInput = document.getElementById('product-id');
    const brandInput = this;
    const dropdown = document.getElementById('brand-dropdown');

    // Clear the dropdown
    dropdown.innerHTML = '';

    // If the product ID field is empty, show all brands
    if (!productIdInput.value.trim()) {
        const uniqueBrands = [...new Set(Object.values(products).map(product => product.brand))];

        // Populate the dropdown with all unique brands
        uniqueBrands.forEach(brand => {
            const option = document.createElement('div');
            option.classList.add('dropdown-item');
            option.textContent = brand;
            option.addEventListener('click', function () {
                // Set the selected brand
                brandInput.value = brand;
                selectedBrand = brand;

                // Clear the dropdown
                dropdown.innerHTML = '';
                dropdown.style.display = 'none';
            });
            dropdown.appendChild(option);
        });

        // Show the dropdown
        dropdown.style.display = 'block';
    }
});

// Filter product IDs by the selected brand and input value
document.getElementById('product-id').addEventListener('input', function () {
    const input = this.value.trim();
    const dropdown = document.getElementById('product-dropdown');

    // Clear the dropdown
    dropdown.innerHTML = '';

    // Show dropdown only if input has at least 3 characters
    if (input.length >= 3) {
        const matchingProducts = Object.keys(products).filter(productId => {
            const product = products[productId];
            return productId.startsWith(input) && (!selectedBrand || product.brand === selectedBrand);
        });

        // Populate the dropdown with matching products
        matchingProducts.forEach(productId => {
            const option = document.createElement('div');
            option.classList.add('dropdown-item');
            option.textContent = `${productId} - ${products[productId].name} - ${products[productId].brand}`;
            option.addEventListener('click', function () {
                // Fill the input fields with the selected product's data
                document.getElementById('product-id').value = productId;
                document.getElementById('product-name').value = products[productId].name;
                document.getElementById('brand').value = products[productId].brand;
                selectedBrand = products[productId].brand;

                // Clear the dropdown
                dropdown.innerHTML = '';
                dropdown.style.display = 'none';
            });
            dropdown.appendChild(option);
        });

        // Show the dropdown if there are matching products
        dropdown.style.display = matchingProducts.length > 0 ? 'block' : 'none';
    } else {
        dropdown.style.display = 'none';
    }
});

// Hide the dropdowns when clicking outside
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('product-dropdown');
    if (!event.target.closest('#product-id') && !event.target.closest('#product-dropdown') && !event.target.closest('#brand')) {
        dropdown.style.display = 'none';
    }
});
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('brand-dropdown');
    if (!event.target.closest('#brand-id') && !event.target.closest('#brand-dropdown') && !event.target.closest('#brand')) {
        dropdown.style.display = 'none';
    }
});

// Update price fields dynamically
function updatePriceFields() {
    const productId = document.getElementById('product-id').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value.trim(), 10) || 0;
    const pricePerItemElement = document.querySelector('#price-per-item');
    const priceTotalElement = document.querySelector('#price-total');

    if (products[productId]) {
        const pricePerItem = products[productId].price;
        pricePerItemElement.textContent = `Price per Item: €${pricePerItem.toFixed(2)}`;
        priceTotalElement.textContent = `Price Total: €${(pricePerItem * quantity).toFixed(2)}`;
    } else {
        pricePerItemElement.textContent = 'Price per Item: €0.00';
        priceTotalElement.textContent = 'Price Total: €0.00';
    }
}

// Event listener for product ID input
document.getElementById('product-id').addEventListener('input', updatePriceFields);

// Event listener for quantity input
document.getElementById('quantity').addEventListener('input', updatePriceFields);

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function () {
        // Entferne die aktive Klasse von allen Links
        document.querySelectorAll('nav a').forEach(navLink => {
            navLink.classList.remove('active');
        });

        // Füge die aktive Klasse zum angeklickten Link hinzu
        this.classList.add('active');
    });
});

// Setze die "Order System"-Seite standardmäßig auf aktiv
document.querySelector('nav a:first-child').classList.add('active');