// -----------------------------------------------------------------------------------
//
//	Lightbox v2.05
//	by Lokesh Dhakar - http://www.lokeshdhakar.com
//	Last Modification: 3/18/11
//
//	For more information, visit:
//	http://lokeshdhakar.com/projects/lightbox2/
//
//	Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
//  	- Free for use in both personal and commercial projects
//		- Attribution requires leaving author name, author link, and the license info intact.
//
//  Thanks: Scott Upton(uptonic.com), Peter-Paul Koch(quirksmode.com), and Thomas Fuchs(mir.aculo.us) for ideas, libs, and snippets.
//  		Artemy Tregubenko (arty.name) for cleanup and help in updating to latest ver of proto-aculous.
//
// -----------------------------------------------------------------------------------
/*

    Table of Contents
    -----------------
    Configuration

    Lightbox Class Declaration
    - initialize()
    - updateImageList()
    - start()
    - changeImage()
    - resizeImageContainer()
    - showImage()
    - updateDetails()
    - updateNav()
    - enableKeyboardNav()
    - disableKeyboardNav()
    - keyboardAction()
    - preloadNeighborImages()
    - end()

    Function Calls
    - document.observe()

*/
// -----------------------------------------------------------------------------------

//
//  Configurationl
//
LightboxOptions = Object.extend(
  {
    fileLoadingImage: "images/icons/loading.gif",
    fileBottomNavCloseImage: "images/icons/close.svg",

    overlayOpacity: 0.8, // controls transparency of shadow overlay

    animate: true, // toggles resizing animations
    resizeDuration: 0.6, // the duration of the image resizing animations (in seconds)

    borderSize: 10, //if you adjust the padding in the CSS, you will need to update this variable

    // When grouping images this is used to write: Image # of #.
    // Change it for non-english localization
    labelImage: "Image",
    labelOf: "of",
  },
  window.LightboxOptions || {},
);

// -----------------------------------------------------------------------------------

var Lightbox = Class.create();

