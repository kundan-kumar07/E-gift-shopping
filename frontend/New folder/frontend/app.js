const apiUrl = 'http://localhost:5000/api';  // Backend API URL
let userToken = null;

document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  loadProducts();
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('loginBtn').addEventListener('click', showLoginForm);
  document.getElementById('signupBtn').addEventListener('click', showSignupForm);
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('authFormEl')?.addEventListener('submit', handleAuthForm);
}

function showLoginForm() {
  document.getElementById('authTitle').textContent = 'Login';
  document.getElementById('authForm').style.display = 'block';
  document.getElementById('submitBtn').textContent = 'Login';
}

function showSignupForm() {
  document.getElementById('authTitle').textContent = 'Sign Up';
  document.getElementById('authForm').style.display = 'block';
  document.getElementById('submitBtn').textContent = 'Sign Up';
}

async function handleAuthForm(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const url = event.target.id === 'authFormEl' ? '/auth/login' : '/auth/signup';
  
  const response = await fetch(apiUrl + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (response.ok) {
    userToken = data.token;
    localStorage.setItem('userToken', userToken);
    document.getElementById('authForm').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    loadProducts();
    loadCart();
  } else {
    alert(data.message);
  }
}

async function loadProducts() {
  const response = await fetch(apiUrl + '/products');
  const products = await response.json();

  const productsList = document.getElementById('productsList');
  productsList.innerHTML = '';

  products.forEach(product => {
    const productElem = document.createElement('div');
    productElem.classList.add('product');
    productElem.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.price}</p>
      <button onclick="addToCart(${product._id})">Add to Cart</button>
    `;
    productsList.appendChild(productElem);
  });
}

async function addToCart(productId) {
  if (!userToken) {
    alert('Please log in to add items to the cart');
    return;
  }

  const response = await fetch(apiUrl + '/cart', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId })
  });

  const data = await response.json();
  if (response.ok) {
    alert('Item added to cart');
    loadCart();
  } else {
    alert(data.message);
  }
}

async function loadCart() {
  if (!userToken) return;

  const response = await fetch(apiUrl + '/cart', {
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });

  const cartItems = await response.json();
  const cartList = document.getElementById('cartList');
  cartList.innerHTML = '';

  cartItems.forEach(item => {
    const cartItemElem = document.createElement('div');
    cartItemElem.classList.add('cart-item');
    cartItemElem.innerHTML = `
      <img src="${item.product.imageUrl}" alt="${item.product.name}" />
      <h3>${item.product.name}</h3>
      <p>Price: ${item.product.price}</p>
      <button onclick="removeFromCart(${item._id})">Remove</button>
    `;
    cartList.appendChild(cartItemElem);
  });

  document.getElementById('checkoutBtn').style.display = cartItems.length ? 'inline-block' : 'none';
}

async function removeFromCart(cartItemId) {
  const response = await fetch(apiUrl + '/cart/' + cartItemId, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });

  const data = await response.json();
  if (response.ok) {
    alert('Item removed from cart');
    loadCart();
  } else {
    alert(data.message);
  }
}

function checkAuthStatus() {
  userToken = localStorage.getItem('userToken');
  if (userToken) {
    document.getElementById('logoutBtn').style.display = 'inline-block';
    loadProducts();
    loadCart();
  }
}

function logout() {
  localStorage.removeItem('userToken');
  userToken = null;
  document.getElementById('logoutBtn').style.display = 'none';
  loadProducts();
  loadCart();
}
