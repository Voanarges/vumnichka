// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_3d-card
// Usage: codyhouse.co/license


(function() {
    
    var TdCard = function(element) {
      this.element = element;
      this.maxRotation = parseInt(this.element.getAttribute('data-rotation')) || 2; // rotation max value
      this.perspective = this.element.getAttribute('data-perspective') || '300px'; // perspective value
      this.rotateX = 0;
      this.rotateY = 0;
      this.partRotateX = 0;
      this.partRotateY = 0;
      this.deltaRotation = 0.3;
      this.animating = false;
      initTdEvents(this);
    };
  
    function initTdEvents(tdCard) {
      // detect mouse hovering over the card
      tdCard.element.addEventListener('mousemove', function(event){
        if(tdCard.animating) return;
        tdCard.animating = window.requestAnimationFrame(moveCard.bind(tdCard, event, false));
      });
  
      // detect mouse leaving the card
      tdCard.element.addEventListener('mouseleave', function(event){
        if(tdCard.animating) window.cancelAnimationFrame(tdCard.animating);
        tdCard.animating = window.requestAnimationFrame(moveCard.bind(tdCard, event, true));
      });
    };
  
    function moveCard(event, leaving) {
      // get final rotation values
      setRotationLevel(this, event, leaving);
      
      // update rotation values
      updateRotationLevel(this);
    };
  
    function setRotationLevel(tdCard, event, leaving) {
      if(leaving) {
        tdCard.rotateX = 0;
        tdCard.rotateY = 0;
        return;
      }
  
      var wrapperPosition = tdCard.element.getBoundingClientRect();
      var rotateY = 2*(tdCard.maxRotation/wrapperPosition.width)*(event.clientX - wrapperPosition.left - wrapperPosition.width/2);
      var rotateX = 2*(tdCard.maxRotation/wrapperPosition.height)*(wrapperPosition.top - event.clientY + wrapperPosition.height/2);
  
      if(rotateY > tdCard.maxRotation) rotateY = tdCard.maxRotation;
      if(rotateY < -1*tdCard.maxRotation) rotateY = -tdCard.maxRotation;
      if(rotateX > tdCard.maxRotation) rotateX = tdCard.maxRotation;
      if(rotateX < -1*tdCard.maxRotation) rotateX = -tdCard.maxRotation;
  
      tdCard.rotateX = rotateX;
      tdCard.rotateY = rotateY;
    };
  
    function updateRotationLevel(tdCard) {
      if( (tdCard.partRotateX == tdCard.rotateX) && (tdCard.partRotateY == tdCard.rotateY)) {
        tdCard.animating = false;
        return;
      }
  
      tdCard.partRotateX = getPartRotation(tdCard.partRotateX, tdCard.rotateX, tdCard.deltaRotation);
      tdCard.partRotateY = getPartRotation(tdCard.partRotateY, tdCard.rotateY, tdCard.deltaRotation);
      // set partial rotation
      rotateCard(tdCard);
      // keep rotating the card
      tdCard.animating = window.requestAnimationFrame(function(){
        updateRotationLevel(tdCard);
      });
    };
  
    function getPartRotation(start, end, delta) {
      if(start == end) return end;
      var newVal = start;
      if(start < end) {
        newVal = start + delta;
        if(newVal > end) newVal = end;
      } else if(start > end) {
        newVal = start - delta;
        if(newVal < end) newVal = end;
      }
      return newVal;
    }
  
    function rotateCard(tdCard) {
      tdCard.element.style.transform = 'perspective('+tdCard.perspective+') rotateX('+tdCard.partRotateX+'deg) rotateY('+tdCard.partRotateY+'deg)';
    };
  
    window.TdCard = TdCard;
  
    //initialize the TdCard objects
    var tdCards = document.getElementsByClassName('js-td-card');
    if( tdCards.length > 0 && Util.cssSupports('transform', 'translateZ(0px)')) {
      for( var i = 0; i < tdCards.length; i++) {
        (function(i){
          new TdCard(tdCards[i]);
        })(i);
      }
    };
  }());
// File#: _1_anim-menu-btn

