const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
const LEAGUES = ['ECNL','ECNL RL','GA','DPL','MLS NEXT','NAL','NPL','USYS','EDP','Local/Other'];
const AGES = Array.from({length: 12}, (_, i) => `U${i+8}`);

const store = {
  get(key, fallback=[]) { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

function pageName() {
  return document.body.dataset.page;
}

function adSlots(target) {
  target.innerHTML = `
    <div class="ad"><strong>Advertise with SoccerDadHQ</strong><div class="muted">Top banner placeholder</div></div>
    <div class="ad"><strong>Sponsored Placement</strong><div class="muted">In-list sponsored placement placeholder</div></div>
    <div class="ad"><strong>Newsletter Sponsor</strong><div class="muted">Newsletter sponsorship placeholder</div></div>
  `;
}

function options(list, selected='') {
  return list.map(v => `<option value="${v}" ${selected===v?'selected':''}>${v}</option>`).join('');
}

function clubsData() {
  return store.get('clubs', window.SEED.clubs);
}

function coachesData() {
  return store.get('coaches', window.SEED.coaches);
}

function initClubDirectory() {
  const list = document.getElementById('club-list');
  const filters = document.getElementById('club-filters');
  const ad = document.getElementById('club-ads');
  adSlots(ad);

  filters.state.innerHTML = `<option value="">Any</option>${options(STATES)}`;
  filters.league.innerHTML = `<option value="">Any</option>${options(LEAGUES)}`;
  filters.age.innerHTML = `<option value="">Any</option>${options(AGES)}`;

  const render = () => {
    const term = filters.q.value.toLowerCase();
    const state = filters.state.value;
    const city = filters.city.value.toLowerCase();
    const zip = filters.zip.value.trim();
    const gender = filters.gender.value;
    const league = filters.league.value;
    const age = filters.age.value;

    const rows = clubsData().filter(c =>
      (!term || c.name.toLowerCase().includes(term)) &&
      (!state || c.state === state) &&
      (!city || c.city.toLowerCase().includes(city)) &&
      (!zip || c.zip.startsWith(zip)) &&
      (!gender || c.genders.includes(gender)) &&
      (!league || c.leagues.includes(league)) &&
      (!age || c.ages.includes(age))
    );

    list.innerHTML = rows.map(c => `
      <div class="listing">
        <h3>${c.name}</h3>
        <div class="muted">${c.city}, ${c.state} ${c.zip} · <span class="star">★ ${c.rating.toFixed(1)}</span></div>
        <div>${c.leagues.map(l=>`<span class='badge'>${l}</span>`).join('')}</div>
        <div class="actions">
          <a class="badge" href="club-profile.html?id=${c.id}">View Profile</a>
          <a class="badge" href="submit-club.html">Submit Missing Club</a>
        </div>
      </div>
    `).join('') || '<div class="notice">No clubs match your filters.</div>';
  };

  filters.addEventListener('input', render);
  render();
}

function initCoachDirectory() {
  const list = document.getElementById('coach-list');
  const filters = document.getElementById('coach-filters');
  const ad = document.getElementById('coach-ads');
  adSlots(ad);

  filters.state.innerHTML = `<option value="">Any</option>${options(STATES)}`;
  filters.league.innerHTML = `<option value="">Any</option>${options(LEAGUES)}`;
  filters.age.innerHTML = `<option value="">Any</option>${options(AGES)}`;

  const render = () => {
    const name = filters.name.value.toLowerCase();
    const club = filters.club.value.toLowerCase();
    const state = filters.state.value;
    const city = filters.city.value.toLowerCase();
    const gender = filters.gender.value;
    const league = filters.league.value;
    const age = filters.age.value;

    const rows = coachesData().filter(c =>
      (!name || c.name.toLowerCase().includes(name)) &&
      (!club || c.club.toLowerCase().includes(club)) &&
      (!state || c.state === state) &&
      (!city || c.city.toLowerCase().includes(city)) &&
      (!gender || c.genders.includes(gender)) &&
      (!league || c.leagues.includes(league)) &&
      (!age || c.ages.includes(age))
    );

    list.innerHTML = rows.map(c => `
      <div class="listing">
        <h3>${c.name}</h3>
        <div class="muted">${c.club} · ${c.city}, ${c.state} · <span class="star">★ ${c.rating.toFixed(1)}</span></div>
        <p>${c.bio}</p>
        <div class="actions">
          <a class="badge" href="coach-profile.html?id=${c.id}">View Profile</a>
          <a class="badge" href="coach-profile.html?id=${c.id}#rate">Rate a Coach</a>
        </div>
      </div>
    `).join('') || '<div class="notice">No coaches match your filters.</div>';
  };

  filters.addEventListener('input', render);
  render();
}

function param(name) { return new URLSearchParams(location.search).get(name); }

function savePending(form, key, mapper) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const item = mapper(fd);
    const rows = store.get(key, []);
    rows.push(item);
    store.set(key, rows);
    form.reset();
    alert('Saved as pending review.');
  });
}

