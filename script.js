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
    const pricePerItem = 29.99; // Fixed price per item

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
    <td>$${priceTotal}</td>
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
        const price = parseFloat(priceCell.textContent.replace('$', ''));
        totalSum += price;
    });

    const sumRow = document.querySelector('.sum-row td:last-child');
    sumRow.textContent = `$${totalSum.toFixed(2)}`;
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
        alert('Your order has been sent successfully!');
        modal.style.display = 'none';
        // Add any additional logic for order submission here
    };

    // Handle No button
    document.getElementById('confirm-no').onclick = function () {
        modal.style.display = 'none';
    };
});

// Close the modal when clicking outside of it
window.onclick = function (event) {
    const modal = document.getElementById('confirmation-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
// Create dorpdown-List 
document.getElementById('product-id').addEventListener('input', function () {
    const input = this.value.trim();
    const dropdown = document.getElementById('product-dropdown');

    // Clear the dropdown
    dropdown.innerHTML = '';

    // Show dropdown only if input has at least 3 characters
    if (input.length >= 3) {
        const matchingProducts = Object.keys(products).filter(productId =>
            productId.startsWith(input)
        );

        // Populate the dropdown with matching products
        matchingProducts.forEach(productId => {
            const option = document.createElement('div');
            option.classList.add('dropdown-item');
            option.textContent = `${productId} - ${products[productId].name}`;
            option.addEventListener('click', function () {
                // Fill the input fields with the selected product's data
                document.getElementById('product-id').value = productId;
                document.getElementById('product-name').value = products[productId].name;
                document.getElementById('brand').value = products[productId].brand;
                dropdown.innerHTML = ''; // Clear the dropdown
            });
            dropdown.appendChild(option);
        });

        // Show the dropdown if there are matching products
        dropdown.style.display = matchingProducts.length > 0 ? 'block' : 'none';
    } else {
        dropdown.style.display = 'none';
    }
});

// Hide the dropdown when clicking outside
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('product-dropdown');
    if (!event.target.closest('#product-id') && !event.target.closest('#product-dropdown')) {
        dropdown.style.display = 'none';
    }
});

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