(function() {
    var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
    if( menuBtns.length > 0 ) {
      for(var i = 0; i < menuBtns.length; i++) {(function(i){
        initMenuBtn(menuBtns[i]);
      })(i);}
  
      function initMenuBtn(btn) {
        btn.addEventListener('click', function(event){	
          event.preventDefault();
          var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
          Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
          // emit custom event
          var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
          btn.dispatchEvent(event);
        });
      };
    }
  }());
// File#: _1_drawer
// Usage: codyhouse.co/license
(function() {
    var Drawer = function(element) {
      this.element = element;
      this.content = document.getElementsByClassName('js-drawer__body')[0];
      this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
      this.firstFocusable = null;
      this.lastFocusable = null;
      this.selectedTrigger = null;
      this.isModal = Util.hasClass(this.element, 'js-drawer--modal');
      this.showClass = "drawer--is-visible";
      this.preventScrollEl = this.getPreventScrollEl();
      this.initDrawer();
    };
  
    Drawer.prototype.getPreventScrollEl = function() {
      var scrollEl = false;
      var querySelector = this.element.getAttribute('data-drawer-prevent-scroll');
      if(querySelector) scrollEl = document.querySelector(querySelector);
      return scrollEl;
    };
  
    Drawer.prototype.initDrawer = function() {
      var self = this;
      //open drawer when clicking on trigger buttons
      if ( this.triggers ) {
        for(var i = 0; i < this.triggers.length; i++) {
          this.triggers[i].addEventListener('click', function(event) {
            event.preventDefault();
            if(Util.hasClass(self.element, self.showClass)) {
              self.closeDrawer(event.target);
              return;
            }
            self.selectedTrigger = event.target;
            self.showDrawer();
            self.initDrawerEvents();
          });
        }
      }
  
      // if drawer is already open -> we should initialize the drawer events
      if(Util.hasClass(this.element, this.showClass)) this.initDrawerEvents();
    };
  
    Drawer.prototype.showDrawer = function() {
      var self = this;
      this.content.scrollTop = 0;
      Util.addClass(this.element, this.showClass);
      this.getFocusableElements();
      Util.moveFocus(this.element);
      // wait for the end of transitions before moving focus
      this.element.addEventListener("transitionend", function cb(event) {
        Util.moveFocus(self.element);
        self.element.removeEventListener("transitionend", cb);
      });
      this.emitDrawerEvents('drawerIsOpen', this.selectedTrigger);
      // change the overflow of the preventScrollEl
      if(this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
    };
  
    Drawer.prototype.closeDrawer = function(target) {
      Util.removeClass(this.element, this.showClass);
      this.firstFocusable = null;
      this.lastFocusable = null;
      if(this.selectedTrigger) this.selectedTrigger.focus();
      //remove listeners
      this.cancelDrawerEvents();
      this.emitDrawerEvents('drawerIsClose', target);
      // change the overflow of the preventScrollEl
      if(this.preventScrollEl) this.preventScrollEl.style.overflow = '';
    };
  
    Drawer.prototype.initDrawerEvents = function() {
      //add event listeners
      this.element.addEventListener('keydown', this);
      this.element.addEventListener('click', this);
    };
  
    Drawer.prototype.cancelDrawerEvents = function() {
      //remove event listeners
      this.element.removeEventListener('keydown', this);
      this.element.removeEventListener('click', this);
    };
  
    Drawer.prototype.handleEvent = function (event) {
      switch(event.type) {
        case 'click': {
          this.initClick(event);
        }
        case 'keydown': {
          this.initKeyDown(event);
        }
      }
    };
  
    Drawer.prototype.initKeyDown = function(event) {
      if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
        //close drawer window on esc
        this.closeDrawer(false);
      } else if( this.isModal && (event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' )) {
        //trap focus inside drawer
        this.trapFocus(event);
      }
    };
  
    Drawer.prototype.initClick = function(event) {
      //close drawer when clicking on close button or drawer bg layer 
      if( !event.target.closest('.js-drawer__close') && !Util.hasClass(event.target, 'js-drawer') ) return;
      event.preventDefault();
      this.closeDrawer(event.target);
    };
  
    Drawer.prototype.trapFocus = function(event) {
      if( this.firstFocusable == document.activeElement && event.shiftKey) {
        //on Shift+Tab -> focus last focusable element when focus moves out of drawer
        event.preventDefault();
        this.lastFocusable.focus();
      }
      if( this.lastFocusable == document.activeElement && !event.shiftKey) {
        //on Tab -> focus first focusable element when focus moves out of drawer
        event.preventDefault();
        this.firstFocusable.focus();
      }
    }
  
    Drawer.prototype.getFocusableElements = function() {
      //get all focusable elements inside the drawer
      var allFocusable = this.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
      this.getFirstVisible(allFocusable);
      this.getLastVisible(allFocusable);
    };
  
    Drawer.prototype.getFirstVisible = function(elements) {
      //get first visible focusable element inside the drawer
      for(var i = 0; i < elements.length; i++) {
        if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
          this.firstFocusable = elements[i];
          return true;
        }
      }
    };
  
    Drawer.prototype.getLastVisible = function(elements) {
      //get last visible focusable element inside the drawer
      for(var i = elements.length - 1; i >= 0; i--) {
        if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
          this.lastFocusable = elements[i];
          return true;
        }
      }
    };
  
    Drawer.prototype.emitDrawerEvents = function(eventName, target) {
      var event = new CustomEvent(eventName, {detail: target});
      this.element.dispatchEvent(event);
    };
  
    window.Drawer = Drawer;
  
    //initialize the Drawer objects
    var drawer = document.getElementsByClassName('js-drawer');
    if( drawer.length > 0 ) {
      for( var i = 0; i < drawer.length; i++) {
        (function(i){new Drawer(drawer[i]);})(i);
      }
    }
  }());
