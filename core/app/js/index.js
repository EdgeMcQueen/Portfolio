"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * jquery-circle-progress - jQuery Plugin to draw animated circular progress bars:
 * {@link http://kottenator.github.io/jquery-circle-progress/}
 *
 * @author Rostyslav Bryzgunov <kottenator@gmail.com>
 * @version 1.2.2
 * @licence MIT
 * @preserve
 */
// UMD factory - https://github.com/umdjs/umd/blob/d31bb6ee7098715e019f52bdfe27b3e4bfd2b97e/templates/jqueryPlugin.js
// Uses AMD, CommonJS or browser globals to create a jQuery plugin.
(function (factory) {
  if (typeof define === "function" && define.amd) {
    // AMD - register as an anonymous module
    define(["jquery"], factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module.exports) {
    // Node/CommonJS
    var $ = require("jquery");

    factory($);
    module.exports = $;
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function ($) {
  /**
   * Inner implementation of the circle progress bar.
   * The class is not exposed _yet_ but you can create an instance through jQuery method call.
   *
   * @param {object} config - You can customize any class member (property or method).
   * @class
   * @alias CircleProgress
   */
  function CircleProgress(config) {
    this.init(config);
  }

  CircleProgress.prototype = {
    //--------------------------------------- public options ---------------------------------------

    /**
     * This is the only required option. It should be from `0.0` to `1.0`.
     * @type {number}
     * @default 0.0
     */
    value: 0.0,

    /**
     * Size of the canvas in pixels.
     * It's a square so we need only one dimension.
     * @type {number}
     * @default 100.0
     */
    size: 100.0,

    /**
     * Initial angle for `0.0` value in radians.
     * @type {number}
     * @default -Math.PI
     */
    startAngle: -Math.PI,

    /**
     * Width of the arc in pixels.
     * If it's `'auto'` - the value is calculated as `[this.size]{@link CircleProgress#size} / 14`.
     * @type {number|string}
     * @default 'auto'
     */
    thickness: "auto",

    /**
     * Fill of the arc. You may set it to:
     *
     *   - solid color:
     *     - `'#3aeabb'`
     *     - `{ color: '#3aeabb' }`
     *     - `{ color: 'rgba(255, 255, 255, .3)' }`
     *   - linear gradient _(left to right)_:
     *     - `{ gradient: ['#3aeabb', '#fdd250'], gradientAngle: Math.PI / 4 }`
     *     - `{ gradient: ['red', 'green', 'blue'], gradientDirection: [x0, y0, x1, y1] }`
     *     - `{ gradient: [["red", .2], ["green", .3], ["blue", .8]] }`
     *   - image:
     *     - `{ image: 'http://i.imgur.com/pT0i89v.png' }`
     *     - `{ image: imageObject }`
     *     - `{ color: 'lime', image: 'http://i.imgur.com/pT0i89v.png' }` -
     *       color displayed until the image is loaded
     *
     * @default {gradient: ['#3aeabb', '#fdd250']}
     */
    fill: {
      gradient: ["#3aeabb", "#fdd250"]
    },

    /**
     * Color of the "empty" arc. Only a color fill supported by now.
     * @type {string}
     * @default 'rgba(0, 0, 0, .1)'
     */
    emptyFill: "rgba(0, 0, 0, .1)",

    /**
     * jQuery Animation config.
     * You can pass `false` to disable the animation.
     * @see http://api.jquery.com/animate/
     * @type {object|boolean}
     * @default {duration: 1200, easing: 'circleProgressEasing'}
     */
    animation: {
      duration: 1200,
      easing: "circleProgressEasing"
    },

    /**
     * Default animation starts at `0.0` and ends at specified `value`. Let's call this _direct animation_.
     * If you want to make _reversed animation_ - set `animationStartValue: 1.0`.
     * Also you may specify any other value from `0.0` to `1.0`.
     * @type {number}
     * @default 0.0
     */
    animationStartValue: 0.0,

    /**
     * Reverse animation and arc draw.
     * By default, the arc is filled from `0.0` to `value`, _clockwise_.
     * With `reverse: true` the arc is filled from `1.0` to `value`, _counter-clockwise_.
     * @type {boolean}
     * @default false
     */
    reverse: false,

    /**
     * Arc line cap: `'butt'`, `'round'` or `'square'` -
     * [read more]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.lineCap}.
     * @type {string}
     * @default 'butt'
     */
    lineCap: "butt",

    /**
     * Canvas insertion mode: append or prepend it into the parent element?
     * @type {string}
     * @default 'prepend'
     */
    insertMode: "prepend",
    //------------------------------ protected properties and methods ------------------------------

    /**
     * Link to {@link CircleProgress} constructor.
     * @protected
     */
    constructor: CircleProgress,

    /**
     * Container element. Should be passed into constructor config.
     * @protected
     * @type {jQuery}
     */
    el: null,

    /**
     * Canvas element. Automatically generated and prepended to [this.el]{@link CircleProgress#el}.
     * @protected
     * @type {HTMLCanvasElement}
     */
    canvas: null,

    /**
     * 2D-context of [this.canvas]{@link CircleProgress#canvas}.
     * @protected
     * @type {CanvasRenderingContext2D}
     */
    ctx: null,

    /**
     * Radius of the outer circle. Automatically calculated as `[this.size]{@link CircleProgress#size} / 2`.
     * @protected
     * @type {number}
     */
    radius: 0.0,

    /**
     * Fill of the main arc. Automatically calculated, depending on [this.fill]{@link CircleProgress#fill} option.
     * @protected
     * @type {string|CanvasGradient|CanvasPattern}
     */
    arcFill: null,

    /**
     * Last rendered frame value.
     * @protected
     * @type {number}
     */
    lastFrameValue: 0.0,

    /**
     * Init/re-init the widget.
     *
     * Throws a jQuery event:
     *
     * - `circle-inited(jqEvent)`
     *
     * @param {object} config - You can customize any class member (property or method).
     */
    init: function init(config) {
      $.extend(this, config);
      this.radius = this.size / 2;
      this.initWidget();
      this.initFill();
      this.draw();
      this.el.trigger("circle-inited");
    },

    /**
     * Initialize `<canvas>`.
     * @protected
     */
    initWidget: function initWidget() {
      if (!this.canvas) this.canvas = $("<canvas>")[this.insertMode == "prepend" ? "prependTo" : "appendTo"](this.el)[0];
      var canvas = this.canvas;
      canvas.width = this.size;
      canvas.height = this.size;
      this.ctx = canvas.getContext("2d");

      if (window.devicePixelRatio > 1) {
        var scaleBy = window.devicePixelRatio;
        canvas.style.width = canvas.style.height = this.size + "px";
        canvas.width = canvas.height = this.size * scaleBy;
        this.ctx.scale(scaleBy, scaleBy);
      }
    },

    /**
     * This method sets [this.arcFill]{@link CircleProgress#arcFill}.
     * It could do this async (on image load).
     * @protected
     */
    initFill: function initFill() {
      var self = this,
          fill = this.fill,
          ctx = this.ctx,
          size = this.size;
      if (!fill) throw Error("The fill is not specified!");
      if (typeof fill == "string") fill = {
        color: fill
      };
      if (fill.color) this.arcFill = fill.color;

      if (fill.gradient) {
        var gr = fill.gradient;

        if (gr.length == 1) {
          this.arcFill = gr[0];
        } else if (gr.length > 1) {
          var ga = fill.gradientAngle || 0,
              // gradient direction angle; 0 by default
          gd = fill.gradientDirection || [size / 2 * (1 - Math.cos(ga)), // x0
          size / 2 * (1 + Math.sin(ga)), // y0
          size / 2 * (1 + Math.cos(ga)), // x1
          size / 2 * (1 - Math.sin(ga)) // y1
          ];
          var lg = ctx.createLinearGradient.apply(ctx, gd);

          for (var i = 0; i < gr.length; i++) {
            var color = gr[i],
                pos = i / (gr.length - 1);

            if ($.isArray(color)) {
              pos = color[1];
              color = color[0];
            }

            lg.addColorStop(pos, color);
          }

          this.arcFill = lg;
        }
      }

      if (fill.image) {
        var img;

        if (fill.image instanceof Image) {
          img = fill.image;
        } else {
          img = new Image();
          img.src = fill.image;
        }

        if (img.complete) setImageFill();else img.onload = setImageFill;
      }

      function setImageFill() {
        var bg = $("<canvas>")[0];
        bg.width = self.size;
        bg.height = self.size;
        bg.getContext("2d").drawImage(img, 0, 0, size, size);
        self.arcFill = self.ctx.createPattern(bg, "no-repeat");
        self.drawFrame(self.lastFrameValue);
      }
    },

    /**
     * Draw the circle.
     * @protected
     */
    draw: function draw() {
      if (this.animation) this.drawAnimated(this.value);else this.drawFrame(this.value);
    },

    /**
     * Draw a single animation frame.
     * @protected
     * @param {number} v - Frame value.
     */
    drawFrame: function drawFrame(v) {
      this.lastFrameValue = v;
      this.ctx.clearRect(0, 0, this.size, this.size);
      this.drawEmptyArc(v);
      this.drawArc(v);
    },

    /**
     * Draw the arc (part of the circle).
     * @protected
     * @param {number} v - Frame value.
     */
    drawArc: function drawArc(v) {
      if (v === 0) return;
      var ctx = this.ctx,
          r = this.radius,
          t = this.getThickness(),
          a = this.startAngle;
      ctx.save();
      ctx.beginPath();

      if (!this.reverse) {
        ctx.arc(r, r, r - t / 2, a, a + Math.PI * 2 * v);
      } else {
        ctx.arc(r, r, r - t / 2, a - Math.PI * 2 * v, a);
      }

      ctx.lineWidth = t;
      ctx.lineCap = this.lineCap;
      ctx.strokeStyle = this.arcFill;
      ctx.stroke();
      ctx.restore();
    },

    /**
     * Draw the _empty (background)_ arc (part of the circle).
     * @protected
     * @param {number} v - Frame value.
     */
    drawEmptyArc: function drawEmptyArc(v) {
      var ctx = this.ctx,
          r = this.radius,
          t = this.getThickness(),
          a = this.startAngle;

      if (v < 1) {
        ctx.save();
        ctx.beginPath();

        if (v <= 0) {
          ctx.arc(r, r, r - t / 2, 0, Math.PI * 2);
        } else {
          if (!this.reverse) {
            ctx.arc(r, r, r - t / 2, a + Math.PI * 2 * v, a);
          } else {
            ctx.arc(r, r, r - t / 2, a, a - Math.PI * 2 * v);
          }
        }

        ctx.lineWidth = t;
        ctx.strokeStyle = this.emptyFill;
        ctx.stroke();
        ctx.restore();
      }
    },

    /**
     * Animate the progress bar.
     *
     * Throws 3 jQuery events:
     *
     * - `circle-animation-start(jqEvent)`
     * - `circle-animation-progress(jqEvent, animationProgress, stepValue)` - multiple event
     *   animationProgress: from `0.0` to `1.0`; stepValue: from `0.0` to `value`
     * - `circle-animation-end(jqEvent)`
     *
     * @protected
     * @param {number} v - Final value.
     */
    drawAnimated: function drawAnimated(v) {
      var self = this,
          el = this.el,
          canvas = $(this.canvas); // stop previous animation before new "start" event is triggered

      canvas.stop(true, false);
      el.trigger("circle-animation-start");
      canvas.css({
        animationProgress: 0
      }).animate({
        animationProgress: 1
      }, $.extend({}, this.animation, {
        step: function step(animationProgress) {
          var stepValue = self.animationStartValue * (1 - animationProgress) + v * animationProgress;
          self.drawFrame(stepValue);
          el.trigger("circle-animation-progress", [animationProgress, stepValue]);
        }
      })).promise().always(function () {
        // trigger on both successful & failure animation end
        el.trigger("circle-animation-end");
      });
    },

    /**
     * Get the circle thickness.
     * @see CircleProgress#thickness
     * @protected
     * @returns {number}
     */
    getThickness: function getThickness() {
      return $.isNumeric(this.thickness) ? this.thickness : this.size / 14;
    },

    /**
     * Get current value.
     * @protected
     * @return {number}
     */
    getValue: function getValue() {
      return this.value;
    },

    /**
     * Set current value (with smooth animation transition).
     * @protected
     * @param {number} newValue
     */
    setValue: function setValue(newValue) {
      if (this.animation) this.animationStartValue = this.lastFrameValue;
      this.value = newValue;
      this.draw();
    }
  }; //----------------------------------- Initiating jQuery plugin -----------------------------------

  $.circleProgress = {
    // Default options (you may override them)
    defaults: CircleProgress.prototype
  }; // ease-in-out-cubic

  $.easing.circleProgressEasing = function (x) {
    if (x < 0.5) {
      x = 2 * x;
      return 0.5 * x * x * x;
    } else {
      x = 2 - 2 * x;
      return 1 - 0.5 * x * x * x;
    }
  };
  /**
   * Creates an instance of {@link CircleProgress}.
   * Produces [init event]{@link CircleProgress#init} and [animation events]{@link CircleProgress#drawAnimated}.
   *
   * @param {object} [configOrCommand] - Config object or command name.
   *
   * Config example (you can specify any {@link CircleProgress} property):
   *
   * ```js
   * { value: 0.75, size: 50, animation: false }
   * ```
   *
   * Commands:
   *
   * ```js
   * el.circleProgress('widget'); // get the <canvas>
   * el.circleProgress('value'); // get the value
   * el.circleProgress('value', newValue); // update the value
   * el.circleProgress('redraw'); // redraw the circle
   * el.circleProgress(); // the same as 'redraw'
   * ```
   *
   * @param {string} [commandArgument] - Some commands (like `'value'`) may require an argument.
   * @see CircleProgress
   * @alias "$(...).circleProgress"
   */


  $.fn.circleProgress = function (configOrCommand, commandArgument) {
    var dataName = "circle-progress",
        firstInstance = this.data(dataName);

    if (configOrCommand == "widget") {
      if (!firstInstance) throw Error('Calling "widget" method on not initialized instance is forbidden');
      return firstInstance.canvas;
    }

    if (configOrCommand == "value") {
      if (!firstInstance) throw Error('Calling "value" method on not initialized instance is forbidden');

      if (typeof commandArgument == "undefined") {
        return firstInstance.getValue();
      } else {
        var newValue = arguments[1];
        return this.each(function () {
          $(this).data(dataName).setValue(newValue);
        });
      }
    }

    return this.each(function () {
      var el = $(this),
          instance = el.data(dataName),
          config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

      if (instance) {
        instance.init(config);
      } else {
        var initialConfig = $.extend({}, el.data());
        if (typeof initialConfig.fill == "string") initialConfig.fill = JSON.parse(initialConfig.fill);
        if (typeof initialConfig.animation == "string") initialConfig.animation = JSON.parse(initialConfig.animation);
        config = $.extend(initialConfig, config);
        config.el = el;
        instance = new CircleProgress(config);
        el.data(dataName, instance);
      }
    });
  };
});
/**
 * @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
 */


(function (window, document) {
  /*jshint evil:true */

  /** version */
  var version = "3.7.3";
  /** Preset options */

  var options = window.html5 || {};
  /** Used to skip problem elements */

  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
  /** Not all elements can be cloned in IE **/

  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
  /** Detect whether the browser supports default html5 styles */

  var supportsHtml5Styles;
  /** Name of the expando, to work with multiple documents or to re-shiv one document */

  var expando = "_html5shiv";
  /** The id for the the documents expando */

  var expanID = 0;
  /** Cached data for each document */

  var expandoData = {};
  /** Detect whether the browser supports unknown elements */

  var supportsUnknownElements;

  (function () {
    try {
      var a = document.createElement("a");
      a.innerHTML = "<xyz></xyz>"; //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles

      supportsHtml5Styles = "hidden" in a;

      supportsUnknownElements = a.childNodes.length == 1 || function () {
        // assign a false positive if unable to shiv
        document.createElement("a");
        var frag = document.createDocumentFragment();
        return typeof frag.cloneNode == "undefined" || typeof frag.createDocumentFragment == "undefined" || typeof frag.createElement == "undefined";
      }();
    } catch (e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }
  })();
  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */


  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement("p"),
        parent = ownerDocument.getElementsByTagName("head")[0] || ownerDocument.documentElement;
    p.innerHTML = "x<style>" + cssText + "</style>";
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }
  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */


  function getElements() {
    var elements = html5.elements;
    return typeof elements == "string" ? elements.split(" ") : elements;
  }
  /**
   * Extends the built-in list of html5 elements
   * @memberOf html5
   * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
   * @param {Document} ownerDocument The context document.
   */


  function addElements(newElements, ownerDocument) {
    var elements = html5.elements;

    if (typeof elements != "string") {
      elements = elements.join(" ");
    }

    if (typeof newElements != "string") {
      newElements = newElements.join(" ");
    }

    html5.elements = elements + " " + newElements;
    shivDocument(ownerDocument);
  }
  /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */


  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];

    if (!data) {
      data = {};
      expanID++;
      ownerDocument[expando] = expanID;
      expandoData[expanID] = data;
    }

    return data;
  }
  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document|DocumentFragment} ownerDocument The context document.
   * @returns {Object} The shived element.
   */


  function createElement(nodeName, ownerDocument, data) {
    if (!ownerDocument) {
      ownerDocument = document;
    }

    if (supportsUnknownElements) {
      return ownerDocument.createElement(nodeName);
    }

    if (!data) {
      data = getExpandoData(ownerDocument);
    }

    var node;

    if (data.cache[nodeName]) {
      node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
      node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
      node = data.createElem(nodeName);
    } // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set


    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
  }
  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */


  function createDocumentFragment(ownerDocument, data) {
    if (!ownerDocument) {
      ownerDocument = document;
    }

    if (supportsUnknownElements) {
      return ownerDocument.createDocumentFragment();
    }

    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;

    for (; i < l; i++) {
      clone.createElement(elems[i]);
    }

    return clone;
  }
  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */


  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
      data.cache = {};
      data.createElem = ownerDocument.createElement;
      data.createFrag = ownerDocument.createDocumentFragment;
      data.frag = data.createFrag();
    }

    ownerDocument.createElement = function (nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
        return data.createElem(nodeName);
      }

      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function("h,f", "return function(){" + "var n=f.cloneNode(),c=n.createElement;" + "h.shivMethods&&(" + // unroll the `createElement` calls
    getElements().join().replace(/[\w\-:]+/g, function (nodeName) {
      data.createElem(nodeName);
      data.frag.createElement(nodeName);
      return 'c("' + nodeName + '")';
    }) + ");return n}")(html5, data.frag);
  }
  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */


  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
      ownerDocument = document;
    }

    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument, // corrects block display not defined in IE6/7/8/9
      "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}" + // adds styling not present in IE6/7/8/9
      "mark{background:#FF0;color:#000}" + // hides non-rendered elements
      "template{display:none}");
    }

    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }

    return ownerDocument;
  }
  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */


  var html5 = {
    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    elements: options.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",

    /**
     * current version of html5shiv
     */
    version: version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    shivCSS: options.shivCSS !== false,

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    supportsUnknownElements: supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    shivMethods: options.shivMethods !== false,

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    type: "default",
    // shivs the document according to the specified `html5` object options
    shivDocument: shivDocument,
    //creates a shived element
    createElement: createElement,
    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment,
    //extends list of elements
    addElements: addElements
  };
  /*--------------------------------------------------------------------------*/
  // expose html5

  window.html5 = html5; // shiv the document

  shivDocument(document);

  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) == "object" && module.exports) {
    module.exports = html5;
  }
})(typeof window !== "undefined" ? window : void 0, document); // smooth anchor scroll


