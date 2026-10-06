export function TermsOfService() {
  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-invert max-w-none text-neutral-300 space-y-6">
          <p>
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using Kolkata Diary, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on Kolkata Diary's website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Tickets and Events</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-neutral-400">
              <li>All ticket sales are subject to availability and the specific event organizer's terms.</li>
              <li>Kolkata Diary acts as a platform facilitating transactions between you and event organizers.</li>
              <li>Event details, times, and venues are subject to change by the organizers without prior notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Disclaimer</h2>
            <p>
              The materials on Kolkata Diary's website are provided on an 'as is' basis. Kolkata Diary makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
