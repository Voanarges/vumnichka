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
// File#: _1_menu
// Usage: codyhouse.co/license
(function() {
    var Menu = function(element) {
      this.element = element;
      this.elementId = this.element.getAttribute('id');
      this.menuItems = this.element.getElementsByClassName('js-menu__content');
      this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
      this.selectedTrigger = false;
      this.menuIsOpen = false;
      this.initMenu();
      this.initMenuEvents();
    };	
  
    Menu.prototype.initMenu = function() {
      // init aria-labels
      for(var i = 0; i < this.trigger.length; i++) {
        Util.setAttributes(this.trigger[i], {'aria-expanded': 'false', 'aria-haspopup': 'true'});
      }
      // init tabindex
      for(var i = 0; i < this.menuItems.length; i++) {
        this.menuItems[i].setAttribute('tabindex', '0');
      }
    };
  
    Menu.prototype.initMenuEvents = function() {
      var self = this;
      for(var i = 0; i < this.trigger.length; i++) {(function(i){
        self.trigger[i].addEventListener('click', function(event){
          event.preventDefault();
          // if the menu had been previously opened by another trigger element -> close it first and reopen in the right position
          if(Util.hasClass(self.element, 'menu--is-visible') && self.selectedTrigger !=  self.trigger[i]) {
            self.toggleMenu(false, false); // close menu
          }
          // toggle menu
          self.selectedTrigger = self.trigger[i];
          self.toggleMenu(!Util.hasClass(self.element, 'menu--is-visible'), true);
        });
      })(i);}
      
      // keyboard events
      this.element.addEventListener('keydown', function(event) {
        // use up/down arrow to navigate list of menu items
        if( !Util.hasClass(event.target, 'js-menu__content') ) return;
        if( (event.keyCode && event.keyCode == 40) || (event.key && event.key.toLowerCase() == 'arrowdown') ) {
          self.navigateItems(event, 'next');
        } else if( (event.keyCode && event.keyCode == 38) || (event.key && event.key.toLowerCase() == 'arrowup') ) {
          self.navigateItems(event, 'prev');
        }
      });
    };
  
    Menu.prototype.toggleMenu = function(bool, moveFocus) {
      var self = this;
      // toggle menu visibility
      Util.toggleClass(this.element, 'menu--is-visible', bool);
      this.menuIsOpen = bool;
      if(bool) {
        this.selectedTrigger.setAttribute('aria-expanded', 'true');
        Util.moveFocus(this.menuItems[0]);
        this.element.addEventListener("transitionend", function(event) {Util.moveFocus(self.menuItems[0]);}, {once: true});
        // position the menu element
        this.positionMenu();
        // add class to menu trigger
        Util.addClass(this.selectedTrigger, 'menu-control--active');
      } else if(this.selectedTrigger) {
        this.selectedTrigger.setAttribute('aria-expanded', 'false');
        if(moveFocus) Util.moveFocus(this.selectedTrigger);
        // remove class from menu trigger
        Util.removeClass(this.selectedTrigger, 'menu-control--active');
        this.selectedTrigger = false;
      }
    };
  
    Menu.prototype.positionMenu = function(event, direction) {
      var selectedTriggerPosition = this.selectedTrigger.getBoundingClientRect(),
        menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
        // menuOnTop = window.innerHeight < selectedTriggerPosition.bottom + this.element.offsetHeight;
        
      var left = selectedTriggerPosition.left,
        right = (window.innerWidth - selectedTriggerPosition.right),
        isRight = (window.innerWidth < selectedTriggerPosition.left + this.element.offsetWidth);
  
      var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
        vertical = menuOnTop
          ? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
          : 'top: '+selectedTriggerPosition.bottom+'px;';
      // check right position is correct -> otherwise set left to 0
      if( isRight && (right + this.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - this.element.offsetWidth)/2)+'px;';
      var maxHeight = menuOnTop ? selectedTriggerPosition.top - 20 : window.innerHeight - selectedTriggerPosition.bottom - 20;
      this.element.setAttribute('style', horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
    };
  
    Menu.prototype.navigateItems = function(event, direction) {
      event.preventDefault();
      var index = Util.getIndexInArray(this.menuItems, event.target),
        nextIndex = direction == 'next' ? index + 1 : index - 1;
      if(nextIndex < 0) nextIndex = this.menuItems.length - 1;
      if(nextIndex > this.menuItems.length - 1) nextIndex = 0;
      Util.moveFocus(this.menuItems[nextIndex]);
    };
  
    Menu.prototype.checkMenuFocus = function() {
      var menuParent = document.activeElement.closest('.js-menu');
      if (!menuParent || !this.element.contains(menuParent)) this.toggleMenu(false, false);
    };
  
    Menu.prototype.checkMenuClick = function(target) {
      if( !this.element.contains(target) && !target.closest('[aria-controls="'+this.elementId+'"]')) this.toggleMenu(false);
    };
  
    window.Menu = Menu;
  
    //initialize the Menu objects
    var menus = document.getElementsByClassName('js-menu');
    if( menus.length > 0 ) {
      var menusArray = [];
      var scrollingContainers = [];
      for( var i = 0; i < menus.length; i++) {
        (function(i){
          menusArray.push(new Menu(menus[i]));
          var scrollableElement = menus[i].getAttribute('data-scrollable-element');
          if(scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
        })(i);
      }
  
      // listen for key events
      window.addEventListener('keyup', function(event){
        if( event.keyCode && event.keyCode == 9 || event.key && event.key.toLowerCase() == 'tab' ) {
          //close menu if focus is outside menu element
          menusArray.forEach(function(element){
            element.checkMenuFocus();
          });
        } else if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
          // close menu on 'Esc'
          menusArray.forEach(function(element){
            element.toggleMenu(false, false);
          });
        } 
      });
      // close menu when clicking outside it
      window.addEventListener('click', function(event){
        menusArray.forEach(function(element){
          element.checkMenuClick(event.target);
        });
      });
      // on resize -> close all menu elements
      window.addEventListener('resize', function(event){
        menusArray.forEach(function(element){
          element.toggleMenu(false, false);
        });
      });
      // on scroll -> close all menu elements
      window.addEventListener('scroll', function(event){
        menusArray.forEach(function(element){
          if(element.menuIsOpen) element.toggleMenu(false, false);
        });
      });
      // take into account additinal scrollable containers
      for(var j = 0; j < scrollingContainers.length; j++) {
        var scrollingContainer = document.querySelector(scrollingContainers[j]);
        if(scrollingContainer) {
          scrollingContainer.addEventListener('scroll', function(event){
            menusArray.forEach(function(element){
              if(element.menuIsOpen) element.toggleMenu(false, false);
            });
          });
        }
      }
    }
  }());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
    var Modal = function(element) {
      this.element = element;
      this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
      this.firstFocusable = null;
      this.lastFocusable = null;
      this.moveFocusEl = null; // focus will be moved to this element when modal is open
      this.modalFocus = this.element.getAttribute('data-modal-first-focus') ? this.element.querySelector(this.element.getAttribute('data-modal-first-focus')) : null;
      this.selectedTrigger = null;
      this.preventScrollEl = this.getPreventScrollEl();
      this.showClass = "modal--is-visible";
      this.initModal();
    };
  
    Modal.prototype.getPreventScrollEl = function() {
      var scrollEl = false;
      var querySelector = this.element.getAttribute('data-modal-prevent-scroll');
      if(querySelector) scrollEl = document.querySelector(querySelector);
      return scrollEl;
    };
  
    Modal.prototype.initModal = function() {
      var self = this;
      //open modal when clicking on trigger buttons
      if ( this.triggers ) {
        for(var i = 0; i < this.triggers.length; i++) {
          this.triggers[i].addEventListener('click', function(event) {
            event.preventDefault();
            if(Util.hasClass(self.element, self.showClass)) {
              self.closeModal();
              return;
            }
            self.selectedTrigger = event.currentTarget;
            self.showModal();
            self.initModalEvents();
          });
        }
      }
  
      // listen to the openModal event -> open modal without a trigger button
      this.element.addEventListener('openModal', function(event){
        if(event.detail) self.selectedTrigger = event.detail;
        self.showModal();
        self.initModalEvents();
      });
  
      // listen to the closeModal event -> close modal without a trigger button
      this.element.addEventListener('closeModal', function(event){
        if(event.detail) self.selectedTrigger = event.detail;
        self.closeModal();
      });
  
      // if modal is open by default -> initialise modal events
      if(Util.hasClass(this.element, this.showClass)) this.initModalEvents();
    };
  
    Modal.prototype.showModal = function() {
      var self = this;
      Util.addClass(this.element, this.showClass);
      this.getFocusableElements();
      if(this.moveFocusEl) {
        this.moveFocusEl.focus();
        // wait for the end of transitions before moving focus
        this.element.addEventListener("transitionend", function cb(event) {
          self.moveFocusEl.focus();
          self.element.removeEventListener("transitionend", cb);
        });
      }
      this.emitModalEvents('modalIsOpen');
      // change the overflow of the preventScrollEl
      if(this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
    };
  
    Modal.prototype.closeModal = function() {
      if(!Util.hasClass(this.element, this.showClass)) return;
      Util.removeClass(this.element, this.showClass);
      this.firstFocusable = null;
      this.lastFocusable = null;
      this.moveFocusEl = null;
      if(this.selectedTrigger) this.selectedTrigger.focus();
      //remove listeners
      this.cancelModalEvents();
      this.emitModalEvents('modalIsClose');
      // change the overflow of the preventScrollEl
      if(this.preventScrollEl) this.preventScrollEl.style.overflow = '';
    };
  
    Modal.prototype.initModalEvents = function() {
      //add event listeners
      this.element.addEventListener('keydown', this);
      this.element.addEventListener('click', this);
    };
  
    Modal.prototype.cancelModalEvents = function() {
      //remove event listeners
      this.element.removeEventListener('keydown', this);
      this.element.removeEventListener('click', this);
    };
  
    Modal.prototype.handleEvent = function (event) {
      switch(event.type) {
        case 'click': {
          this.initClick(event);
        }
        case 'keydown': {
          this.initKeyDown(event);
        }
      }
    };
  
    Modal.prototype.initKeyDown = function(event) {
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside modal
        this.trapFocus(event);
      } else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
        event.preventDefault();
        this.closeModal(); // close modal when pressing Enter on close button
      }	
    };
  
    Modal.prototype.initClick = function(event) {
      //close modal when clicking on close button or modal bg layer 
      if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
      event.preventDefault();
      this.closeModal();
    };
  
    Modal.prototype.trapFocus = function(event) {
      if( this.firstFocusable == document.activeElement && event.shiftKey) {
        //on Shift+Tab -> focus last focusable element when focus moves out of modal
        event.preventDefault();
        this.lastFocusable.focus();
      }
      if( this.lastFocusable == document.activeElement && !event.shiftKey) {
        //on Tab -> focus first focusable element when focus moves out of modal
        event.preventDefault();
        this.firstFocusable.focus();
      }
    }
  
    Modal.prototype.getFocusableElements = function() {
      //get all focusable elements inside the modal
      var allFocusable = this.element.querySelectorAll(focusableElString);
      this.getFirstVisible(allFocusable);
      this.getLastVisible(allFocusable);
      this.getFirstFocusable();
    };
  
    Modal.prototype.getFirstVisible = function(elements) {
      //get first visible focusable element inside the modal
      for(var i = 0; i < elements.length; i++) {
        if( isVisible(elements[i]) ) {
          this.firstFocusable = elements[i];
          break;
        }
      }
    };
  
    Modal.prototype.getLastVisible = function(elements) {
      //get last visible focusable element inside the modal
      for(var i = elements.length - 1; i >= 0; i--) {
        if( isVisible(elements[i]) ) {
          this.lastFocusable = elements[i];
          break;
        }
      }
    };
  
    Modal.prototype.getFirstFocusable = function() {
      if(!this.modalFocus || !Element.prototype.matches) {
        this.moveFocusEl = this.firstFocusable;
        return;
      }
      var containerIsFocusable = this.modalFocus.matches(focusableElString);
      if(containerIsFocusable) {
        this.moveFocusEl = this.modalFocus;
      } else {
        this.moveFocusEl = false;
        var elements = this.modalFocus.querySelectorAll(focusableElString);
        for(var i = 0; i < elements.length; i++) {
          if( isVisible(elements[i]) ) {
            this.moveFocusEl = elements[i];
            break;
          }
        }
        if(!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
      }
    };
  
    Modal.prototype.emitModalEvents = function(eventName) {
      var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
      this.element.dispatchEvent(event);
    };
  
    function isVisible(element) {
      return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
    };
  
    window.Modal = Modal;
  
    //initialize the Modal objects
    var modals = document.getElementsByClassName('js-modal');
    // generic focusable elements string selector
    var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
    if( modals.length > 0 ) {
      var modalArrays = [];
      for( var i = 0; i < modals.length; i++) {
        (function(i){modalArrays.push(new Modal(modals[i]));})(i);
      }
  
      window.addEventListener('keydown', function(event){ //close modal window on esc
        if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
          for( var i = 0; i < modalArrays.length; i++) {
            (function(i){modalArrays[i].closeModal();})(i);
          };
        }
      });
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
// File#: _1_swipe-content
(function() {
    var SwipeContent = function(element) {
      this.element = element;
      this.delta = [false, false];
      this.dragging = false;
      this.intervalId = false;
      initSwipeContent(this);
    };
  
    function initSwipeContent(content) {
      content.element.addEventListener('mousedown', handleEvent.bind(content));
      content.element.addEventListener('touchstart', handleEvent.bind(content), {passive: true});
    };
  
    function initDragging(content) {
      //add event listeners
      content.element.addEventListener('mousemove', handleEvent.bind(content));
      content.element.addEventListener('touchmove', handleEvent.bind(content), {passive: true});
      content.element.addEventListener('mouseup', handleEvent.bind(content));
      content.element.addEventListener('mouseleave', handleEvent.bind(content));
      content.element.addEventListener('touchend', handleEvent.bind(content));
    };
  
    function cancelDragging(content) {
      //remove event listeners
      if(content.intervalId) {
        (!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
        content.intervalId = false;
      }
      content.element.removeEventListener('mousemove', handleEvent.bind(content));
      content.element.removeEventListener('touchmove', handleEvent.bind(content));
      content.element.removeEventListener('mouseup', handleEvent.bind(content));
      content.element.removeEventListener('mouseleave', handleEvent.bind(content));
      content.element.removeEventListener('touchend', handleEvent.bind(content));
    };
  
    function handleEvent(event) {
      switch(event.type) {
        case 'mousedown':
        case 'touchstart':
          startDrag(this, event);
          break;
        case 'mousemove':
        case 'touchmove':
          drag(this, event);
          break;
        case 'mouseup':
        case 'mouseleave':
        case 'touchend':
          endDrag(this, event);
          break;
      }
    };
  
    function startDrag(content, event) {
      content.dragging = true;
      // listen to drag movements
      initDragging(content);
      content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
      // emit drag start event
      emitSwipeEvents(content, 'dragStart', content.delta, event.target);
    };
  
    function endDrag(content, event) {
      cancelDragging(content);
      // credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
      var dx = parseInt(unify(event).clientX), 
        dy = parseInt(unify(event).clientY);
      
      // check if there was a left/right swipe
      if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
        var s = getSign(dx - content.delta[0]);
        
        if(Math.abs(dx - content.delta[0]) > 30) {
          (s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);	
        }
        
        content.delta[0] = false;
      }
      // check if there was a top/bottom swipe
      if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
          var y = getSign(dy - content.delta[1]);
  
          if(Math.abs(dy - content.delta[1]) > 30) {
            (y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
        }
  
        content.delta[1] = false;
      }
      // emit drag end event
      emitSwipeEvents(content, 'dragEnd', [dx, dy]);
      content.dragging = false;
    };
  
    function drag(content, event) {
      if(!content.dragging) return;
      // emit dragging event with coordinates
      (!window.requestAnimationFrame) 
        ? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250) 
        : content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
    };
  
    function emitDrag(event) {
      emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
    };
  
    function unify(event) { 
      // unify mouse and touch events
      return event.changedTouches ? event.changedTouches[0] : event; 
    };
  
    function emitSwipeEvents(content, eventName, detail, el) {
      var trigger = false;
      if(el) trigger = el;
      // emit event with coordinates
      var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1], origin: trigger}});
      content.element.dispatchEvent(event);
    };
  
    function getSign(x) {
      if(!Math.sign) {
        return ((x > 0) - (x < 0)) || +x;
      } else {
        return Math.sign(x);
      }
    };
  
    window.SwipeContent = SwipeContent;
    
    //initialize the SwipeContent objects
    var swipe = document.getElementsByClassName('js-swipe-content');
    if( swipe.length > 0 ) {
      for( var i = 0; i < swipe.length; i++) {
        (function(i){new SwipeContent(swipe[i]);})(i);
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
// File#: _2_menu-bar
// Usage: codyhouse.co/license
(function() {
    var MenuBar = function(element) {
      this.element = element;
      this.items = Util.getChildrenByClassName(this.element, 'menu-bar__item');
      this.mobHideItems = this.element.getElementsByClassName('menu-bar__item--hide');
      this.moreItemsTrigger = this.element.getElementsByClassName('js-menu-bar__trigger');
      initMenuBar(this);
    };
  
    function initMenuBar(menu) {
      setMenuTabIndex(menu); // set correct tabindexes for menu item
      initMenuBarMarkup(menu); // create additional markup
      checkMenuLayout(menu); // set menu layout
      Util.addClass(menu.element, 'menu-bar--loaded'); // reveal menu
  
      // custom event emitted when window is resized
      menu.element.addEventListener('update-menu-bar', function(event){
        checkMenuLayout(menu);
        if(menu.menuInstance) menu.menuInstance.toggleMenu(false, false); // close dropdown
      });
  
      // keyboard events 
      // open dropdown when pressing Enter on trigger element
      if(menu.moreItemsTrigger.length > 0) {
        menu.moreItemsTrigger[0].addEventListener('keydown', function(event) {
          if( (event.keyCode && event.keyCode == 13) || (event.key && event.key.toLowerCase() == 'enter') ) {
            if(!menu.menuInstance) return;
            menu.menuInstance.selectedTrigger = menu.moreItemsTrigger[0];
            menu.menuInstance.toggleMenu(!Util.hasClass(menu.subMenu, 'menu--is-visible'), true);
          }
        });
  
        // close dropdown on esc
        menu.subMenu.addEventListener('keydown', function(event) {
          if((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape')) { // close submenu on esc
            if(menu.menuInstance) menu.menuInstance.toggleMenu(false, true);
          }
        });
      }
      
      // navigate menu items using left/right arrows
      menu.element.addEventListener('keydown', function(event) {
        if( (event.keyCode && event.keyCode == 39) || (event.key && event.key.toLowerCase() == 'arrowright') ) {
          navigateItems(menu.items, event, 'next');
        } else if( (event.keyCode && event.keyCode == 37) || (event.key && event.key.toLowerCase() == 'arrowleft') ) {
          navigateItems(menu.items, event, 'prev');
        }
      });
    };
  
    function setMenuTabIndex(menu) { // set tabindexes for the menu items to allow keyboard navigation
      var nextItem = false;
      for(var i = 0; i < menu.items.length; i++ ) {
        if(i == 0 || nextItem) menu.items[i].setAttribute('tabindex', '0');
        else menu.items[i].setAttribute('tabindex', '-1');
        if(i == 0 && menu.moreItemsTrigger.length > 0) nextItem = true;
        else nextItem = false;
      }
    };
  
    function initMenuBarMarkup(menu) {
      if(menu.mobHideItems.length == 0 ) { // no items to hide on mobile - remove trigger
        if(menu.moreItemsTrigger.length > 0) menu.element.removeChild(menu.moreItemsTrigger[0]);
        return;
      }
  
      if(menu.moreItemsTrigger.length == 0) return;
  
      // create the markup for the Menu element
      var content = '';
      menu.menuControlId = 'submenu-bar-'+Date.now();
      for(var i = 0; i < menu.mobHideItems.length; i++) {
        var item = menu.mobHideItems[i].cloneNode(true),
          svg = item.getElementsByTagName('svg')[0],
          label = item.getElementsByClassName('menu-bar__label')[0];
  
        svg.setAttribute('class', 'icon menu__icon');
        content = content + '<li role="menuitem"><span class="menu__content js-menu__content">'+svg.outerHTML+'<span>'+label.innerHTML+'</span></span></li>';
      }
  
      Util.setAttributes(menu.moreItemsTrigger[0], {'role': 'button', 'aria-expanded': 'false', 'aria-controls': menu.menuControlId, 'aria-haspopup': 'true'});
  
      var subMenu = document.createElement('menu'),
        customClass = menu.element.getAttribute('data-menu-class');
      Util.setAttributes(subMenu, {'id': menu.menuControlId, 'class': 'menu js-menu '+customClass});
      subMenu.innerHTML = content;
      document.body.appendChild(subMenu);
  
      menu.subMenu = subMenu;
      menu.subItems = subMenu.getElementsByTagName('li');
  
      menu.menuInstance = new Menu(menu.subMenu); // this will handle the dropdown behaviour
    };
  
    function checkMenuLayout(menu) { // switch from compressed to expanded layout and viceversa
      var layout = getComputedStyle(menu.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
      Util.toggleClass(menu.element, 'menu-bar--collapsed', layout == 'collapsed');
    };
  
    function navigateItems(list, event, direction, prevIndex) { // keyboard navigation among menu items
      event.preventDefault();
      var index = (typeof prevIndex !== 'undefined') ? prevIndex : Util.getIndexInArray(list, event.target),
        nextIndex = direction == 'next' ? index + 1 : index - 1;
      if(nextIndex < 0) nextIndex = list.length - 1;
      if(nextIndex > list.length - 1) nextIndex = 0;
      // check if element is visible before moving focus
      (list[nextIndex].offsetParent === null) ? navigateItems(list, event, direction, nextIndex) : Util.moveFocus(list[nextIndex]);
    };
  
    function checkMenuClick(menu, target) { // close dropdown when clicking outside the menu element
      if(menu.menuInstance && !menu.moreItemsTrigger[0].contains(target) && !menu.subMenu.contains(target)) menu.menuInstance.toggleMenu(false, false);
    };
  
    // init MenuBars objects
    var menuBars = document.getElementsByClassName('js-menu-bar');
    if( menuBars.length > 0 ) {
      var j = 0,
        menuBarArray = [];
      for( var i = 0; i < menuBars.length; i++) {
        var beforeContent = getComputedStyle(menuBars[i], ':before').getPropertyValue('content');
        if(beforeContent && beforeContent !='' && beforeContent !='none') {
          (function(i){menuBarArray.push(new MenuBar(menuBars[i]));})(i);
          j = j + 1;
        }
      }
      
      if(j > 0) {
        var resizingId = false,
          customEvent = new CustomEvent('update-menu-bar');
        // update Menu Bar layout on resize  
        window.addEventListener('resize', function(event){
          clearTimeout(resizingId);
          resizingId = setTimeout(doneResizing, 150);
        });
  
        // close menu when clicking outside it
        window.addEventListener('click', function(event){
          menuBarArray.forEach(function(element){
            checkMenuClick(element, event.target);
          });
        });
  
        function doneResizing() {
          for( var i = 0; i < menuBars.length; i++) {
            (function(i){menuBars[i].dispatchEvent(customEvent)})(i);
          };
        };
      }
    }
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
// File#: _2_slideshow
// Usage: codyhouse.co/license
(function() {
    var Slideshow = function(opts) {
      this.options = Util.extend(Slideshow.defaults , opts);
      this.element = this.options.element;
      this.items = this.element.getElementsByClassName('js-slideshow__item');
      this.controls = this.element.getElementsByClassName('js-slideshow__control'); 
      this.selectedSlide = 0;
      this.autoplayId = false;
      this.autoplayPaused = false;
      this.navigation = false;
      this.navCurrentLabel = false;
      this.ariaLive = false;
      this.moveFocus = false;
      this.animating = false;
      this.supportAnimation = Util.cssSupports('transition');
      this.animationOff = (!Util.hasClass(this.element, 'slideshow--transition-fade') && !Util.hasClass(this.element, 'slideshow--transition-slide') && !Util.hasClass(this.element, 'slideshow--transition-prx'));
      this.animationType = Util.hasClass(this.element, 'slideshow--transition-prx') ? 'prx' : 'slide';
      this.animatingClass = 'slideshow--is-animating';
      initSlideshow(this);
      initSlideshowEvents(this);
      initAnimationEndEvents(this);
    };
  
    Slideshow.prototype.showNext = function() {
      showNewItem(this, this.selectedSlide + 1, 'next');
    };
  
    Slideshow.prototype.showPrev = function() {
      showNewItem(this, this.selectedSlide - 1, 'prev');
    };
  
    Slideshow.prototype.showItem = function(index) {
      showNewItem(this, index, false);
    };
  
    Slideshow.prototype.startAutoplay = function() {
      var self = this;
      if(this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
        self.autoplayId = setInterval(function(){
          self.showNext();
        }, self.options.autoplayInterval);
      }
    };
  
    Slideshow.prototype.pauseAutoplay = function() {
      var self = this;
      if(this.options.autoplay) {
        clearInterval(self.autoplayId);
        self.autoplayId = false;
      }
    };
  
    function initSlideshow(slideshow) { // basic slideshow settings
      // if no slide has been selected -> select the first one
      if(slideshow.element.getElementsByClassName('slideshow__item--selected').length < 1) Util.addClass(slideshow.items[0], 'slideshow__item--selected');
      slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('slideshow__item--selected')[0]);
      // create an element that will be used to announce the new visible slide to SR
      var srLiveArea = document.createElement('div');
      Util.setAttributes(srLiveArea, {'class': 'sr-only js-slideshow__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
      slideshow.element.appendChild(srLiveArea);
      slideshow.ariaLive = srLiveArea;
    };
  
    function initSlideshowEvents(slideshow) {
      // if slideshow navigation is on -> create navigation HTML and add event listeners
      if(slideshow.options.navigation) {
        // check if navigation has already been included
        if(slideshow.element.getElementsByClassName('js-slideshow__navigation').length == 0) {
          var navigation = document.createElement('ol'),
            navChildren = '';
  
          var navClasses = slideshow.options.navigationClass+' js-slideshow__navigation';
          if(slideshow.items.length <= 1) {
            navClasses = navClasses + ' is-hidden';
          }
          
          navigation.setAttribute('class', navClasses);
          for(var i = 0; i < slideshow.items.length; i++) {
            var className = (i == slideshow.selectedSlide) ? 'class="'+slideshow.options.navigationItemClass+' '+slideshow.options.navigationItemClass+'--selected js-slideshow__nav-item"' :  'class="'+slideshow.options.navigationItemClass+' js-slideshow__nav-item"',
              navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-slideshow__nav-current-label">Current Item</span>' : '';
            navChildren = navChildren + '<li '+className+'><button class="reset"><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</button></li>';
          }
          navigation.innerHTML = navChildren;
          slideshow.element.appendChild(navigation);
        }
        
        slideshow.navCurrentLabel = slideshow.element.getElementsByClassName('js-slideshow__nav-current-label')[0]; 
        slideshow.navigation = slideshow.element.getElementsByClassName('js-slideshow__nav-item');
  
        var dotsNavigation = slideshow.element.getElementsByClassName('js-slideshow__navigation')[0];
  
        dotsNavigation.addEventListener('click', function(event){
          navigateSlide(slideshow, event, true);
        });
        dotsNavigation.addEventListener('keyup', function(event){
          navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
        });
      }
      // slideshow arrow controls
      if(slideshow.controls.length > 0) {
        // hide controls if one item available
        if(slideshow.items.length <= 1) {
          Util.addClass(slideshow.controls[0], 'is-hidden');
          Util.addClass(slideshow.controls[1], 'is-hidden');
        }
        slideshow.controls[0].addEventListener('click', function(event){
          event.preventDefault();
          slideshow.showPrev();
          updateAriaLive(slideshow);
        });
        slideshow.controls[1].addEventListener('click', function(event){
          event.preventDefault();
          slideshow.showNext();
          updateAriaLive(slideshow);
        });
      }
      // swipe events
      if(slideshow.options.swipe) {
        //init swipe
        new SwipeContent(slideshow.element);
        slideshow.element.addEventListener('swipeLeft', function(event){
          slideshow.showNext();
        });
        slideshow.element.addEventListener('swipeRight', function(event){
          slideshow.showPrev();
        });
      }
      // autoplay
      if(slideshow.options.autoplay) {
        slideshow.startAutoplay();
        // pause autoplay if user is interacting with the slideshow
        if(!slideshow.options.autoplayOnHover) {
          slideshow.element.addEventListener('mouseenter', function(event){
            slideshow.pauseAutoplay();
            slideshow.autoplayPaused = true;
          });
          slideshow.element.addEventListener('mouseleave', function(event){
            slideshow.autoplayPaused = false;
            slideshow.startAutoplay();
          });
        }
        if(!slideshow.options.autoplayOnFocus) {
          slideshow.element.addEventListener('focusin', function(event){
            slideshow.pauseAutoplay();
            slideshow.autoplayPaused = true;
          });
          slideshow.element.addEventListener('focusout', function(event){
            slideshow.autoplayPaused = false;
            slideshow.startAutoplay();
          });
        }
      }
      // detect if external buttons control the slideshow
      var slideshowId = slideshow.element.getAttribute('id');
      if(slideshowId) {
        var externalControls = document.querySelectorAll('[data-controls="'+slideshowId+'"]');
        for(var i = 0; i < externalControls.length; i++) {
          (function(i){externalControlSlide(slideshow, externalControls[i]);})(i);
        }
      }
      // custom event to trigger selection of a new slide element
      slideshow.element.addEventListener('selectNewItem', function(event){
        // check if slide is already selected
        if(event.detail) {
          if(event.detail - 1 == slideshow.selectedSlide) return;
          showNewItem(slideshow, event.detail - 1, false);
        }
      });
  
      // keyboard navigation
      slideshow.element.addEventListener('keydown', function(event){
        if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
          slideshow.showNext();
        } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
          slideshow.showPrev();
        }
      });
    };
  
    function navigateSlide(slideshow, event, keyNav) { 
      // user has interacted with the slideshow navigation -> update visible slide
      var target = ( Util.hasClass(event.target, 'js-slideshow__nav-item') ) ? event.target : event.target.closest('.js-slideshow__nav-item');
      if(keyNav && target && !Util.hasClass(target, 'slideshow__nav-item--selected')) {
        slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
        slideshow.moveFocus = true;
        updateAriaLive(slideshow);
      }
    };
  
    function initAnimationEndEvents(slideshow) {
      // remove animation classes at the end of a slide transition
      for( var i = 0; i < slideshow.items.length; i++) {
        (function(i){
          slideshow.items[i].addEventListener('animationend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
          slideshow.items[i].addEventListener('transitionend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
        })(i);
      }
    };
  
    function resetAnimationEnd(slideshow, item) {
      setTimeout(function(){ // add a delay between the end of animation and slideshow reset - improve animation performance
        if(Util.hasClass(item,'slideshow__item--selected')) {
          if(slideshow.moveFocus) Util.moveFocus(item);
          emitSlideshowEvent(slideshow, 'newItemVisible', slideshow.selectedSlide);
          slideshow.moveFocus = false;
        }
        Util.removeClass(item, 'slideshow__item--'+slideshow.animationType+'-out-left slideshow__item--'+slideshow.animationType+'-out-right slideshow__item--'+slideshow.animationType+'-in-left slideshow__item--'+slideshow.animationType+'-in-right');
        item.removeAttribute('aria-hidden');
        slideshow.animating = false;
        Util.removeClass(slideshow.element, slideshow.animatingClass); 
      }, 100);
    };
  
    function showNewItem(slideshow, index, bool) {
      if(slideshow.items.length <= 1) return;
      if(slideshow.animating && slideshow.supportAnimation) return;
      slideshow.animating = true;
      Util.addClass(slideshow.element, slideshow.animatingClass); 
      if(index < 0) index = slideshow.items.length - 1;
      else if(index >= slideshow.items.length) index = 0;
      // skip slideshow item if it is hidden
      if(bool && Util.hasClass(slideshow.items[index], 'is-hidden')) {
        slideshow.animating = false;
        index = bool == 'next' ? index + 1 : index - 1;
        showNewItem(slideshow, index, bool);
        return;
      }
      // index of new slide is equal to index of slide selected item
      if(index == slideshow.selectedSlide) {
        slideshow.animating = false;
        return;
      }
      var exitItemClass = getExitItemClass(slideshow, bool, slideshow.selectedSlide, index);
      var enterItemClass = getEnterItemClass(slideshow, bool, slideshow.selectedSlide, index);
      // transition between slides
      if(!slideshow.animationOff) Util.addClass(slideshow.items[slideshow.selectedSlide], exitItemClass);
      Util.removeClass(slideshow.items[slideshow.selectedSlide], 'slideshow__item--selected');
      slideshow.items[slideshow.selectedSlide].setAttribute('aria-hidden', 'true'); //hide to sr element that is exiting the viewport
      if(slideshow.animationOff) {
        Util.addClass(slideshow.items[index], 'slideshow__item--selected');
      } else {
        Util.addClass(slideshow.items[index], enterItemClass+' slideshow__item--selected');
      }
      // reset slider navigation appearance
      resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
      slideshow.selectedSlide = index;
      // reset autoplay
      slideshow.pauseAutoplay();
      slideshow.startAutoplay();
      // reset controls/navigation color themes
      resetSlideshowTheme(slideshow, index);
      // emit event
      emitSlideshowEvent(slideshow, 'newItemSelected', slideshow.selectedSlide);
      if(slideshow.animationOff) {
        slideshow.animating = false;
        Util.removeClass(slideshow.element, slideshow.animatingClass);
      }
    };
  
    function getExitItemClass(slideshow, bool, oldIndex, newIndex) {
      var className = '';
      if(bool) {
        className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-out-right' : 'slideshow__item--'+slideshow.animationType+'-out-left'; 
      } else {
        className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-out-left' : 'slideshow__item--'+slideshow.animationType+'-out-right';
      }
      return className;
    };
  
    function getEnterItemClass(slideshow, bool, oldIndex, newIndex) {
      var className = '';
      if(bool) {
        className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-in-right' : 'slideshow__item--'+slideshow.animationType+'-in-left'; 
      } else {
        className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-in-left' : 'slideshow__item--'+slideshow.animationType+'-in-right';
      }
      return className;
    };
  
    function resetSlideshowNav(slideshow, newIndex, oldIndex) {
      if(slideshow.navigation) {
        Util.removeClass(slideshow.navigation[oldIndex], 'slideshow__nav-item--selected');
        Util.addClass(slideshow.navigation[newIndex], 'slideshow__nav-item--selected');
        slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
        slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
      }
    };
  
    function resetSlideshowTheme(slideshow, newIndex) {
      var dataTheme = slideshow.items[newIndex].getAttribute('data-theme');
      if(dataTheme) {
        if(slideshow.navigation) slideshow.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
        if(slideshow.controls[0]) slideshow.controls[0].parentElement.setAttribute('data-theme', dataTheme);
      } else {
        if(slideshow.navigation) slideshow.navigation[0].parentElement.removeAttribute('data-theme');
        if(slideshow.controls[0]) slideshow.controls[0].parentElement.removeAttribute('data-theme');
      }
    };
  
    function emitSlideshowEvent(slideshow, eventName, detail) {
      var event = new CustomEvent(eventName, {detail: detail});
      slideshow.element.dispatchEvent(event);
    };
  
    function updateAriaLive(slideshow) {
      slideshow.ariaLive.innerHTML = 'Item '+(slideshow.selectedSlide + 1)+' of '+slideshow.items.length;
    };
  
    function externalControlSlide(slideshow, button) { // control slideshow using external element
      button.addEventListener('click', function(event){
        var index = button.getAttribute('data-index');
        if(!index || index == slideshow.selectedSlide + 1) return;
        event.preventDefault();
        showNewItem(slideshow, index - 1, false);
      });
    };
  
    Slideshow.defaults = {
      element : '',
      navigation : true,
      autoplay : false,
      autoplayOnHover: false,
      autoplayOnFocus: false,
      autoplayInterval: 5000,
      navigationItemClass: 'slideshow__nav-item',
      navigationClass: 'slideshow__navigation',
      swipe: false
    };
  
    window.Slideshow = Slideshow;
    
    //initialize the Slideshow objects
    var slideshows = document.getElementsByClassName('js-slideshow');
    if( slideshows.length > 0 ) {
      for( var i = 0; i < slideshows.length; i++) {
        (function(i){
          var navigation = (slideshows[i].getAttribute('data-navigation') && slideshows[i].getAttribute('data-navigation') == 'off') ? false : true,
            autoplay = (slideshows[i].getAttribute('data-autoplay') && slideshows[i].getAttribute('data-autoplay') == 'on') ? true : false,
            autoplayOnHover = (slideshows[i].getAttribute('data-autoplay-hover') && slideshows[i].getAttribute('data-autoplay-hover') == 'on') ? true : false,
            autoplayOnFocus = (slideshows[i].getAttribute('data-autoplay-focus') && slideshows[i].getAttribute('data-autoplay-focus') == 'on') ? true : false,
            autoplayInterval = (slideshows[i].getAttribute('data-autoplay-interval')) ? slideshows[i].getAttribute('data-autoplay-interval') : 5000,
            swipe = (slideshows[i].getAttribute('data-swipe') && slideshows[i].getAttribute('data-swipe') == 'on') ? true : false,
            navigationItemClass = slideshows[i].getAttribute('data-navigation-item-class') ? slideshows[i].getAttribute('data-navigation-item-class') : 'slideshow__nav-item',
            navigationClass = slideshows[i].getAttribute('data-navigation-class') ? slideshows[i].getAttribute('data-navigation-class') : 'slideshow__navigation';
          new Slideshow({element: slideshows[i], navigation: navigation, autoplay : autoplay, autoplayOnHover: autoplayOnHover, autoplayOnFocus: autoplayOnFocus, autoplayInterval : autoplayInterval, swipe : swipe, navigationItemClass: navigationItemClass, navigationClass: navigationClass});
        })(i);
      }
    }
  }());
// File#: _3_lightbox
// Usage: codyhouse.co/license

(function() {
    var Lightbox = function(element) {
      this.element = element;
      this.id = this.element.getAttribute('id');
      this.slideshow = this.element.getElementsByClassName('js-lightbox__body')[0];
      this.slides = this.slideshow.getElementsByClassName('js-slideshow__item');
      this.thumbWrapper = this.element.getElementsByClassName('js-lightbox_thumb-list');
      lazyLoadLightbox(this);
      initSlideshow(this);
      initThumbPreview(this);
      initThumbEvents(this);
    }
  
    function lazyLoadLightbox(modal) {
      // add no-transition class to lightbox - used to select the first visible slide
      Util.addClass(modal.element, 'lightbox--no-transition');
      //load first slide media when modal is open
      modal.element.addEventListener('modalIsOpen', function(event){
        setSelectedItem(modal, event);
        var selectedSlide = modal.slideshow.getElementsByClassName('slideshow__item--selected');
        modal.selectedSlide = Util.getIndexInArray(modal.slides, selectedSlide[0]);
        if(selectedSlide.length > 0) {
          if(modal.slideshowObj) modal.slideshowObj.selectedSlide = modal.selectedSlide;
          lazyLoadSlide(modal);
          resetVideos(modal, false);
          resetIframes(modal, false);
          updateThumb(modal);
        }
        Util.removeClass(modal.element, 'lightbox--no-transition');
      });
      modal.element.addEventListener('modalIsClose', function(event){ // add no-transition class
        Util.addClass(modal.element, 'lightbox--no-transition');
      });
      // lazyload media of selected slide/prev slide/next slide
      modal.slideshow.addEventListener('newItemSelected', function(event){
        // 'newItemSelected' is emitted by the Slideshow object when a new slide is selected
        var prevSelected = modal.selectedSlide;
        modal.selectedSlide = event.detail;
        lazyLoadSlide(modal);
        resetVideos(modal, prevSelected); // pause video of previous visible slide and start new video (if present)
        resetIframes(modal, prevSelected);
        updateThumb(modal);
      });
    };
  
    function lazyLoadSlide(modal) {
      setSlideMedia(modal, modal.selectedSlide);
      setSlideMedia(modal, modal.selectedSlide + 1);
      setSlideMedia(modal, modal.selectedSlide - 1);
    };
  
    function setSlideMedia(modal, index) {
      if(index < 0) index = modal.slides.length - 1;
      if(index > modal.slides.length - 1) index = 0;
      setSlideImgs(modal, index);
      setSlidesVideos(modal, index, 'video');
      setSlidesVideos(modal, index, 'iframe');
    };
  
    function setSlideImgs(modal, index) {
      var imgs = modal.slides[index].querySelectorAll('img[data-src]');
      for(var i = 0; i < imgs.length; i++) {
        imgs[i].src = imgs[i].getAttribute('data-src');
      }
    };
  
    function setSlidesVideos(modal, index, type) {
      var videos = modal.slides[index].querySelectorAll(type+'[data-src]');
      for(var i = 0; i < videos.length; i++) {
        videos[0].src = videos[0].getAttribute('data-src');
        videos[0].removeAttribute('data-src');
      }
    };
  
    function initSlideshow(modal) { 
      if(modal.slides.length <= 1) {
        hideSlideshowElements(modal);
        return;
      } 
      var swipe = (modal.slideshow.getAttribute('data-swipe') && modal.slideshow.getAttribute('data-swipe') == 'on') ? true : false;
      modal.slideshowObj = new Slideshow({element: modal.slideshow, navigation: false, autoplay : false, swipe : swipe});
    };
  
    function hideSlideshowElements(modal) { // hide slideshow controls if gallery is composed by one item only
      var slideshowNav = modal.element.getElementsByClassName('js-slideshow__control');
      if(slideshowNav.length > 0) {
        for(var i = 0; i < slideshowNav.length; i++) Util.addClass(slideshowNav[i], 'is-hidden');
      }
      var slideshowThumbs = modal.element.getElementsByClassName('js-lightbox_footer');
      if(slideshowThumbs.length > 0) Util.addClass(slideshowThumbs[0], 'is-hidden');
    };
  
    function resetVideos(modal, index) {
      if(index) {
        var actualVideo = modal.slides[index].getElementsByTagName('video');
        if(actualVideo.length > 0 ) actualVideo[0].pause();
      }
      var newVideo = modal.slides[modal.selectedSlide].getElementsByTagName('video');
      if(newVideo.length > 0 ) {
        setVideoWidth(modal, modal.selectedSlide, newVideo[0]);
        newVideo[0].play();
      }
    };
  
    function resetIframes(modal, index) {
      if(index) {
        var actualIframe = modal.slides[index].getElementsByTagName('iframe');
        if(actualIframe.length > 0 ) {
          actualIframe[0].setAttribute('data-src', actualIframe[0].src);
          actualIframe[0].removeAttribute('src');
        }
      }
      var newIframe = modal.slides[modal.selectedSlide].getElementsByTagName('iframe');
      if(newIframe.length > 0 ) {
        setVideoWidth(modal, modal.selectedSlide, newIframe[0]);
      }
    };
  
    function resizeLightbox(modal) { // executed when window has been resized
      if(!modal.selectedSlide) return; // modal not active
      var video = modal.slides[modal.selectedSlide].getElementsByTagName('video');
      if(video.length > 0 ) setVideoWidth(modal, modal.selectedSlide, video[0]);
      var iframe = modal.slides[modal.selectedSlide].getElementsByTagName('iframe');
      if(iframe.length > 0 ) setVideoWidth(modal, modal.selectedSlide, iframe[0]);
    };
  
    function setVideoWidth(modal, index, video) {
      var videoContainer = modal.slides[index].getElementsByClassName('js-lightbox__media-outer');
      if(videoContainer.length == 0 ) return;
      var videoWrapper = videoContainer[0].getElementsByClassName('js-lightbox__media-inner');
      var maxWidth = (video.offsetWidth/video.offsetHeight)*videoContainer[0].offsetHeight;
      if(maxWidth < modal.slides[index].offsetWidth) {
        videoWrapper[0].style.width = maxWidth+'px';
        videoWrapper[0].style.paddingBottom = videoContainer[0].offsetHeight+'px';
      } else {
        videoWrapper[0].removeAttribute('style')
      }
    };
  
    function initThumbPreview(modal) {
      if(modal.thumbWrapper.length < 1) return;
      var content = '';
      for(var i = 0; i < modal.slides.length; i++) {
        var activeClass = Util.hasClass(modal.slides[i], 'slideshow__item--selected') ? ' lightbox__thumb--active': '';
        content = content + '<li class="lightbox__thumb js-lightbox__thumb'+activeClass+'"><img src="'+modal.slides[i].querySelector('[data-thumb]').getAttribute('data-thumb')+'">'+'</li>';
      }
      modal.thumbWrapper[0].innerHTML = content;
    };
  
    function initThumbEvents(modal) {
      if(modal.thumbWrapper.length < 1) return;
      modal.thumbSlides = modal.thumbWrapper[0].getElementsByClassName('js-lightbox__thumb');
      modal.thumbWrapper[0].addEventListener('click', function(event){
        var selectedThumb = event.target.closest('.js-lightbox__thumb');
        if(!selectedThumb || Util.hasClass(selectedThumb, 'lightbox__thumb--active')) return;
        modal.slideshowObj.showItem(Util.getIndexInArray(modal.thumbSlides, selectedThumb));
      });
    };
  
    function updateThumb(modal) {
      if(modal.thumbWrapper.length < 1) return;
      // update selected thumb classes
      var selectedThumb = modal.thumbWrapper[0].getElementsByClassName('lightbox__thumb--active');
      if(selectedThumb.length > 0) Util.removeClass(selectedThumb[0], 'lightbox__thumb--active');
      Util.addClass(modal.thumbSlides[modal.selectedSlide], 'lightbox__thumb--active');
      // update thumb list position (if selected thumb is outside viewport)
      var offsetThumb = modal.thumbSlides[modal.selectedSlide].getBoundingClientRect(),
        offsetThumbList = modal.thumbWrapper[0].getBoundingClientRect();
      if(offsetThumb.left < offsetThumbList.left) {
        modal.thumbWrapper[0].scrollTo(modal.thumbSlides[modal.selectedSlide].offsetLeft - offsetThumbList.left, 0);
      } else if(offsetThumb.right > offsetThumbList.right) {
        modal.thumbWrapper[0].scrollTo( (offsetThumb.right - offsetThumbList.right) + modal.thumbWrapper[0].scrollLeft, 0);
      }
    };
  
    function keyboardNavigateLightbox(modal, direction) {
      if(!Util.hasClass(modal.element, 'modal--is-visible')) return;
      if(!document.activeElement.closest('.js-lightbox__body') && document.activeElement.closest('.js-modal')) return
      (direction == 'next') ? modal.slideshowObj.showNext() : modal.slideshowObj.showPrev();
    };
  
    function setSelectedItem(modal, event) {
      // if a specific slide was selected -> make sure to show that item first
      var selectedItemId = false;
      if(event.detail) {
        var elTarget = event.detail.closest('[aria-controls="'+modal.id+'"]');
        if(elTarget) selectedItemId = elTarget.getAttribute('data-lightbox-item');
      } 
     
      if(!selectedItemId || !modal.slideshowObj) return;
      var selectedItem = document.getElementById(selectedItemId);
      if(!selectedItem) return;
      var lastSelected = modal.slideshow.getElementsByClassName('slideshow__item--selected');
      if(lastSelected.length > 0 ) Util.removeClass(lastSelected[0], 'slideshow__item--selected');
      Util.addClass(selectedItem, 'slideshow__item--selected');
    };
  
    window.Lightbox = Lightbox;
  
    // init Lightbox objects
    var lightBoxes = document.getElementsByClassName('js-lightbox');
    if( lightBoxes.length > 0 ) {
      var lightBoxArray = [];
      for( var i = 0; i < lightBoxes.length; i++) {
        (function(i){ lightBoxArray.push(new Lightbox(lightBoxes[i]));})(i);
        
        // resize video/iframe
        var resizingId = false;
        window.addEventListener('resize', function(event){
          clearTimeout(resizingId);
          resizingId = setTimeout(doneResizing, 300);
        });
  
        function doneResizing() {
          for( var i = 0; i < lightBoxArray.length; i++) {
            (function(i){resizeLightbox(lightBoxArray[i]);})(i);
          };
        };
  
        // Lightbox gallery navigation with keyboard
        window.addEventListener('keydown', function(event){
          if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
            updateLightbox('next');
          } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
            updateLightbox('prev');
          }
        });
  
        function updateLightbox(direction) {
          for( var i = 0; i < lightBoxArray.length; i++) {
            (function(i){keyboardNavigateLightbox(lightBoxArray[i], direction);})(i);
          };
        };
      }
    }
  }());