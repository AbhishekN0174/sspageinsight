import { motion } from 'framer-motion'
import { useAnalytics } from '../hooks/useAnalytics'

const TermsPage = () => {
  useAnalytics('Terms & Conditions')
  const sections = [
    {
      number: '1',
      title: 'ACCEPTANCE OF TERMS',
      content: [
        'By accessing or using the SweatSocial platform ("Platform"), including our mobile application and website, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Platform.',
        'We reserve the right to modify these Terms at any time. Your continued use of the Platform after any such changes constitutes your acceptance of the new Terms.'
      ]
    },
    {
      number: '2',
      title: 'DESCRIPTION OF SERVICE',
      content: [
        'SweatSocial is a fitness platform that connects users with boutique fitness studios and wellness centers. We facilitate class bookings, provide information about fitness classes and studios, and enable communication between users and fitness providers.',
        'We act as an intermediary between users and fitness studios. We do not own, operate, or control the fitness studios listed on our Platform.'
      ]
    },
    {
      number: '3',
      title: 'USER ACCOUNTS',
      content: [
        'To use certain features of our Platform, you must create an account. You agree to:',
        '• Provide accurate, current, and complete information during registration',
        '• Maintain and update your account information to keep it accurate',
        '• Maintain the security of your password and account',
        '• Accept responsibility for all activities that occur under your account',
        '• Notify us immediately of any unauthorized use of your account',
        'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
      ]
    },
    {
      number: '4',
      title: 'BOOKINGS AND PAYMENTS',
      content: [
        'When you book a class through our Platform, you enter into a contract directly with the fitness studio. SweatSocial facilitates the booking but is not a party to that contract.',
        'Payment processing is handled through secure third-party payment processors. By making a booking, you agree to pay all charges associated with your booking.',
        'Cancellation and refund policies are set by individual fitness studios. Please review the studio\'s cancellation policy before booking.',
        'We reserve the right to cancel or modify bookings in cases of fraud, technical errors, or other circumstances beyond our control.'
      ]
    },
    {
      number: '5',
      title: 'USER CONDUCT',
      content: [
        'You agree not to:',
        '• Use the Platform for any illegal or unauthorized purpose',
        '• Violate any laws in your jurisdiction',
        '• Infringe upon the rights of others',
        '• Transmit any viruses, malware, or harmful code',
        '• Attempt to gain unauthorized access to the Platform or its systems',
        '• Interfere with or disrupt the Platform or servers',
        '• Use automated systems to access the Platform without permission',
        '• Impersonate any person or entity',
        '• Harass, abuse, or harm other users or fitness studios'
      ]
    },
    {
      number: '6',
      title: 'INTELLECTUAL PROPERTY',
      content: [
        'All content on the Platform, including text, graphics, logos, images, software, and other materials, is the property of SweatSocial or its licensors and is protected by copyright, trademark, and other intellectual property laws.',
        'You may not reproduce, distribute, modify, create derivative works, publicly display, or otherwise use any content from the Platform without our prior written permission.',
        'The SweatSocial name, logo, and other marks are trademarks of SweatSocial. You may not use these marks without our prior written consent.'
      ]
    },
    {
      number: '7',
      title: 'DISCLAIMER OF WARRANTIES',
      content: [
        'The Platform is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that:',
        '• The Platform will be uninterrupted, secure, or error-free',
        '• The results obtained from using the Platform will be accurate or reliable',
        '• Any defects or errors will be corrected',
        '• The Platform is free of viruses or other harmful components',
        'We do not endorse, warrant, or assume responsibility for any fitness studios, classes, or services offered through our Platform.'
      ]
    },
    {
      number: '8',
      title: 'LIMITATION OF LIABILITY',
      content: [
        'To the maximum extent permitted by law, SweatSocial and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses, resulting from your use of the Platform.',
        'Our total liability to you for all claims arising from or related to the Platform shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.',
        'You acknowledge that fitness activities carry inherent risks, and you participate at your own risk. SweatSocial is not responsible for any injuries, damages, or losses that occur during fitness classes or at fitness studios.'
      ]
    },
    {
      number: '9',
      title: 'INDEMNIFICATION',
      content: [
        'You agree to indemnify, defend, and hold harmless SweatSocial and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including attorney\'s fees) arising from:',
        '• Your use of the Platform',
        '• Your violation of these Terms',
        '• Your violation of any third-party rights',
        '• Any content you submit or transmit through the Platform'
      ]
    },
    {
      number: '10',
      title: 'TERMINATION',
      content: [
        'We may terminate or suspend your account and access to the Platform immediately, without prior notice, for any reason, including if you breach these Terms.',
        'Upon termination, your right to use the Platform will cease immediately. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.'
      ]
    },
    {
      number: '11',
      title: 'GOVERNING LAW',
      content: [
        'These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.',
        'Any disputes arising from or relating to these Terms or the Platform shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.'
      ]
    },
    {
      number: '12',
      title: 'CONTACT INFORMATION',
      content: [
        'If you have any questions about these Terms, please contact us at:',
        'Email: hello@sweatsocial.club',
        'Address: SweatSocial, Bangalore, Karnataka, India',
        'Website: www.sweatsocial.club'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-petal-50 via-pink-50 to-purple-50 opacity-50" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Terms and Conditions
            </h1>
            <p className="text-lg text-gray-600">
              Last Updated: April 4, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="mb-12"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                    {section.number}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 pt-2">
                    {section.title}
                  </h2>
                </div>

                <div className="ml-16 space-y-3">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-gray-700 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsPage

