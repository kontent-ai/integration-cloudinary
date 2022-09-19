import cloudinaryLogo from './images/cloudinary_logo.png'
import { FC } from "react";

export const PoweredByLogo: FC = () => (
  <div style={{ float: 'right', padding: 10 }}>
    <span style={{ paddingRight: 5 }}>powered by</span>
    <img
      height={40}
      src={cloudinaryLogo}
      alt="Cloudinary logo"
      title="Cloudinary logo"
    />
  </div>
);

PoweredByLogo.displayName = 'PoweredByLogo';
