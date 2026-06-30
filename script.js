
  const API_URL = 'http://localhost:5000/api';

  // TAB NAVIGATION
  function showTab(tabId, element) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');
  }

  // THEME TOGGLE
  function toggleTheme() {
    const body = document.documentElement;
    const newTheme = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    fetch(`${API_URL}/user`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ theme: newTheme }) });
  }

  // PROGRESS BAR
  function updateProgress() {
    const trackerChecks = document.querySelectorAll('.track-check');
    const total = trackerChecks.length;
    let completed = Array.from(trackerChecks).filter(c => c.checked).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    document.getElementById('progress-bar').style.width = percentage + '%';
    document.getElementById('progress-text').innerText = percentage + '%';
  }

  // SYNC WITH MONGODB
  async function saveData(key, value) {
    const payload = {};
    payload[key] = value;
    await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
   try {
    const response = await fetch(`${API_URL}/user`);
    if (!response.ok) {
        console.error("Fetch failed with status:", response.status);
        return;
    }
    const data = await response.json();
    console.log("Data received:", data); // Check this in the Console tab
    // ... rest of your code
} catch (error) {
    console.error("Fetch error:", error);
}
        
        el.addEventListener('change', (e) => {
          saveData(e.target.id, e.target.type === 'checkbox' ? e.target.checked : e.target.value);
          if(e.target.classList.contains('track-check')) updateProgress();
        });
      });
      updateProgress();
    } catch (err) {
      console.error("Sync Error:", err);
    }
  });
