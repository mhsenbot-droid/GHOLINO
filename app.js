console.log("GHOLINO is ready.");
function addOrder() {
  const customerName = document.getElementById("customerName").value.trim();
  const productName = document.getElementById("productName").value.trim();
  const orderPrice = document.getElementById("orderPrice").value;
  if (!customerName || !productName || !orderPrice) {
    alert("لطفاً همه اطلاعات سفارش را وارد کنید.");
    return;
  }
  const ordersList = document.getElementById("ordersList");
  const order = document.createElement("div");
  order.className = "order-item";
  order.innerHTML = `
    <strong>${customerName}</strong>
    <span>${productName}</span>
    <span>${Number(orderPrice).toLocaleString()} تومان</span>
    <button onclick="this.parentElement.remove()">حذف</button>
  `;
  ordersList.appendChild(order);
  document.getElementById("customerName").value = "";
  document.getElementById("productName").value = "";
  document.getElementById("orderPrice").value = "";
}
