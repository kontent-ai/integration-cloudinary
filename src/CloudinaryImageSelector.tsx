import { FC, useCallback, useEffect, useLayoutEffect, useState } from "react";

import { AssetsPickerButton } from "./AssetsPickerButton";
import { PoweredByLogo } from "./PoweredByLogo";
import { SelectedImages } from "./SelectedImages";

export const CloudinaryImageSelector: FC = () => {
  const [currentValue, setCurrentValue] = useState<ReadonlyArray<CloudinaryImage> | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<MediaLibrary | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [fixedSize, setFixedSize] = useState<number | null>(null);

  const updateValue = useCallback((newValue: ReadonlyArray<CloudinaryImage>) => {
    // send null for [] so that the element fails validation when it should not be empty
    CustomElement.setValue(newValue.length ? JSON.stringify(newValue) : null);
    setCurrentValue(newValue);
  }, []);

  const updateSize = useCallback((providedSize?: number) => {
    setFixedSize(providedSize ?? null);
    const newSize = providedSize ?? Math.max(document.documentElement.offsetHeight, 100);

    CustomElement.setHeight(Math.ceil(newSize));
  }, []);

  useLayoutEffect(() => {
    updateSize();
  }, [updateSize, currentValue]);

  useEffect(() => {
    CustomElement.init((el) => {
      const { cloudName, apiKey, defaultTransformation } = el.config ?? {};
      if (typeof cloudName !== "string" || typeof apiKey !== "string") {
        throw new Error(`Custom element configuration must contain "cloudName" and "apiKey" keys of type string.`);
      }
      if (defaultTransformation !== undefined && !isArrayOf(isArrayOf(isObject))(defaultTransformation)) {
        throw new Error("The \"defaultTransformation\" key must be of type Object[][].");
      }

      const settings = {
        cloud_name: cloudName,
        api_key: apiKey,
        multiple: true,
        default_transformations: defaultTransformation,
        integration: {
          type: "kontentai_connector",
          platform: "kontent_custom_element 1.0",
          version: "1.0",
          environment: "prod",
        },
      };

      const newMediaLibrary = cloudinary.createMediaLibrary(
        settings,
        {
          insertHandler(data) {
            updateValue(data.assets);
          },
          showHandler() {
            updateSize(800);
          },
          hideHandler() {
            updateSize();
          },
        },
      );

      setMediaLibrary(newMediaLibrary);

      setCurrentValue(JSON.parse(el.value || "[]"));
      setIsDisabled(el.disabled);
    });
  }, [updateSize, updateValue]);

  useEffect(() => {
    CustomElement.onDisabledChanged(setIsDisabled);
  }, []);

  useEffect(() => {
    const listener = () => {
      setWindowWidth(window.innerWidth);
      if (windowWidth !== window.innerWidth && fixedSize === null) {
        updateSize();
      }
    };
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [updateSize, windowWidth, fixedSize]);

  if (currentValue === null) {
    return null;
  }

  const removeImage = (publicId: string) => {
    if (isDisabled) {
      return;
    }
    const newValue = currentValue.filter(image => image.public_id !== publicId);

    updateValue(newValue);
  };

  return (
    <>
      <div style={{ padding: 10 }}>
        <AssetsPickerButton
          isDisabled={isDisabled}
          onClick={() => mediaLibrary?.show()}
        />
      </div>
      <SelectedImages
        images={currentValue}
        isDisabled={isDisabled}
        removeImage={removeImage}
      />
      <PoweredByLogo />
    </>
  );
};

CloudinaryImageSelector.displayName = "CloudinaryImageSelector";

const isArrayOf = <T extends unknown>(guard: (element: unknown) => element is T) => (arr: unknown): arr is T[] =>
  Array.isArray(arr) && arr.every(guard);

const isObject = (input: unknown): input is Record<PropertyKey, unknown> => typeof input === "object" && input !== null;
