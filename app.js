let orders = JSON.parse(localStorage.getItem("gholinoOrders")) || [];

function addOrder() {
    const customerName = document.getElementById("customerName").value.trim();
    const productName = document.getElementById("productName").value.trim();
    const orderPrice = document.getElementById("orderPrice").value.trim();

    if (!customerName || !productName || !orderPrice) {
        alert("لطفاً همه اطلاعات سفارش را وارد کنید.");
        return;
    }

    const order = {
        id: Date.now(),
        customerName,
        productName,
        price: Number(orderPrice),
        status: "در انتظار"
    };

    orders.push(order);
    saveOrders();
    renderOrders();

    document.getElementById("customerName").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("orderPrice").value = "";
}

function deleteOrder(id) {
    orders = orders.filter(order => order.id !== id);
    saveOrders();
    renderOrders();
}

function changeStatus(id) {
    const order = orders.find(order => order.id === id);

    if (!order) return;

    const statuses = ["در انتظار", "در حال پردازش", "ارسال شد", "تکمیل شد"];
    const currentIndex = statuses.indexOf(order.status);

    order.status = statuses[(currentIndex + 1) % statuses.length];

    saveOrders();
    renderOrders();
}

function saveOrders() {
    localStorage.setItem("gholinoOrders", JSON.stringify(orders));
}

function renderOrders() {
    const ordersList = document.getElementById("ordersList");

    if (!ordersList) return;

    if (orders.length === 0) {
        ordersList.innerHTML = "<p>هنوز سفارشی ثبت نشده است.</p>";
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <h3>📦 ${order.productName}</h3>
            <p>👤 مشتری: ${order.customerName}</p>
            <p>💰 مبلغ: ${order.price.toLocaleString("fa-IR")} تومان</p>
            <p>📌 وضعیت: <strong>${order.status}</strong></p>

            <button onclick="changeStatus(${order.id})">
                تغییر وضعیت
            </button>

            <button onclick="deleteOrder(${order.id})">
                حذف سفارش
            </button>
        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", renderOrders);
