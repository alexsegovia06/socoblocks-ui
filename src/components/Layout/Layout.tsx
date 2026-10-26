import { Outlet } from 'react-router'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import './Layout.css'

interface Props {
    contained?: boolean
}

export default function Layout({ contained }: Props) {
    return (
        <div className="layout">
            <Header />
            <div className="layout__content">
                <div className="layout__page">
                    {contained ? (
                        <main className="main">
                            <Outlet />
                        </main>
                    ) : (
                        <Outlet />
                    )}
                </div>
                <Footer />
            </div>
        </div>
    )
}