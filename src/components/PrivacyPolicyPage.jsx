import { motion } from 'framer-motion'
import { useAnalytics } from '../hooks/useAnalytics'

const PrivacyPolicyPage = () => {
  useAnalytics('Privacy Policy')
  const sections = [
    {
      number: '1',
      title: 'INTRODUCTION',
      content: [
        'Welcome to SweatSocial ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, the "Platform").',
        'Please read this Privacy Policy carefully. By accessing or using our Platform, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.'
      ]
    },
    {
      number: '2',
      title: 'INFORMATION WE COLLECT',
      subsections: [
        {
          title: '2.1 Information You Provide to Us',
          content: [
            'We may collect the following types of information when you create an account, use our services, or communicate with us:',
            'Account Information: Name, email address, phone number, profile picture, password, and preferences.',
            'Payment Information: Credit card details, billing address, and other financial information necessary for processing payments.',
            'User Profile Information: Age, gender, fitness preferences, goals, and other information you choose to provide.',
            'Communication Data: Information you provide when contacting us or participating in surveys, promotions, or events.'
          ]
        },
        {
          title: '2.2 Information Automatically Collected',
          content: [
            'When you use our Platform, we may automatically collect certain information, including:',
            'Device Information: Device type, operating system, unique device identifiers, IP address, mobile network information, and browser type.',
            'Usage Data: Information about how you use our Platform, including class bookings, attendance history, interaction with content, and feature usage.',
            'Location Data: With your consent, we collect precise location data to show nearby studios and classes.',
            'Cookies and Similar Technologies: We use cookies, web beacons, and similar technologies to collect information about your browsing activities.'
          ]
        }
      ]
    },
    {
      number: '3',
      title: 'HOW WE USE YOUR INFORMATION',
      content: [
        'We use the information we collect for various purposes, including to:',
        '• Provide, maintain, and improve our services',
        '• Process transactions and manage your account',
        '• Personalize your experience and content',
        '• Connect you with fitness studios and classes',
        '• Communicate with you about services, updates, and promotions',
        '• Respond to your requests and provide customer support',
        '• Monitor and analyze usage patterns and trends',
        '• Ensure the security and integrity of our Platform',
        '• Comply with legal obligations'
      ]
    },
    {
      number: '4',
      title: 'SHARING YOUR INFORMATION',
      subsections: [
        {
          title: '4.1 Fitness Studios and Partners',
          content: [
            'We share necessary information with fitness studios and wellness centers to facilitate bookings, class attendance, and services.'
          ]
        },
        {
          title: '4.2 Service Providers',
          content: [
            'We engage third-party service providers to perform functions on our behalf, such as payment processing, data analysis, email delivery, and hosting services.'
          ]
        },
        {
          title: '4.3 Business Transfers',
          content: [
            'If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.'
          ]
        },
        {
          title: '4.4 Legal Requirements',
          content: [
            'We may disclose your information if required to do so by law or in response to valid requests by public authorities.'
          ]
        }
      ]
    },
    {
      number: '5',
      title: 'DATA SECURITY',
      content: [
        'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.'
      ]
    },
    {
      number: '6',
      title: 'YOUR RIGHTS AND CHOICES',
      content: [
        'Depending on your location, you may have certain rights regarding your personal information, including:',
        '• Accessing, correcting, or deleting your personal information',
        '• Restricting or objecting to our processing of your data',
        '• Data portability',
        '• Withdrawing consent',
        'To exercise these rights, please contact us at hello@sweatsocial.club'
      ]
    },
    {
      number: '7',
      title: 'DATA RETENTION',
      content: [
        'We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.'
      ]
    },
    {
      number: '8',
      title: "CHILDREN'S PRIVACY",
      content: [
        "Our Platform is not intended for children under 16 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us."
      ]
    },
    {
      number: '9',
      title: 'CHANGES TO THIS PRIVACY POLICY',
      content: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated Privacy Policy on our Platform and updating the "Last Updated" date.'
      ]
    },
    {
      number: '10',
      title: 'CONTACT US',
      content: [
        'If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:',
        'Email: hello@sweatsocial.club',
        'Address: SweatSocial, Bangalore, Karnataka, India',
        'Website: www.sweatsocial.club',
        'This Privacy Policy is effective as of the date stated at the top and supersedes any previous version.'
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
              Privacy Policy
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

                {section.subsections ? (
                  <div className="ml-16 space-y-6">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex} className="space-y-3">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {subsection.title}
                        </h3>
                        <div className="space-y-2">
                          {subsection.content.map((paragraph, pIndex) => (
                            <p
                              key={pIndex}
                              className="text-gray-700 leading-relaxed"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
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
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicyPage

