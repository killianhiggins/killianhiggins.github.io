import CapillaryAction from './components/capillaryaction';
import GeoTriangle from './components/geotriangle';

function App() {
  return (
    <>
      <h1>My Portfolio</h1>
      <div className="projects">
        <div className="firstproject">
          <div className="sketchLeft">
            <CapillaryAction />
          </div>
          <div className="textRight">
            <a href="https://killianhiggins.github.io/CapillaryAction/">Capillary Action Simulator</a>
            <p>Simple simulation of capillary action - the reason water travels up tissue/paper or up the side of a glass.</p>
          </div>
        </div>
        <div className="secondproj">
          <GeoTriangle />
        </div>
      </div>
    </>
  )
}

export default App
