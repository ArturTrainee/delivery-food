const cartBtn = document.getElementById('cart-btn'),
    modal = document.querySelector('.modal'),
    closeBtn = document.querySelector('.close'),
    cancelBtn = document.getElementById('cancel-btn');

cartBtn.addEventListener('click', toggleModal);
closeBtn.addEventListener('click', toggleModal);
cancelBtn.addEventListener('click', toggleModal);

function toggleModal() {
    modal.classList.toggle('visible');
}

new WOW().init();