const SUPABASE_URL = "https://peyilmgpseriuyelbsde.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XR7zqZg1a9Ch-0axfdRwaw_ppOhJT65";


const ready = !SUPABASE_URL.startsWith("PASTE_") && !SUPABASE_ANON_KEY.startsWith("PASTE_");
const sb = ready ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const $ = id => document.getElementById(id);
let orders = [];

function money(v){return "₹" + Number(v || 0).toLocaleString("en-IN");}
function esc(s){return String(s ?? "").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function formatDate(s){return new Date(s).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"});}

async function boot(){
  if(!ready){
    $("loginMsg").textContent="First open admin.js and add your Supabase URL + anon key.";
    $("loginBtn").disabled=true;
    return;
  }
  const {data:{session}} = await sb.auth.getSession();
  if(session) showApp(); else showLogin();
  sb.auth.onAuthStateChange((_event, session)=> session ? showApp() : showLogin());
}

function showLogin(){$("loginView").classList.remove("hidden");$("app").classList.add("hidden");}
function showApp(){$("loginView").classList.add("hidden");$("app").classList.remove("hidden");loadOrders();}

$("loginBtn").onclick = async ()=>{
  $("loginMsg").textContent="Logging in...";
  const {error}=await sb.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});
  $("loginMsg").textContent=error ? error.message : "";
};
$("logoutBtn").onclick = ()=>sb.auth.signOut();
$("refreshBtn").onclick = loadOrders;
$("statusFilter").onchange = render;

async function loadOrders(){
  const {data,error}=await sb.from("orders").select("*").order("created_at",{ascending:false});
  if(error){$("orders").innerHTML=`<div class="empty">${esc(error.message)}</div>`;return;}
  const ids=(data||[]).map(o=>o.id);
  let items=[];
  if(ids.length){
    const r=await sb.from("order_items").select("*").in("order_id",ids);
    if(!r.error) items=r.data||[];
  }
  orders=(data||[]).map(o=>({...o,items:items.filter(i=>i.order_id===o.id)}));
  render();
}

function render(){
  const filter=$("statusFilter").value;
  const visible=filter==="all"?orders:orders.filter(o=>o.status===filter);
  $("orders").innerHTML=visible.length ? visible.map(card).join("") : `<div class="empty">No orders found.</div>`;
  updateStats();
  document.querySelectorAll("[data-status]").forEach(sel=>{
    sel.onchange=()=>updateStatus(Number(sel.dataset.id),sel.value);
  });
}

function card(o){
  return `<article class="order">
    <div class="order-head">
      <div><div class="order-id">Order #${o.id}</div><div class="meta">${formatDate(o.created_at)} • ${esc(o.order_type)}</div></div>
      <span class="badge">${esc(o.status)}</span>
    </div>
    <div class="customer"><b>${esc(o.customer_name)}</b> • ${esc(o.customer_phone)}<br>${esc(o.customer_address || "")}${o.table_no?`<br>Table: ${esc(o.table_no)}`:""}${o.notes?`<br>Note: ${esc(o.notes)}`:""}</div>
    <div class="items">${o.items.map(i=>`<div class="item"><span>${esc(i.item_name)} × ${i.quantity}</span><span>${money(i.line_total)}</span></div>`).join("")}</div>
    <div class="total"><span>Total</span><span>${money(o.total)}</span></div>
    <div class="order-actions">
      <select data-status data-id="${o.id}">
        ${["New","Accepted","Preparing","Ready","Completed","Rejected"].map(s=>`<option ${s===o.status?"selected":""}>${s}</option>`).join("")}
      </select>
    </div>
  </article>`;
}

function updateStats(){
  const today=new Date(); today.setHours(0,0,0,0);
  const todayOrders=orders.filter(o=>new Date(o.created_at)>=today && o.status!=="Rejected");
  $("newCount").textContent=orders.filter(o=>o.status==="New").length;
  $("prepCount").textContent=orders.filter(o=>o.status==="Preparing").length;
  $("todayCount").textContent=todayOrders.length;
  $("todaySales").textContent=money(todayOrders.reduce((s,o)=>s+Number(o.total||0),0));
}

async function updateStatus(id,status){
  const {error}=await sb.from("orders").update({status}).eq("id",id);
  if(error) alert(error.message); else {
    const o=orders.find(x=>x.id===id); if(o)o.status=status;
    render();
  }
}

boot();