// File#: _1_off-canvas-content

(function() {
    var OffCanvas = function(element) {
      this.element = element;
      this.wrapper = document.getElementsByClassName('js-off-canvas')[0];
      this.main = document.getElementsByClassName('off-canvas__main')[0];
      this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
      this.closeBtn = this.element.getElementsByClassName('js-off-canvas__close-btn');
      this.selectedTrigger = false;
      this.firstFocusable = null;
      this.lastFocusable = null;
      this.animating = false;
      initOffCanvas(this);
    };	
  
    function initOffCanvas(panel) {
      panel.element.setAttribute('aria-hidden', 'true');
      for(var i = 0 ; i < panel.triggers.length; i++) { // listen to the click on off-canvas content triggers
        panel.triggers[i].addEventListener('click', function(event){
          panel.selectedTrigger = event.currentTarget;
          event.preventDefault();
          togglePanel(panel);
        });
      }
  
      // listen to the triggerOpenPanel event -> open panel without a trigger button
      panel.element.addEventListener('triggerOpenPanel', function(event){
        if(event.detail) panel.selectedTrigger = event.detail;
        openPanel(panel);
      });
      // listen to the triggerClosePanel event -> open panel without a trigger button
      panel.element.addEventListener('triggerClosePanel', function(event){
        closePanel(panel);
      });
    };
  
    function togglePanel(panel) {
      var status = (panel.element.getAttribute('aria-hidden') == 'true') ? 'close' : 'open';
      if(status == 'close') openPanel(panel);
      else closePanel(panel);
    };
  
    function openPanel(panel) {
      if(panel.animating) return; // already animating
      emitPanelEvents(panel, 'openPanel', '');
      panel.animating = true;
      panel.element.setAttribute('aria-hidden', 'false');
      Util.addClass(panel.wrapper, 'off-canvas--visible');
      getFocusableElements(panel);
      var transitionEl = panel.element;
      if(panel.closeBtn.length > 0 && !Util.hasClass(panel.closeBtn[0], 'js-off-canvas__a11y-close-btn')) transitionEl = 	panel.closeBtn[0];
      transitionEl.addEventListener('transitionend', function cb(){
        // wait for the end of transition to move focus and update the animating property
        panel.animating = false;
        Util.moveFocus(panel.element);
        transitionEl.removeEventListener('transitionend', cb);
      });
      if(!transitionSupported) panel.animating = false;
      initPanelEvents(panel);
    };
  
    function closePanel(panel, bool) {
      if(panel.animating) return;
      panel.animating = true;
      panel.element.setAttribute('aria-hidden', 'true');
      Util.removeClass(panel.wrapper, 'off-canvas--visible');
      panel.main.addEventListener('transitionend', function cb(){
        panel.animating = false;
        if(panel.selectedTrigger) panel.selectedTrigger.focus();
        setTimeout(function(){panel.selectedTrigger = false;}, 10);
        panel.main.removeEventListener('transitionend', cb);
      });
      if(!transitionSupported) panel.animating = false;
      cancelPanelEvents(panel);
      emitPanelEvents(panel, 'closePanel', bool);
    };
  
    function initPanelEvents(panel) { //add event listeners
      panel.element.addEventListener('keydown', handleEvent.bind(panel));
      panel.element.addEventListener('click', handleEvent.bind(panel));
    };
  
    function cancelPanelEvents(panel) { //remove event listeners
      panel.element.removeEventListener('keydown', handleEvent.bind(panel));
      panel.element.removeEventListener('click', handleEvent.bind(panel));
    };
  
    function handleEvent(event) {
      switch(event.type) {
        case 'keydown':
          initKeyDown(this, event);
          break;
        case 'click':
          initClick(this, event);
          break;
      }
    };
  
    function initClick(panel, event) { // close panel when clicking on close button
      if( !event.target.closest('.js-off-canvas__close-btn')) return;
      event.preventDefault();
      closePanel(panel, 'close-btn');
    };
  
    function initKeyDown(panel, event) {
      if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
        //close off-canvas panel on esc
        closePanel(panel, 'key');
      } else if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside panel
        trapFocus(panel, event);
      }
    };
  
    function trapFocus(panel, event) {
      if( panel.firstFocusable == document.activeElement && event.shiftKey) {
        //on Shift+Tab -> focus last focusable element when focus moves out of panel
        event.preventDefault();
        panel.lastFocusable.focus();
      }
      if( panel.lastFocusable == document.activeElement && !event.shiftKey) {
        //on Tab -> focus first focusable element when focus moves out of panel
        event.preventDefault();
        panel.firstFocusable.focus();
      }
    };
  
    function getFocusableElements(panel) { //get all focusable elements inside the off-canvas content
      var allFocusable = panel.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
      getFirstVisible(panel, allFocusable);
      getLastVisible(panel, allFocusable);
    };
  
    function getFirstVisible(panel, elements) { //get first visible focusable element inside the off-canvas content
      for(var i = 0; i < elements.length; i++) {
        if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
          panel.firstFocusable = elements[i];
          return true;
        }
      }
    };
  
    function getLastVisible(panel, elements) { //get last visible focusable element inside the off-canvas content
      for(var i = elements.length - 1; i >= 0; i--) {
        if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
          panel.lastFocusable = elements[i];
          return true;
        }
      }
    };
  
    function emitPanelEvents(panel, eventName, target) { // emit custom event
      var event = new CustomEvent(eventName, {detail: target});
      panel.element.dispatchEvent(event);
    };
  
    //initialize the OffCanvas objects
    var offCanvas = document.getElementsByClassName('js-off-canvas__panel'),
      transitionSupported = Util.cssSupports('transition');
    if( offCanvas.length > 0 ) {
      for( var i = 0; i < offCanvas.length; i++) {
        (function(i){new OffCanvas(offCanvas[i]);})(i);
      }
    }
  }());
