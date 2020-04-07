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
})(typeof window !== "undefined" ? window : void 0, document);
/*!
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.18
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.rampinteractive.co.uk/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 * @license
 * Copyright (c) 2010-2015 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */


!function (factory) {
  "function" == typeof define && define.amd && define.amd.jQuery ? define(["jquery"], factory) : factory("undefined" != typeof module && module.exports ? require("jquery") : jQuery);
}(function ($) {
  "use strict";

  function init(options) {
    return !options || void 0 !== options.allowPageScroll || void 0 === options.swipe && void 0 === options.swipeStatus || (options.allowPageScroll = NONE), void 0 !== options.click && void 0 === options.tap && (options.tap = options.click), options || (options = {}), options = $.extend({}, $.fn.swipe.defaults, options), this.each(function () {
      var $this = $(this),
          plugin = $this.data(PLUGIN_NS);
      plugin || (plugin = new TouchSwipe(this, options), $this.data(PLUGIN_NS, plugin));
    });
  }

  function TouchSwipe(element, options) {
    function touchStart(jqEvent) {
      if (!(getTouchInProgress() || $(jqEvent.target).closest(options.excludedElements, $element).length > 0)) {
        var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;

        if (!event.pointerType || "mouse" != event.pointerType || 0 != options.fallbackToMouseEvents) {
          var ret,
              touches = event.touches,
              evt = touches ? touches[0] : event;
          return phase = PHASE_START, touches ? fingerCount = touches.length : options.preventDefaultEvents !== !1 && jqEvent.preventDefault(), distance = 0, direction = null, currentDirection = null, pinchDirection = null, duration = 0, startTouchesDistance = 0, endTouchesDistance = 0, pinchZoom = 1, pinchDistance = 0, maximumsMap = createMaximumsData(), cancelMultiFingerRelease(), createFingerData(0, evt), !touches || fingerCount === options.fingers || options.fingers === ALL_FINGERS || hasPinches() ? (startTime = getTimeStamp(), 2 == fingerCount && (createFingerData(1, touches[1]), startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start)), (options.swipeStatus || options.pinchStatus) && (ret = triggerHandler(event, phase))) : ret = !1, ret === !1 ? (phase = PHASE_CANCEL, triggerHandler(event, phase), ret) : (options.hold && (holdTimeout = setTimeout($.proxy(function () {
            $element.trigger("hold", [event.target]), options.hold && (ret = options.hold.call($element, event, event.target));
          }, this), options.longTapThreshold)), setTouchInProgress(!0), null);
        }
      }
    }

    function touchMove(jqEvent) {
      var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;

      if (phase !== PHASE_END && phase !== PHASE_CANCEL && !inMultiFingerRelease()) {
        var ret,
            touches = event.touches,
            evt = touches ? touches[0] : event,
            currentFinger = updateFingerData(evt);

        if (endTime = getTimeStamp(), touches && (fingerCount = touches.length), options.hold && clearTimeout(holdTimeout), phase = PHASE_MOVE, 2 == fingerCount && (0 == startTouchesDistance ? (createFingerData(1, touches[1]), startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start)) : (updateFingerData(touches[1]), endTouchesDistance = calculateTouchesDistance(fingerData[0].end, fingerData[1].end), pinchDirection = calculatePinchDirection(fingerData[0].end, fingerData[1].end)), pinchZoom = calculatePinchZoom(startTouchesDistance, endTouchesDistance), pinchDistance = Math.abs(startTouchesDistance - endTouchesDistance)), fingerCount === options.fingers || options.fingers === ALL_FINGERS || !touches || hasPinches()) {
          if (direction = calculateDirection(currentFinger.start, currentFinger.end), currentDirection = calculateDirection(currentFinger.last, currentFinger.end), validateDefaultEvent(jqEvent, currentDirection), distance = calculateDistance(currentFinger.start, currentFinger.end), duration = calculateDuration(), setMaxDistance(direction, distance), ret = triggerHandler(event, phase), !options.triggerOnTouchEnd || options.triggerOnTouchLeave) {
            var inBounds = !0;

            if (options.triggerOnTouchLeave) {
              var bounds = getbounds(this);
              inBounds = isInBounds(currentFinger.end, bounds);
            }

            !options.triggerOnTouchEnd && inBounds ? phase = getNextPhase(PHASE_MOVE) : options.triggerOnTouchLeave && !inBounds && (phase = getNextPhase(PHASE_END)), phase != PHASE_CANCEL && phase != PHASE_END || triggerHandler(event, phase);
          }
        } else phase = PHASE_CANCEL, triggerHandler(event, phase);

        ret === !1 && (phase = PHASE_CANCEL, triggerHandler(event, phase));
      }
    }

    function touchEnd(jqEvent) {
      var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent,
          touches = event.touches;

      if (touches) {
        if (touches.length && !inMultiFingerRelease()) return startMultiFingerRelease(event), !0;
        if (touches.length && inMultiFingerRelease()) return !0;
      }

      return inMultiFingerRelease() && (fingerCount = fingerCountAtRelease), endTime = getTimeStamp(), duration = calculateDuration(), didSwipeBackToCancel() || !validateSwipeDistance() ? (phase = PHASE_CANCEL, triggerHandler(event, phase)) : options.triggerOnTouchEnd || options.triggerOnTouchEnd === !1 && phase === PHASE_MOVE ? (options.preventDefaultEvents !== !1 && jqEvent.cancelable !== !1 && jqEvent.preventDefault(), phase = PHASE_END, triggerHandler(event, phase)) : !options.triggerOnTouchEnd && hasTap() ? (phase = PHASE_END, triggerHandlerForGesture(event, phase, TAP)) : phase === PHASE_MOVE && (phase = PHASE_CANCEL, triggerHandler(event, phase)), setTouchInProgress(!1), null;
    }

    function touchCancel() {
      fingerCount = 0, endTime = 0, startTime = 0, startTouchesDistance = 0, endTouchesDistance = 0, pinchZoom = 1, cancelMultiFingerRelease(), setTouchInProgress(!1);
    }

    function touchLeave(jqEvent) {
      var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;
      options.triggerOnTouchLeave && (phase = getNextPhase(PHASE_END), triggerHandler(event, phase));
    }

    function removeListeners() {
      $element.unbind(START_EV, touchStart), $element.unbind(CANCEL_EV, touchCancel), $element.unbind(MOVE_EV, touchMove), $element.unbind(END_EV, touchEnd), LEAVE_EV && $element.unbind(LEAVE_EV, touchLeave), setTouchInProgress(!1);
    }

    function getNextPhase(currentPhase) {
      var nextPhase = currentPhase,
          validTime = validateSwipeTime(),
          validDistance = validateSwipeDistance(),
          didCancel = didSwipeBackToCancel();
      return !validTime || didCancel ? nextPhase = PHASE_CANCEL : !validDistance || currentPhase != PHASE_MOVE || options.triggerOnTouchEnd && !options.triggerOnTouchLeave ? !validDistance && currentPhase == PHASE_END && options.triggerOnTouchLeave && (nextPhase = PHASE_CANCEL) : nextPhase = PHASE_END, nextPhase;
    }

    function triggerHandler(event, phase) {
      var ret,
          touches = event.touches;
      return (didSwipe() || hasSwipes()) && (ret = triggerHandlerForGesture(event, phase, SWIPE)), (didPinch() || hasPinches()) && ret !== !1 && (ret = triggerHandlerForGesture(event, phase, PINCH)), didDoubleTap() && ret !== !1 ? ret = triggerHandlerForGesture(event, phase, DOUBLE_TAP) : didLongTap() && ret !== !1 ? ret = triggerHandlerForGesture(event, phase, LONG_TAP) : didTap() && ret !== !1 && (ret = triggerHandlerForGesture(event, phase, TAP)), phase === PHASE_CANCEL && touchCancel(event), phase === PHASE_END && (touches ? touches.length || touchCancel(event) : touchCancel(event)), ret;
    }

    function triggerHandlerForGesture(event, phase, gesture) {
      var ret;

      if (gesture == SWIPE) {
        if ($element.trigger("swipeStatus", [phase, direction || null, distance || 0, duration || 0, fingerCount, fingerData, currentDirection]), options.swipeStatus && (ret = options.swipeStatus.call($element, event, phase, direction || null, distance || 0, duration || 0, fingerCount, fingerData, currentDirection), ret === !1)) return !1;

        if (phase == PHASE_END && validateSwipe()) {
          if (clearTimeout(singleTapTimeout), clearTimeout(holdTimeout), $element.trigger("swipe", [direction, distance, duration, fingerCount, fingerData, currentDirection]), options.swipe && (ret = options.swipe.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection), ret === !1)) return !1;

          switch (direction) {
            case LEFT:
              $element.trigger("swipeLeft", [direction, distance, duration, fingerCount, fingerData, currentDirection]), options.swipeLeft && (ret = options.swipeLeft.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
              break;

            case RIGHT:
              $element.trigger("swipeRight", [direction, distance, duration, fingerCount, fingerData, currentDirection]), options.swipeRight && (ret = options.swipeRight.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
              break;

            case UP:
              $element.trigger("swipeUp", [direction, distance, duration, fingerCount, fingerData, currentDirection]), options.swipeUp && (ret = options.swipeUp.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
              break;

            case DOWN:
              $element.trigger("swipeDown", [direction, distance, duration, fingerCount, fingerData, currentDirection]), options.swipeDown && (ret = options.swipeDown.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection));
          }
        }
      }

      if (gesture == PINCH) {
        if ($element.trigger("pinchStatus", [phase, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]), options.pinchStatus && (ret = options.pinchStatus.call($element, event, phase, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData), ret === !1)) return !1;
        if (phase == PHASE_END && validatePinch()) switch (pinchDirection) {
          case IN:
            $element.trigger("pinchIn", [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]), options.pinchIn && (ret = options.pinchIn.call($element, event, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData));
            break;

          case OUT:
            $element.trigger("pinchOut", [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]), options.pinchOut && (ret = options.pinchOut.call($element, event, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData));
        }
      }

      return gesture == TAP ? phase !== PHASE_CANCEL && phase !== PHASE_END || (clearTimeout(singleTapTimeout), clearTimeout(holdTimeout), hasDoubleTap() && !inDoubleTap() ? (doubleTapStartTime = getTimeStamp(), singleTapTimeout = setTimeout($.proxy(function () {
        doubleTapStartTime = null, $element.trigger("tap", [event.target]), options.tap && (ret = options.tap.call($element, event, event.target));
      }, this), options.doubleTapThreshold)) : (doubleTapStartTime = null, $element.trigger("tap", [event.target]), options.tap && (ret = options.tap.call($element, event, event.target)))) : gesture == DOUBLE_TAP ? phase !== PHASE_CANCEL && phase !== PHASE_END || (clearTimeout(singleTapTimeout), clearTimeout(holdTimeout), doubleTapStartTime = null, $element.trigger("doubletap", [event.target]), options.doubleTap && (ret = options.doubleTap.call($element, event, event.target))) : gesture == LONG_TAP && (phase !== PHASE_CANCEL && phase !== PHASE_END || (clearTimeout(singleTapTimeout), doubleTapStartTime = null, $element.trigger("longtap", [event.target]), options.longTap && (ret = options.longTap.call($element, event, event.target)))), ret;
    }

    function validateSwipeDistance() {
      var valid = !0;
      return null !== options.threshold && (valid = distance >= options.threshold), valid;
    }

    function didSwipeBackToCancel() {
      var cancelled = !1;
      return null !== options.cancelThreshold && null !== direction && (cancelled = getMaxDistance(direction) - distance >= options.cancelThreshold), cancelled;
    }

    function validatePinchDistance() {
      return null === options.pinchThreshold || pinchDistance >= options.pinchThreshold;
    }

    function validateSwipeTime() {
      var result;
      return result = !options.maxTimeThreshold || !(duration >= options.maxTimeThreshold);
    }

    function validateDefaultEvent(jqEvent, direction) {
      if (options.preventDefaultEvents !== !1) if (options.allowPageScroll === NONE) jqEvent.preventDefault();else {
        var auto = options.allowPageScroll === AUTO;

        switch (direction) {
          case LEFT:
            (options.swipeLeft && auto || !auto && options.allowPageScroll != HORIZONTAL) && jqEvent.preventDefault();
            break;

          case RIGHT:
            (options.swipeRight && auto || !auto && options.allowPageScroll != HORIZONTAL) && jqEvent.preventDefault();
            break;

          case UP:
            (options.swipeUp && auto || !auto && options.allowPageScroll != VERTICAL) && jqEvent.preventDefault();
            break;

          case DOWN:
            (options.swipeDown && auto || !auto && options.allowPageScroll != VERTICAL) && jqEvent.preventDefault();
            break;

          case NONE:
        }
      }
    }

    function validatePinch() {
      var hasCorrectFingerCount = validateFingers(),
          hasEndPoint = validateEndPoint(),
          hasCorrectDistance = validatePinchDistance();
      return hasCorrectFingerCount && hasEndPoint && hasCorrectDistance;
    }

    function hasPinches() {
      return !!(options.pinchStatus || options.pinchIn || options.pinchOut);
    }

    function didPinch() {
      return !(!validatePinch() || !hasPinches());
    }

    function validateSwipe() {
      var hasValidTime = validateSwipeTime(),
          hasValidDistance = validateSwipeDistance(),
          hasCorrectFingerCount = validateFingers(),
          hasEndPoint = validateEndPoint(),
          didCancel = didSwipeBackToCancel(),
          valid = !didCancel && hasEndPoint && hasCorrectFingerCount && hasValidDistance && hasValidTime;
      return valid;
    }

    function hasSwipes() {
      return !!(options.swipe || options.swipeStatus || options.swipeLeft || options.swipeRight || options.swipeUp || options.swipeDown);
    }

    function didSwipe() {
      return !(!validateSwipe() || !hasSwipes());
    }

    function validateFingers() {
      return fingerCount === options.fingers || options.fingers === ALL_FINGERS || !SUPPORTS_TOUCH;
    }

    function validateEndPoint() {
      return 0 !== fingerData[0].end.x;
    }

    function hasTap() {
      return !!options.tap;
    }

    function hasDoubleTap() {
      return !!options.doubleTap;
    }

    function hasLongTap() {
      return !!options.longTap;
    }

    function validateDoubleTap() {
      if (null == doubleTapStartTime) return !1;
      var now = getTimeStamp();
      return hasDoubleTap() && now - doubleTapStartTime <= options.doubleTapThreshold;
    }

    function inDoubleTap() {
      return validateDoubleTap();
    }

    function validateTap() {
      return (1 === fingerCount || !SUPPORTS_TOUCH) && (isNaN(distance) || distance < options.threshold);
    }

    function validateLongTap() {
      return duration > options.longTapThreshold && distance < DOUBLE_TAP_THRESHOLD;
    }

    function didTap() {
      return !(!validateTap() || !hasTap());
    }

    function didDoubleTap() {
      return !(!validateDoubleTap() || !hasDoubleTap());
    }

    function didLongTap() {
      return !(!validateLongTap() || !hasLongTap());
    }

    function startMultiFingerRelease(event) {
      previousTouchEndTime = getTimeStamp(), fingerCountAtRelease = event.touches.length + 1;
    }

    function cancelMultiFingerRelease() {
      previousTouchEndTime = 0, fingerCountAtRelease = 0;
    }

    function inMultiFingerRelease() {
      var withinThreshold = !1;

      if (previousTouchEndTime) {
        var diff = getTimeStamp() - previousTouchEndTime;
        diff <= options.fingerReleaseThreshold && (withinThreshold = !0);
      }

      return withinThreshold;
    }

    function getTouchInProgress() {
      return !($element.data(PLUGIN_NS + "_intouch") !== !0);
    }

    function setTouchInProgress(val) {
      $element && (val === !0 ? ($element.bind(MOVE_EV, touchMove), $element.bind(END_EV, touchEnd), LEAVE_EV && $element.bind(LEAVE_EV, touchLeave)) : ($element.unbind(MOVE_EV, touchMove, !1), $element.unbind(END_EV, touchEnd, !1), LEAVE_EV && $element.unbind(LEAVE_EV, touchLeave, !1)), $element.data(PLUGIN_NS + "_intouch", val === !0));
    }

    function createFingerData(id, evt) {
      var f = {
        start: {
          x: 0,
          y: 0
        },
        last: {
          x: 0,
          y: 0
        },
        end: {
          x: 0,
          y: 0
        }
      };
      return f.start.x = f.last.x = f.end.x = evt.pageX || evt.clientX, f.start.y = f.last.y = f.end.y = evt.pageY || evt.clientY, fingerData[id] = f, f;
    }

    function updateFingerData(evt) {
      var id = void 0 !== evt.identifier ? evt.identifier : 0,
          f = getFingerData(id);
      return null === f && (f = createFingerData(id, evt)), f.last.x = f.end.x, f.last.y = f.end.y, f.end.x = evt.pageX || evt.clientX, f.end.y = evt.pageY || evt.clientY, f;
    }

    function getFingerData(id) {
      return fingerData[id] || null;
    }

    function setMaxDistance(direction, distance) {
      direction != NONE && (distance = Math.max(distance, getMaxDistance(direction)), maximumsMap[direction].distance = distance);
    }

    function getMaxDistance(direction) {
      if (maximumsMap[direction]) return maximumsMap[direction].distance;
    }

    function createMaximumsData() {
      var maxData = {};
      return maxData[LEFT] = createMaximumVO(LEFT), maxData[RIGHT] = createMaximumVO(RIGHT), maxData[UP] = createMaximumVO(UP), maxData[DOWN] = createMaximumVO(DOWN), maxData;
    }

    function createMaximumVO(dir) {
      return {
        direction: dir,
        distance: 0
      };
    }

    function calculateDuration() {
      return endTime - startTime;
    }

    function calculateTouchesDistance(startPoint, endPoint) {
      var diffX = Math.abs(startPoint.x - endPoint.x),
          diffY = Math.abs(startPoint.y - endPoint.y);
      return Math.round(Math.sqrt(diffX * diffX + diffY * diffY));
    }

    function calculatePinchZoom(startDistance, endDistance) {
      var percent = endDistance / startDistance * 1;
      return percent.toFixed(2);
    }

    function calculatePinchDirection() {
      return pinchZoom < 1 ? OUT : IN;
    }

    function calculateDistance(startPoint, endPoint) {
      return Math.round(Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)));
    }

    function calculateAngle(startPoint, endPoint) {
      var x = startPoint.x - endPoint.x,
          y = endPoint.y - startPoint.y,
          r = Math.atan2(y, x),
          angle = Math.round(180 * r / Math.PI);
      return angle < 0 && (angle = 360 - Math.abs(angle)), angle;
    }

    function calculateDirection(startPoint, endPoint) {
      if (comparePoints(startPoint, endPoint)) return NONE;
      var angle = calculateAngle(startPoint, endPoint);
      return angle <= 45 && angle >= 0 ? LEFT : angle <= 360 && angle >= 315 ? LEFT : angle >= 135 && angle <= 225 ? RIGHT : angle > 45 && angle < 135 ? DOWN : UP;
    }

    function getTimeStamp() {
      var now = new Date();
      return now.getTime();
    }

    function getbounds(el) {
      el = $(el);
      var offset = el.offset(),
          bounds = {
        left: offset.left,
        right: offset.left + el.outerWidth(),
        top: offset.top,
        bottom: offset.top + el.outerHeight()
      };
      return bounds;
    }

    function isInBounds(point, bounds) {
      return point.x > bounds.left && point.x < bounds.right && point.y > bounds.top && point.y < bounds.bottom;
    }

    function comparePoints(pointA, pointB) {
      return pointA.x == pointB.x && pointA.y == pointB.y;
    }

    var options = $.extend({}, options),
        useTouchEvents = SUPPORTS_TOUCH || SUPPORTS_POINTER || !options.fallbackToMouseEvents,
        START_EV = useTouchEvents ? SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerDown" : "pointerdown" : "touchstart" : "mousedown",
        MOVE_EV = useTouchEvents ? SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerMove" : "pointermove" : "touchmove" : "mousemove",
        END_EV = useTouchEvents ? SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerUp" : "pointerup" : "touchend" : "mouseup",
        LEAVE_EV = useTouchEvents ? SUPPORTS_POINTER ? "mouseleave" : null : "mouseleave",
        CANCEL_EV = SUPPORTS_POINTER ? SUPPORTS_POINTER_IE10 ? "MSPointerCancel" : "pointercancel" : "touchcancel",
        distance = 0,
        direction = null,
        currentDirection = null,
        duration = 0,
        startTouchesDistance = 0,
        endTouchesDistance = 0,
        pinchZoom = 1,
        pinchDistance = 0,
        pinchDirection = 0,
        maximumsMap = null,
        $element = $(element),
        phase = "start",
        fingerCount = 0,
        fingerData = {},
        startTime = 0,
        endTime = 0,
        previousTouchEndTime = 0,
        fingerCountAtRelease = 0,
        doubleTapStartTime = 0,
        singleTapTimeout = null,
        holdTimeout = null;

    try {
      $element.bind(START_EV, touchStart), $element.bind(CANCEL_EV, touchCancel);
    } catch (e) {
      $.error("events not supported " + START_EV + "," + CANCEL_EV + " on jQuery.swipe");
    }

    this.enable = function () {
      return this.disable(), $element.bind(START_EV, touchStart), $element.bind(CANCEL_EV, touchCancel), $element;
    }, this.disable = function () {
      return removeListeners(), $element;
    }, this.destroy = function () {
      removeListeners(), $element.data(PLUGIN_NS, null), $element = null;
    }, this.option = function (property, value) {
      if ("object" == _typeof(property)) options = $.extend(options, property);else if (void 0 !== options[property]) {
        if (void 0 === value) return options[property];
        options[property] = value;
      } else {
        if (!property) return options;
        $.error("Option " + property + " does not exist on jQuery.swipe.options");
      }
      return null;
    };
  }

  var VERSION = "1.6.18",
      LEFT = "left",
      RIGHT = "right",
      UP = "up",
      DOWN = "down",
      IN = "in",
      OUT = "out",
      NONE = "none",
      AUTO = "auto",
      SWIPE = "swipe",
      PINCH = "pinch",
      TAP = "tap",
      DOUBLE_TAP = "doubletap",
      LONG_TAP = "longtap",
      HORIZONTAL = "horizontal",
      VERTICAL = "vertical",
      ALL_FINGERS = "all",
      DOUBLE_TAP_THRESHOLD = 10,
      PHASE_START = "start",
      PHASE_MOVE = "move",
      PHASE_END = "end",
      PHASE_CANCEL = "cancel",
      SUPPORTS_TOUCH = ("ontouchstart" in window),
      SUPPORTS_POINTER_IE10 = window.navigator.msPointerEnabled && !window.navigator.pointerEnabled && !SUPPORTS_TOUCH,
      SUPPORTS_POINTER = (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && !SUPPORTS_TOUCH,
      PLUGIN_NS = "TouchSwipe",
      defaults = {
    fingers: 1,
    threshold: 75,
    cancelThreshold: null,
    pinchThreshold: 20,
    maxTimeThreshold: null,
    fingerReleaseThreshold: 250,
    longTapThreshold: 500,
    doubleTapThreshold: 200,
    swipe: null,
    swipeLeft: null,
    swipeRight: null,
    swipeUp: null,
    swipeDown: null,
    swipeStatus: null,
    pinchIn: null,
    pinchOut: null,
    pinchStatus: null,
    click: null,
    tap: null,
    doubleTap: null,
    longTap: null,
    hold: null,
    triggerOnTouchEnd: !0,
    triggerOnTouchLeave: !1,
    allowPageScroll: "auto",
    fallbackToMouseEvents: !0,
    excludedElements: ".noSwipe",
    preventDefaultEvents: !0
  };
  $.fn.swipe = function (method) {
    var $this = $(this),
        plugin = $this.data(PLUGIN_NS);

    if (plugin && "string" == typeof method) {
      if (plugin[method]) return plugin[method].apply(plugin, Array.prototype.slice.call(arguments, 1));
      $.error("Method " + method + " does not exist on jQuery.swipe");
    } else if (plugin && "object" == _typeof(method)) plugin.option.apply(plugin, arguments);else if (!(plugin || "object" != _typeof(method) && method)) return init.apply(this, arguments);

    return $this;
  }, $.fn.swipe.version = VERSION, $.fn.swipe.defaults = defaults, $.fn.swipe.phases = {
    PHASE_START: PHASE_START,
    PHASE_MOVE: PHASE_MOVE,
    PHASE_END: PHASE_END,
    PHASE_CANCEL: PHASE_CANCEL
  }, $.fn.swipe.directions = {
    LEFT: LEFT,
    RIGHT: RIGHT,
    UP: UP,
    DOWN: DOWN,
    IN: IN,
    OUT: OUT
  }, $.fn.swipe.pageScroll = {
    NONE: NONE,
    HORIZONTAL: HORIZONTAL,
    VERTICAL: VERTICAL,
    AUTO: AUTO
  }, $.fn.swipe.fingers = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    ALL: ALL_FINGERS
  };
}); // smooth anchor scroll

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
  var $burgerContainer = $(".burger-container");
  var $burgerIcon = $(".burger-icon");
  var $burgerMenu = $(".burger-menu");
  $burgerIcon.click(function () {
    $burgerMenu.toggleClass("burger-opened");
    $burgerContainer.toggleClass("burger-close");

    if ($burgerIcon.hasClass("burger-close") == true) {
      $(".go-to-top").css("display", "none");
    } else {
      $(".go-to-top").css("display", "block");
    }
  });
  $burgerContainer.swipe({
    swipeLeft: function swipeLeft(event, direction, distance, duration, fingerCount) {
      $(".burger-menu").addClass("burger-opened");
      $(".burger-container").addClass("burger-close");
    }
  });
  $burgerMenu.swipe({
    swipeRight: function swipeRight(event, direction, distance, duration, fingerCount) {
      $(".burger-menu").removeClass("burger-opened");
      $(".burger-container").removeClass("burger-close");
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
