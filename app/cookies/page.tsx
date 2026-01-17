// app/cookies/page.tsx
export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Cookie Policy
            </h1>
            <p className="text-gray-600">
              This policy explains how we use cookies and similar technologies on our website.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">What Are Cookies?</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Cookies are small text files that are placed on your device when you visit our website. 
                  They help us provide you with a better experience by:
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Remembering your preferences</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Understanding how you use our site</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Improving site functionality</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-700">
                    These are necessary for the website to function properly. They enable basic functions 
                    like page navigation and access to secure areas. The website cannot function properly 
                    without these cookies.
                  </p>
                </div>

                <div className="border-l-4 border-secondary pl-4 py-2">
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Preference Cookies</h3>
                  <p className="text-gray-700">
                    These cookies remember your preferences (like language or region) to provide you with 
                    a more personalized experience.
                  </p>
                </div>

                <div className="border-l-4 border-accent pl-4 py-2">
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Analytics Cookies</h3>
                  <p className="text-gray-700">
                    These help us understand how visitors interact with our website by collecting and 
                    reporting information anonymously. This helps us improve our website and services.
                  </p>
                </div>

                <div className="border-l-4 border-warning pl-4 py-2">
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-2">Marketing Cookies</h3>
                  <p className="text-gray-700">
                    These track your online activity to help advertisers deliver more relevant advertising 
                    or to limit how many times you see an ad. These cookies can share that information 
                    with other organizations or advertisers.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">How We Use Cookies</h2>
              <div className="space-y-4 text-gray-700">
                <ul className="space-y-2 pl-5">
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      <strong>Website Functionality:</strong> To remember your preferences and settings
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      <strong>Performance & Analytics:</strong> To understand how our website is used and improve it
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      <strong>Marketing:</strong> To show you relevant content and advertisements
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      <strong>Security:</strong> To protect your information and prevent fraud
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Some cookies are placed by third-party services that appear on our pages. These may include:
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Social media platforms (Facebook, Instagram)</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Analytics services (Google Analytics)</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Payment processors</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Advertising networks</span>
                  </li>
                </ul>
                <p>
                  We don't control these third-party cookies. Please check their privacy policies for 
                  more information.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Managing Cookies</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  You can control and/or delete cookies as you wish. Most web browsers allow you to:
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>See what cookies you have and delete them</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Block cookies from specific sites</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Block all cookies</span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>Clear all cookies when you close your browser</span>
                  </li>
                </ul>
                <p>
                  You can delete all cookies that are already on your device and set most browsers to 
                  prevent them from being placed. However, if you do this, you may have to manually adjust 
                  some preferences every time you visit a site and some services and functionalities may not work.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Browser-Specific Instructions</h2>
              <div className="space-y-4 text-gray-700">
                <ul className="space-y-2 pl-5">
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      <strong>Google Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      <strong>Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Cookies and site data
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Changes to This Cookie Policy</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  We may update this Cookie Policy from time to time. We will notify you of any changes 
                  by posting the new Cookie Policy on this page and updating the "Last Updated" date.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">Shanti Himalaya</p>
                  <p>Email: <a href="mailto:info@shantihimalaya.com" className="text-primary hover:underline">info@shantihimalaya.com</a></p>
                  <p>Phone: +91-99107 75078</p>
                </div>
              </div>
            </section>

            <div className="pt-8 border-t border-gray-200">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-display font-bold text-lg mb-2">Your Consent</h3>
                <p className="text-gray-700">
                  By using our website, you consent to our use of cookies as described in this policy. 
                  You can withdraw your consent at any time by adjusting your browser settings or 
                  contacting us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}