// File#: _1_read-more
// Usage: codyhouse.co/license
(function () {
    var ReadMore = function (element) {
      this.element = element;
      this.moreContent = this.element.getElementsByClassName(
        "js-read-more__content"
      );
      this.count = this.element.getAttribute("data-characters") || 200;
      this.counting = 0;
      this.btnClasses = this.element.getAttribute("data-btn-class");
      this.ellipsis =
        this.element.getAttribute("data-ellipsis") &&
        this.element.getAttribute("data-ellipsis") == "off"
          ? false
          : true;
      this.btnShowLabel = "Read more";
      this.btnHideLabel = "Read less";
      this.toggleOff =
        this.element.getAttribute("data-toggle") &&
        this.element.getAttribute("data-toggle") == "off"
          ? false
          : true;
      if (this.moreContent.length == 0) splitReadMore(this);
      setBtnLabels(this);
      initReadMore(this);
    };
  
    function splitReadMore(readMore) {
      splitChildren(readMore.element, readMore); // iterate through children and hide content
    }
  
    function splitChildren(parent, readMore) {
      if (readMore.counting >= readMore.count) {
        Util.addClass(parent, "js-read-more__content");
        return parent.outerHTML;
      }
      var children = parent.childNodes;
      var content = "";
      for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType == Node.TEXT_NODE) {
          content = content + wrapText(children[i], readMore);
        } else {
          content = content + splitChildren(children[i], readMore);
        }
      }
      parent.innerHTML = content;
      return parent.outerHTML;
    }
  
    function wrapText(element, readMore) {
      var content = element.textContent;
      if (content.replace(/\s/g, "").length == 0) return ""; // check if content is empty
      if (readMore.counting >= readMore.count) {
        return '<span class="js-read-more__content">' + content + "</span>";
      }
      if (readMore.counting + content.length < readMore.count) {
        readMore.counting = readMore.counting + content.length;
        return content;
      }
      var firstContent = content.substr(0, readMore.count - readMore.counting);
      firstContent = firstContent.substr(
        0,
        Math.min(firstContent.length, firstContent.lastIndexOf(" "))
      );
      var secondContent = content.substr(firstContent.length, content.length);
      readMore.counting = readMore.count;
      return (
        firstContent +
        '<span class="js-read-more__content">' +
        secondContent +
        "</span>"
      );
    }
  
    function setBtnLabels(readMore) {
      // set custom labels for read More/Less btns
      var btnLabels = readMore.element.getAttribute("data-btn-labels");
      if (btnLabels) {
        var labelsArray = btnLabels.split(",");
        readMore.btnShowLabel = labelsArray[0].trim();
        readMore.btnHideLabel = labelsArray[1].trim();
      }
    }
  
    function initReadMore(readMore) {
      // add read more/read less buttons to the markup
      readMore.moreContent = readMore.element.getElementsByClassName(
        "js-read-more__content"
      );
      if (readMore.moreContent.length == 0) {
        Util.addClass(readMore.element, "read-more--loaded");
        return;
      }
      var btnShow =
        ' <button class="js-read-more__btn ' +
        readMore.btnClasses +
        '">' +
        readMore.btnShowLabel +
        "</button>";
      var btnHide =
        ' <button class="js-read-more__btn is-hidden ' +
        readMore.btnClasses +
        '">' +
        readMore.btnHideLabel +
        "</button>";
      if (readMore.ellipsis) {
        btnShow =
          '<span class="js-read-more__ellipsis" aria-hidden="true">...</span>' +
          btnShow;
      }
  
      readMore.moreContent[readMore.moreContent.length - 1].insertAdjacentHTML(
        "afterend",
        btnHide
      );
      readMore.moreContent[0].insertAdjacentHTML("afterend", btnShow);
      resetAppearance(readMore);
      initEvents(readMore);
    }
  
    function resetAppearance(readMore) {
      // hide part of the content
      for (var i = 0; i < readMore.moreContent.length; i++)
        Util.addClass(readMore.moreContent[i], "is-hidden");
      Util.addClass(readMore.element, "read-more--loaded"); // show entire component
    }
  
    function initEvents(readMore) {
      // listen to the click on the read more/less btn
      readMore.btnToggle = readMore.element.getElementsByClassName(
        "js-read-more__btn"
      );
      readMore.ellipsis = readMore.element.getElementsByClassName(
        "js-read-more__ellipsis"
      );
  
      readMore.btnToggle[0].addEventListener("click", function (event) {
        event.preventDefault();
        updateVisibility(readMore, true);
      });
      readMore.btnToggle[1].addEventListener("click", function (event) {
        event.preventDefault();
        updateVisibility(readMore, false);
      });
    }
  
    function updateVisibility(readMore, visibile) {
      for (var i = 0; i < readMore.moreContent.length; i++)
        Util.toggleClass(readMore.moreContent[i], "is-hidden", !visibile);
      // reset btns appearance
      Util.toggleClass(readMore.btnToggle[0], "is-hidden", visibile);
      Util.toggleClass(readMore.btnToggle[1], "is-hidden", !visibile);
      if (readMore.ellipsis.length > 0)
        Util.toggleClass(readMore.ellipsis[0], "is-hidden", visibile);
      if (!readMore.toggleOff) Util.addClass(readMore.btn, "is-hidden");
      // move focus
      if (visibile) {
        var targetTabIndex = readMore.moreContent[0].getAttribute("tabindex");
        Util.moveFocus(readMore.moreContent[0]);
        resetFocusTarget(readMore.moreContent[0], targetTabIndex);
      } else {
        Util.moveFocus(readMore.btnToggle[0]);
      }
    }
  
    function resetFocusTarget(target, tabindex) {
      if (parseInt(target.getAttribute("tabindex")) < 0) {
        target.style.outline = "none";
        !tabindex && target.removeAttribute("tabindex");
      }
    }
  
    //initialize the ReadMore objects
    var readMore = document.getElementsByClassName("js-read-more");
    if (readMore.length > 0) {
      for (var i = 0; i < readMore.length; i++) {
        (function (i) {
          new ReadMore(readMore[i]);
        })(i);
      }
    }
  })();