$(document).on("click", 'a[href^="#"]', function (event) {
  event.preventDefault();
  $("html, body").animate({
    scrollTop: $($.attr(this, "href")).offset().top
  }, 1000);
}); // burger menu

/*
(function () {
  var burgerIcon = document.querySelector(".burger-container"),
    burgerMenu = document.querySelector(".burger-menu");

  burgerIcon.onclick = function () {
    burgerMenu.classList.toggle("burger-opened");
    burgerIcon.classList.toggle("burger-close");
  };
})();
*/

$(function () {
  var $burgerIcon = $(".burger-container");
  var $burgerMenu = $(".burger-menu");
  $burgerIcon.click(function () {
    $burgerMenu.toggleClass("burger-opened");
    $burgerIcon.toggleClass("burger-close");

    if ($burgerIcon.hasClass("burger-close") == true) {
      $(".go-to-top").css("display", "none");
    } else {
      $(".go-to-top").css("display", "block");
    }
  });
}()); // dropDown menu show/hide

/*
(function () {
  var dropMenuIcon = document.querySelector(".dropMenu-toggle"),
    dropMenu = document.querySelector(".nav");

  dropMenuIcon.onclick = function () {
    dropMenu.classList.toggle("dropMenu-show");
    dropMenuIcon.classList.toggle("dropMenu-hide");
  };
})();
*/

