// app/privacy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Name, email address, phone number, and contact details</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Booking and payment information</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Passport details and travel preferences</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Medical information relevant to your trip</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Communication preferences</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We use your information to:
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Process bookings and provide travel services</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Communicate about your trip and send updates</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Ensure your safety and provide appropriate medical care if needed</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Improve our services and customer experience</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Comply with legal obligations</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We only share your information with:
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Service providers necessary for your trip (hotels, transport, guides)</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Medical personnel in case of emergency</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Government authorities as required by law</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Insurance companies for claims processing</span>
                  </li>
                </ul>
                <p>
                  We never sell your personal information to third parties for marketing purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">4. Data Security</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We implement appropriate security measures to protect your personal information from 
                  unauthorized access, alteration, or destruction. This includes:
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Encryption of sensitive data</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Regular security assessments</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Limited access to personal information</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">5. Data Retention</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We retain your personal information only as long as necessary for:
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Providing services to you</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Compliance with legal obligations</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Resolving disputes</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Preventing fraud and abuse</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  You have the right to:
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Access your personal information</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Correct inaccurate information</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Request deletion of your information</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Object to or restrict processing</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Withdraw consent at any time</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">7. Cookies</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We use cookies and similar technologies to improve website functionality and user 
                  experience. For more information, please see our{' '}
                  <a href="/cookies" className="text-primary hover:underline">
                    Cookie Policy
                  </a>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may update this privacy policy periodically. The updated version will be posted on 
                  our website with the effective date.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">9. Contact Us</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  If you have questions about this privacy policy or your personal information, 
                  please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">Shanti Himalaya</p>
                  <p>Email: <a href="mailto:info@shantihimalaya.com" className="text-primary hover:underline">info@shantihimalaya.com</a></p>
                  <p>Phone: +91-99107 75078</p>
                  <p>Address: Deviroad, PO Kotdwar, Pauri Garhwal, Uttarakhand</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}