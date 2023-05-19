import { FC } from "react";

type Props = Readonly<{
  onClick: () => void;
  isDisabled: boolean;
}>;

export const AssetsPickerButton: FC<Props> = props => (
  <div className="selector">
    <button
      className="btn btn--tertiary"
      onClick={props.onClick}
      disabled={props.isDisabled}
    >
      pick from assets
    </button>
  </div>
);

AssetsPickerButton.displayName = "AssetsPickerButton";
