var currentValue = null;
var isDisabled = true;
var config = null;

function updateDisabled(disabled) {
  const enabledElements = $(".selector").add(".remove");
  if (disabled) {
    enabledElements.hide();
  }
  else {
    enabledElements.show();  
  }
  
  isDisabled = disabled;
}

function remove(id) {
  const images = currentValue || [];
  const newImages = images.filter(image => image.public_id !== id);
  updateValue(newImages);
}

function renderSelected(images) {
  const $selected = $(".selected").empty();
  if (images && images.length) {
    for (var i = 0; i < images.length; i++) {
      const image = images[i];
      if (image) {
        imageTile($selected, image, remove);
      }
    }
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
    }
    else {
      currentValue = null;
      CustomElement.setValue(null);
      renderSelected(null);
    }
  }
}

function imageTile($parent, item, remove) {
  const $tile = $(`<div class="asset-thumbnail"></div>`).appendTo($parent);
  const $tileInside = $(`<div class="asset-preview"></div>`).appendTo($tile);
  const $actions = $('<div class="asset-thumbnail__actions-pane"></div>').appendTo($tileInside);

  if (item.secure_url) {
    $(`<a class="action" title="Download" href="${item.secure_url}" target="_blank"><i class="icon-arrow-down-line"></i></a>`).appendTo($actions);
    $(`<a class="remove" title="Remove"><i class="icon-times"></i></a>`).appendTo($actions).click(function () {remove(item.public_id);});
    $(`<a href="${item.secure_url}" target="_blank"><img class="asset-thumbnail__image" src="${item.secure_url}" /></a>`).appendTo($tileInside).on('load', updateSize);
  }
  else {
    $(`<a class="remove" title="Remove"><i class="icon-times"></i></a>`).appendTo($actions).click(function () {remove(item.public_id);});
    $('<div class="noimage">No image available</div>').appendTo($tileInside);
  }

  $(`<div class="asset-thumbnail__bottom">${item.public_id}</div>`).appendTo($tileInside);
}

function setupSelector(value) {
  if (value) {
    currentValue = JSON.parse(value);
    renderSelected(currentValue);
  }
  else {
    renderSelected(null);
  }
  // Reacts to window resize to adjust the height
  window.addEventListener("resize", updateSize);
}

function updateSize(val) {
  let height = Math.ceil(Math.max($("html").height(), document.body.offsetHeight, 100));
  if(val){
    height = val;
  }
  CustomElement.setHeight(height + 30);
}

function initCustomElement() {
  try {
    CustomElement.init((element, _context) => {
      // Setup with initial value and disabled state
      config = element.config || {};
      
      let settings = {
        cloud_name: config.cloudName,
        api_key: config.apiKey,
        button_class: "btn btn--tertiary",
        button_caption: "pick from assets",
        multiple: true,
        integration: {
          type: "kontentai_connector",
          platform: "kontent_custom_element 1.0",
          version: "1.0",
          environment: "prod"
        }            
      };
      
      if(config.defaultTransformations) {
        settings.default_transformations = config.defaultTransformations;
      }      

      window.ml = cloudinary.createMediaLibrary(
        settings,
        {
          insertHandler: function (data) {
            updateValue(data.assets);
          },
          showHandler: function() {
            updateSize(800);
          },
          hideHandler: function() {
            updateSize();
          }
        },
        "#open-btn"
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

$(document).ready(function () {
  initCustomElement();
});


