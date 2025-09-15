import React from 'react';
import { Shield, FileText, Lock, CheckCircle } from 'lucide-react';

const ComplianceSection: React.FC = () => {
  const complianceFrameworks = [
    {
      name: 'GDPR',
      title: 'General Data Protection Regulation',
      description: 'Ensure EU data protection compliance with automated access monitoring and breach detection',
      features: [
        'Data access logging and audit trails',
        'Right to be forgotten automation',
        'Data breach notification system',
        'Consent management tracking'
      ]
    },
    {
      name: 'HIPAA',
      title: 'Health Insurance Portability and Accountability Act',
      description: 'Protect patient health information with advanced access controls and monitoring',
      features: [
        'PHI access monitoring and alerting',
        'Audit trail for all medical record accesses',
        'Role-based access control enforcement',
        'Breach detection and reporting'
      ]
    },
    {
      name: 'PCI-DSS',
      title: 'Payment Card Industry Data Security Standard',
      description: 'Secure cardholder data with continuous monitoring and access controls',
      features: [
        'Cardholder data environment monitoring',
        'Access control and authentication logging',
        'Regular security testing automation',
        'Incident response and reporting'
      ]
    },
    {
      name: 'SOC 2',
      title: 'System and Organization Controls',
      description: 'Maintain trust through comprehensive security, availability, and confidentiality controls',
      features: [
        'Continuous security monitoring',
        'Availability and performance tracking',
        'Confidentiality assurance',
        'Automated compliance reporting'
      ]
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 px-4 py-2 rounded-full text-sm font-medium text-teal-300 mb-4">
            <Shield className="w-4 h-4" />
            <span>ENTERPRISE COMPLIANCE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">Regulatory Compliance</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet stringent compliance requirements with automated monitoring, reporting, and security controls
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {complianceFrameworks.map((framework, index) => (
            <div key={index} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{framework.name}</h3>
                  <p className="text-teal-300 text-sm">{framework.title}</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{framework.description}</p>
              
              <div className="space-y-2">
                {framework.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Benefits */}
        {/* <div className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 rounded-2xl p-8 border border-teal-500/30">
          <h3 className="text-2xl font-bold mb-6 text-center">Compliance Automation Benefits</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-teal-400" />
              </div>
              <h4 className="font-semibold mb-2">Reduced Audit Costs</h4>
              <p className="text-gray-300 text-sm">Automate evidence collection and reduce manual audit preparation by 70%</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-400" />
              </div>
              <h4 className="font-semibold mb-2">Continuous Monitoring</h4>
              <p className="text-gray-300 text-sm">24/7 security monitoring with real-time alerts for compliance violations</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-teal-400" />
              </div>
              <h4 className="font-semibold mb-2">Automated Reporting</h4>
              <p className="text-gray-300 text-sm">Generate compliance reports with one click for auditors and regulators</p>
            </div>
          </div>
        </div> */}

        {/* CTA Section */}
        {/* <div className="text-center mt-12">
          <div className="bg-white/10 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">Ready for Enterprise Deployment</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Our platform is trusted by Fortune 500 companies and meets the most stringent security 
              and compliance requirements in regulated industries.
            </p>
            <button className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 transition-colors">
              Request Compliance Assessment
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ComplianceSection;