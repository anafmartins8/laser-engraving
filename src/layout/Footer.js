import Clock from "react-live-clock";

function Footer() {
  return (
    <footer>
      <div>ERROR TYPE | error message </div>
      <div>
        <Clock
          format={"ddd, D MMM YYYY HH:mm:ss"}
          ticking={true}
          timezone={"PT/Pacific"}
        />
      </div>
    </footer>
  );
}

export default Footer;
