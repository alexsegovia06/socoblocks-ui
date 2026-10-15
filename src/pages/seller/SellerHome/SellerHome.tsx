import { Link } from 'react-router'
import Profile from '../../../components/Profile.tsx'

export default function SellerHome() {
  return (
    <>
      <h1>Panel del vendedor</h1>
      <p className="muted">
        Solo los vendedores ven las páginas bajo /seller. Prueba abrir <Link to="/user">/user</Link> o{' '}
        <Link to="/user/profile">/user/profile</Link>: te manda a tu dashboard.
      </p>
      <Profile />
    </>
  )
}