function initSubmitClub() {
  const form = document.getElementById('submit-club-form');
  form.state.innerHTML = options(STATES);
  savePending(form, 'pendingClubSubmissions', (fd) => ({
    id: crypto.randomUUID(),
    clubName: fd.get('clubName'), city: fd.get('city'), state: fd.get('state'), zip: fd.get('zip'),
    website: fd.get('website'), contactEmail: fd.get('contactEmail'), leagues: fd.getAll('leagues'),
    genders: fd.getAll('genders'), ages: fd.getAll('ages'), notes: fd.get('notes'), status: 'pending', createdAt: new Date().toISOString()
  }));
}

function initSubmitCoach() {
  const form = document.getElementById('submit-coach-form');
  form.state.innerHTML = options(STATES);
  savePending(form, 'pendingCoachSubmissions', (fd) => ({
    id: crypto.randomUUID(),
    coachName: fd.get('coachName'), club: fd.get('club'), city: fd.get('city'), state: fd.get('state'), bio: fd.get('bio'),
    ages: fd.getAll('ages'), leagues: fd.getAll('leagues'), genders: fd.getAll('genders'), notes: fd.get('notes'),
    status: 'pending', createdAt: new Date().toISOString()
  }));
}

function initClubProfile() {
  const id = param('id');
  const club = clubsData().find(c => c.id === id);
  const root = document.getElementById('club-profile');
  if (!club) return root.innerHTML = '<p>Club not found.</p>';
  root.innerHTML = `
    <div class="card">
      <h2>${club.name}</h2>
      <div class="muted">${club.city}, ${club.state} ${club.zip}</div>
      <p>${club.description}</p>
      <p><strong>Website:</strong> ${club.website} | <strong>Phone:</strong> ${club.phone} | <strong>Email:</strong> ${club.email}</p>
      <p><strong>Tryouts:</strong> ${club.tryoutInfo}</p>
      <p><strong>Yearly Club Claim Fee:</strong> Placeholder UI (payment system not connected).</p>
      <div class="actions">
        <a class="badge" href="claim-club.html?clubId=${club.id}">Claim This Club</a>
      </div>
      <div class="ad"><strong>Profile Page Sponsor</strong><div class="muted">Sponsor area placeholder</div></div>
    </div>
  `;

  initReviews('club', club.id, 'club-reviews');
}

function initCoachProfile() {
  const id = param('id');
  const coach = coachesData().find(c => c.id === id);
  const root = document.getElementById('coach-profile');
  if (!coach) return root.innerHTML = '<p>Coach not found.</p>';
  root.innerHTML = `
    <div class="card">
      <h2>${coach.name}</h2>
      <div class="muted">${coach.club} · ${coach.city}, ${coach.state}</div>
      <p>${coach.bio}</p>
      <div class="actions">
        <a class="badge" href="claim-coach.html?coachId=${coach.id}">Claim This Coach Profile</a>
        <a class="badge" href="#rate">Rate a Coach</a>
      </div>
      <div class="ad"><strong>Profile Page Sponsor</strong><div class="muted">Sponsor area placeholder</div></div>
    </div>
  `;

  initReviews('coach', coach.id, 'coach-reviews');
}

function initClubClaim() {
  const clubId = param('clubId');
  const club = clubsData().find(c => c.id === clubId);
  const form = document.getElementById('claim-club-form');
  form.clubId.value = clubId || '';
  document.getElementById('club-claim-title').textContent = club ? `Claim ${club.name}` : 'Claim Club';
  savePending(form, 'pendingClubClaims', (fd) => ({
    id: crypto.randomUUID(), clubId: fd.get('clubId'), name: fd.get('name'), role: fd.get('role'), email: fd.get('email'),
    phone: fd.get('phone'), website: fd.get('website'), message: fd.get('message'), status: 'pending', createdAt: new Date().toISOString()
  }));
}

