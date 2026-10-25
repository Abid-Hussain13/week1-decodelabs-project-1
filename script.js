const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const filterButtons = document.querySelectorAll(".filter-btn");
const products = document.querySelectorAll(".product");
const filterStatus = document.getElementById("filter-status");

const cartBtn = document.querySelector(".cart-btn");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartBtn = document.querySelector(".close-cart");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const toast = document.getElementById("toast");

const cart = {};

navToggle.addEventListener("click", () => {
  const open = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a") && siteNav.classList.contains("is-open")) {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    let visible = 0;

    products.forEach((product) => {
      const match = filter === "all" || product.dataset.category === filter;
      product.classList.toggle("is-hidden", !match);
      if (match) visible += 1;
    });

    filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
    filterStatus.textContent = `Showing ${visible} item${visible === 1 ? "" : "s"}`;
  });
});

function openCart() {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  cartBtn.setAttribute("aria-expanded", "true");
  cartOverlay.hidden = false;
  requestAnimationFrame(() => cartOverlay.classList.add("visible"));
  document.body.classList.add("cart-open");
  closeCartBtn.focus();
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  cartBtn.setAttribute("aria-expanded", "false");
  cartOverlay.classList.remove("visible");
  document.body.classList.remove("cart-open");
  setTimeout(() => {
    cartOverlay.hidden = true;
  }, 250);
}

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartPanel.classList.contains("open")) {
    closeCart();
  }
});

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderCart() {
  const ids = Object.keys(cart);
  const totalQty = ids.reduce((sum, id) => sum + cart[id].qty, 0);
  const totalPrice = ids.reduce((sum, id) => sum + cart[id].qty * cart[id].price, 0);

  cartCount.textContent = totalQty;
  cartCount.classList.remove("bump");
  void cartCount.offsetWidth;
  cartCount.classList.add("bump");

  cartItems.querySelectorAll(".cart-line").forEach((line) => line.remove());
  cartEmpty.style.display = ids.length ? "none" : "block";

  ids.forEach((id) => {
    const item = cart[id];
    const line = document.createElement("div");
    line.className = "cart-line";
    line.innerHTML = `
      <h3>${item.name}</h3>
      <span class="line-price">$${item.qty * item.price}</span>
      <div class="qty">
        <button type="button" data-action="dec" data-id="${id}" aria-label="Decrease quantity">−</button>
        <span>${item.qty}</span>
        <button type="button" data-action="inc" data-id="${id}" aria-label="Increase quantity">+</button>
      </div>
      <button type="button" class="remove-line" data-action="remove" data-id="${id}">Remove</button>
    `;
    cartItems.appendChild(line);
  });

  cartTotal.textContent = `$${totalPrice}`;
  checkoutBtn.disabled = totalQty === 0;
}

document.querySelectorAll(".add-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const product = btn.closest(".product");
    const id = product.dataset.id;

    if (!cart[id]) {
      cart[id] = {
        name: product.dataset.name,
        price: Number(product.dataset.price),
        qty: 0
      };
    }

    cart[id].qty += 1;
    renderCart();
    showToast(`${cart[id].name} added to cart`);

    btn.classList.add("added");
    btn.textContent = "Added ✓";
    setTimeout(() => {
      btn.classList.remove("added");
      btn.textContent = "Add to cart";
    }, 900);
  });
});

cartItems.addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "inc") cart[id].qty += 1;
  if (action === "dec") cart[id].qty -= 1;
  if (action === "remove" || cart[id].qty <= 0) delete cart[id];

  renderCart();
});

checkoutBtn.addEventListener("click", () => {
  showToast("This is a demo — no real checkout here.");
});