// File#: _1_sliding-panels
// Usage: codyhouse.co/license
(function() {
    var SlidingPanels = function(element) {
      this.element = element;
      this.itemsList = this.element.getElementsByClassName('js-s-panels__projects-list');
      this.items = this.itemsList[0].getElementsByClassName('js-s-panels__project-preview');
      this.navigationToggle = this.element.getElementsByClassName('js-s-panels__nav-control');
      this.navigation = this.element.getElementsByClassName('js-s-panels__nav-wrapper');
      this.transitionLayer = this.element.getElementsByClassName('js-s-panels__overlay-layer');
      this.selectedSection = false; // will be used to store the visible project content section
      this.animating = false;
      // aria labels for the navigationToggle button
      this.toggleAriaLabels = ['Toggle navigation', 'Close Project'];
      initSlidingPanels(this);
    };
  
    function initSlidingPanels(element) {
      // detect click on toggle menu
      if(element.navigationToggle.length > 0 && element.navigation.length > 0) {
        element.navigationToggle[0].addEventListener('click', function(event) {
          if(element.animating) return;
          
          // if project is open -> close project
          if(closeProjectIfVisible(element)) return;
          
          // toggle navigation
          var openNav = Util.hasClass(element.navigation[0], 'is-hidden');
          toggleNavigation(element, openNav);
        });
      }
  
      // open project
      element.element.addEventListener('click', function(event) {
        if(element.animating) return;
  
        var link = event.target.closest('.js-s-panels__project-control');
        if(!link) return;
        event.preventDefault();
        openProject(element, event.target.closest('.js-s-panels__project-preview'), link.getAttribute('href').replace('#', ''));
      });
    };
  
    // check if there's a visible project to close and close it
    function closeProjectIfVisible(element) {
      var visibleProject = element.element.getElementsByClassName('s-panels__project-preview--selected');
      if(visibleProject.length > 0) {
        element.animating = true;
        closeProject(element);
        return true;
      }
  
      return false;
    };
  
    function toggleNavigation(element, openNavigation) {
      element.animating = true;
      if(openNavigation) Util.removeClass(element.navigation[0], 'is-hidden');
      slideProjects(element, openNavigation, false, function(){
        element.animating = false;
        if(!openNavigation) Util.addClass(element.navigation[0], 'is-hidden');
      });
      Util.toggleClass(element.navigationToggle[0], 's-panels__nav-control--arrow-down', openNavigation);
    };
  
    function openProject(element, project, id) {
      element.animating = true;
      var projectIndex = Util.getIndexInArray(element.items, project);
      // hide navigation
      Util.removeClass(element.itemsList[0], 'bg-opacity-0');
      // expand selected projects
      Util.addClass(project, 's-panels__project-preview--selected');
      // hide remaining projects
      slideProjects(element, true, projectIndex, function() {
        // reveal section content
        element.selectedSection = document.getElementById(id);
        if(element.selectedSection) Util.removeClass(element.selectedSection, 'is-hidden');
        element.animating = false;
        // trigger a custom event - this can be used to init the project content (if required)
        element.element.dispatchEvent(new CustomEvent('slidingPanelOpen', {detail: projectIndex}));
      });
      // modify toggle button appearance
      Util.addClass(element.navigationToggle[0], 's-panels__nav-control--close');
      // modify toggle button aria-label
      element.navigationToggle[0].setAttribute('aria-label', element.toggleAriaLabels[1]);
    };
  
    function closeProject(element) {
      // remove transitions from projects
      toggleTransitionProjects(element, true);
      // hide navigation
      Util.removeClass(element.itemsList[0], 'bg-opacity-0');
      // reveal transition layer
      Util.addClass(element.transitionLayer[0], 's-panels__overlay-layer--visible');
      // wait for end of transition layer effect
      element.transitionLayer[0].addEventListener('transitionend', function cb(event) {
        if(event.propertyName != 'opacity') return;
        element.transitionLayer[0].removeEventListener('transitionend', cb);
        // update projects classes
        resetProjects(element);
  
        setTimeout(function(){
          // hide transition layer
          Util.removeClass(element.transitionLayer[0], 's-panels__overlay-layer--visible');
          // reveal projects
          slideProjects(element, false, false, function() {
            Util.addClass(element.itemsList[0], 'bg-opacity-0');
            element.animating = false;
          });
        }, 200);
      });
  
      // modify toggle button appearance
      Util.removeClass(element.navigationToggle[0], 's-panels__nav-control--close');
      // modify toggle button aria-label
      element.navigationToggle[0].setAttribute('aria-label', element.toggleAriaLabels[0]);
    };
  
    function slideProjects(element, openNav, exclude, cb) {
      // projects will slide out in a random order
      var randomList = getRandomList(element.items.length, exclude);
      for(var i = 0; i < randomList.length; i++) {(function(i){
        setTimeout(function(){
          Util.toggleClass(element.items[randomList[i]], 's-panels__project-preview--hide', openNav);
          toggleProjectAccessibility(element.items[randomList[i]], openNav);
          if(cb && i == randomList.length - 1) {
            // last item to be animated -> execute callback function at the end of the animation
            element.items[randomList[i]].addEventListener('transitionend', function cbt() {
              if(event.propertyName != 'transform') return;
              if(cb) cb();
              element.items[randomList[i]].removeEventListener('transitionend', cbt);
            });
          }
        }, i*100);
      })(i);}
    };
  
    function toggleTransitionProjects(element, bool) {
      // remove transitions from project elements
      for(var i = 0; i < element.items.length; i++) {
        Util.toggleClass(element.items[i], 's-panels__project-preview--no-transition', bool);
      }
    };
  
    function resetProjects(element) {
      // reset projects classes -> remove selected/no-transition class + add hide class
      for(var i = 0; i < element.items.length; i++) {
        Util.removeClass(element.items[i], 's-panels__project-preview--selected s-panels__project-preview--no-transition');
        Util.addClass(element.items[i], 's-panels__project-preview--hide');
      }
  
      // hide project content
      if(element.selectedSection) Util.addClass(element.selectedSection, 'is-hidden');
      element.selectedSection = false;
    };
  
    function getRandomList(maxVal, exclude) {
      // get list of random integer from 0 to (maxVal - 1) excluding (exclude) if defined
      var uniqueRandoms = [];
      var randomArray = [];
      
      function makeUniqueRandom() {
        // refill the array if needed
        if (!uniqueRandoms.length) {
          for (var i = 0; i < maxVal; i++) {
            if(exclude === false || i != exclude) uniqueRandoms.push(i);
          }
        }
        var index = Math.floor(Math.random() * uniqueRandoms.length);
        var val = uniqueRandoms[index];
        // now remove that value from the array
        uniqueRandoms.splice(index, 1);
        return val;
      }
  
      for(var j = 0; j < maxVal; j++) {
        randomArray.push(makeUniqueRandom());
      }
  
      return randomArray;
    };
  
    function toggleProjectAccessibility(project, bool) {
      bool ? project.setAttribute('aria-hidden', 'true') : project.removeAttribute('aria-hidden');
      var link = project.getElementsByClassName('js-s-panels__project-control');
      if(link.length > 0) {
        bool ? link[0].setAttribute('tabindex', '-1') : link[0].removeAttribute('tabindex');
      }
    };
  
    //initialize the SlidingPanels objects
    var slidingPanels = document.getElementsByClassName('js-s-panels');
    if( slidingPanels.length > 0 ) {
      for( var i = 0; i < slidingPanels.length; i++) {
        (function(i){new SlidingPanels(slidingPanels[i]);})(i);
      }
    }
  }());