function initCoachClaim() {
  const coachId = param('coachId');
  const coach = coachesData().find(c => c.id === coachId);
  const form = document.getElementById('claim-coach-form');
  form.coachId.value = coachId || '';
  document.getElementById('coach-claim-title').textContent = coach ? `Claim ${coach.name}` : 'Claim Coach Profile';
  savePending(form, 'pendingCoachClaims', (fd) => ({
    id: crypto.randomUUID(), coachId: fd.get('coachId'), name: fd.get('name'), role: fd.get('role'), email: fd.get('email'),
    phone: fd.get('phone'), message: fd.get('message'), status: 'pending', createdAt: new Date().toISOString()
  }));
}

function avg(values) { return (values.reduce((a,b)=>a+b,0)/values.length).toFixed(1); }
function initReviews(type, entityId, containerId) {
  const key = type === 'club' ? 'clubReviews' : 'coachReviews';
  const queueKey = type === 'club' ? 'pendingClubReviews' : 'pendingCoachReviews';
  const wrap = document.getElementById(containerId);
  const approved = store.get(key, []).filter(r => r.entityId === entityId && r.status === 'approved');
  const stars = approved.length ? avg(approved.map(r => r.overallExperience)) : '—';
  wrap.innerHTML = `
    <div class='card' id='rate'>
      <h3>Ratings & Reviews <span class='star'>★ ${stars}</span></h3>
      <p class='muted'>Reviews are anonymous publicly and require admin approval.</p>
      ${approved.map(r => `<div class='listing'><strong>Anonymous Parent</strong><p>${r.text || 'No comment.'}</p></div>`).join('') || '<p class="muted">No approved reviews yet.</p>'}
      <form id='review-form'>
        <label>Overall experience (1-5)<input name='overallExperience' type='number' min='1' max='5' required /></label>
        <label>Comments<textarea name='text'></textarea></label>
        <button type='submit'>Submit Review</button>
      </form>
    </div>
  `;
  wrap.querySelector('#review-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const queue = store.get(queueKey, []);
    queue.push({ id: crypto.randomUUID(), entityId, overallExperience: Number(fd.get('overallExperience')), text: fd.get('text'), status: 'pending' });
    store.set(queueKey, queue);
    alert('Thanks! Your review is pending admin moderation.');
    e.target.reset();
  });
}

function initAdmin() {
  const root = document.getElementById('admin-panels');
  const groups = [
    ['Club submissions', 'pendingClubSubmissions'],
    ['Coach submissions', 'pendingCoachSubmissions'],
    ['Club claims', 'pendingClubClaims'],
    ['Coach claims', 'pendingCoachClaims'],
    ['Club reviews', 'pendingClubReviews'],
    ['Coach reviews', 'pendingCoachReviews']
  ];
  root.innerHTML = groups.map(([title, key]) => {
    const rows = store.get(key, []);
    return `
      <div class='card'>
        <h3>${title}</h3>
        ${rows.map(r => `<div class='listing'><pre>${JSON.stringify(r, null, 2)}</pre>
          <div class='actions'>
            <button data-key='${key}' data-id='${r.id}' data-action='approved'>Approve</button>
            <button data-key='${key}' data-id='${r.id}' data-action='rejected'>Reject</button>
          </div>
        </div>`).join('') || '<p class="muted">No pending items.</p>'}
      </div>
    `;
  }).join('');

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-key]');
    if (!btn) return;
    const rows = store.get(btn.dataset.key, []);
    const next = rows.map(r => r.id === btn.dataset.id ? {...r, status: btn.dataset.action} : r);
    store.set(btn.dataset.key, next);
    if (btn.dataset.action === 'approved' && btn.dataset.key === 'pendingClubReviews') {
      const approved = store.get('clubReviews', []);
      const item = next.find(r => r.id === btn.dataset.id);
      approved.push({...item, status: 'approved'});
      store.set('clubReviews', approved);
    }
    if (btn.dataset.action === 'approved' && btn.dataset.key === 'pendingCoachReviews') {
      const approved = store.get('coachReviews', []);
      const item = next.find(r => r.id === btn.dataset.id);
      approved.push({...item, status: 'approved'});
      store.set('coachReviews', approved);
    }
    initAdmin();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const page = pageName();
  if (page === 'clubs') initClubDirectory();
  if (page === 'coaches') initCoachDirectory();
  if (page === 'submit-club') initSubmitClub();
  if (page === 'submit-coach') initSubmitCoach();
  if (page === 'club-profile') initClubProfile();
  if (page === 'coach-profile') initCoachProfile();
  if (page === 'claim-club') initClubClaim();
  if (page === 'claim-coach') initCoachClaim();
  if (page === 'admin') initAdmin();
});
