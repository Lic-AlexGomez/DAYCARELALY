
import React, { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Context } from "../store/appContext"
import Swal from 'sweetalert2';

const Footer = () => {
  const { store, actions } = useContext(Context)
  const [email, setEmail] = useState("")
  const [data, setData] = useState({})

  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await actions.newsletter(email);
      if (result) {
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully subscribed to the newsletter.',
          icon: 'success',
          confirmButtonText: 'Great!'
        });
        setEmail("");
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'There was an error when subscribing: ' + error.message,
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  }

  useEffect(() => {
    if (store.settings !== undefined) {
      setData(store.settings)
    }
  }, [store.settings])

  // Social Media Icons
  const TwitterIcon = () => (
    <svg className="tw-w-5 tw-h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  )

  const FacebookIcon = () => (
    <svg className="tw-w-5 tw-h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )

  const InstagramIcon = () => (
    <svg className="tw-w-5 tw-h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )

  const LinkedinIcon = () => (
    <svg className="tw-w-5 tw-h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )

  return (
    <footer className="tw-bg-[#111111] tw-text-gray-400">
      <div className="tw-container-fluid tw-mx-auto tw-px-3 tw-py-12">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-5 tw-gap-2">
          {/* About Company Column */}
          <div>
            <h3 className="tw-text-white tw-font-bold tw-mb-6">ABOUT COMPANY</h3>
            <div className="tw-flex tw-items-center tw-mb-4">
              <img
                src={
                  data.image ||
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-99FXF35kTcwNUSbJWYUSXRAgAYiuGx.png" ||
                  ""
                }
                alt="Logo"
                className="tw-h-10"
              />
            </div>
            <p className="tw-mb-6 tw-text-sm tw-leading-relaxed">
              Suspien faucibus lacusda semtut pharetra nisi rutruem qeemen stras nula magna area vehicula necator
              feugiat.
            </p>
            <div className="tw-flex tw-space-x-4">
              <a href={data.twitter || "#"} className="tw-text-gray-400 hover:tw-text-white tw-transition-colors">
                <TwitterIcon />
              </a>
              <a href={data.facebook || "#"} className="tw-text-gray-400 hover:tw-text-white tw-transition-colors">
                <FacebookIcon />
              </a>
              <a href={data.instagram || "#"} className="tw-text-gray-400 hover:tw-text-white tw-transition-colors">
                <InstagramIcon />
              </a>
              <a href={data.linkedin || "#"} className="tw-text-gray-400 hover:tw-text-white tw-transition-colors">
                <LinkedinIcon />
              </a>
            </div>
          </div>

          {/* Our Services Column */}
          <div>
            <h3 className="tw-text-white tw-font-bold tw-mb-6">Our Services</h3>
            <ul className="tw-space-y-3 tw-text-sm">
              <li>
                <Link to="/" className="hover:tw-text-white tw-transition-colors">
                  Online class
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:tw-text-white tw-transition-colors">
                  Baby care
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:tw-text-white tw-transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:tw-text-white tw-transition-colors">
                  Kids Playzone
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:tw-text-white tw-transition-colors">
                  Nurse
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links Column */}
          <div>
            <h3 className="tw-text-white tw-font-bold tw-mb-6">Useful Links</h3>
            <ul className="tw-space-y-3 tw-text-sm">
              <li>
                <Link to="/" className="hover:tw-text-white tw-transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:tw-text-white tw-transition-colors">
                  Our team
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:tw-text-white tw-transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:tw-text-white tw-transition-colors">
                  Contact us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:tw-text-white tw-transition-colors">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
		  <div className="tw-space-y-3 tw-text-sm">
				 <h3 className="tw-text-white tw-font-bold tw-mb-6">Reach Us</h3>	
              <p className="tw-flex tw-items-center">
                <span className="tw-mr-2">📞</span>
                {data.phone || "+1012 3456 789"}
              </p>
              <p className="tw-flex tw-items-center">
                <span className="tw-mr-2">✉️</span>
                {data.admin_email || "demo@gmail.com"}
              </p>
              <p className="tw-flex tw-items-start">
                <span className="tw-mr-2">📍</span>
                {data.address || "132 Dartmouth Street Boston, Massachusetts 02156 United States"}
              </p>
            </div>
          
       
           {/* Newsletter */}
           <div className="tw-bg-black tw-p-6 tw-rounded-md lg:tw-ms-2 tw-mt-6 md:tw-mt-0">
            <h3 className="tw-text-white tw-font-bold tw-mb-6">Join Our Newsletter</h3>
            <form onSubmit={handleSubmit} className="tw-flex tw-flex-col md:tw-flex-row tw-gap-2 tw-mb-2">
              <input
                type="email"
                onChange={handleChangeEmail}
                value={email}
                placeholder="Your email address"
                className="tw-flex-1 tw-bg-[#1A1A1A] tw-px-1 tw-py-2.5 tw-rounded-sm tw-text-sm tw-text-white"
              />
              <button
                type="submit"
                className="tw-bg-[#FF9F00] tw-text-white tw-px-1 tw-py-2.5 tw-rounded-sm tw-text-sm hover:tw-bg-[#FF9F00]/90"
              >
                Subscribe
              </button>
            </form>
            <p className="tw-text-xs tw-text-gray-500 tw-mt-2">
              * We'll send you weekly updates for your better tool management.
            </p>
          </div>
        </div>

        <div className="tw-mt-12 tw-pt-8 tw-border-t tw-border-gray-800 tw-text-center tw-text-sm tw-whitespace-nowrap">
          <p>@copyright 2024 all rights reserved by AgeeksAcademy</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;