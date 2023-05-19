type CreateMediaLibrarySetting = Readonly<{
  cloud_name: string;
  api_key: string;
  button_class?: string;
  button_caption?: string;
  multiple: boolean;
  default_transformations?: ReadonlyArray<ReadonlyArray<Record<string, unknown>>>;
  integration: Readonly<{
    type: string;
    platform: string;
    version: string;
    environment: string;
  }>;
}>;

type CloudinaryImage = Readonly<{
  secure_url: string;
  public_id: string;
  bytes: number;
  created_at: string;
  height: number;
  width: number;
  format: string;
}>;

type CreateMediaLibraryCallbacks = Readonly<{
  insertHandler: (data: { readonly assets: ReadonlyArray<CloudinaryImage> }) => void;
  showHandler: () => void;
  hideHandler: () => void;
}>;

type CloudinaryMediaLibraryCreator = {
  readonly createMediaLibrary: (
    settings: CreateMediaLibrarySetting,
    callbacks: CreateMediaLibraryCallbacks,
    buttonSelector?: string,
  ) => MediaLibrary;
};

type MediaLibrary = Readonly<{
  show: () => void;
}>;

declare const cloudinary: CloudinaryMediaLibraryCreator;
