//style
import { StyledDownloadButton } from "./style";

export const DownloadButton = ({ children, onClick, href, download }) => {
  return (
    <StyledDownloadButton href={href} onClick={onClick} download={download}>
      {children}
    </StyledDownloadButton>
  );
};
