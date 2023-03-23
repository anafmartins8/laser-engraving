import Logo from "./Logo";

function Header() {
  return (
    <header>
      <div>
        <Logo />
        <div class="title">GISLOTICA OTR SCANNER</div>
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
