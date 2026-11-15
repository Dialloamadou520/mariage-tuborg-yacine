/**
 * Mariage Tuborg & Yacine - Gestionnaire RSVP & Confirmation
 * Samedi 28 Novembre 2026 - Saint-Louis, Sénégal
 */

// CONFIGURATION DES NUMÉROS WHATSAPP DES MARIÉS
const WHATSAPP_CONTACTS = [
  { 
    id: "groom",
    name: "Tuborg (Le Marié)", 
    number: "221776185100", 
    display: "+221 77 618 51 00",
    role: "Marié"
  },
  { 
    id: "coordination",
    name: "Organisation & Coordination", 
    number: "221771760906", 
    display: "+221 77 176 09 06",
    role: "Coordination"
  }
];

// CONFIGURATION DU WEBHOOK GOOGLE SHEETS
// Remplacez l'URL ci-dessous par l'URL de votre Web App Google Apps Script
// Consultez le fichier google-sheets-script.js pour la mise en place en 2 minutes.
const GOOGLE_SHEET_WEBHOOK_URL = ""; 

// CONFIGURATION EMAIL SECONDAIRE (Optionnel : Web3Forms / Formspree)
const FORMSPREE_ENDPOINT = ""; 

document.addEventListener('DOMContentLoaded', () => {
  initRsvpForm();
  initAdminDashboard();
});

function initRsvpForm() {
  const form = document.getElementById('rsvp-form');
  const attendanceRadios = document.querySelectorAll('input[name="presence"]');
  const plusOneSection = document.getElementById('plus-one-section');
  const companionsCountSelect = document.getElementById('nb-accompagnants');
  const companionsNamesContainer = document.getElementById('companions-names-container');
  const submitBtn = document.getElementById('rsvp-submit-btn');
  const successModal = document.getElementById('rsvp-success-modal');
  const closeSuccessModalBtn = document.getElementById('close-success-modal-btn');

  if (!form) return;

  // Gestion conditionnelle de la présence
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const isAttending = e.target.value === 'oui';
      if (plusOneSection) {
        if (isAttending) {
          plusOneSection.classList.remove('hidden');
        } else {
          plusOneSection.classList.add('hidden');
        }
      }
    });
  });

  // Gestion conditionnelle du champ pour les noms des accompagnants
  if (companionsCountSelect && companionsNamesContainer) {
    companionsCountSelect.addEventListener('change', (e) => {
      const count = parseInt(e.target.value, 10);
      if (count > 0) {
        companionsNamesContainer.classList.remove('hidden');
      } else {
        companionsNamesContainer.classList.add('hidden');
      }
    });
  }

  // Soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('rsvp-fullname')?.value.trim();
    const presenceEl = document.querySelector('input[name="presence"]:checked');
    const presence = presenceEl ? presenceEl.value : 'oui';
    const companionsCount = presence === 'oui' ? (document.getElementById('nb-accompagnants')?.value || '0') : '0';
    const companionsNames = presence === 'oui' ? (document.getElementById('rsvp-companions-names')?.value.trim() || '') : '';
    const phone = document.getElementById('rsvp-phone')?.value.trim() || '';
    const diet = presence === 'oui' ? (document.getElementById('rsvp-diet')?.value || 'aucun') : 'aucun';
    const message = document.getElementById('rsvp-message')?.value.trim() || '';

    if (!fullName) {
      alert("Veuillez renseigner votre Nom et Prénom.");
      return;
    }

    const rsvpData = {
      id: 'rsvp_' + Date.now(),
      dateSubmitted: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      nomComplet: fullName,
      presence: presence === 'oui' ? 'Présent' : 'Absent',
      nombreAccompagnants: parseInt(companionsCount, 10),
      nomsAccompagnants: companionsNames,
      telephone: phone,
      regimeAlimentaire: diet,
      message: message
    };

    // 1. Sauvegarde locale permanente dans le navigateur (garantie zéro perte)
    saveRsvpLocally(rsvpData);

    // Changement d'état du bouton
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-900 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Envoi en cours...
      `;
    }

    // 2. Envoi vers Google Sheets ou webhook distant si configuré
    try {
      if (GOOGLE_SHEET_WEBHOOK_URL && GOOGLE_SHEET_WEBHOOK_URL.trim() !== '') {
        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors', // standard pour Google Apps Script Web App
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rsvpData)
        });
      } else if (FORMSPREE_ENDPOINT && FORMSPREE_ENDPOINT.trim() !== '') {
        await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(rsvpData)
        });
      }
    } catch (err) {
      console.warn("Note : Envoi webhook réseau non bloquant :", err);
    }

    // 3. Déclenchement de la célébration festive (Confettis)
    triggerCelebrationConfetti();

    // 4. Affichage du Modal de confirmation
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Confirmer ma réponse</span>`;
    }

    showSuccessModal(rsvpData);
    form.reset();
  });

  if (closeSuccessModalBtn && successModal) {
    closeSuccessModalBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
    });
  }
}