$(function () {
  var $dropMenuIcon = $(".dropMenu-toggle");
  var $dropMenu = $(".nav");
  $dropMenuIcon.click(function () {
    $dropMenu.toggleClass("dropMenu-show");
    $dropMenuIcon.toggleClass("dropMenu-hide");
  });
}()); // slide down menu

/*
$(window).scroll(function() {scrollFunction()});

function scrollFunction() {
	if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		document.querySelector(".dropMenu-toggle").style.top = "0";
		document.querySelector(".dropMenu-toggle").style.display = "block";

	} else {
		document.querySelector(".dropMenu-toggle").style.top = "-50px";
		document.querySelector(".nav").classList.remove("dropMenu-show");
	}
}
*/

$(window).scroll(function () {
  scrollFunction();
});

function scrollFunction() {
  if ($("body").scrollTop() > 100 || $(document.documentElement).scrollTop() > 100) {
    $(".dropMenu-toggle").css({
      top: "0",
      display: "block"
    });
    $(".dropMenu-toggle__icon").css("display", "block");
  } else {
    $(".dropMenu-toggle").css({
      top: "-50"
    });
    $(".dropMenu-toggle__icon").css("display", "none");
    $(".nav").removeClass("dropMenu-show");
  }
} // menu hide after click to link


$(document).ready(function () {
  $(".dropdown-nav-menu__link").click(function () {
    if ($(".nav").hasClass("dropMenu-show")) {
      $(".nav").removeClass("dropMenu-show");
    }
  });
  $(".nav-burger__link").click(function () {
    if ($(".burger-menu").hasClass("burger-opened") || $(".burger-container").hasClass("burger-close")) {
      $(".burger-menu").removeClass("burger-opened");
      $(".burger-container").removeClass("burger-close");
    }
  });
}); // skills circle progress

function circle(el) {
  $(el).circleProgress({
    fill: {
      color: "#828282"
    }
  }).on("circle-animation-progress", function (event, progress, stepValue) {
    $(this).find(".skills__percent").text(String(stepValue.toFixed(2)).substr(2) + "%");
  });
}

circle(".skills__round");
$(".skills__round").circleProgress({
  startAngle: Math.PI / -2
});
//# sourceMappingURL=maps/index.js.map
