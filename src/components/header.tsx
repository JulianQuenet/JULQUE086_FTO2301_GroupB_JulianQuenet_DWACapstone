import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton/IconButton";


interface headerProps {
  user: any;
  toggle: () => void;
}

const Header = (props: headerProps) => {
  const { user, toggle } = props;

  const headerStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
  };



  return (
    <>
      <div className="header">
        <div style={headerStyles}>
          <img src="./src/assets/mic-logo.png" width={60} />
          <div style={{ color: "Highlight" }}>PODLY</div>
        </div>
        <div className="user-section">
          <div style={{ color: "Highlight" }} className="user-info">
            Welcome back {user.user.user_metadata.full_name}
          </div>
          <div className="user-controls">
            <IconButton onClick={toggle} color="info">
              <SettingsIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
