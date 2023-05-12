import "./App.css";
//import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import ImageArea from "./layout/image-area/ImageArea";
import ManipulationArea from "./layout/manipulation-area/ManipulationArea";
import WorkArea from "./layout/work-area/WorkArea";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <ImageArea />
        <ManipulationArea />
        <WorkArea />
      </main>
      <Footer />
    </div>
  );
}

export default App;
