'use strict';

const cartButton = document.querySelector('#cart-button');
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

let login = localStorage.getItem('deliveryFoodUser');

const getData = async function(url) {
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

function authorized() {

    function logOut() {
        login = null;
        localStorage.removeItem('deliveryFoodUser');

        authBtn.style.display = '';
        userName.style.display = '';
        logOutBtn.style.display = '';

        logOutBtn.removeEventListener('click', logOut);

        checkAuth();
    }

    userName.textContent = login;

    authBtn.style.display = 'none';
    userName.style.display = 'inline';
    logOutBtn.style.display = 'block';
    logOutBtn.addEventListener('click', logOut);
}

function notAuthorized() {

    function logIn(event) {
        event.preventDefault();
        login = logInInput.value;

        if (login.trim() === '') {
            logInInput.style.borderColor = 'red';
            logInInput.placeholder = 'Invalid login entered';
            return;
        }
        localStorage.setItem('deliveryFoodUser', login);
        toggleModalAuth();
        authBtn.removeEventListener('click', toggleModalAuth);
        closeAuthBtn.removeEventListener('click', toggleModalAuth);
        logInForm.removeEventListener('submit', logIn);
        logInForm.reset();

        checkAuth();
    }

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

function createRestaurantCard(restaurant) {
    const { image, kitchen, name, price, products, stars, 
        time_of_delivery: timeOfDelivery
    } = restaurant;

    const card = `
        <a class="card card-restaurant" data-products="${products}">
            <img src="${image}" alt="image" class="card-image"/>
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${timeOfDelivery}</span>
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

function createGoodCard(goods) {
    const { description, id, image, name, price } = goods;

    const card = document.createElement('div');
    card.className = 'card';

    card.insertAdjacentHTML('beforeend', `
        <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title card-title-reg">${name}</h3>
            </div>
            <div class="card-info">
            <div class="ingredients">${description}</div>
            </div>
            <div class="card-buttons">
                <button class="button button-primary button-add-cart">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                </button>
                <strong class="card-price-bold">${price} ₽</strong>
            </div>
        </div>
    `);

    cardsMenu.insertAdjacentElement('beforeend' ,card);
}

function showGoods(event) {
    const target = event.target;

    if (login) {
        const restaurant = target.closest('.card-restaurant');

        if (restaurant) {
            cardsMenu.textContent = '';
            promoContainer.classList.add('hide');
            restaurantsSection.classList.add('hide');
            menuSection.classList.remove('hide');
            getData(`./db/${restaurant.dataset.products}`).then(function(data) {
                data.forEach(createGoodCard);
            });
        }
    } else {
        toggleModalAuth();
    }
}

function init() {
    getData('./db/partners.json').then(function(data) {
        data.forEach(createRestaurantCard);
    });

    cartButton.addEventListener('click', toggleModal);

    closeBtn.addEventListener('click', toggleModal);

    restaurantsCards.addEventListener('click', showGoods);

    logo.addEventListener('click', returnMainContent);

    checkAuth();

    new Swiper('.swiper-container', {
        loop: true,
        sliderPerView: 1,
        autoplay: true
    });
}

init();