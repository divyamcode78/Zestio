import { useState } from 'react'
import { X, Download, Receipt, Calendar, MapPin, Phone, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/lib/utils'

interface OrderReceiptProps {
  isOpen: boolean
  onClose: () => void
  orderData: {
    orderId: string
    paymentMethod: string
    paymentId: string
    totalAmount: number
    customerName?: string
    customerEmail?: string
    customerPhone?: string
    deliveryAddress?: string
    items?: Array<{
      name: string
      quantity: number
      price: number
    }>
  }
}

export function OrderReceipt({ isOpen, onClose, orderData }: OrderReceiptProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Debug logging
  console.log('OrderReceipt - orderData:', orderData)
  console.log('OrderReceipt - items:', orderData.items)

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'card': return 'Credit/Debit Card'
      case 'upi': return 'UPI'
      case 'cash': return 'Cash on Delivery'
      case 'razorpay': return 'Razorpay'
      default: return method
    }
  }

  const generatePDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      // Create the receipt content
      const receiptContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Receipt - Zestio</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #f97316;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #f97316;
            margin-bottom: 10px;
        }
        .order-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-section {
            background: #f8f8f8;
            padding: 15px;
            border-radius: 8px;
        }
        .info-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #f97316;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th,
        .items-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .items-table th {
            background: #f97316;
            color: white;
        }
        .total-section {
            text-align: right;
            margin-bottom: 30px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .final-total {
            font-weight: bold;
            font-size: 18px;
            color: #f97316;
            border-top: 2px solid #f97316;
            padding-top: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
        @media print {
            body { padding: 10px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🍕 Zestio Food Delivery</div>
        <div>Order Receipt</div>
        <div style="font-size: 12px; color: #666;">${formatDate(new Date())}</div>
    </div>

    <div class="order-info">
        <div class="info-section">
            <div class="info-title">Order Information</div>
            <div><strong>Order ID:</strong> ${orderData.orderId}</div>
            <div><strong>Payment Method:</strong> ${getPaymentMethodName(orderData.paymentMethod)}</div>
            <div><strong>Payment ID:</strong> ${orderData.paymentId}</div>
            <div><strong>Status:</strong> <span style="color: green;">✓ Paid</span></div>
        </div>
        <div class="info-section">
            <div class="info-title">Customer Information</div>
            <div><strong>Name:</strong> ${orderData.customerName || 'Customer'}</div>
            <div><strong>Email:</strong> ${orderData.customerEmail || 'N/A'}</div>
            <div><strong>Phone:</strong> ${orderData.customerPhone || 'N/A'}</div>
            <div><strong>Delivery Address:</strong> ${orderData.deliveryAddress || 'N/A'}</div>
        </div>
    </div>

    <div class="info-section">
        <div class="info-title">Order Items</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${orderData.items && orderData.items.length > 0 ? orderData.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.price)}</td>
                        <td>${formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                `).join('') : `
                    <tr>
                        <td colspan="4" style="text-align: center; color: #666;">Order items will be displayed here</td>
                    </tr>
                `}
            </tbody>
        </table>
    </div>

    <div class="total-section">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(orderData.totalAmount - 3.99)}</span>
        </div>
        <div class="total-row">
            <span>Delivery Fee:</span>
            <span>${formatCurrency(3.99)}</span>
        </div>
        <div class="total-row final-total">
            <span>Total Amount:</span>
            <span>${formatCurrency(orderData.totalAmount)}</span>
        </div>
    </div>

    <div class="footer">
        <div>Thank you for choosing Zestio! 🍕</div>
        <div style="margin-top: 10px;">For any queries, contact our customer support</div>
        <div style="margin-top: 5px;">Email: support@zestio.com | Phone: 1-800-ZESTIO</div>
    </div>
</body>
</html>
      `

      // Create a blob and download
      const blob = new Blob([receiptContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `Zestio_Receipt_${orderData.orderId}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Order Receipt
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generatePDF}
              disabled={isGeneratingPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header */}
          <div className="text-center border-b pb-6">
            <div className="text-2xl font-bold text-orange-500 mb-2">🍕 Zestio Food Delivery</div>
            <div className="text-lg font-semibold">Order Receipt</div>
            <div className="text-sm text-muted-foreground">{formatDate(new Date())}</div>
          </div>

          {/* Order and Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-orange-500">Order Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono text-sm">{orderData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>{getPaymentMethodName(orderData.paymentMethod)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <span className="font-mono text-sm">{orderData.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    ✓ Paid
                  </Badge>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-orange-500">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{orderData.customerName || 'Customer'}</span>
                </div>
                {orderData.customerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{orderData.customerEmail}</span>
                  </div>
                )}
                {orderData.customerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{orderData.customerPhone}</span>
                  </div>
                )}
                {orderData.deliveryAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{orderData.deliveryAddress}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-orange-500">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="text-left p-3">Item</th>
                    <th className="text-center p-3">Quantity</th>
                    <th className="text-right p-3">Price</th>
                    <th className="text-right p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items && orderData.items.length > 0 ? (
                    orderData.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{item.name}</td>
                        <td className="text-center p-3">{item.quantity}</td>
                        <td className="text-right p-3">{formatCurrency(item.price)}</td>
                        <td className="text-right p-3 font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center p-6 text-muted-foreground">
                        Order items will be displayed here
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatCurrency(orderData.totalAmount - 3.99)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Fee:</span>
              <span>{formatCurrency(3.99)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg text-orange-500">
              <span>Total Amount:</span>
              <span>{formatCurrency(orderData.totalAmount)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t pt-6">
            <div className="font-semibold mb-2">Thank you for choosing Zestio! 🍕</div>
            <div className="text-sm text-muted-foreground">
              For any queries, contact our customer support
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Email: support@zestio.com | Phone: 1-800-ZESTIO
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
