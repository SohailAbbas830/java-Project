const API_BASE = '/api';

async function loadServices() {
  try {
    const res = await fetch(API_BASE + '/services');
    const data = await res.json();
    const servicesDiv = document.getElementById('services');
    const servicesList = document.getElementById('services-list');
    [servicesDiv, servicesList].forEach(el => { if (el) el.innerHTML = ''; });
    data.services.forEach(s => {
      const card = `<div class="col-md-4"><div class="card mb-3"><div class="card-body"><h5>${s.title}</h5><p>${s.description}</p></div></div></div>`;
      if (servicesDiv) servicesDiv.insertAdjacentHTML('beforeend', card);
      if (servicesList) servicesList.insertAdjacentHTML('beforeend', `<div class="col-md-4"><div class="card mb-3"><div class="card-body"><h5>${s.title}</h5><p>${s.description}</p></div></div></div>`);
      const sel = document.getElementById('serviceSelect');
      if (sel) sel.insertAdjacentHTML('beforeend', `<option value="${s.id}">${s.title}</option>`);
    });
  } catch (e) { console.error(e); }
}

async function submitBooking(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const res = await fetch(API_BASE + '/appointments', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
  const json = await res.json();
  const msg = document.getElementById('bookingMsg');
  if (json.error) msg.innerHTML = `<div class="alert alert-danger">${json.error}</div>`;
  else msg.innerHTML = `<div class="alert alert-success">Appointment requested (ID: ${json.appointmentId}).</div>`;
  form.reset();
}

async function signupSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const res = await fetch(API_BASE + '/auth/signup', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
  const json = await res.json();
  const msg = document.getElementById('signupMsg');
  if (json.error) msg.innerHTML = `<div class="alert alert-danger">${json.error}</div>`;
  else { localStorage.setItem('token', json.token); msg.innerHTML = `<div class="alert alert-success">Signed up</div>`; window.location='dashboard_patient.html'; }
}

async function loginSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const res = await fetch(API_BASE + '/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
  const json = await res.json();
  const msg = document.getElementById('loginMsg');
  if (json.error) msg.innerHTML = `<div class="alert alert-danger">${json.error}</div>`;
  else { localStorage.setItem('token', json.token); msg.innerHTML = `<div class="alert alert-success">Logged in</div>`; window.location='dashboard_patient.html'; }
}

async function loadPatientAppointments() {
  const token = localStorage.getItem('token');
  if (!token) { document.getElementById('patientAppointments').innerHTML = '<p>Please login first.</p>'; return; }
  const res = await fetch(API_BASE + '/appointments', {headers:{'Authorization':'Bearer ' + token}});
  const json = await res.json();
  const el = document.getElementById('patientAppointments');
  if (json.error) { el.innerHTML = '<div class="alert alert-danger">'+json.error+'</div>'; return; }
  el.innerHTML = '<h3>Your Appointments</h3>';
  json.appointments.forEach(a => {
    el.insertAdjacentHTML('beforeend', `<div class="card mb-2"><div class="card-body"><strong>${a.name}</strong> ${a.date} ${a.time} — <em>${a.service||''}</em> <span class="badge bg-secondary">${a.status}</span></div></div>`);
  });
}

async function loadAdminAppointments() {
  const token = localStorage.getItem('token');
  if (!token) { document.getElementById('adminAppointments').innerHTML = '<p>Please login first.</p>'; return; }
  const res = await fetch(API_BASE + '/appointments', {headers:{'Authorization':'Bearer ' + token}});
  const json = await res.json();
  const el = document.getElementById('adminAppointments');
  if (json.error) { el.innerHTML = '<div class="alert alert-danger">'+json.error+'</div>'; return; }
  el.innerHTML = '<h3>All Appointments</h3>';
  json.appointments.forEach(a => {
    el.insertAdjacentHTML('beforeend', `<div class="card mb-2"><div class="card-body"><strong>${a.name}</strong> ${a.date} ${a.time} — <em>${a.service||''}</em> <span class="badge bg-secondary">${a.status}</span> ${a.status==='pending'? `<button class="btn btn-sm btn-success ms-2" onclick="approve(${a.id})">Approve</button>`: ''}</div></div>`);
  });
}

async function approve(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(API_BASE + '/appointments/' + id + '/approve', {method:'PUT', headers:{'Authorization':'Bearer ' + token}});
  const json = await res.json();
  if (json.status==='ok') { alert('Approved'); loadAdminAppointments(); }
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadServices();
  const bookingForm = document.getElementById('bookingForm'); if (bookingForm) bookingForm.addEventListener('submit', submitBooking);
  const signupForm = document.getElementById('signupForm'); if (signupForm) signupForm.addEventListener('submit', signupSubmit);
  const loginForm = document.getElementById('loginForm'); if (loginForm) loginForm.addEventListener('submit', loginSubmit);
  if (document.getElementById('patientAppointments')) loadPatientAppointments();
  if (document.getElementById('adminAppointments')) loadAdminAppointments();
  const contactForm = document.getElementById('contactForm'); if (contactForm) contactForm.addEventListener('submit', (e)=>{ e.preventDefault(); alert('Message sent (simulated)'); contactForm.reset(); });
});