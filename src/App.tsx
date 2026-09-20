import Header from "./Header";
import Converter from "./Converter";

function App() {
  return (
    <>
      <Header />
      <div className="space-y-10 px-4 py-8">
        <Converter />
      </div>
    </>
  );
}

export default App;
