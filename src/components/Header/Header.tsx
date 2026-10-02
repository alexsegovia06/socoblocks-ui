import { Link } from 'react-router'
import { Blocks } from 'lucide-react'
import Navbar from "../Navbar/Navbar.tsx";
import type { NavItem } from "../Navbar/Navbar.ts";
import './Header.css'

interface Props {
  links?: NavItem[]
}

export default function Header({ links }: Props) {
  return (
    <header className="site-header">
      <div className="header__inner">
        <Link to="/" className="header__brand">
          <span className="header__logo">
            <Blocks size={22} strokeWidth={2} />
          </span>
          <span className="header__brand-text">
            <span className="header__name">
              Iconic<span>Brick</span>
            </span>
            <span className="header__tagline">Sets pop mexicanos</span>
          </span>
        </Link>

        <Navbar links={links} />
      </div>
    </header>
  )
}
