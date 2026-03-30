import { Link, useNavigate } from 'react-router'
import { ArrowLeft, Users, Award, Globe, Heart, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AboutUsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🍕</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Zestio</span>
            </Link>
            <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">About Zestio</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Delivering happiness, one meal at a time since 2008
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Users className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">50M+ Happy Customers</h3>
            <p className="text-gray-600">Serving millions of satisfied customers across India</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Award className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">100K+ Partners</h3>
            <p className="text-gray-600">Working with the best restaurants and delivery partners</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Globe className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">500+ Cities</h3>
            <p className="text-gray-600">Present in cities across the country</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8">
              To revolutionize food delivery by connecting people with their favorite restaurants 
              through innovative technology and exceptional service.
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="font-semibold">Passion</p>
              </div>
              <div className="text-center">
                <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="font-semibold">Excellence</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">Community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
