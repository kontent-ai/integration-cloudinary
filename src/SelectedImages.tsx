import { FC } from "react";

type Props = Readonly<{
  images: ReadonlyArray<CloudinaryImage>;
  isDisabled: boolean;
  removeImage: (imageId: string) => void;
}>

export const SelectedImages: FC<Props> = props => (
  <div className="selected">
    {props.images.map(image => (
      <div
        key={image.public_id}
        className="asset-thumbnail"
      >
        <div className="asset-preview">
          <div className="asset-thumbnail__actions-pane">
            {!!image.secure_url && (
              <a
                className="asset-action"
                title="Download"
                href={image.secure_url}
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon-arrow-down-line" />
              </a>
            )}
            {!props.isDisabled && (
              <button
                className="asset-action asset-action--remove"
                title="Remove"
                onClick={() => props.removeImage(image.public_id)}
              >
                <i className="icon-times" />
              </button>
            )}
          </div>
          {renderImage(image)}
          <div className="asset-thumbnail__bottom">{image.public_id}</div>
        </div>
      </div>
    ))}
  </div>
);

SelectedImages.displayName = 'SelectedImages';

const renderImage = (image: CloudinaryImage) => image.secure_url
  ? (
    <a
      href={image.secure_url}
      target="_blank"
      rel="noreferrer"
    >
      <img
        className="asset-thumbnail__image"
        src={image.secure_url}
        alt={image.public_id}
      />
    </a>
  )
  : (
    <div className="noimage">
      No image available
    </div>
  )