/* ========================================================
   Sauvegarde et Stockage Local (LocalStorage)
   ======================================================== */
function saveRsvpLocally(data) {
  try {
    const existing = JSON.parse(localStorage.getItem('wedding_rsvp_tuborg_yacine') || '[]');
    existing.push(data);
    localStorage.setItem('wedding_rsvp_tuborg_yacine', JSON.stringify(existing));
  } catch (e) {
    console.error("Erreur d'enregistrement local :", e);
  }
}

function getLocalRsvps() {
  try {
    return JSON.parse(localStorage.getItem('wedding_rsvp_tuborg_yacine') || '[]');
  } catch (e) {
    return [];
  }
}

/* ========================================================
   Pluie de Confettis Dorés & Émeraude (Canvas Confetti)
   ======================================================== */
function triggerCelebrationConfetti() {
  if (typeof confetti !== 'function') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#D4AF37', '#F3E5AB', '#0F382A', '#EFE8D8', '#B8860B']
  };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/* ========================================================
   Génération et Envoi Direct WhatsApp
   Numéros : +221 77 618 51 00 et +221 77 176 09 06
   ======================================================== */
function formatWhatsAppMessage(data) {
  const isPresent = data.presence === 'Présent';
  let lines = [
    `💍 *CONFIRMATION MARIAGE TUBORG & YACINE*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Invité(e) :* ${data.nomComplet}`,
    `✨ *Statut :* ${isPresent ? '✅ Présent(e) avec grand plaisir !' : '❌ Ne pourra malheureusement pas venir'}`,
  ];

  if (isPresent) {
    const acc = data.nombreAccompagnants > 0 
      ? `+${data.nombreAccompagnants} personne(s) ${data.nomsAccompagnants ? `(${data.nomsAccompagnants})` : ''}` 
      : 'Vient seul(e)';
    lines.push(`👥 *Accompagnant(s) :* ${acc}`);

    if (data.regimeAlimentaire && data.regimeAlimentaire !== 'aucun') {
      lines.push(`🍽️ *Préférence de table :* ${data.regimeAlimentaire}`);
    }
  }

  if (data.telephone) {
    lines.push(`📞 *Téléphone / WhatsApp :* ${data.telephone}`);
  }

  if (data.message) {
    lines.push(`💌 *Message aux mariés :* « ${data.message} »`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📅 *Date :* Samedi 28 Novembre 2026 à 17h00`);
  lines.push(`📍 *Lieu :* Hôtel Keur Dada, Saint-Louis (Sénégal)`);

  return lines.join('\n');
}

function getWhatsAppUrl(phone, text) {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
}

/* ========================================================
   Modal de Confirmation Personnalisée
   ======================================================== */
function showSuccessModal(data) {
  const modal = document.getElementById('rsvp-success-modal');
  const nameEl = document.getElementById('success-guest-name');
  const detailsEl = document.getElementById('success-summary-text');

  if (!modal) return;

  if (nameEl) nameEl.textContent = data.nomComplet;
  if (detailsEl) {
    if (data.presence === 'Présent') {
      const accompagnantsTexte = data.nombreAccompagnants > 0 
        ? ` avec ${data.nombreAccompagnants} accompagnant(s)` 
        : ` (vous venez seul(e))`;
      detailsEl.innerHTML = `
        <p class="text-emerald-900 font-semibold mb-2">Votre présence est bien confirmée${accompagnantsTexte} !</p>
        <p class="text-gray-600 text-sm">Tuborg & Yacine ont hâte de vous retrouver le <strong>samedi 28 novembre 2026 dès 17h00</strong> à l'Hôtel Keur Dada à Saint-Louis pour célébrer ce moment inoubliable.</p>
      `;
    } else {
      detailsEl.innerHTML = `
        <p class="text-gray-800 font-semibold mb-2">Nous avons bien noté que vous ne pourrez pas être présent(e).</p>
        <p class="text-gray-600 text-sm">Merci beaucoup d'avoir pris le temps de nous répondre. Vos tendres pensées nous touchent droit au cœur !</p>
      `;
    }
  }

  // Configuration des liens directs WhatsApp
  const messageText = formatWhatsAppMessage(data);
  const groomUrl = getWhatsAppUrl('221776185100', messageText);
  const coordUrl = getWhatsAppUrl('221771760906', messageText);

  const groomBtn = document.getElementById('whatsapp-btn-groom');
  const coordBtn = document.getElementById('whatsapp-btn-coord');

  if (groomBtn) groomBtn.href = groomUrl;
  if (coordBtn) coordBtn.href = coordUrl;

  modal.classList.remove('hidden');

  // Tentative respectueuse d'ouverture directe de WhatsApp pour le marié
  try {
    window.open(groomUrl, '_blank');
  } catch (err) {
    // Les boutons dans la fenêtre modale restent toujours disponibles en 1 clic
  }
}

/* ========================================================
   Dashboard Invités Secret (Pour les Mariés & Organisateurs)
   Accessible via Ctrl + Shift + R ou 5 clics sur le logo
   ======================================================== */
function initAdminDashboard() {
  const adminModal = document.getElementById('admin-rsvp-modal');
  const closeAdminBtn = document.getElementById('close-admin-modal-btn');
  const exportCsvBtn = document.getElementById('export-csv-btn');
  const clearDataBtn = document.getElementById('clear-rsvp-data-btn');
  const tableBody = document.getElementById('admin-rsvp-tbody');
  const totalCountEl = document.getElementById('admin-total-guests');
  const logoTrigger = document.getElementById('nav-logo-brand');

  let clickCounter = 0;
  if (logoTrigger) {
    logoTrigger.addEventListener('click', (e) => {
      clickCounter++;
      if (clickCounter >= 5) {
        clickCounter = 0;
        openAdminModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
      e.preventDefault();
      openAdminModal();
    }
  });

  if (closeAdminBtn && adminModal) {
    closeAdminBtn.addEventListener('click', () => {
      adminModal.classList.add('hidden');
    });
  }

  function openAdminModal() {
    if (!adminModal) return;
    renderTable();
    adminModal.classList.remove('hidden');
  }

  function renderTable() {
    const list = getLocalRsvps();
    if (!tableBody) return;
    tableBody.innerHTML = '';

    let totalConfirmedSeats = 0;

    if (list.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic">
            Aucune réponse enregistrée pour le moment sur cet appareil.
          </td>
        </tr>
      `;
    } else {
      list.forEach((item, index) => {
        const isPresent = item.presence === 'Présent';
        if (isPresent) {
          totalConfirmedSeats += 1 + (item.nombreAccompagnants || 0);
        }

        const tr = document.createElement('tr');
        tr.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        tr.innerHTML = `
          <td class="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">${item.dateFormatted || item.dateSubmitted}</td>
          <td class="px-4 py-3 text-sm font-semibold text-gray-800">${item.nomComplet}</td>
          <td class="px-4 py-3 text-xs">
            <span class="inline-flex px-2 py-1 rounded-full text-xs font-bold ${isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
              ${item.presence}
            </span>
          </td>
          <td class="px-4 py-3 text-xs text-gray-700">
            ${isPresent ? (item.nombreAccompagnants > 0 ? `+${item.nombreAccompagnants} (${item.nomsAccompagnants || 'non spécifié'})` : 'Seul(e)') : '-'}
          </td>
          <td class="px-4 py-3 text-xs text-gray-600">${item.telephone || '-'}</td>
          <td class="px-4 py-3 text-xs text-gray-600 max-w-xs truncate" title="${item.message || ''}">${item.message || '-'}</td>
        `;
        tableBody.appendChild(tr);
      });
    }

    if (totalCountEl) {
      totalCountEl.textContent = `${totalConfirmedSeats} place(s) confirmée(s) (${list.length} réponses totales)`;
    }
  }

  // Exportation CSV pour Excel
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const list = getLocalRsvps();
      if (list.length === 0) {
        alert("Aucune donnée à exporter.");
        return;
      }

      const headers = ["Date", "Nom et Prenom", "Presence", "Nb Accompagnants", "Noms Accompagnants", "Telephone", "Regime", "Message"];
      const rows = list.map(item => [
        `"${item.dateFormatted || item.dateSubmitted}"`,
        `"${item.nomComplet.replace(/"/g, '""')}"`,
        `"${item.presence}"`,
        `"${item.nombreAccompagnants || 0}"`,
        `"${(item.nomsAccompagnants || '').replace(/"/g, '""')}"`,
        `"${(item.telephone || '').replace(/"/g, '""')}"`,
        `"${(item.regimeAlimentaire || '').replace(/"/g, '""')}"`,
        `"${(item.message || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `RSVP_Mariage_Tuborg_Yacine_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Effacer la liste
  if (clearDataBtn) {
    clearDataBtn.addEventListener('click', () => {
      if (confirm("Voulez-vous vraiment effacer les réponses enregistrées localement sur ce navigateur ?")) {
        localStorage.removeItem('wedding_rsvp_tuborg_yacine');
        renderTable();
      }
    });
  }
}
