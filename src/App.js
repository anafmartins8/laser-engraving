import "./App.css";
//import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import ManipulationArea from "./layout/manipulation-area/ManipulationArea";
import WorkArea from "./layout/work-area/WorkArea";
import ImageArea2 from "./layout/image-area/ImageArea2";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <ImageArea2 />
        <ManipulationArea />
        <WorkArea />
      </main>
      <Footer />
    </div>
  );
}

export default App;
