export default function Terms() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using this analytics dashboard, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>
  
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use License</h2>
            <p>Permission is granted to temporarily use this application for personal or commercial analytics purposes. This license does not include:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose</li>
              <li>Attempting to decompile or reverse engineer any software</li>
              <li>Removing any copyright or proprietary notations</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
            <p>As a user, you are responsible for:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring the accuracy of data you upload</li>
              <li>Complying with all applicable laws</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Ownership</h2>
            <p>You retain all ownership rights to the data you upload. We do not claim any intellectual property rights over your data.</p>
          </section>
  
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
            <p>We shall not be liable for any damages arising out of the use or inability to use our services, including but not limited to data loss or business interruption.</p>
          </section>
  
          <p className="text-sm text-gray-500 mt-8">Last updated: January 1, 2024</p>
        </div>
      </div>
    );
}