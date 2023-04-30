import Logo from "../../components/common/logo/Logo";

function Header() {
  return (
    <header>
      <div>
        <Logo />
        <div className="title">GISLOTICA OTR SCANNER</div>
      </div>
      <div>
        <button type="button" className="button-header">
          PT
        </button>
      </div>
    </header>
  );
}

export default Header;