// File#: _2_drawer-navigation
// Usage: codyhouse.co/license
(function() {
    function initDrNavControl(element) {
      var circle = element.getElementsByTagName('circle');
      if(circle.length > 0) {
        // set svg attributes to create fill-in animation on click
        initCircleAttributes(element, circle[0]);
      }
  
      var drawerId = element.getAttribute('aria-controls'),
        drawer = document.getElementById(drawerId);
      if(drawer) {
        // when the drawer is closed without click (e.g., user presses 'Esc') -> reset trigger status
        drawer.addEventListener('drawerIsClose', function(event){ 
          if(!event.detail || (event.detail && !event.detail.closest('.js-dr-nav-control[aria-controls="'+drawerId+'"]')) ) resetTrigger(element);
        });
      }
    };
  
    function initCircleAttributes(element, circle) {
      // set circle stroke-dashoffset/stroke-dasharray values
      var circumference = (2*Math.PI*circle.getAttribute('r')).toFixed(2);
      circle.setAttribute('stroke-dashoffset', circumference);
      circle.setAttribute('stroke-dasharray', circumference);
      Util.addClass(element, 'dr-nav-control--ready-to-animate');
    };
  
    function resetTrigger(element) {
      Util.removeClass(element, 'anim-menu-btn--state-b'); 
    };
  
    var drNavControl = document.getElementsByClassName('js-dr-nav-control');
    if(drNavControl.length > 0) initDrNavControl(drNavControl[0]);
  }());
