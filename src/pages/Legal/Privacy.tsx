export function PrivacyPolicy() {
  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none text-neutral-300 space-y-6">
          <p>
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create or modify your account, purchase tickets, contact customer support, or otherwise communicate with us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>
              We may use the information we collect from you to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-neutral-400">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process transactions and send you related information.</li>
              <li>Send you technical notices, updates, security alerts, and support and administrative messages.</li>
              <li>Respond to your comments, questions, and requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Sharing of Information</h2>
            <p>
              We may share personal information about you with event organizers when you purchase a ticket or register for an event, or with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at support@kolkatadiary.ibartstech.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
