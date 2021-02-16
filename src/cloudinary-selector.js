var config = null;
var currentValue = null;
var isDisabled = true;

function updateDisabled(disabled) {
  const elements = $(".selector").add(".remove").add(".spacer");
  if (disabled) {
    elements.hide();
  } else {
    elements.show();
  }
  isDisabled = disabled;
  updateSize();
}

function renderSelected(images) {
  const $selected = $(".selected").empty();
  const $titleText = $(".title").find(".text");
  const $clear = $(".btn--destructive").hide();

  if (images && images.length) {
    $titleText.text("Selected images");
    $titleText.addClass("title--selected");
    $clear.show();

    for (var i = 0; i < images.length; i++) {
      const image = images[i];
      if (image && image.public_id) {
        imageTile($selected, image);
      }
    }
  } else {
    $titleText.text("No assets selected");
    $titleText.removeClass("title--selected");
  }
  updateSize();
}

function updateValue(images) {
  // Send updated value to Kentico (send null in case of the empty string => element will not meet required condition).
  if (!isDisabled) {
    if (images && images.length) {
      currentValue = images;
      CustomElement.setValue(JSON.stringify(images));
      renderSelected(images);
    } else {
      currentValue = null;
      CustomElement.setValue(null);
      renderSelected(null);
    }
  }
}

function remove(public_id) {
  const images = currentValue || [];
  const newImages = images.filter((image) => image.public_id !== public_id);

  updateValue(newImages);
}

function imageTile($parent, item) {
  const $tile = $(
    `<div class="tile" title="${item.public_id}"></div>`
  ).appendTo($parent);

  const $actions = $('<div class="actions"></div>').appendTo($tile);

  $(
    `<div class="action remove" title="Remove"><i class="icon-remove"></i></div>`
  )
    .appendTo($actions)
    .click(function () {
      remove(item.public_id);
    });

  if (item.secure_url) {
    const $preview = $('<div class="preview"></div>').appendTo($tile);

    $('<img draggable="false" class="thumbnail" />')
      .attr("src", item.secure_url)
      .appendTo($preview)
      .on("load", updateSize);
  } else {
    $('<div class="noimage">No image available</div>').appendTo($tile);
  }

  const $info = $(`<div class="info"></div>`).appendTo($tile);
  $(`<div class="name">${item.public_id}</div>`).appendTo($info);

  updateSize();
}

function setupSelector(value) {
  $(".clear").click(function () {
    updateValue(null);
  });

  if (value) {
    currentValue = JSON.parse(value);
    renderSelected(currentValue);
  } else {
    renderSelected(null);
  }
  // Reacts to window resize to adjust the height
  window.addEventListener("resize", updateSize);
}

function updateSize() {
  // Update the custom element height in the Kentico UI.
  const height = isDisabled
    ? Math.ceil($("html").height())
    : window.screen.height - 300;

  CustomElement.setHeight(height);
}

function initCustomElement() {
  try {
    CustomElement.init((element, _context) => {
      // Setup with initial value and disabled state
      config = element.config || {};
      window.ml = cloudinary.createMediaLibrary(
        {
          cloud_name: config.cloudName,
          api_key: config.apiKey,
          button_class: "btn btn--primary",
          button_caption: "Select Assets",
        },
        {
          insertHandler: function (data) {
            updateValue(data.assets);
          },
        },
        document.getElementById("open-btn")
      );

      setupSelector(element.value);
      updateDisabled(element.disabled);
      updateSize();
    });

    // Reacts to changes in disabling (e.g., when publishing the item)
    CustomElement.onDisabledChanged(updateDisabled);
  } catch (err) {
    // Sends message to console and editor if initialization failed (for example, the page is displayed outside the Kontent UI)
    console.error(err);
    setupSelector();
    updateDisabled(true);
  }
}

initCustomElement();
