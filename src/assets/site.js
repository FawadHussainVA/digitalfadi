/* Mark the page as loaded so looping decoration can start */
window.addEventListener('load', function(){ setTimeout(function(){ document.documentElement.classList.add('loaded'); }, 300); });
/* Load Cloudflare Turnstile only where a form needs it */
document.addEventListener('DOMContentLoaded', function(){
  if (!document.querySelector('.cf-turnstile')) return;
  var serviceWidget = document.querySelector('.service-form .cf-turnstile');
  if (serviceWidget && serviceWidget.clientWidth < 300) serviceWidget.dataset.size = 'compact';
  var t = document.createElement('script');
  t.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  t.async = true; t.defer = true;
  document.head.appendChild(t);
});

(function(){
  var WA_NUMBER = document.getElementById('waSend').dataset.whatsapp;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- desk feed (home only) ---------- */
  var tb = document.getElementById('rows');
  if(tb){
    var data = [
      {n:'Search: brand',   bid:0.84, cpa:11, w:1},
      {n:'Search: generic', bid:3.42, cpa:41, w:1},
      {n:'Shopping',              bid:0.71, cpa:26, w:1},
      {n:'Performance Max',       bid:1.18, cpa:29, w:0},
      {n:'YouTube in-stream',     bid:0.09, cpa:48, w:1},
      {n:'Display',               bid:0.42, cpa:57, w:0},
      {n:'Demand Gen',            bid:0.63, cpa:38, w:1},
      {n:'Remarketing',           bid:0.55, cpa:19, w:1}
    ];
    data.forEach(function(d){
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>'+d.n+'</td>'+
        '<td class="num" data-k="bid">$'+d.bid.toFixed(2)+'</td>'+
        '<td class="num" data-k="cpa">$'+d.cpa+'</td>'+
        '<td class="num"><span class="pill '+(d.w?'won':'lost')+'">'+(d.w?'Won':'Outbid')+'</span></td>';
      tb.appendChild(tr);
    });
    if(!reduce){
      var boardOn = false;
      if('IntersectionObserver' in window){
        new IntersectionObserver(function(es){ boardOn = es[0].isIntersecting; }).observe(tb);
      } else { boardOn = true; }
      var startFeed = function(){ setInterval(function(){
        if(!boardOn || document.hidden) return;
        var i = Math.floor(Math.random()*data.length), d = data[i], row = tb.children[i];
        d.bid = Math.max(0.35, d.bid + (Math.random()-0.5)*0.22);
        d.cpa = Math.max(9, Math.round(d.cpa + (Math.random()-0.52)*4));
        d.w = Math.random() > 0.28 ? 1 : 0;
        var b = row.querySelector('[data-k="bid"]'), c = row.querySelector('[data-k="cpa"]');
        b.textContent = '$'+d.bid.toFixed(2);
        c.textContent = '$'+d.cpa;
        var p = row.querySelector('.pill');
        p.className = 'pill '+(d.w?'won':'lost');
        p.textContent = d.w?'Won':'Outbid';
        b.classList.add('flash'); c.classList.add('flash');
        setTimeout(function(){ b.classList.remove('flash'); c.classList.remove('flash'); },480);
      },1500); };
      if(document.readyState === 'complete') setTimeout(startFeed, 800);
      else window.addEventListener('load', function(){ setTimeout(startFeed, 800); });
    }
  }

  /* ---------- ticker ---------- */
  var track = document.getElementById('track');
  if(track){
    var chans = ['Search campaigns','Shopping campaigns','Performance Max','YouTube ads','Display','Demand Gen','Remarketing','Local Services Ads','Keyword research','Negative keywords','Merchant Center feeds','Enhanced conversions','GA4 & Tag Manager','Smart Bidding','RSA testing','Account analysis'];
    var h = chans.map(function(c){ return '<span>'+c+' \u00B7</span>'; }).join('');
    track.innerHTML = h + h;
  }

  /* ---------- scroll progress, header, back to top ---------- */
  var prog = document.getElementById('prog'), hdr = document.getElementById('hdr'), topBtn = document.getElementById('top');
  function onScroll(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    hdr.classList.toggle('shrunk', window.scrollY > 40);
    topBtn.classList.toggle('on', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  topBtn.addEventListener('click', function(){
    window.scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'});
  });

  /* ---------- reveals ---------- */
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    /* threshold 0: reveal as soon as any part is on screen, however tall the block is.
       A 10% threshold never fired for long lists on phones, so cards stayed invisible. */
    },{threshold:0, rootMargin:'0px 0px -8% 0px'});
    var pending = [].slice.call(document.querySelectorAll('.rv,.stg'));
    pending.forEach(function(el){ io.observe(el); });
    /* Safety net for fast flicks on phones: anything that has scrolled into or past
       the screen is revealed, even if the observer never saw it intersect. */
    var revealTick = false;
    var revealPassed = function(){
      revealTick = false;
      var limit = window.innerHeight;
      pending = pending.filter(function(el){
        if(el.classList.contains('in')) return false;
        if(el.getBoundingClientRect().top < limit){ el.classList.add('in'); io.unobserve(el); return false; }
        return true;
      });
      if(!pending.length) window.removeEventListener('scroll', onRevealScroll);
    };
    var onRevealScroll = function(){ if(!revealTick){ revealTick = true; requestAnimationFrame(revealPassed); } };
    window.addEventListener('scroll', onRevealScroll, {passive:true});
  } else {
    document.querySelectorAll('.rv,.stg').forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- counters ---------- */
  var figs = document.querySelectorAll('[data-to]');
  function runCount(el){
    var to = parseFloat(el.dataset.to), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    if(reduce){ el.textContent = pre + to + suf; return; }
    var start = null, dur = 1400;
    function step(t){
      if(!start) start = t;
      var p = Math.min((t - start)/dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(to * e) + suf;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var io2 = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ runCount(e.target); io2.unobserve(e.target); } });
    },{threshold:.5});
    figs.forEach(function(f){ io2.observe(f); });
  } else {
    figs.forEach(runCount);
  }

  /* ---------- filters (results + blog) ---------- */
  var fbar = document.querySelector('[data-filterbar]');
  if(fbar){
    var items = document.querySelectorAll('[data-tags]');
    var empty = document.querySelector('.noresult');
    fbar.addEventListener('click', function(e){
      var b = e.target.closest('.fbtn');
      if(!b) return;
      fbar.querySelectorAll('.fbtn').forEach(function(x){ x.classList.remove('on'); x.setAttribute('aria-pressed','false'); });
      b.classList.add('on'); b.setAttribute('aria-pressed','true');
      var f = b.dataset.f, shown = 0;
      items.forEach(function(it){
        var match = (f === 'all') || it.dataset.tags.split(' ').indexOf(f) > -1;
        it.classList.toggle('hidden', !match);
        if(match) shown++;
      });
      if(empty) empty.classList.toggle('hidden', shown > 0);
      /* show the filtered cards straight away, without waiting for the scroll animation */
      items.forEach(function(it){ var g = it.closest('.stg'); if(g) g.classList.add('in'); });
    });
  }

  /* ---------- lead forms: same-origin Cloudflare Function -> Hostinger Mail API ---------- */
  var FORM_ENDPOINT = '/api/contact';

  function trackAnalytics(event, details){
    var allowed = false;
    try { allowed = localStorage.getItem('df_consent') === 'granted'; } catch(e) {}
    if(!allowed || typeof window.gtag !== 'function') return;
    window.gtag('event', event, Object.assign({page_path: location.pathname}, details));
  }

  function formDone(card, email){
    card.innerHTML =
      '<div class="fdone" tabindex="-1">' +
        '<div class="tick"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
        '<h4>Request submitted</h4>' +
        '<p>Thank you. We\'ll reply to ' + String(email).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }) + ' as soon as possible.</p>' +
      '</div>';
    card.querySelector('.fdone').focus();
  }
  function formError(form, message){
    var notice = form.querySelector('[data-form-error]');
    if(!notice){
      notice = document.createElement('p');
      notice.setAttribute('data-form-error','');
      notice.setAttribute('role','alert');
      notice.style.cssText = 'color:#a4232b;font-weight:650;margin:12px 0;line-height:1.5';
      var button = form.querySelector('.fsubmit');
      button.parentNode.insertBefore(notice,button.nextSibling);
    }
    notice.textContent = message;
  }
  document.querySelectorAll('[data-leadform]').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.reportValidity()) return;
      var fd = new FormData(form);
      var card = form.closest('.fcard');
      var email = String(fd.get('email') || 'you');
      var btn = form.querySelector('.fsubmit');
      if(btn.disabled) return;
      var original = btn.innerHTML;
      var oldError = form.querySelector('[data-form-error]');
      if(oldError) oldError.remove();
      var payload = {};
      fd.forEach(function(value,key){
        payload[key] = String(value);
      });
      // Turnstile may finish after FormData is created or omit the hidden field.
      var widget = form.querySelector('.cf-turnstile');
      var tokenField = form.querySelector('[name="cf-turnstile-response"]');
      var widgetToken = '';
      if(widget && window.turnstile && typeof window.turnstile.getResponse === 'function'){
        try { widgetToken = window.turnstile.getResponse(widget) || ''; } catch(_) {}
      }
      payload['cf-turnstile-response'] = widgetToken || (tokenField && tokenField.value) || '';
      if(!payload['cf-turnstile-response']){
        formError(form, 'Please complete the security verification before submitting. If it is not visible, disable browser blockers and refresh.');
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Sending...';
      var controller = new AbortController();
      var timeout = setTimeout(function(){controller.abort();}, 15000);
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type':'application/json','Accept':'application/json'},
        signal: controller.signal,
        body: JSON.stringify(payload)
      }).then(function(response){
        return response.json().catch(function(){throw new Error('Server returned a non-JSON response ('+response.status+')');})
          .then(function(result){
            if(!response.ok || !result || result.success !== true){
              throw new Error(result && result.error ? result.error : 'Server error '+response.status);
            }
          });
      }).then(function(){
        formDone(card,email);
        trackAnalytics('generate_lead', {form_type: form.getAttribute('name')});
      }).catch(function(error){
        console.error('Contact form submission failed:',error);
        btn.disabled = false;
        btn.innerHTML = original;
        formError(form, error && error.name === 'AbortError'
          ? 'The email service did not respond. Please try again later.'
          : (error && /^(Verification required|Verification failed|Turnstile not configured|Verification unavailable|Email service not configured|Email service unavailable|Email delivery not configured|Email delivery unavailable|Email delivery failed|Invalid form|Invalid details|Request failed)$/.test(error.message)
              ? error.message + '. Please try again, or contact fawad@digitalfadi.com.'
              : 'Message could not be submitted. Please try again later.'));
      }).finally(function(){ clearTimeout(timeout); });
    });
  });

  /* ---------- client logos carousel ---------- */
  var ct = document.getElementById('clientsTrack');
  if(ct){
    var cPrev = document.getElementById('clientsPrev'), cNext = document.getElementById('clientsNext'),
        cDots = document.getElementById('clientsDots'), cTimer = null, cPaused = false, cVisible = false;
    var perView = function(){ var li = ct.querySelector('.client'); return li ? Math.max(1, Math.round(ct.clientWidth / li.getBoundingClientRect().width)) : 1; };
    var pageCount = function(){ return Math.max(1, Math.ceil(ct.children.length / perView())); };
    var curPage = function(){
      var max = ct.scrollWidth - ct.clientWidth;
      if(max > 0 && ct.scrollLeft >= max - 2) return pageCount() - 1;
      return Math.round(ct.scrollLeft / ct.clientWidth);
    };
    var goPage = function(i){
      var n = pageCount(); i = ((i % n) + n) % n;
      ct.scrollTo({left: Math.min(i * ct.clientWidth, ct.scrollWidth - ct.clientWidth), behavior: reduce ? 'auto' : 'smooth'});
    };
    var markDots = function(){
      var p = curPage();
      [].forEach.call(cDots.children, function(d, i){ d.classList.toggle('on', i === p); d.setAttribute('aria-current', i === p ? 'true' : 'false'); });
    };
    var buildDots = function(){
      var n = pageCount(); cDots.innerHTML = '';
      for(var i = 0; i < n; i++){
        (function(i){
          var d = document.createElement('button'); d.type = 'button'; d.className = 'clients-dot';
          d.setAttribute('aria-label', 'Show logo set ' + (i + 1) + ' of ' + n);
          d.addEventListener('click', function(){ goPage(i); });
          cDots.appendChild(d);
        })(i);
      }
      var hide = n < 2; cPrev.hidden = hide; cNext.hidden = hide; cDots.hidden = hide;
      markDots();
    };
    cPrev.addEventListener('click', function(){ goPage(curPage() - 1); });
    cNext.addEventListener('click', function(){ goPage(curPage() + 1); });
    var cTick = false;
    ct.addEventListener('scroll', function(){ if(!cTick){ cTick = true; requestAnimationFrame(function(){ cTick = false; markDots(); }); } }, {passive:true});
    var cResize; window.addEventListener('resize', function(){ clearTimeout(cResize); cResize = setTimeout(buildDots, 150); });
    ['mouseenter','focusin','touchstart'].forEach(function(ev){ ct.parentNode.addEventListener(ev, function(){ cPaused = true; }, {passive:true}); });
    ['mouseleave','focusout'].forEach(function(ev){ ct.parentNode.addEventListener(ev, function(){ cPaused = false; }); });
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ cVisible = es[0].isIntersecting; }).observe(ct);
    } else { cVisible = true; }
    if(!reduce){
      cTimer = setInterval(function(){ if(cVisible && !cPaused && !document.hidden) goPage(curPage() + 1); }, 4000);
    }
    buildDots();
  }

  /* ---------- 15-minute call: Calendly opens in a popup on this page ----------
     The Calendly script loads only when someone clicks a booking link, so it costs
     nothing on page load. If it cannot load, the link opens in a new tab as before. */
  var calendlyState = 0, calendlyQueue = [];
  var confirmedBookings = new Set();
  window.addEventListener('message', function(e){
    if(e.origin !== 'https://calendly.com' || e.data?.event !== 'calendly.event_scheduled') return;
    var widget = document.querySelector('.calendly-popup iframe');
    if(!widget || widget.contentWindow !== e.source) return;
    var booking = e.data.payload?.invitee?.uri;
    if(typeof booking !== 'string' || confirmedBookings.has(booking)) return;
    confirmedBookings.add(booking);
    trackAnalytics('booking_completed', {booking_provider: 'calendly'});
  });
  var openCalendlyTab = function(url){ window.open(url, '_blank', 'noopener'); };
  var loadCalendly = function(cb, fail){
    if(calendlyState === 2) return cb();
    calendlyQueue.push([cb, fail]);
    if(calendlyState === 1) return;
    calendlyState = 1;
    var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);
    var js = document.createElement('script'); js.src = 'https://assets.calendly.com/assets/external/widget.js'; js.async = true;
    var done = function(ok){ calendlyState = ok ? 2 : 0; var q = calendlyQueue; calendlyQueue = []; q.forEach(function(p){ (ok ? p[0] : p[1])(); }); };
    js.onload = function(){ done(!!window.Calendly); };
    js.onerror = function(){ done(false); };
    document.head.appendChild(js);
    setTimeout(function(){ if(calendlyState === 1) done(false); }, 6000);
  };
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="https://calendly.com/"]');
    if(!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    trackAnalytics('booking_click', {booking_provider: 'calendly'});
    var url = a.href;
    loadCalendly(function(){ window.Calendly.initPopupWidget({url: url}); }, function(){ openCalendlyTab(url); });
  });

  /* ---------- whatsapp widget ---------- */
  var waBtn = document.getElementById('waBtn'),
      panel = document.getElementById('waPanel'),
      waX   = document.getElementById('waClose'),
      badge = document.getElementById('waBadge'),
      txt   = document.getElementById('waText'),
      dismissed = false;

  function openPanel(){
    panel.classList.add('open');
    waBtn.setAttribute('aria-expanded','true');
    badge.classList.add('hide');
    setTimeout(function(){ txt.focus(); }, 320);
  }
  function closePanel(){
    panel.classList.remove('open');
    waBtn.setAttribute('aria-expanded','false');
    dismissed = true;
  }
  waBtn.addEventListener('click', function(){
    panel.classList.contains('open') ? closePanel() : openPanel();
  });
  waX.addEventListener('click', closePanel);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });
  /* auto-open only on wider screens, and never over the free tools */
  if(window.innerWidth >= 700 && location.pathname.indexOf('/tools/') !== 0){
    setTimeout(function(){
      if(!dismissed && !panel.classList.contains('open')) openPanel();
    }, 12000);
  }

  document.getElementById('chips').addEventListener('click', function(e){
    var c = e.target.closest('.chip');
    if(!c) return;
    document.querySelectorAll('.chip').forEach(function(x){ x.classList.remove('sel'); });
    c.classList.add('sel');
    txt.value = 'Hi DigitalFadi - we are running ' + c.textContent + ' and would like an account audit.';
    txt.focus();
  });
  document.addEventListener('click', function(e){
    var link = e.target.closest && e.target.closest('a[href^="https://wa.me/' + WA_NUMBER + '"]');
    if(link) trackAnalytics('whatsapp_click', {placement: 'link'});
  });
  document.getElementById('waSend').addEventListener('click', function(){
    trackAnalytics('whatsapp_click', {placement: 'widget'});
    var m = txt.value.trim() || 'Hi DigitalFadi - I would like an account audit.';
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(m), '_blank', 'noopener');
  });
  txt.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && (e.metaKey || e.ctrlKey)) document.getElementById('waSend').click();
  });
  /* ---------- one-pager nav highlight (uses the existing nav a.on rule) ---------- */
  var navLinks = [].slice.call(document.querySelectorAll('nav[aria-label="Main"] a[href^="#"]'));
  if(navLinks.length && 'IntersectionObserver' in window){
    var spyTargets = navLinks.map(function(a){
      return document.getElementById(a.getAttribute('href').slice(1));
    }).filter(Boolean);
    if(spyTargets.length){
      var spy = new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(!e.isIntersecting) return;
          navLinks.forEach(function(a){
            var on = a.getAttribute('href') === '#' + e.target.id;
            a.classList.toggle('on', on);
            if(on){ a.setAttribute('aria-current','true'); }
            else { a.removeAttribute('aria-current'); }
          });
        });
      }, {rootMargin:'-45% 0px -50% 0px'});
      spyTargets.forEach(function(t){ spy.observe(t); });
    }
  }

  /* ---------- day / night mode ---------- */
  var themeBtn = document.getElementById('themeToggle');
  if(themeBtn){
    var syncThemeBtn = function(){
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', dark ? 'Switch to day mode' : 'Switch to dark mode');
    };
    syncThemeBtn();
    themeBtn.addEventListener('click', function(){
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('df_theme', next); } catch(e) {}
      syncThemeBtn();
    });
  }

  /* ---------- primary navigation ---------- */
  var navToggle = document.getElementById('navToggle'),
      mainNav = document.getElementById('mainnav'),
      servicesToggle = mainNav.querySelector('.navtop'),
      servicesGroup = servicesToggle.closest('.navdrop'),
      desktopNav = window.matchMedia('(min-width: 1081px)');
  var servicesPinned = false, servicesCloseTimer;

  function showServices(open){
    clearTimeout(servicesCloseTimer);
    if(!open) servicesPinned = false;
    servicesToggle.setAttribute('aria-expanded', String(open));
  }

  function showMobileMenu(open){
    mainNav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if(!open) showServices(false);
  }

  navToggle.addEventListener('click', function(){
    showMobileMenu(!mainNav.classList.contains('open'));
  });
  servicesToggle.addEventListener('click', function(){
    servicesPinned = !servicesPinned;
    showServices(servicesPinned);
  });
  servicesGroup.addEventListener('pointerenter', function(e){
    if(desktopNav.matches && e.pointerType === 'mouse') showServices(true);
  });
  servicesGroup.addEventListener('pointerleave', function(e){
    if(desktopNav.matches && e.pointerType === 'mouse' && !servicesPinned && !servicesGroup.contains(document.activeElement)){
      servicesCloseTimer = setTimeout(function(){ showServices(false); }, 200);
    }
  });
  servicesGroup.addEventListener('focusout', function(e){
    if(desktopNav.matches && !servicesGroup.contains(e.relatedTarget)) showServices(false);
  });
  mainNav.addEventListener('click', function(e){
    if(e.target.closest('a')) showMobileMenu(false);
  });
  document.addEventListener('click', function(e){
    if(!servicesGroup.contains(e.target)) showServices(false);
  });
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    if(servicesToggle.getAttribute('aria-expanded') === 'true'){
      showServices(false);
      servicesToggle.focus();
    } else if(mainNav.classList.contains('open')){
      showMobileMenu(false);
      navToggle.focus();
    }
  });
  desktopNav.addEventListener('change', function(){ showMobileMenu(false); });

})();


(function(){
  var KEY = 'df_consent', box = document.getElementById('ckBanner');
  if (!box) return;
  function read(){ try { return localStorage.getItem(KEY); } catch(e) { return null; } }
  function choose(v){
    var s = v === 'granted' ? 'granted' : 'denied';
    try { localStorage.setItem(KEY, s); localStorage.setItem(KEY + '_at', new Date().toISOString()); } catch(e) {}
    gtag('consent', 'update', {ad_storage:s, ad_user_data:s, ad_personalization:s, analytics_storage:s});
    window.dataLayer.push({event: 'consent_choice', consent: s});
    box.hidden = true;
    document.documentElement.classList.remove('ck-show');
  }
  document.getElementById('ckYes').addEventListener('click', function(){ choose('granted'); });
  document.getElementById('ckNo').addEventListener('click', function(){ choose('denied'); });
  var open = document.getElementById('ckOpen');
  if (open) open.addEventListener('click', function(){ box.hidden = false; document.getElementById('ckYes').focus(); });
  if (!read()) box.hidden = false;
})();
