const STORE_KEY = "khabonina_demo_products";
const REQUEST_KEY = "khabonina_demo_requests";
let products = JSON.parse(localStorage.getItem(STORE_KEY) || "null") || [
    { id: "p1", name: "Marquee Tent", category: "Marquees", price: 1200, quantity: 5, status: "Active" },
    { id: "p2", name: "White Chairs", category: "Chairs", price: 15, quantity: 200, status: "Active" },
    { id: "p3", name: "Event Tables", category: "Tables", price: 80, quantity: 35, status: "Active" },
    { id: "p4", name: "Event Accessories", category: "Accessories", price: 100, quantity: 20, status: "Active" }];
let requests = JSON.parse(localStorage.getItem(REQUEST_KEY) || "null") || [
    { id: "REQ-1001", customer: "Sample Customer", date: "2026-11-07", items: "2 marquee tents, 80 chairs", status: "Pending" },
    { id: "REQ-1002", customer: "Example Events", date: "2026-11-14", items: "10 tables, 60 chairs", status: "Confirmed" }];
const money = n => "R" + Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function persist() { localStorage.setItem(STORE_KEY, JSON.stringify(products)); localStorage.setItem(REQUEST_KEY, JSON.stringify(requests)); }
function renderProducts() { document.getElementById("productRows").innerHTML = products.map(p => `<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(p.category)}</td><td>${money(p.price)}</td><td>${p.quantity}</td><td><span class="status confirmed">${p.status}</span></td><td><button class="button small secondary" data-edit="${p.id}">Edit</button> <button class="button small secondary" data-delete="${p.id}">Delete</button></td></tr>`).join(""); document.getElementById("statProducts").textContent = products.length; }
function renderRequests() { document.getElementById("requestRows").innerHTML = requests.map(r => `<tr><td><strong>${esc(r.id)}</strong></td><td>${esc(r.customer)}</td><td>${esc(r.date)}</td><td>${esc(r.items)}</td><td><span class="status ${r.status.toLowerCase()}">${r.status}</span></td><td><select data-status="${r.id}" aria-label="Update request status"><option ${r.status === "Pending" ? "selected" : ""}>Pending</option><option ${r.status === "Confirmed" ? "selected" : ""}>Confirmed</option><option ${r.status === "Declined" ? "selected" : ""}>Declined</option><option ${r.status === "Completed" ? "selected" : ""}>Completed</option><option ${r.status === "Cancelled" ? "selected" : ""}>Cancelled</option></select></td></tr>`).join(""); document.getElementById("statRequests").textContent = requests.filter(r => r.status === "Pending").length; }
const form = document.getElementById("productForm");
document.getElementById("addProductBtn").addEventListener("click", () => { form.reset(); form.dataset.edit = ""; document.getElementById("productFormTitle").textContent = "Add product"; form.classList.remove("hidden"); form.scrollIntoView({ behavior: "smooth", block: "center" }); });
document.getElementById("cancelProductBtn").addEventListener("click", () => form.classList.add("hidden"));
document.getElementById("productRows").addEventListener("click", e => { const edit = e.target.closest("[data-edit]"); const del = e.target.closest("[data-delete]"); if (edit) { const p = products.find(x => x.id === edit.dataset.edit); if (!p) return; form.dataset.edit = p.id; form.elements.name.value = p.name; form.elements.category.value = p.category; form.elements.price.value = p.price; form.elements.quantity.value = p.quantity; document.getElementById("productFormTitle").textContent = "Edit product"; form.classList.remove("hidden"); form.scrollIntoView({ behavior: "smooth", block: "center" }); } if (del) { if (confirm("Delete this demo product?")) { products = products.filter(p => p.id !== del.dataset.delete); persist(); renderProducts(); } } });
form.addEventListener("submit", e => { e.preventDefault(); const data = { name: form.elements.name.value.trim(), category: form.elements.category.value, price: Number(form.elements.price.value), quantity: Number(form.elements.quantity.value), status: "Active" }; if (form.dataset.edit) { products = products.map(p => p.id === form.dataset.edit ? { ...p, ...data } : p); } else { products.push({ id: "p" + Date.now(), ...data }); } persist(); renderProducts(); form.classList.add("hidden"); });
document.getElementById("requestRows").addEventListener("change", e => { const s = e.target.closest("select[data-status]"); if (!s) return; const r = requests.find(x => x.id === s.dataset.status); if (r) { r.status = s.value; persist(); renderRequests(); } });
renderProducts(); renderRequests();

// Example figures, not connected to paid bookings yet.
let demoSales = {
    day: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [900, 1300, 800, 2700, 1900, 3300, 2200], orders: 19 },
    month: { labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], values: [6200, 7800, 5400, 9100, 8700, 10500, 12300, 11000, 13900, 12500, 15700, 16400], orders: 144 },
    year: { labels: ['2022', '2023', '2024', '2025', '2026'], values: [65000, 91000, 116000, 138000, 162000], orders: 580 }
};
function showSales() {
    let d = demoSales[document.getElementById('salesPeriod').value], total = d.values.reduce((a, b) => a + b, 0);
    document.getElementById('salesTotal').textContent = money(total);
    document.getElementById('salesOrders').textContent = d.orders;
    document.getElementById('salesAverage').textContent = money(total / d.orders);
    let max = Math.max(...d.values) * 1.15, left = 48, top = 16, width = 688, height = 162;
    let pts = d.values.map((v, i) => [left + (i * (width / (d.values.length - 1))), top + height - (v / max * height)]);
    let line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    let area = line + ' L ' + pts[pts.length - 1][0] + ' ' + (top + height) + ' L ' + left + ' ' + (top + height) + ' Z';
    let svg = ''; for (let i = 0; i < 4; i++) { let y = top + i * height / 3; svg += `<line class="chart-gridline" x1="${left}" y1="${y}" x2="${left + width}" y2="${y}"/>`; }
    svg += `<path class="chart-area" d="${area}"/><path class="chart-line" d="${line}"/>`;
    pts.forEach((p, i) => { svg += `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#486a7c"><title>${d.labels[i]}: ${money(d.values[i])}</title></circle><text class="chart-label" x="${p[0]}" y="203" text-anchor="middle">${d.labels[i]}</text>`; });
    document.getElementById('salesChart').innerHTML = svg;
}
document.getElementById('salesPeriod').addEventListener('change', showSales); showSales();
