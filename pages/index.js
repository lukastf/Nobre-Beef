//import 'bootstrap/dist/css/bootstrap.min.css'

import Navbar from '../components/Navbar/Navbar'
import PageFlip from '../components/PageFlip/PageFlip' 
import Premium from '../components/Premium/Premium'
import ComoComprar from '../components/ComoComprar/ComoComprar'
import MaisVendidos from '../components/MaisVendidos/MaisVendidos'
import MidiasSociais from '../components/MidiasSociais/MidiasSociais'
import Footer from '../components/Footer/Footer'

export default function Home() {
  return (
    <>
    <Navbar />
    <PageFlip />
    <Premium />
    <ComoComprar />
    <MaisVendidos />
    <MidiasSociais />
    <Footer />
    </>
  )
}
