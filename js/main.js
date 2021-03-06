'use strict';

const cartBtn = document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.close');
const authBtn = document.querySelector('.button-auth');
const closeAuthBtn = document.querySelector('.close-auth');
const modalAuth = document.querySelector('.modal-auth');
const logInForm = document.querySelector('#logInForm');
const logInInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const logOutBtn = document.querySelector('.button-out');
const restaurantsCards = document.querySelector('.cards-restaurants');
const promoContainer = document.querySelector('.container-promo');
const restaurantsSection = document.querySelector('.restaurants');
const menuSection = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const cartModalBody = document.querySelector('.modal-body');
const cartModalPrice = document.querySelector('.modal-pricetag');
const clearCartBtn = document.querySelector('.clear-cart');

const cart = [];

let login = localStorage.getItem('deliveryFoodUser');

const getData = async function (url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error for url: ${url}, error status: ${response.status}`);
    }
    return await response.json();
};

function toggleModal() {
    modal.classList.toggle('is-open');
}

function toggleModalAuth() {
    modalAuth.classList.toggle('is-open');
}

function returnMainContent() {
    promoContainer.classList.remove('hide');
    restaurantsSection.classList.remove('hide');
    menuSection.classList.add('hide');
}

const validate = function (str) {
    const nameRegex = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
    return nameRegex.test(str);
};

function logIn(event) {
    event.preventDefault();
    login = logInInput.value;

    if (validate(login)) {
        localStorage.setItem('deliveryFoodUser', login);
        toggleModalAuth();
        authBtn.removeEventListener('click', toggleModalAuth);
        closeAuthBtn.removeEventListener('click', toggleModalAuth);
        logInForm.removeEventListener('submit', logIn);
        logInForm.reset();

        checkAuth();
    } else {
        logInInput.style.borderColor = 'red';
        logInInput.value = '';
        logInInput.placeholder = 'Invalid login entered';
    }
}

function logOut() {
    login = null;
    localStorage.removeItem('deliveryFoodUser');

    authBtn.style.display = '';
    userName.style.display = '';
    logOutBtn.style.display = '';
    logOutBtn.style.display = '';

    logOutBtn.removeEventListener('click', logOut);

    checkAuth();
    returnMainContent();
}

function authorized() {
    userName.textContent = login;

    authBtn.style.display = 'none';
    userName.style.display = 'inline';
    logOutBtn.style.display = 'flex';
    cartBtn.style.display = 'flex';
    logOutBtn.addEventListener('click', logOut);
}

function notAuthorized() {
    authBtn.addEventListener('click', toggleModalAuth);
    closeAuthBtn.addEventListener('click', toggleModalAuth);
    logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
    if (login) {
        authorized();
    } else {
        notAuthorized();
    }
}

function createRestaurantCard({ image, kitchen, name, price, products, stars,
    time_of_delivery: timeOfDelivery }) {

    const card = `
        <a class="card card-restaurant"
        data-products="${products}"
        data-info="${[name, price, stars, kitchen]}">
            <img src="${image}" alt="image" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${timeOfDelivery} минут</span>
                </div>
                <div class="card-info">
                <div class="rating">${stars}</div>
                <div class="price">От ${price} ₽</div>
                <div class="category">${kitchen}</div>
                </div>
            </div>
        </a>
    `;
    restaurantsCards.insertAdjacentHTML('beforeend', card);
}

function createGoodCard({ description, id, image, name, price }) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = id;

    card.insertAdjacentHTML('beforeend', `
        <img src="${image}" alt="${name}" class="card-image"/>
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title card-title-reg">${name}</h3>
            </div>
            <div class="card-info">
            <div class="ingredients">${description}</div>
            </div>
            <div class="card-buttons">
                <button class="button button-primary button-add-cart" id="${id}">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                </button>
                <strong class="card-price card-price-bold">${price} ₽</strong>
            </div>
        </div>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);
}

function showGoods(event) {
    const target = event.target;

    if (login) {
        const restaurant = target.closest('.card-restaurant');

        if (restaurant) {
            const info = restaurant.dataset.info;
            const [name, price, stars, kitchen] = info.split(',');

            cardsMenu.textContent = '';
            promoContainer.classList.add('hide');
            restaurantsSection.classList.add('hide');
            menuSection.classList.remove('hide');

            restaurantTitle.textContent = name;
            rating.textContent = stars;
            minPrice.textContent = `От ${price} P`;
            category.textContent = kitchen;

            getData(`./db/${restaurant.dataset.products}`).then(function (data) {
                data.forEach(createGoodCard);
            });
        }
    } else {
        toggleModalAuth();
    }
}

function addItemToCart(event) {
    const target = event.target;
    const addToCartBtn = target.closest('.button-add-cart');

    if (addToCartBtn) {
        const goodCard = target.closest('.card');
        const title = goodCard.querySelector('.card-title-reg').textContent;
        const price = parseFloat(goodCard.querySelector('.card-price').textContent);
        const id = addToCartBtn.id;

        const goodInCart = cart.find(function (item) {
            return item.id === id;
        });

        if (goodInCart) {
            goodInCart.count++;
        } else {
            cart.push({
                id,
                title,
                price,
                count: 1
            });
        }
    }
}

function renderCart() {
    cartModalBody.textContent = '';

    cart.forEach(function ({ id, title, price, count }) {
        const cartItem = `
            <div class="food-row">
				<span class="food-name">${title}</span>
				<strong class="food-price">${price} ₽</strong>
				<div class="food-counter">
					<button class="counter-button counter-minus" data-id=${id}>-</button>
					<span class="counter">${count}</span>
					<button class="counter-button counter-plus" data-id=${id}>+</button>
				</div>
			</div>
        `;

        cartModalBody.insertAdjacentHTML('afterbegin', cartItem);
    });

    const totalPrice = cart.reduce(function (total, item) {
        return (total + parseFloat(item.price) * item.count);
    }, 0);

    cartModalPrice.textContent = `${totalPrice} ₽`;
}

function changeGoodInCartCount(event) {
    const target = event.target;

    if (target.classList.contains('counter-button')) {
        const good = cart.find(function (item) {
            return item.id === target.dataset.id;
        });
        if (target.classList.contains('counter-plus')) good.count++;
        if (target.classList.contains('counter-minus')) {
            good.count--;
            if (good.count === 0) {
                cart.splice(cart.indexOf(good), 1);
            }
        }
        renderCart();
    }
}

function init() {
    getData('./db/partners.json').then(function (data) {
        data.forEach(createRestaurantCard);
    });

    cartBtn.addEventListener('click', function () {
        renderCart();
        toggleModal();
    });

    clearCartBtn.addEventListener('click', function () {
        cart.length = 0;
        toggleModal();
    });

    cartModalBody.addEventListener('click', changeGoodInCartCount);

    cardsMenu.addEventListener('click', addItemToCart);

    closeBtn.addEventListener('click', toggleModal);

    restaurantsCards.addEventListener('click', showGoods);

    logo.addEventListener('click', returnMainContent);

    checkAuth();

    new Swiper('.swiper-container', {
        loop: true,
        sliderPerView: 1,
        autoplay: {
            delay: 3000
        }
    });
}

init();