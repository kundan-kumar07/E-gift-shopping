const API_URL = "http://localhost:5000/api";

// Array of products (example data)
const products = [
    { id: 1, name: 'Gift Card A', price: 20 },
    { id: 2, name: 'Gift Card B', price: 30 },
    { id: 3, name: 'Gift Card C', price: 40 },
    { id: 4, name: 'Gift Card D', price: 25 },
    { id: 5, name: 'Gift Card E', price: 15 },
    { id: 6, name: 'Gift Card F', price: 50 },
    { id: 7, name: 'Gift Card G', price: 10 },
    { id: 8, name: 'Gift Card H', price: 35 },
    { id: 9, name: 'Gift Card I', price: 45 },
    { id: 10, name: 'Gift Card J', price: 55 }
];

// Helper function to show a loading indicator
function showLoading(isLoading) {
    const loading = document.getElementById('loading');
    if (isLoading) {
        loading.style.display = 'block';
    } else {
        loading.style.display = 'none';
    }
}

// Function to load products and display them
function loadProducts() {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id}, ${product.price})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

// Call the loadProducts function to display the products when the page loads
window.onload = loadProducts;

// Signup function
async function signup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    showLoading(true); // Show loading indicator

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        showLoading(false); // Hide loading indicator after response

        if (response.ok) {
            alert('Signup successful! Please login.');
            window.location.href = 'login.html';
        } else {
            const errorData = await response.json();
            alert(`Signup failed: ${errorData.message || 'An error occurred'}`);
        }
    } catch (error) {
        showLoading(false); // Hide loading on error
        alert('Signup failed: Network error or server unavailable.');
    }
}

// Login function
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    showLoading(true); // Show loading indicator

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        showLoading(false); // Hide loading indicator after response

        const data = await response.json(); // Get the JSON response

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'main.html';
        } else {
            // Check if there is a message in the response, otherwise use a default message
            alert(`Login failed: ${data.message || 'Invalid credentials or server error'}`);
        }
    } catch (error) {
        showLoading(false); // Hide loading on error
        alert('Login failed: Network error or server unavailable.');
    }
}

function logout() {
    localStorage.removeItem('token'); // Remove the token from localStorage
    alert('You have logged out successfully!');
    window.location.href = 'login.html'; // Redirect to the login page
}

// View Cart function
async function viewCart() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login first!');
        return;
    }

    showLoading(true); // Show loading indicator

    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        showLoading(false); // Hide loading indicator after response

        const data = await response.json();

        if (!data.items) {
            alert("No items in the cart.");
            return;
        }

        const cartDiv = document.getElementById('cart-items');
        cartDiv.innerHTML = '';
        let total = 0;
        data.items.forEach(item => {
            total += item.price * item.quantity;
            cartDiv.innerHTML += `<p>${item.productId} - Quantity: ${item.quantity} - Price: $${item.price}</p>`;
        });
        document.getElementById('cart-total').innerText = `$${total.toFixed(2)}`;
    } catch (error) {
        showLoading(false); // Hide loading on error
        alert('Error fetching cart: Network error or server unavailable.');
    }
}

// Add to Cart function
// Add to Cart function
async function addToCart(productId, price) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login first!');
        return;
    }

    const quantity = 1; // You can make this dynamic if you want

    const response = await fetch(`${API_URL}/cart`, {  // Changed /add to /cart
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
    });

    const data = await response.json();
    if (response.ok) {
        alert('Item added to cart!');
        // Optionally, refresh the cart or update the UI
    } else {
        alert('Failed to add item to cart');
    }
}

