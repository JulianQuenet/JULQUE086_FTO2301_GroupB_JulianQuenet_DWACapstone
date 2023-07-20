
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton/IconButton";

interface headerProps {
  user: any;
  toggle: () => void;
}

const Header = (props: headerProps) => {
  const { user, toggle } = props;

  return (
    <>
      <div className="header">
        <div>insert logo here....</div>
        <div className="user-section">
          <div className="user-info">
            Welcome back {user.user.user_metadata.full_name}
          </div>
          <div className="user-controls">
            <IconButton
              onClick={toggle}
              color="info"
            >
              <SettingsIcon />
            </IconButton>

          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
