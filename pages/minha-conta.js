//import 'bootstrap/dist/css/bootstrap.min.css'
import { signIn, signOut, useSession } from 'next-auth/client'

import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import EntrarOuCriarConta from '../components/MinhaConta/EntrarCriarConta'
import MinhaConta from '../components/MinhaConta/MinhaConta'

export default function Page() {
  const [ session, loading ] = useSession();

  return (
  <>
  <Navbar />
    {!session && <>
        <EntrarOuCriarConta />
    </>}
    {session && <>
        <MinhaConta />
    </>}
  <Footer />
  </>
  )
}