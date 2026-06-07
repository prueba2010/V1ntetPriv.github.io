let orders =
JSON.parse(localStorage.getItem("orders")) || [];

function save() {
    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    render();
}

function createOrder() {

    const name =
        document.getElementById("orderName").value;

    const cost =
        parseFloat(
            document.getElementById("orderCost").value
        );

    if (!name || !cost) {
        alert("Omple tots els camps");
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

function addShirt(orderIndex) {

    const shirtName =
        prompt("Nom de la samarreta:");

    if (!shirtName) return;

    const shirtCost =
        parseFloat(
            prompt("Cost de la samarreta:")
        );

    if (isNaN(shirtCost)) return;

    orders[orderIndex].shirts.push({
        name: shirtName,
        cost: shirtCost,
        sold: false,
        salePrice: 0
    });

    save();
}

function sellShirt(orderIndex, shirtIndex) {

    const price =
        parseFloat(
            prompt("Preu de venda:")
        );

    if (isNaN(price)) return;

    orders[orderIndex]
        .shirts[shirtIndex]
        .sold = true;

    orders[orderIndex]
        .shirts[shirtIndex]
        .salePrice = price;

    save();
}

function deleteShirt(orderIndex, shirtIndex) {

    const confirmDelete =
        confirm(
            "Segur que vols eliminar aquesta samarreta?"
        );

    if (!confirmDelete) return;

    orders[orderIndex]
        .shirts.splice(shirtIndex, 1);

    save();
}

function deleteOrder(orderIndex) {

    const confirmDelete =
        confirm(
            "Segur que vols eliminar aquest pedido?"
        );

    if (!confirmDelete) return;

    orders.splice(orderIndex, 1);

    save();
}

function exportData() {

    const blob =
        new Blob(
            [
                JSON.stringify(
                    orders,
                    null,
                    2
                )
            ],
            {
                type: "application/json"
            }
        );

    const a =
        document.createElement("a");

    a.href =
        URL.createObjectURL(blob);

    a.download =
        "vinted-backup.json";

    a.click();
}

function render() {

    const container =
        document.getElementById("orders");

    container.innerHTML = "";

    let revenue = 0;
    let investment = 0;
    let stock = 0;

    orders.forEach(
        (order, orderIndex) => {

            investment += order.cost;

            let html = `
            <div class="order">

                <h2>${order.name}</h2>

                <p>
                    Cost Temu:
                    ${order.cost.toFixed(2)}€
                </p>

                <button onclick="addShirt(${orderIndex})">
                    ➕ Afegir Samarreta
                </button>

                <button
                    style="background:#e53935;margin-left:10px;"
                    onclick="deleteOrder(${orderIndex})">
                    🗑️ Eliminar Pedido
                </button>
            `;

            order.shirts.forEach(
                (shirt, shirtIndex) => {

                    if (shirt.sold) {
                        revenue += shirt.salePrice;
                    } else {
                        stock++;
                    }

                    const profit =
                        shirt.salePrice - shirt.cost;

                    html += `
                    <div class="shirt">

                        <span>
                            ${shirt.name}
                        </span>

                        <span>
                            Cost:
                            ${shirt.cost.toFixed(2)}€
                        </span>

                        <span>
                            ${
                                shirt.sold
                                ? `✅ Venuda per ${shirt.salePrice.toFixed(2)}€ | Benefici: ${profit.toFixed(2)}€`
                                : "❌ No venuda"
                            }
                        </span>

                        ${
                            !shirt.sold
                            ?
                            `
                            <button
                                onclick="
                                sellShirt(
                                    ${orderIndex},
                                    ${shirtIndex}
                                )">
                                💰 Vendre
                            </button>
                            `
                            :
                            ""
                        }

                        <button
                            style="background:#e53935"
                            onclick="
                            deleteShirt(
                                ${orderIndex},
                                ${shirtIndex}
                            )">
                            🗑️
                        </button>

                    </div>
                    `;
                }
            );

            html += `
            </div>
            `;

            container.innerHTML += html;
        }
    );

    const profit =
        revenue - investment;

    document.getElementById(
        "profit"
    ).innerText =
        profit.toFixed(2) + "€";

    document.getElementById(
        "revenue"
    ).innerText =
        revenue.toFixed(2) + "€";

    document.getElementById(
        "investment"
    ).innerText =
        investment.toFixed(2) + "€";

    document.getElementById(
        "stock"
    ).innerText =
        stock;
}

render();
