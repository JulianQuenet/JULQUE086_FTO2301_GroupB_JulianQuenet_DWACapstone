const footerStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  backdropFilter: "blur(4.5px)",
  borderTop: "1px solid rgba(255, 255, 255, 0.089)",
  width: "100%",
  marginTop: "4rem",
  fontFamily: "system-ui",
  color: "darkOrange",
  textAlign: "center",
};

const linkStyles: React.CSSProperties = {
  color: "khaki",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
};

const infoStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const Footer = () => {
  return (
    <footer className="header" style={footerStyles}>
      <div style={infoStyles}>
        Project by Julian Quenet, this serves as the final project in the
        Software Development Course provided by 
        <a style={linkStyles} href="https://www.codespace.co.za/"><img
          src="https://codespace-assets.global.ssl.fastly.net/wp/assets/website/favicon.ico"
          width={20}
        />
          CodeSpace Academy
        </a>
        .
      </div>
    </footer>
  );
};

export default Footer;
