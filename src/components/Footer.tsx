import { Link } from 'react-router'
import { Facebook, Twitter, Instagram, Linkedin, Play, Apple, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const companyLinks = [
    { name: 'Zomato', href: '#' },
    { name: 'Blinkit', href: '#' },
    { name: 'District', href: '#' },
    { name: 'Hyperpure', href: '#' },
    { name: 'Feeding India', href: '#' },
  ]

  const businessLinks = [
    { name: 'Investor Relations', href: '#' },
    { name: 'For Restaurants', href: '#' },
    { name: 'Partner With Us', href: '#' },
    { name: 'Apps For You', href: '#' },
    { name: 'Restaurant Consulting', href: '#' },
  ]

  const deliveryLinks = [
    { name: 'For Delivery Partners', href: '#' },
    { name: 'Partner With Us', href: '#' },
    { name: 'Apps For You', href: '#' },
    { name: 'Learn More', href: '#' },
  ]

  const legalLinks = [
    { name: 'Privacy', href: '#' },
    { name: 'Security', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Help & Support', href: '#' },
    { name: 'Report a Fraud', href: '#' },
    { name: 'Blog', href: '#' },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ]

  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="w-full py-8">
        {/* Main Footer Content */}
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Business</h3>
            <ul className="space-y-2">
              {businessLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery Partners Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Delivery Partners</h3>
            <ul className="space-y-2">
              {deliveryLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Apps & Social Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Get Our App</h3>
            <div className="space-y-3 mb-6">
              <Button variant="outline" className="w-full justify-start bg-black border-gray-600 text-white hover:bg-gray-800">
                <Play className="h-4 w-4 mr-2" />
                Google Play
              </Button>
              <Button variant="outline" className="w-full justify-start bg-black border-gray-600 text-white hover:bg-gray-800">
                <Apple className="h-4 w-4 mr-2" />
                App Store
              </Button>
            </div>

            <h3 className="text-lg font-semibold mb-4 text-orange-500">Follow Us</h3>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  to={social.href}
                  className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700 mb-8" />

        {/* Bottom Footer */}
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <div className="text-2xl font-bold text-orange-500 mb-2">🍕 Zestio</div>
            <p className="text-gray-400 text-sm text-center md:text-left">
              By continuing past this page, you agree to our Terms of Service, Cookie Policy, 
              Privacy Policy and Content Policies. All trademarks are properties of their respective owners
            </p>
            <p className="text-gray-400 text-xs mt-2">
              2008-{currentYear} © Zestio™ Ltd. All rights reserved.
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                support@zestio.com
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                1-800-ZESTIO
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <MapPin className="h-4 w-4 mr-1" />
              Mumbai, India
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="max-w-screen-2xl mx-auto flex flex-wrap justify-center space-x-6 text-xs text-gray-400">
            <Link to="#" className="hover:text-white transition-colors">Sitemap</Link>
            <Link to="#" className="hover:text-white transition-colors">Careers</Link>
            <Link to="#" className="hover:text-white transition-colors">Press</Link>
            <Link to="#" className="hover:text-white transition-colors">Advertise</Link>
            <Link to="#" className="hover:text-white transition-colors">Gift Cards</Link>
            <Link to="#" className="hover:text-white transition-colors">FAQ</Link>
            <Link to="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
