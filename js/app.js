/**
 * Mariage Tuborg & Yacine - Script Principal
 * Samedi 28 Novembre 2026 - Saint-Louis, Sénégal
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initAudioPlayer();
  initSwiper();
  initCalendarGenerator();
  initNavbarScroll();
  initScrollTop();
});

/* ========================================================
   1. Compte à Rebours (Countdown)
   Date cible : 28 Novembre 2026 à 17:00:00 (GMT / Sénégal)
   ======================================================== */
function initCountdown() {
  const targetDate = new Date('2026-11-28T17:00:00Z').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      const titleEl = document.getElementById('countdown-title');
      if (titleEl) titleEl.textContent = "C'est le grand jour ! Bienvenue à notre mariage !";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ========================================================
   2. Ambiance Sonore Intégrée (Daman Bannex - Obree Daman)
   Lecteur discret avec Play / Pause / Mute / Visualizer
   + Fallback Web Audio Synthèse Kora / Acoustique
   ======================================================== */
function initAudioPlayer() {
  const audio = document.getElementById('wedding-audio');
  const playBtn = document.getElementById('audio-play-btn');
  const muteBtn = document.getElementById('audio-mute-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const volumeIcon = document.getElementById('volume-icon');
  const muteIcon = document.getElementById('mute-icon');
  const equalizer = document.getElementById('audio-equalizer');
  const vinylDisc = document.getElementById('vinyl-disc');
  const promptToast = document.getElementById('music-prompt-toast');
  const acceptMusicBtn = document.getElementById('accept-music-btn');
  const closeMusicToastBtn = document.getElementById('close-music-toast-btn');

  let isPlaying = false;
  let synthFallbackActive = false;
  let synthInterval = null;
  let audioCtx = null;

  // Création d'une mélodie kora acoustique traditionnelle en Web Audio API si le fichier MP3 n'est pas encore présent
  function playKoraSynthNote(freq, time, duration = 0.8) {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.15, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  function startKoraArpeggio() {
    if (synthFallbackActive) return;
    synthFallbackActive = true;
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00]; // Pentatonique chaleureuse
    let noteIdx = 0;
    synthInterval = setInterval(() => {
      if (!isPlaying) return;
      playKoraSynthNote(notes[noteIdx % notes.length], 0, 0.9);
      noteIdx++;
    }, 400);
  }

  function stopKoraArpeggio() {
    synthFallbackActive = false;
    if (synthInterval) clearInterval(synthInterval);
  }

  function setPlayerState(playing) {
    isPlaying = playing;
    if (playing) {
      playIcon?.classList.add('hidden');
      pauseIcon?.classList.remove('hidden');
      equalizer?.classList.add('active');
      vinylDisc?.classList.add('playing');
    } else {
      playIcon?.classList.remove('hidden');
      pauseIcon?.classList.add('hidden');
      equalizer?.classList.remove('active');
      vinylDisc?.classList.remove('playing');
      stopKoraArpeggio();
    }
  }

  function startPlayback() {
    if (!audio) return;
    audio.play().then(() => {
      setPlayerState(true);
      hidePrompt();
    }).catch((err) => {
      console.warn("Lecture du fichier audio local échouée, activation du synthé acoustique kora :", err);
      // Fallback doux
      startKoraArpeggio();
      setPlayerState(true);
      hidePrompt();
    });
  }

  function pausePlayback() {
    if (audio) audio.pause();
    stopKoraArpeggio();
    setPlayerState(false);
  }

  function togglePlay() {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }

  function toggleMute() {
    if (!audio) return;
    audio.muted = !audio.muted;
    if (audio.muted) {
      volumeIcon?.classList.add('hidden');
      muteIcon?.classList.remove('hidden');
      stopKoraArpeggio();
    } else {
      volumeIcon?.classList.remove('hidden');
      muteIcon?.classList.add('hidden');
      if (isPlaying && synthFallbackActive) {
        startKoraArpeggio();
      }
    }
  }

  function hidePrompt() {
    if (promptToast) {
      promptToast.style.opacity = '0';
      promptToast.style.transform = 'translateY(20px)';
      setTimeout(() => {
        promptToast.style.display = 'none';
      }, 400);
    }
  }

  playBtn?.addEventListener('click', togglePlay);
  muteBtn?.addEventListener('click', toggleMute);
  acceptMusicBtn?.addEventListener('click', () => {
    startPlayback();
  });
  closeMusicToastBtn?.addEventListener('click', hidePrompt);

  // Tentative respectueuse d'autoplay ou affichage de la bulle après 2 secondes
  setTimeout(() => {
    if (!isPlaying && promptToast) {
      promptToast.classList.remove('hidden');
    }
  }, 1800);

  // Démarrer délicatement au premier clic n'importe où sur la page si l'utilisateur n'a pas encore interagi
  const handleFirstInteraction = () => {
    if (!isPlaying && !sessionStorage.getItem('music_interacted')) {
      sessionStorage.setItem('music_interacted', 'true');
      // On n'impose pas, mais si l'utilisateur clique sur le hero CTA, on peut lancer
    }
    document.removeEventListener('click', handleFirstInteraction);
  };
  document.addEventListener('click', handleFirstInteraction);
}

/* ========================================================
   3. Carrousel Swiper Hero
   ======================================================== */
function initSwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.hero-swiper', {
    loop: true,
    speed: 1400,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
}

/* ========================================================
   4. Générateur "Ajouter au Calendrier" (.ics & Google Calendar)
   ======================================================== */
function initCalendarGenerator() {
  const gcalBtn = document.getElementById('btn-add-gcal');
  const icalBtn = document.getElementById('btn-download-ics');

  const eventTitle = encodeURIComponent("Mariage de Tuborg & Yacine");
  const eventDesc = encodeURIComponent("Célébration du mariage de Tuborg & Yacine à l'Hôtel Keur Dada, Saint-Louis, Sénégal.\nProgramme : Cérémonie, Dîner, Danses & Soirée festive.");
  const eventLocation = encodeURIComponent("Hôtel Keur Dada, Saint-Louis, Sénégal");
  
  // 28 Nov 2026 de 17:00 à 03:00 (GMT)
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=20261128T170000Z/20261129T030000Z&details=${eventDesc}&location=${eventLocation}`;

  if (gcalBtn) {
    gcalBtn.href = gcalUrl;
    gcalBtn.target = "_blank";
  }

  if (icalBtn) {
    icalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadICalFile();
    });
  }
}

function downloadICalFile() {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mariage Tuborg et Yacine//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:mariage-tuborg-yacine-20261128@saintlouis',
    'DTSTAMP:20261115T000000Z',
    'DTSTART:20261128T170000Z',
    'DTEND:20261129T030000Z',
    'SUMMARY:Mariage de Tuborg & Yacine',
    'DESCRIPTION:Célébration de l\'union de Tuborg et Yacine à l\'Hôtel Keur Dada, Saint-Louis, Sénégal. Cérémonie, dîner et festivités.',
    'LOCATION:Hôtel Keur Dada, Saint-Louis, Sénégal',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Mariage-Tuborg-et-Yacine.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ========================================================
   5. Navigation Floue & Défilement
   ======================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('main-navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('navbar-scrolled');
    } else {
      navbar?.classList.remove('navbar-scrolled');
    }
  });

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Fermer le menu lors du clic sur un lien
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

/* ========================================================
   6. Bouton Retour en Haut
   ======================================================== */
function initScrollTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
