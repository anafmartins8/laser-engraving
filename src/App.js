import "./App.css";
//import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import ImageArea from "./layout/ImageArea";
import ZoomArea from "./layout/ZoomArea";
import WorkArea from "./layout/WorkArea";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <ImageArea />
        <ZoomArea />
        <WorkArea />
      </main>
      <Footer />
    </div>
  );
}

export default App;