// File#: _2_off-canvas-navigation

(function() {
    var OffCanvasNav = function(element) {
      this.element = element;
      this.panel = this.element.getElementsByClassName('js-off-canvas__panel')[0];
      this.trigger = document.querySelectorAll('[aria-controls="'+this.panel.getAttribute('id')+'"]')[0];
      this.svgAnim = this.trigger.getElementsByTagName('circle');
      initOffCanvasNav(this);
    };
  
    function initOffCanvasNav(canvas) {
      if(transitionSupported) {
        // do not allow click on menu icon while the navigation is animating
        canvas.trigger.addEventListener('click', function(event){
          canvas.trigger.style.setProperty('pointer-events', 'none');
        });
        canvas.panel.addEventListener('openPanel', function(event){
          canvas.trigger.style.setProperty('pointer-events', 'none');
        });
        canvas.panel.addEventListener('transitionend', function(event){
          if(event.propertyName == 'visibility') {
            canvas.trigger.style.setProperty('pointer-events', '');
          }
        });
      }
  
      if(canvas.svgAnim.length > 0) { // create the circle fill-in effect
        var circumference = (2*Math.PI*canvas.svgAnim[0].getAttribute('r')).toFixed(2);
        canvas.svgAnim[0].setAttribute('stroke-dashoffset', circumference);
        canvas.svgAnim[0].setAttribute('stroke-dasharray', circumference);
        Util.addClass(canvas.trigger, 'offnav-control--ready-to-animate');
      }
      
      canvas.panel.addEventListener('closePanel', function(event){
        // if the navigation is closed using keyboard or a11y close btn -> change trigger icon appearance (from arrow to menu icon) 
        if(event.detail == 'key' || event.detail == 'close-btn') {
          canvas.trigger.click();
        }
      });
    };
  
    // init OffCanvasNav objects
    var offCanvasNav = document.getElementsByClassName('js-off-canvas--nav'),
      transitionSupported = Util.cssSupports('transition');
    if( offCanvasNav.length > 0 ) {
      for( var i = 0; i < offCanvasNav.length; i++) {
        (function(i){new OffCanvasNav(offCanvasNav[i]);})(i);
      }
    }
  }());