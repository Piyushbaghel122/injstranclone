import { Route ,  BrowserRouter , Routes } from "react-router-dom";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>hello-world</div>} />
        <Route path="/about" element={<div>second world</div>} />
        <Route path="/contact" element={<div>third world</div>}/>
        <Route path="/home" element={<div>four world</div>}/>
        <Route path="/first" element={<div>five world</div>} />
      </Routes>
    </BrowserRouter>
  )
}
export default AppRoutes;