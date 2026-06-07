let orders = JSON.parse(localStorage.getItem("orders")) || [];

/* =======================
        SAVE DATA
======================= */
function save() {
    localStorage.setItem("orders", JSON.stringify(orders));
    render();
}

/* =======================
        CREATE ORDER
======================= */
function createOrder() {

    const name = document.getElementById("orderName").value;
    const cost = parseFloat(document.getElementById("orderCost").value);

    if (!name || isNaN(cost)) {
        alert("Omple correctament el pedido");
        return;
    }

    orders.push({
        name,
        cost,
        shirts: []
    });

    document.getElementById("orderName").value = "";
    document.getElementById("orderCost").value = "";

    save();
}

/* =======================
        ADD PRODUCT
======================= */
function addShirt(orderIndex) {

    const type = prompt("Tipus (samarreta / pantalons):");
    if (!type) return;

    const name = prompt("Nom de la peça:");
    if (!name) return;

    const color = prompt("Color:");
    if (!color) return;

    const cost = parseFloat(prompt("Cost de compra:"));
    if (isNaN(cost)) return;

    orders[orderIndex].shirts.push({
        type: type.toLowerCase(),
        name,
        color: color.toLowerCase(),
        cost,
        sold: false,
        salePrice: 0
    });

    save();
}

/* =======================
        SELL PRODUCT
======================= */
function sellShirt(orderIndex, shirtIndex) {

    const price = parseFloat(prompt("Preu de venda:"));
    if (isNaN(price)) return;

    orders[orderIndex].shirts[shirtIndex].sold = true;
    orders[orderIndex].shirts[shirtIndex].salePrice = price;

    save();
}

/* =======================
        DELETE PRODUCT
======================= */
function deleteShirt(orderIndex, shirtIndex) {

    if (!confirm("Eliminar aquesta peça?")) return;

    orders[orderIndex].shirts.splice(shirtIndex, 1);
    save();
}

/* =======================
        DELETE ORDER
======================= */
function deleteOrder(orderIndex) {

    if (!confirm("Eliminar aquest pedido?")) return;

    orders.splice(orderIndex, 1);
    save();
}

/* =======================
        EXPORT DATA
======================= */
function exportData() {

    const blob = new Blob(
        [JSON.stringify(orders, null, 2)],
        { type: "application/json" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "vinted-backup.json";
    a.click();
}

/* =======================
        RENDER UI
======================= */
function render() {

    const container = document.getElementById("orders");
    container.innerHTML = "";

    let revenue = 0;
    let investment = 0;
    let stock = 0;

    orders.forEach((order, orderIndex) => {

        investment += order.cost;

        let html = `
        <div class="order">

            <h2>${order.name}</h2>

            <p>Cost pedido: ${order.cost.toFixed(2)}€</p>

            <button onclick="addShirt(${orderIndex})">➕ Afegir peça</button>

            <button style="background:red;margin-left:10px"
                onclick="deleteOrder(${orderIndex})">
                🗑️ Eliminar pedido
            </button>
        `;

        order.shirts.forEach((s, shirtIndex) => {

            if (s.sold) {
                revenue += s.salePrice;
            } else {
                stock++;
            }

            const profit = s.salePrice - s.cost;

            html += `
            <div class="shirt">

                <span>
                    ${s.type === "pantalons" ? "👖" : "👕"} ${s.name}
                </span>

                <span>🎨 ${s.color}</span>

                <span>Cost: ${s.cost.toFixed(2)}€</span>

                <span>
                    ${
                        s.sold
                        ? `✅ ${s.salePrice.toFixed(2)}€ | 💰 ${profit.toFixed(2)}€`
                        : "❌ No venuda"
                    }
                </span>

                ${
                    !s.sold
                    ? `<button onclick="sellShirt(${orderIndex},${shirtIndex})">💰 Vendre</button>`
                    : ""
                }

                <button style="background:red"
                    onclick="deleteShirt(${orderIndex},${shirtIndex})">
                    🗑️
                </button>

            </div>
            `;
        });

        html += `</div>`;
        container.innerHTML += html;
    });

    document.getElementById("profit").innerText =
        (revenue - investment).toFixed(2) + "€";

    document.getElementById("revenue").innerText =
        revenue.toFixed(2) + "€";

    document.getElementById("investment").innerText =
        investment.toFixed(2) + "€";

    document.getElementById("stock").innerText =
        stock;

    updateCharts();
}

/* =======================
        CHARTS
======================= */
function updateCharts() {

    let shirts = 0;
    let pants = 0;

    let colorCount = {};
    let colorProfit = {};

    orders.forEach(o => {
        o.shirts.forEach(s => {

            if (s.type === "pantalons") pants++;
            else shirts++;

            colorCount[s.color] = (colorCount[s.color] || 0) + 1;

            const profit = (s.salePrice || 0) - s.cost;
            colorProfit[s.color] = (colorProfit[s.color] || 0) + profit;
        });
    });

    new Chart(document.getElementById("typeChart"), {
        type: "pie",
        data: {
            labels: ["Samarretes", "Pantalons"],
            datasets: [{
                data: [shirts, pants]
            }]
        }
    });

    new Chart(document.getElementById("colorChart"), {
        type: "bar",
        data: {
            labels: Object.keys(colorProfit),
            datasets: [{
                label: "Benefici per color (€)",
                data: Object.values(colorProfit)
            }]
        }
    });
}

render();
