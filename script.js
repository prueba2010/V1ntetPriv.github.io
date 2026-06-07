let orders =
JSON.parse(localStorage.getItem("orders")) || [];

function save() {
localStorage.setItem(
"orders",
JSON.stringify(orders)
);

render();
}

function createOrder(){

const name =
document.getElementById("orderName").value;

const cost =
parseFloat(
document.getElementById("orderCost").value
);

if(!name || !cost) return;

orders.push({
name,
cost,
shirts:[]
});

save();
}

function addShirt(index){

const shirtName =
prompt("Nom samarreta:");

if(!shirtName) return;

const shirtCost =
orders[index].cost / 4;

orders[index].shirts.push({
name:shirtName,
cost:shirtCost,
sold:false,
salePrice:0
});

save();
}

function sellShirt(orderIndex, shirtIndex){

const price =
parseFloat(
prompt("Preu venda:")
);

if(!price) return;

orders[orderIndex]
.shirts[shirtIndex]
.sold = true;

orders[orderIndex]
.shirts[shirtIndex]
.salePrice = price;

save();
}

function render(){

const container =
document.getElementById("orders");

container.innerHTML="";

let revenue=0;
let investment=0;
let stock=0;

orders.forEach((order,orderIndex)=>{

investment += order.cost;

let html = `
<div class="order">

<h2>${order.name}</h2>

<p>
Cost Temu:
${order.cost.toFixed(2)}€
</p>

<button onclick="
addShirt(${orderIndex})
">
➕ Afegir Samarreta
</button>
`;

order.shirts.forEach(
(shirt,shirtIndex)=>{

if(shirt.sold){
revenue += shirt.salePrice;
}else{
stock++;
}

html += `
<div class="shirt">

<span>
${shirt.name}
</span>

<span>
${shirt.sold
? "✅ "+shirt.salePrice+"€"
: "❌ No venuda"}
</span>

${
!shirt.sold
?
`<button onclick="
sellShirt(
${orderIndex},
${shirtIndex}
)">
Vendre
</button>`
:
""
}

</div>
`;
});

html += "</div>";

container.innerHTML += html;

});

const profit =
revenue - investment;

document.getElementById(
"profit"
).innerText =
profit.toFixed(2)+"€";

document.getElementById(
"revenue"
).innerText =
revenue.toFixed(2)+"€";

document.getElementById(
"investment"
).innerText =
investment.toFixed(2)+"€";

document.getElementById(
"stock"
).innerText =
stock;
}

function exportData(){

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
type:"application/json"
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

render();
