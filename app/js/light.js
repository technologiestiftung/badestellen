/* global CookieConsent */

/*
 * Responsive Menu Button
 */
window.toggleNav = function () {
  var x = document.getElementById('myTopnav')
  if (x.className === 'topnav') {
    x.className += ' responsive'
  } else {
    x.className = 'topnav'
  }
}

window.cookieInstance = new CookieConsent({
  container: document.getElementById('cookieconsent'),
  hasTransition: false,
  cookie: {
    name: 'BadestellenConsentCookie',
    domain: '127.0.0.1'
  },
  content: {
    message: 'Zur Erhebung der Nutzer*innenzahlen werden Cookies genutzt.',
    link: 'Sie können dies hier deaktivieren &raquo;',
    href: '/datenschutz.html#optout',
    dismiss: 'Akzeptieren'
  },
  palette: {
    popup: { background: '#c7d9ff', color: '#253276' },
    button: { background: '#253276', color: '#fff' }
  },
  revokable: false,
  theme: 'edgeless'
})
