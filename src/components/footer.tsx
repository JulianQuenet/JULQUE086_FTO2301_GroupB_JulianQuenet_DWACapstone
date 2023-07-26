import logo from "../assets/mic-logo.png";

const footerStyles: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.15)",
  backdropFilter: "blur(0.5px)",
  borderTop: "1px solid rgba(0, 0, 0, 0.089)",
  marginTop: "4rem",
  fontFamily: "system-ui",
  color: "darkOrange",
  fontSize: "0.65rem",
  padding: "20px",
  boxShadow:
    "0 0 7.55px rgba(0, 0, 0, 0.65), 0 0 10px rgba(0, 0, 0, 0.35), 0 0 15px rgba(0, 0, 0, 0.15)",
};

const backgroundStyles: React.CSSProperties = {
  width: "100%",
  background: `url(${logo}) center center no-repeat`,
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
  gap: "3px",
  textAlign: "center",
  margin:"0"
};

const Footer = () => {
  return ( // Nothing fancy here, just a footer with some links and info
    <div style={backgroundStyles}>
      <footer style={footerStyles}>
        <p style={infoStyles}>
          Meta tag image sourced from unsplash by
          <a style={linkStyles} href="https://unsplash.com/photos/c1ZN57GfDB0">
            Jonathan Velasquez
          </a>
        </p>
        <p style={infoStyles}>
          Favicon icon sourced from{" "}
          <a style={linkStyles} href="https://www.flaticon.com/">
            Flaticon
          </a>
        </p>
        <p style={infoStyles}>
          Project by Julian Quenet, this serves as the final project in the
        </p>
        <p style={infoStyles}>
          Software Development Course provided by
          <a style={linkStyles} href="https://www.codespace.co.za/">
            <img
              src="https://codespace-assets.global.ssl.fastly.net/wp/assets/website/favicon.ico"
              width={20}
            />
            CodeSpace Academy.
          </a>
        </p>
        <p style={infoStyles}>
          All other images{`(Genres)`} and logo sourced from{" "}
          <a style={linkStyles} href="https://www.canva.com/">
            Canva
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Footer;