Lightbox.prototype = {
  imageArray: [],
  activeImage: undefined,

  // initialize()
  // Constructor runs on completion of the DOM loading. Calls updateImageList and then
  // the function inserts html at the bottom of the page which is used to display the shadow
  // overlay and the image container.
  //
  initialize: function () {
    this.updateImageList();

    this.keyboardAction = this.keyboardAction.bindAsEventListener(this);

    this.resizeDuration = LightboxOptions.animate
      ? LightboxOptions.resizeDuration
      : 0;
    this.overlayDuration = LightboxOptions.animate ? LightboxOptions.overlayDuration : 0; // shadow fade in/out duration

    // When Lightbox starts it will resize itself from 250 by 250 to the current image dimension.
    // If animations are turned off, it will be hidden as to prevent a flicker of a
    // white 250 by 250 box.
    var size = (LightboxOptions.animate ? 250 : 1) + "px";

    // Code inserts html at the bottom of the page that looks similar to this:
    //
    // <div id="overlay"></div>
    // <div id="lightbox">
    //   <div id="outerImageContainer">
    //     <div id="imageDataContainer">
    //       <div id="imageData">
    //         <div id="imageDetails">
    //           <span id="caption"></span>
    //           <span id="numberDisplay"></span>
    //         </div>
    //         <div id="bottomNav">
    //           <a href="#" id="bottomNavClose">
    //             <img src="images/close.gif">
    //           </a>
    //         </div>
    //       </div>
    //     </div>
    //     <div id="imageContainer">
    //       <img id="lightboxImage">
    //       <div style="" id="hoverNav">
    //         <a href="#" id="prevLink"></a>
    //         <a href="#" id="nextLink"></a>
    //       </div>
    //       <div id="loading">
    //         <a href="#" id="loadingLink">
    //           <img src="images/loading.gif">
    //         </a>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    var objBody = $$("body")[0];

    objBody.appendChild(Builder.node("div", { id: "overlay" }));

    objBody.appendChild(
      Builder.node("div", { id: "lightbox" }, [
        Builder.node("div", { id: "outerImageContainer" }, [
          Builder.node(
            "div",
            { id: "imageDataContainer" },
            Builder.node("div", { id: "imageData" }, [
              Builder.node("div", { id: "imageDetails" }, [
                Builder.node("span", { id: "caption" }),
                Builder.node("span", { id: "numberDisplay" }),
              ]),
              Builder.node(
                "div",
                { id: "bottomNav" },
                Builder.node(
                  "a",
                  { id: "bottomNavClose", href: "#" },
                  Builder.node("img", {
                    src: LightboxOptions.fileBottomNavCloseImage,
                  })
                )
              ),
            ])
          ),
          Builder.node("div", { id: "imageContainer" }, [
            Builder.node("img", { id: "lightboxImage" }),
            Builder.node("div", { id: "hoverNav" }, [
              Builder.node("a", { id: "prevLink", href: "#" }),
              Builder.node("a", { id: "nextLink", href: "#" }),
            ]),
            Builder.node(
              "div",
              { id: "loading" },
              Builder.node(
                "a",
                { id: "loadingLink", href: "#" },
                Builder.node("img", { src: LightboxOptions.fileLoadingImage })
              )
            ),
          ]),
        ]),
      ])
    );

    $("overlay")
      .hide()
      .observe(
        "click",
        function () {
          this.end();
        }.bind(this),
      );
    $("lightbox")
      .hide()
      .observe(
        "click",
        function (event) {
          if (event.element().id == "lightbox") this.end();
        }.bind(this),
      );
    $("prevLink").observe(
      "click",
      function (event) {
        event.stop();
        this.changeImage(this.activeImage - 1);
      }.bindAsEventListener(this),
    );
    $("nextLink").observe(
      "click",
      function (event) {
        event.stop();
        this.changeImage(this.activeImage + 1);
      }.bindAsEventListener(this),
    );
    $("loadingLink").observe(
      "click",
      function (event) {
        event.stop();
        this.end();
      }.bind(this),
    );
    $("bottomNavClose").observe(
      "click",
      function (event) {
        event.stop();
        this.end();
      }.bind(this),
    );

    var th = this;
    (function () {
      var ids =
        "overlay lightbox outerImageContainer imageContainer lightboxImage hoverNav prevLink nextLink loading loadingLink " +
        "imageDataContainer imageData imageDetails caption numberDisplay bottomNav bottomNavClose";
      $w(ids).each(function (id) {
        th[id] = $(id);
      });
    }).defer();
  },

  //
  // updateImageList()
  // Loops through anchor tags looking for 'lightbox' references and applies onclick
  // events to appropriate links. You can rerun after dynamically adding images w/ajax.
  //
  updateImageList: function () {
    this.updateImageList = Prototype.emptyFunction;

    document.observe(
      "click",
      function (event) {
        var target =
          event.findElement("a[rel^=lightbox]") ||
          event.findElement("area[rel^=lightbox]");
        if (target) {
          event.stop();
          this.start(target);
        }
      }.bind(this),
    );
  },

  //
  //  start()
  //  Display overlay and lightbox. If image is part of a set, add siblings to imageArray.
  //
  start: function (imageLink) {
    $$("select", "object", "embed").each(function (node) {
      node.style.visibility = "hidden";
    });

    new Effect.Appear(this.overlay, {
      duration: this.overlayDuration,
      from: 0.0,
      to: LightboxOptions.overlayOpacity,
    });

    new Effect.Appear(this.lightbox, {
      duration: this.overlayDuration,
      from: 0.0,
      to: 1.0,
    });

    new Effect.Appear(this.imageDataContainer, {
      duration: this.overlayDuration,
      from: 0.0,
      to: 1.0,
    });

    this.imageArray = [];
    var imageNum = 0;

    if (imageLink.getAttribute("rel") == "lightbox") {
      // if image is NOT part of a set, add single image to imageArray
      this.imageArray.push([imageLink.href, imageLink.title]);
    } else {
      // if image is part of a set..
      this.imageArray = $$(
        imageLink.tagName + '[href][rel="' + imageLink.rel + '"]',
      )
        .collect(function (anchor) {
          return [anchor.href, anchor.title];
        })
        .uniq();

      while (this.imageArray[imageNum][0] != imageLink.href) {
        imageNum++;
      }
    }

    // calculate top and left offset for the lightbox
    var arrayPageScroll = document.viewport.getScrollOffsets();
    var lightboxTop = arrayPageScroll[1] + document.viewport.getHeight() / 70; // change on Oct.3: divided by 70 instead of 10
    var lightboxLeft = arrayPageScroll[0];
    this.lightbox
      .setStyle({ top: lightboxTop + "px", left: lightboxLeft + "px", opacity: 0.0 })
      .show();

    this.changeImage(imageNum, true);
  },

  //
  //  changeImage()
  //  Hide most elements and preload image in preparation for resizing image container.
  //
  changeImage: function (imageNum, firstLoad = false) {
    this.activeImage = imageNum; // update global var

    // hide elements during transition
    if (LightboxOptions.animate) {
      this.loading.show();
    }
    this.lightboxImage.hide();
    this.hoverNav.hide();
    this.prevLink.hide();
    this.nextLink.hide();
    this.numberDisplay.hide();

    var imgPreloader = new Image();

    // once image is preloaded, resize image container
    imgPreloader.onload = function () {
      this.lightboxImage.src = this.imageArray[this.activeImage][0];
      /*Bug Fixed by Andy Scott*/
      this.lightboxImage.width = imgPreloader.width;
      this.lightboxImage.height = imgPreloader.height;
      /*End of Bug Fix*/
      this.resizeImageContainer(imgPreloader.width, imgPreloader.height, firstLoad);
    }.bind(this);
    imgPreloader.src = this.imageArray[this.activeImage][0];
  },

  //
  //  resizeImageContainer()
  //
  resizeImageContainer: function (imgWidth, imgHeight, firstLoad = false) {
    // get current width and height
    var widthCurrent = this.outerImageContainer.getWidth();
    var heightCurrent = this.imageContainer.getHeight();

    var widthNew = imgWidth + LightboxOptions.borderSize * 2;
    var heightNew = imgHeight;

    // calculate size difference between new and old image, and resize if necessary
    var wDiff = widthCurrent - widthNew;
    var hDiff = heightCurrent - heightNew;

    if (hDiff != 0 || wDiff != 0) {
      new Effect.Scale(this.outerImageContainer, [100, (widthNew / widthCurrent) * 100], {
        scaleY: false,
        duration: firstLoad ? 0 : this.resizeDuration,
      });
      new Effect.Scale(this.imageContainer, [(heightNew / heightCurrent) * 100, 100], {
        scaleX: false,
        duration: firstLoad ? 0 : this.resizeDuration,
      });
    }

    // if new and old image are same size and no scaling transition is necessary,
    // do a quick pause to prevent image flicker.
    var timeout = 0;
    if (hDiff == 0 && wDiff == 0) {
      timeout = 100;
      if (Prototype.Browser.IE) timeout = 250;
    }

    (function () {
      this.showImage();
    })
      .bind(this)
      .delay(timeout / 1000);
  },

  //
  //  showImage()
  //  Display image and begin preloading neighbors.
  //
  showImage: function () {
    this.loading.hide();
    this.updateDetails();
    // new Effect.Appear(this.imageDataContainer, {
    //   duration: this.resizeDuration,
    //   // queue: "end",
    // });
    new Effect.Appear(this.lightboxImage, {
      duration: this.resizeDuration,
      queue: "end",
    });
    this.preloadNeighborImages();
  },

  //
  //  updateDetails()
  //  Display caption, image number, and bottom nav.
  //
  updateDetails: function () {
    this.caption.update(this.imageArray[this.activeImage][1]).show();

    // if image is part of set display 'Image x of x'
    if (this.imageArray.length > 1) {
      this.numberDisplay
        .update(
          LightboxOptions.labelImage +
            " " +
            (this.activeImage + 1) +
            " " +
            LightboxOptions.labelOf +
            "  " +
            this.imageArray.length,
        )
        .show();
    }

    new Effect.Parallel(
      [
        // new Effect.Appear(this.imageDataContainer, {
        //   sync: true,
        //   duration: this.resizeDuration,
        // }),
      ],
      {
        duration: this.resizeDuration,
        afterFinish: function () {
          this.updateNav();
        }.bind(this),
      },
    );
  },

  //
  //  updateNav()
  //  Display appropriate previous and next hover navigation.
  //
  updateNav: function () {
    this.hoverNav.show();

    // if not first image in set, display prev image button
    if (this.activeImage > 0) this.prevLink.show();

    // if not last image in set, display next image button
    if (this.activeImage < this.imageArray.length - 1) this.nextLink.show();

    this.enableKeyboardNav();
  },

  //
  //  enableKeyboardNav()
  //
  enableKeyboardNav: function () {
    document.observe("keydown", this.keyboardAction);
  },

  //
  //  disableKeyboardNav()
  //
  disableKeyboardNav: function () {
    document.stopObserving("keydown", this.keyboardAction);
  },

  //
  //  keyboardAction()
  //
  keyboardAction: function (event) {
    var keycode = event.keyCode;

    var escapeKey;
    if (event.DOM_VK_ESCAPE) {
      // mozilla
      escapeKey = event.DOM_VK_ESCAPE;
    } else {
      // ie
      escapeKey = 27;
    }

    var key = String.fromCharCode(keycode).toLowerCase();

    if (key.match(/x|o|c/) || keycode == escapeKey) {
      // close lightbox
      this.end();
    } else if (key == "p" || keycode == 37) {
      // display previous image
      if (this.activeImage != 0) {
        this.disableKeyboardNav();
        this.changeImage(this.activeImage - 1);
      }
    } else if (key == "n" || keycode == 39) {
      // display next image
      if (this.activeImage != this.imageArray.length - 1) {
        this.disableKeyboardNav();
        this.changeImage(this.activeImage + 1);
      }
    }
  },

  //
  //  preloadNeighborImages()
  //  Preload previous and next images.
  //
  preloadNeighborImages: function () {
    var preloadNextImage, preloadPrevImage;
    if (this.imageArray.length > this.activeImage + 1) {
      preloadNextImage = new Image();
      preloadNextImage.src = this.imageArray[this.activeImage + 1][0];
    }
    if (this.activeImage > 0) {
      preloadPrevImage = new Image();
      preloadPrevImage.src = this.imageArray[this.activeImage - 1][0];
    }
  },

  //
  //  end()
  //
  end: function () {
    this.disableKeyboardNav();
    this.lightbox.hide();
    new Effect.Fade(this.overlay, { duration: this.overlayDuration });
    $$("select", "object", "embed").each(function (node) {
      node.style.visibility = "visible";
    });
  },
};

document.observe("dom:loaded", function () {
  new Lightbox();
});
