"use strict";

/*
  GHOLINO
  Simple local business management app
  Data is stored in localStorage.
*/

const STORAGE_KEY = "gholinoOrders";


function getOrders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];

  } catch (error) {
    console.error("خطا در خواندن سفارش‌ها:", error);
    return [];
  }
}


function saveOrders(orders) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(orders)
  );
}


function formatPrice(price) {
  const number = Number(price) || 0;

  return number.toLocaleString("fa-IR") + " تومان";
}


function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function showMessage(message) {

  const oldToast = document.querySelector(".toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");

  toast.className = "toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}


/* =========================
   ADD ORDER
========================= */

function addOrder(event) {

  if (event) {
    event.preventDefault();
  }

  const customerInput =
    document.getElementById("customerName");

  const productInput =
    document.getElementById("productName");

  const priceInput =
    document.getElementById("orderPrice");


  if (
    !customerInput ||
    !productInput ||
    !priceInput
  ) {
    return;
  }


  const customerName =
    customerInput.value.trim();

  const productName =
    productInput.value.trim();

  const orderPrice =
    Number(priceInput.value);


  if (!customerName) {
    showMessage("نام مشتری را وارد کنید.");
    customerInput.focus();
    return;
  }


  if (!productName) {
    showMessage("نام محصول را وارد کنید.");
    productInput.focus();
    return;
  }


  if (
    !Number.isFinite(orderPrice) ||
    orderPrice <= 0
  ) {
    showMessage("مبلغ سفارش را درست وارد کنید.");
    priceInput.focus();
    return;
  }


  const orders = getOrders();


  const order = {
    id: Date.now(),
    customerName,
    productName,
    price: orderPrice,
    status: "در انتظار",
    createdAt: new Date().toISOString()
  };


  orders.unshift(order);

  saveOrders(orders);


  customerInput.value = "";
  productInput.value = "";
  priceInput.value = "";


  renderOrders();
  renderDashboardOrders();
  updateDashboardStats();


  showMessage("سفارش با موفقیت ثبت شد. ✓");
}


/* =========================
   CHANGE STATUS
========================= */

function changeStatus(id) {

  const orders = getOrders();

  const order = orders.find(
    item => item.id === id
  );


  if (!order) {
    return;
  }


  const statuses = [
    "در انتظار",
    "در حال پردازش",
    "ارسال شد",
    "تکمیل شد"
  ];


  const currentIndex =
    statuses.indexOf(order.status);


  const nextIndex =
    currentIndex === -1
      ? 0
      : (currentIndex + 1) % statuses.length;


  order.status =
    statuses[nextIndex];


  saveOrders(orders);


  renderOrders();
  renderDashboardOrders();
  updateDashboardStats();


  showMessage(
    `وضعیت سفارش به «${order.status}» تغییر کرد.`
  );
}


/* =========================
   DELETE ORDER
========================= */

function deleteOrder(id) {

  const orders = getOrders();

  const filtered =
    orders.filter(
      order => order.id !== id
    );


  saveOrders(filtered);


  renderOrders();
  renderDashboardOrders();
  updateDashboardStats();


  showMessage("سفارش حذف شد.");
}


/* =========================
   INDEX ORDERS
========================= */

function renderOrders() {

  const list =
    document.getElementById("ordersList");


  if (!list) {
    return;
  }


  const orders = getOrders();


  if (orders.length === 0) {

    list.innerHTML = `
      <div class="empty-orders">
        هنوز سفارشی ثبت نشده است.
        اولین سفارش خود را از فرم بالا ثبت کنید.
      </div>
    `;

    return;
  }


  list.innerHTML =
    orders.map(order => {

      return `
        <article class="order-card">

          <div class="order-info">

            <h3>
              📦 ${escapeHTML(order.productName)}
            </h3>

            <p>
              👤 مشتری:
              ${escapeHTML(order.customerName)}
            </p>

            <p>
              💰 مبلغ:
              ${formatPrice(order.price)}
            </p>

            <p>
              📌 وضعیت:
              <strong>${escapeHTML(order.status)}</strong>
            </p>

          </div>


          <div class="order-actions">

            <button
              type="button"
              class="order-action"
              onclick="changeStatus(${order.id})"
            >
              تغییر وضعیت
            </button>

            <button
              type="button"
              class="order-action delete"
              onclick="deleteOrder(${order.id})"
            >
              حذف
            </button>

          </div>

        </article>
      `;

    }).join("");
}


/* =========================
   DASHBOARD ORDERS
========================= */

function renderDashboardOrders() {

  const list =
    document.getElementById(
      "dashboardOrders"
    );


  if (!list) {
    return;
  }


  const orders = getOrders();


  if (orders.length === 0) {

    list.innerHTML = `
      <div class="empty-orders">
        هنوز سفارشی ثبت نشده است.
        <br>
        از صفحه اصلی اولین سفارش را ثبت کنید.
      </div>
    `;

    return;
  }


  list.innerHTML =
    orders.map(order => {

      return `
        <article class="dashboard-order">

          <div>

            <h3>
              📦 ${escapeHTML(order.productName)}
            </h3>

            <p>
              مشتری:
              ${escapeHTML(order.customerName)}
            </p>

            <p>
              مبلغ:
              ${formatPrice(order.price)}
            </p>

          </div>


          <div>

            <span class="status">
              ${escapeHTML(order.status)}
            </span>

            <div
              style="
                margin-top:10px;
                display:flex;
                gap:7px;
                flex-wrap:wrap;
              "
            >

              <button
                type="button"
                class="order-action"
                onclick="changeStatus(${order.id})"
              >
                تغییر وضعیت
              </button>

              <button
                type="button"
                class="order-action delete"
                onclick="deleteOrder(${order.id})"
              >
                حذف
              </button>

            </div>

          </div>

        </article>
      `;

    }).join("");
}


/* =========================
   DASHBOARD STATS
========================= */

function updateDashboardStats() {

  const countElement =
    document.getElementById(
      "ordersCount"
    );


  if (!countElement) {
    return;
  }


  const orders = getOrders();


  countElement.textContent =
    orders.length.toLocaleString("fa-IR");


  const salesElement =
    document.getElementById(
      "todaySales"
    );


  if (salesElement) {

    const total =
      orders.reduce(
        (sum, order) =>
          sum + Number(order.price || 0),
        0
      );


    if (total > 0) {

      salesElement.textContent =
        total.toLocaleString("fa-IR");

    } else {

      salesElement.textContent =
        "۱۲٫۵M";
    }
  }
}


/* =========================
   ASSISTANT
========================= */

function openAssistant() {

  showMessage(
    "دستیار هوشمند آماده است. اتصال سرویس هوش مصنوعی در مرحله بعد اضافه می‌شود."
  );
}


/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const orderForm =
      document.getElementById(
        "orderForm"
      );


    if (orderForm) {

      orderForm.addEventListener(
        "submit",
        addOrder
      );
    }
const STORE_KEY = "gholinoStore";


function saveStore(event) {

  event.preventDefault();

  const storeName =
    document.getElementById("storeName")?.value.trim();

  const ownerName =
    document.getElementById("ownerName")?.value.trim();

  const phone =
    document.getElementById("phone")?.value.trim();

  const storeType =
    document.getElementById("storeType")?.value;

  const storeAddress =
    document.getElementById("storeAddress")?.value.trim();


  if (!storeName) {
    showMessage("نام فروشگاه را وارد کنید.");
    return;
  }

  if (!ownerName) {
    showMessage("نام مدیر فروشگاه را وارد کنید.");
    return;
  }

  if (!phone) {
    showMessage("شماره تماس را وارد کنید.");
    return;
  }

  if (!storeType) {
    showMessage("نوع کسب‌وکار را انتخاب کنید.");
    return;
  }


  const store = {
    id: Date.now(),
    storeName,
    ownerName,
    phone,
    storeType,
    storeAddress,
    createdAt: new Date().toISOString()
  };


  localStorage.setItem(
    STORE_KEY,
    JSON.stringify(store)
  );


  showMessage(
    "اطلاعات فروشگاه با موفقیت ثبت شد. ✓"
  );


  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
}

    renderOrders();
    renderDashboardOrders();
    updateDashboardStats();

  }
);
