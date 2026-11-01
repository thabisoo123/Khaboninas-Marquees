let cart = JSON.parse(localStorage.getItem('khabonina_demo_cart_v2') || '[]');
const $ = id => document.getElementById(id);
function safe(t) { return String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function save() { localStorage.setItem('khabonina_demo_cart_v2', JSON.stringify(cart)); drawCart(); }
function drawCart() {
    $('cartCount').textContent = cart.reduce((n, x) => n + x.qty, 0);
    $('cartItems').innerHTML = cart.length ? cart.map(x => `<div class="cart-item"><div><strong>${safe(x.name)}</strong><small>Quantity: ${x.qty}</small></div><div class="qty-controls"><button data-id="${x.id}" data-do="minus">−</button><button data-id="${x.id}" data-do="plus">+</button><button data-id="${x.id}" data-do="remove">Remove</button></div></div>`).join('') : '<p class="empty">Your request is empty. Add a few items from the collection above.</p>';
}
document.querySelectorAll('.add-cart').forEach(btn => btn.onclick = () => { let item = cart.find(x => x.id === btn.dataset.id); if (item) item.qty++; else cart.push({ id: btn.dataset.id, name: btn.dataset.name, qty: 1 }); save(); });
$('cartItems').onclick = e => { let b = e.target.closest('button[data-do]'); if (!b) return; let item = cart.find(x => x.id === b.dataset.id); if (!item) return; if (b.dataset.do === 'plus') item.qty++; if (b.dataset.do === 'minus') item.qty--; if (b.dataset.do === 'remove' || item.qty < 1) cart = cart.filter(x => x.id !== b.dataset.id); save(); };
let cat = 'All';
function filter() { let search = $('searchInput').value.toLowerCase(); document.querySelectorAll('.product-card').forEach(x => x.hidden = !(cat === 'All' || x.dataset.category === cat) || !x.dataset.name.toLowerCase().includes(search)); }
$('filters').onclick = e => { let b = e.target.closest('[data-category]'); if (!b) return; cat = b.dataset.category; document.querySelectorAll('.filter').forEach(x => x.classList.toggle('active', x === b)); filter(); };
$('searchInput').oninput = filter;
function menu(open) { $('mainNav').classList.toggle('open', open); $('menuShade').hidden = !open; $('menuToggle').setAttribute('aria-expanded', String(open)); }
$('menuToggle').onclick = () => menu(!$('mainNav').classList.contains('open'));
$('closeMenu').onclick = () => menu(false); $('menuShade').onclick = () => menu(false);
document.querySelectorAll('#mainNav a').forEach(a => a.onclick = () => menu(false));
$('requestForm').onsubmit = e => {
    e.preventDefault(); let msg = $('formMessage'); if (!cart.length) { msg.textContent = 'Add an item before sending your enquiry.'; return; }
    let f = new FormData(e.target); if (f.get('returnDate') < f.get('hireDate')) { msg.textContent = 'The return date cannot be before the event date.'; return; }
    let details = { name: f.get('name'), email: f.get('email'), phone: f.get('phone'), location: f.get('location'), hireDate: f.get('hireDate'), returnDate: f.get('returnDate'), notes: f.get('notes'), inspection: $('inspectionWanted').checked, items: cart };
    localStorage.setItem('khabonina_last_enquiry', JSON.stringify(details));
    msg.textContent = 'Your enquiry has been prepared and saved in this browser only. This demonstration does not send it to the business. A site inspection fee, if requested, will depend on distance.';
    cart = []; save(); e.target.reset(); $('inspectionWanted').checked = false;
};
$('year').textContent = new Date().getFullYear(); drawCart();
