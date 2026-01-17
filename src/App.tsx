import React, { useState, useEffect } from 'react';
import { 
  Mail, Send, CheckCircle, Clock, AlertCircle, Paperclip, 
  Upload, FileText, X, List, Trash2, Download, Building2, 
  Image as ImageIcon, Copy, FileDown 
} from 'lucide-react';

export default function HiringPortal() {
  const [formData, setFormData] = useState({
    email: '',
    candidateName: '',
    role: '',
    interviewDate: ''
  });
  
  const [companySettings, setCompanySettings] = useState({
    companyName: 'My Company',
    logoUrl: 'https://i.imgur.com/aiSGId8.png' // Default Google Logo for testing
  });
  
  const [status, setStatus] = useState('idle');
  const [attachedDocument, setAttachedDocument] = useState<any>(null);
  const [sentEmails, setSentEmails] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('send');
  const [logoError, setLogoError] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);

  const roles = [
    'Data Entry Specialist',
    'Virtual Payroll Assistant',
    'Customer Care Representative',
    'Administrative Support'
  ];

  // Load saved data
  useEffect(() => {
    const savedEmails = localStorage.getItem('sent-emails-list');
    if (savedEmails) setSentEmails(JSON.parse(savedEmails));
    const savedSettings = localStorage.getItem('company-settings');
    if (savedSettings) setCompanySettings(JSON.parse(savedSettings));
  }, []);

  // Smart Logo Validation
  useEffect(() => {
    if (companySettings.logoUrl && companySettings.logoUrl.startsWith('http')) {
      setLogoLoading(true);
      const img = new Image();
      img.onload = () => { setLogoLoading(false); setLogoError(false); };
      img.onerror = () => { setLogoLoading(false); setLogoError(true); };
      img.src = companySettings.logoUrl;
    } else {
      setLogoError(false);
    }
  }, [companySettings.logoUrl]);

  const saveSettings = (newSettings: any) => {
    setCompanySettings(newSettings);
    localStorage.setItem('company-settings', JSON.stringify(newSettings));
  };

  const generateHTMLEmail = () => {
    const { candidateName, role } = formData;
    const { companyName, logoUrl } = companySettings;
    
    // PROFESSIONAL & EXCITING WFH TEMPLATE
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f1f5f9; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    
    /* Header Styles */
    .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; text-align: center; color: white; }
    .header img { height: 50px; background: white; padding: 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 15px; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { margin: 5px 0 0; opacity: 0.9; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }

    /* Content Styles */
    .content { padding: 40px; }
    .greeting { font-size: 18px; color: #0f172a; margin-bottom: 20px; }
    .highlight-box { background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
    .role-title { color: #0369a1; font-weight: 700; font-size: 18px; display: block; margin-bottom: 5px; }
    
    /* Next Steps Section */
    .steps-container { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-top: 30px; }
    .steps-title { font-weight: 700; color: #1e293b; font-size: 16px; margin-bottom: 15px; display: block; text-transform: uppercase; }
    .step-item { display: flex; align-items: flex-start; margin-bottom: 15px; }
    .step-number { background: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0; margin-top: 2px; }
    .step-text { font-size: 14px; color: #475569; }

    /* Footer Styles */
    .footer { background-color: #1e293b; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px; }
    .footer img { height: 25px; opacity: 0.7; margin-bottom: 10px; filter: grayscale(100%); }
    .footer-links { margin-top: 10px; }
    .footer-links a { color: #cbd5e1; text-decoration: none; margin: 0 5px; }
  </style>
</head>
<body>
  <div class="container">
    
    <div class="header">
      <img src="${logoUrl}" alt="${companyName} Logo">
      <h1>${companyName}</h1>
      <p>Official Employment Offer</p>
    </div>

    <div class="content">
      <p class="greeting">Hello <strong>${candidateName || 'Candidate'}</strong>,</p>
      
      <p>It is with genuine excitement that we welcome you to the team! We know that finding a role that fits your life—whether you are balancing parenthood, caregiving, or simply seeking a better work-life environment—is vital.</p>
      
      <p>We were incredibly impressed by your performance, professionalism and expertise while we are confident that you will thrive in our flexible, remote-first environment. We are pleased to formally offer you the position of:</p>

      <div class="highlight-box">
        <span class="role-title">✨ ${role || '[Position Name]'}</span>
        <span>${companyName} • Remote</span>
      </div>

      ${attachedDocument ? `
      <div style="background: #ecfdf5; border: 1px dashed #059669; padding: 12px; border-radius: 6px; font-size: 14px; color: #065f46; margin-bottom: 20px;">
        <strong>📎 Attachment Included:</strong> Please review the attached <em>${attachedDocument.name}</em> for full details.
      </div>` : ''}

      <div class="steps-container">
        <span class="steps-title">What Happens Next?</span>
        
        <div class="step-item">
          <div class="step-number">1</div>
          <div class="step-text"><strong>Review & Accept:</strong> Please read through the attached offer letter. To accept, simply sign and reply to this email.</div>
        </div>
        
        <div class="step-item">
          <div class="step-number">2</div>
          <div class="step-text"><strong>Workspace Setup:</strong> Our team will send instructions for setting up your secure remote dashboard & system access credentials.</div>
        </div>

        <div class="step-item">
          <div class="step-number">3</div>
          <div class="step-text"><strong>Onboarding Kickoff:</strong> While this is an immediate opening, we want to ensure you have a smooth start. Our onboarding specialists will reach out with detailed information about your onboarding process and overview.</div>
        </div>
      </div>

      <p style="margin-top: 30px;">We are building a diverse and supportive community here at ${companyName}, and we can't wait for you to be a part of it.</p>
      <p>If you have any questions, please don't hesitate to reach out to our HR department.</p>
      <p>Warmly,</p>
      <p><strong>The ${companyName} Hiring Team</strong></p>
    </div>

    <div class="footer">
      <img src="${logoUrl}" alt="Logo">
      <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
      <p>100% Remote • Equal Opportunity Employer</p>
    </div>
  </div>
</body>
</html>`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedDocument({ name: file.name, size: file.size });
  };

  const downloadEmail = () => {
    const html = generateHTMLEmail();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Offer_${formData.candidateName.replace(/\s+/g, '_') || 'Candidate'}.html`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Navigation Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-lg shadow-lg shadow-blue-200">
              <Building2 className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hiring<span className="text-blue-600">Portal</span></h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Secure Offer Management</p>
            </div>
          </div>

          <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            {[
              { id: 'send', icon: Send, label: 'Compose Offer' },
              { id: 'settings', icon: Building2, label: 'Branding' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'send' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Input Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">1</div>
                  <h2 className="font-bold text-slate-800">Candidate Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1.5 block">Full Name</label>
                    <input 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-slate-700"
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.candidateName} 
                      onChange={e => setFormData({...formData, candidateName: e.target.value})} 
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1.5 block">Position</label>
                    <select 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700 appearance-none"
                      value={formData.role} 
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="">Select a Role...</option>
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">2</div>
                  <h2 className="font-bold text-slate-800">Offer Documents</h2>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group relative">
                  <input type="file" id="up" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && setAttachedDocument({name: e.target.files[0].name})} />
                  <div className="pointer-events-none">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={20} />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{attachedDocument ? attachedDocument.name : "Drop PDF or Word Doc here"}</p>
                    <p className="text-xs text-slate-400 mt-1">Max file size 10MB</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={downloadEmail} 
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <Download size={20} />
                Download Final Email
              </button>
            </div>

            {/* Right Column: Live Preview */}
            <div className="lg:col-span-7">
              <div className="bg-slate-800 rounded-2xl p-2 shadow-2xl h-[800px] flex flex-col ring-4 ring-slate-900/5">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <span className="text-xs font-medium text-slate-400 ml-2">Live Email Preview</span>
                </div>
                <iframe 
                  className="w-full flex-1 bg-white rounded-b-xl" 
                  srcDoc={generateHTMLEmail()} 
                  title="Preview"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Company Branding</h2>
              <p className="text-slate-500 mb-8">Customize how your emails look to candidates.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 block">Company Name</label>
                  <input 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium text-lg"
                    value={companySettings.companyName} 
                    onChange={e => saveSettings({...companySettings, companyName: e.target.value})} 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 block">Logo Image Link</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input 
                        className={`w-full p-4 bg-slate-50 border rounded-xl focus:bg-white outline-none font-mono text-sm ${logoError ? 'border-red-500 ring-2 ring-red-50' : 'border-slate-200 focus:ring-2 focus:ring-blue-500'}`} 
                        value={companySettings.logoUrl} 
                        onChange={e => saveSettings({...companySettings, logoUrl: e.target.value})} 
                      />
                      {logoError && (
                        <p className="flex items-center gap-1 text-red-500 text-xs font-bold mt-2">
                          <AlertCircle size={12} /> Unable to load image. Use a direct .png link.
                        </p>
                      )}
                    </div>
                    <div className="w-20 h-20 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center p-2 relative">
                      {logoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <img src={companySettings.logoUrl} className="max-w-full max-h-full object-contain" alt="Preview" />
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-3">Tip: Right-click an image online and select "Copy Image Address". Link must end in .png or .jpg</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}