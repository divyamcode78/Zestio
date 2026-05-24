import React from 'react'
import { Link } from 'react-router'
import { Facebook, Twitter, Instagram, Linkedin, Play, Apple, Mail, Phone, MapPin, Globe, Shield, Users, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const essentialLinks = [
    { name: 'About Us', href: '/about', icon: Globe },
    { name: 'For Restaurants', href: '#', icon: Package },
    { name: 'Delivery Partners', href: '#', icon: Users },
    { name: 'Help & Support', href: '/help-support', icon: Shield },
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-blue-400' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
  ]

  const stats = [
    { number: '50M+', label: 'Happy Customers' },
    { number: '100K+', label: 'Partner Restaurants' },
    { number: '500+', label: 'Cities' },
    { number: '24/7', label: 'Support' },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white w-full relative overflow-hidden mt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative w-full pt-16 pb-8 px-6">
        {/* Top Stats Bar */}
        <div className="max-w-screen-2xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-2xl font-bold text-orange-400">{stat.number}</div>
                  <div className="text-xs text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">🍕</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Zestio</div>
                  <div className="text-xs text-orange-400">Delivering Happiness</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Experience delicious food delivered right to your doorstep from the best restaurants in your city.
              </p>

              {/* App Download */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Get Our App</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="bg-black/50 border-gray-600 text-white hover:bg-black/70">
                    <Play className="h-3 w-3 mr-1" />
                    Play Store
                  </Button>
                  <Button variant="outline" size="sm" className="bg-black/50 border-gray-600 text-white hover:bg-black/70">
                    <Apple className="h-3 w-3 mr-1" />
                    App Store
                  </Button>
                </div>
              </div>
            </div>

            {/* Essential Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                {essentialLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className="text-gray-300 hover:text-orange-400 transition-all duration-300 text-sm flex items-center group"
                  >
                    <link.icon className="h-4 w-4 mr-2 opacity-60 group-hover:opacity-100" />
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Social Media */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Follow Us</h4>
                <div className="flex space-x-2">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      to={social.href}
                      className={`p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 ${social.color}`}
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <Mail className="h-4 w-4 text-orange-400" />
                  <span>support@zestio.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <Phone className="h-4 w-4 text-orange-400" />
                  <span>1-800-ZESTIO (24/7)</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  <span>Mumbai, India</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Stay Updated</h4>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors text-sm"
                  />
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white px-4">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700 mb-8" />

        {/* Bottom Footer */}
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-white">🍕 Zestio</span>
                <span className="text-xs text-orange-400">Delivering Happiness</span>
              </div>
              <p className="text-gray-400 text-xs">
                2008-{currentYear} © Zestio™ Ltd. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/privacy-policy">
                <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs cursor-pointer hover:bg-gray-700 hover:text-white transition-colors">Privacy Policy</Badge>
              </Link>
              <Link to="/terms-of-service">
                <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs cursor-pointer hover:bg-gray-700 hover:text-white transition-colors">Terms of Service</Badge>
              </Link>
              <Link to="/cookie-policy">
                <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs cursor-pointer hover:bg-gray-700 hover:text-white transition-colors">Cookie Policy</Badge>
              </Link>
              <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">SSL Secure</Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">GDPR Compliant</Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
