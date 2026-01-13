import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, Clock, AlertCircle, Paperclip, Upload, FileText, X, List, Trash2, Download, Building2, Image, Copy, FileDown } from 'lucide-react';

export default function HiringPortal() {
  const [formData, setFormData] = useState({
    email: '',
    candidateName: '',
    role: '',
    interviewDate: ''
  });
  const [companySettings, setCompanySettings] = useState({
    companyName: 'RPM Healthcare',
    logoUrl: '',
  });
  const [status, setStatus] = useState('idle');
  const [emailPreview, setEmailPreview] = useState(false);
  const [error, setError] = useState('');
  const [attachedDocument, setAttachedDocument] = useState(null);
  const [sentEmails, setSentEmails] = useState([]);
  const [activeTab, setActiveTab] = useState('send');
  const [copySuccess, setCopySuccess] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);

  const roles = [
    'Data Entry Specialist',
    'Payroll Specialist',
    'Customer Service Representative'
  ];

  useEffect(() => {
    loadSentEmails();
    loadCompanySettings();
  }, []);

  useEffect(() => {
    if (companySettings.logoUrl) {
      validateLogo(companySettings.logoUrl);
    }
  }, [companySettings.logoUrl]);

  const validateLogo = (url: string) => {
    setLogoLoading(true);
    setLogoError(false);
    
    const img = new window.Image();
    img.onload = () => {
      setLogoLoading(false);
      setLogoError(false);
    };
    img.onerror = () => {
      setLogoLoading(false);
      setLogoError(true);
    }Storage.;
    img.src = url;
  };

  const loadSentEmails = async () => {
    try {
      const result = await localStorage.getItem('sent-emails-list');
      if (result && result.value) {
        setSentEmails(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No previous emails found');
    }
  };

  const loadCompanySettings = async () => {
    try {
      const result = await localStorage.getItem('company-settings');
      if (result && result.value) {
        setCompanySettings(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('Using default company settings');
    }
  };

  const saveCompanySettings = async (settings: React.SetStateAction<{ companyName: string; logoUrl: string; }>) => {
    setCompanySettings(settings);
    try {
      await localStorage.setItem('company-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const saveSentEmail = async (emailData: { email: string; candidateName: string; role: string; interviewDate: string; hasAttachment: boolean; companyName: string; }) => {
    const newEmail = {
      id: Date.now(),
      ...emailData,
      timestamp: new Date().toISOString(),
      sentAt: new Date().toLocaleString()
    };
    
    const updatedEmails = [newEmail, ...sentEmails];
    setSentEmails(updatedEmails);
    
    try {
      await localStorage.setItem('sent-emails-list', JSON.stringify(updatedEmails));
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all email history? This cannot be undone.')) {
      setSentEmails([]);
      try {
        await localStorage.removeItem('sent-emails-list');
        alert('Email history cleared successfully!');
      } catch (error) {
        console.error('Error clearing history:', error);
      }
    }
  };

  const exportHistory = () => {
    const csv = [
      ['Date Sent', 'Candidate Name', 'Email', 'Position', 'Interview Date'],
      ...sentEmails.map(e => [e.sentAt, e.candidateName, e.email, e.role, e.interviewDate])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hiring-emails-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatFileSize = (bytes: string | number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileUpload = (e: { target: { files: any[]; }; }) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF and Word documents are allowed');
        return;
      }

      setError('');
      setAttachedDocument({
        file: file,
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  };

  const removeAttachment = () => {
    setAttachedDocument(null);
  };

  const generateHTMLEmail = () => {
    const { candidateName, role, interviewDate } = formData;
    const { companyName, logoUrl } = companySettings;
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%); padding: 50px 40px; text-align: center;">
              <img src="${logoUrl}" alt="${companyName}" style="max-width: 220px; height: auto; margin-bottom: 24px; display: block; margin-left: auto; margin-right: auto;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Welcome to the Team!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 16px;">You've been selected for an exciting opportunity</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 48px 40px;">
              <p style="color: #334155; font-size: 17px; line-height: 1.7; margin: 0 0 24px 0;">Dear <strong>${candidateName}</strong>,</p>
              
              <p style="color: #334155; font-size: 17px; line-height: 1.7; margin: 0 0 24px 0;">
                We are <strong style="color: #2563eb;">thrilled to inform you</strong> that following your interview on <strong>${formatDate(interviewDate)}</strong>, you have been successfully selected for the position of <strong style="color: #2563eb;">${role}</strong> at ${companyName}.
              </p>

              <p style="color: #334155; font-size: 17px; line-height: 1.7; margin: 0 0 28px 0;">
                Your performance, professionalism, and expertise during the interview process truly impressed our team. We believe your unique skills and experience will be invaluable to our growing remote healthcare workforce.
              </p>

              ${attachedDocument ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; margin: 28px 0; border: 2px solid #10b981;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="color: #065f46; font-size: 16px; font-weight: 700; margin: 0 0 6px 0;">📎 Important Document Attached</p>
                    <p style="color: #047857; font-size: 15px; margin: 0;">Please review the <strong>${attachedDocument.name}</strong> attached to this email.</p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; margin: 32px 0; border-left: 6px solid #2563eb;">
                <tr>
                  <td style="padding: 28px;">
                    <h2 style="color: #1e40af; font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">🎯 What Happens Next</h2>
                    <p style="color: #1e40af; font-size: 15px; margin: 0 0 16px 0;">Our onboarding team will contact you within <strong>24-48 hours</strong> with details about:</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="padding: 8px 0; color: #475569; font-size: 15px;"><span style="color: #2563eb; font-weight: bold;">✓</span> Your start date and orientation schedule</td></tr>
                      <tr><td style="padding: 8px 0; color: #475569; font-size: 15px;"><span style="color: #2563eb; font-weight: bold;">✓</span> Required documentation and paperwork</td></tr>
                      <tr><td style="padding: 8px 0; color: #475569; font-size: 15px;"><span style="color: #2563eb; font-weight: bold;">✓</span> Technical setup and system access</td></tr>
                      <tr><td style="padding: 8px 0; color: #475569; font-size: 15px;"><span style="color: #2563eb; font-weight: bold;">✓</span> Training program overview</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #334155; font-size: 17px; line-height: 1.7; margin: 32px 0 0 0;">
                <strong>Warm regards,</strong><br>
                <span style="color: #2563eb; font-weight: 700;">The ${companyName} Hiring Team</span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px 40px; text-align: center;">
              <img src="${logoUrl}" alt="${companyName}" style="max-width: 140px; height: auto; margin-bottom: 16px; opacity: 0.8; display: block; margin-left: auto; margin-right: auto;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                <strong style="color: #cbd5e1;">${companyName}</strong><br>
                © ${new Date().getFullYear()} ${companyName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  const downloadHTMLEmail = () => {
    const html = generateHTMLEmail();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hiring-email-${formData.candidateName.replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePlainEmail = () => {
    const { candidateName, role, interviewDate } = formData;
    const { companyName } = companySettings;
    
    return `Dear ${candidateName},

Congratulations! 🎉

Following your interview on ${formatDate(interviewDate)}, you have been successfully selected for the ${role} position at ${companyName}.

Your performance, professionalism, and expertise during the interview process truly impressed our team. We believe your unique skills and experience will be invaluable to our growing remote healthcare workforce.

${attachedDocument ? `📎 IMPORTANT: Please review the attached ${attachedDocument.name}\n\n` : ''}🎯 WHAT HAPPENS NEXT

Our onboarding team will contact you within 24-48 hours with detailed information about:

✓ Your start date and comprehensive orientation schedule
✓ Required documentation and onboarding paperwork
✓ Technical setup and system access credentials
✓ Training program overview and schedule

If you have any immediate questions, please don't hesitate to reach out to our HR department.

We're excited to have you join us and contribute to our mission of delivering exceptional healthcare services!

Warm regards,
The ${companyName} Hiring Team

---
© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;
  };

  const handleSend = async () => {
    if (!isFormValid) return;
    
    setStatus('sending');
    setError('');

    try {
      await saveSentEmail({
        email: formData.email,
        candidateName: formData.candidateName,
        role: formData.role,
        interviewDate: formData.interviewDate,
        hasAttachment: !!attachedDocument,
        companyName: companySettings.companyName
      });
      
      const subject = `Welcome to ${companySettings.companyName} - ${formData.role} Position`;
      const body = generatePlainEmail();
      
      const mailtoLink = `mailto:${formData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      
      setTimeout(() => {
        setStatus('sent');
        setTimeout(() => {
          setStatus('idle');
          setFormData({
            email: '',
            candidateName: '',
            role: '',
            interviewDate: ''
          });
          setAttachedDocument(null);
          setEmailPreview(false);
        }, 2500);
      }, 800);

    } catch (err) {
      setError('Failed to open email client. Use the download method instead.');
      setStatus('idle');
    }
  };

  const isFormValid = formData.email && formData.candidateName && formData.role && formData.interviewDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl shadow-sm">
                {logoLoading ? (
                  <div className="h-12 w-32 bg-slate-200 animate-pulse rounded"></div>
                ) : logoError ? (
                  <div className="h-12 w-32 bg-red-100 rounded flex items-center justify-center text-xs text-red-600">
                    Logo Error
                  </div>
                ) : (
                  <img 
                    src={companySettings.logoUrl} 
                    alt={companySettings.companyName}
                    className="h-12 w-auto"
                  />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{companySettings.companyName} Hiring Portal</h1>
                <p className="text-sm text-slate-500">Streamlined candidate onboarding</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('send')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  activeTab === 'send' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Send className="w-4 h-4" />
                Send
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  activeTab === 'history' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <List className="w-4 h-4" />
                History ({sentEmails.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  activeTab === 'settings' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'send' ? (
          /* Send Email Form */
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-8 py-7">
              <h2 className="text-2xl font-bold text-white">New Hire Confirmation</h2>
              <p className="text-blue-100 mt-1">Send a professional welcome email to your new team member</p>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Candidate Name *
                    </label>
                    <input
                      type="text"
                      value={formData.candidateName}
                      onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Position *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                    >
                      <option value="">Select a role...</option>
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Interview Date *
                    </label>
                    <input
                      type="date"
                      value={formData.interviewDate}
                      onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Document Upload */}
                <div className="border-t-2 border-slate-200 pt-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    <Paperclip className="w-4 h-4 inline mr-2" />
                    Attach Document (Optional)
                  </label>
                  <p className="text-xs text-slate-500 mb-4">
                    Upload documents like offer letters or handbooks (PDF/Word, max 10MB)
                  </p>
                  
                  {!attachedDocument ? (
                    <label className="flex flex-col items-center justify-center w-full h-36 border-3 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-12 h-12 text-slate-400 mb-3" />
                        <p className="text-sm text-slate-600 font-semibold">Click to upload document</p>
                        <p className="text-xs text-slate-500 mt-1">PDF or Word documents only</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500 rounded-xl p-3 shadow-sm">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{attachedDocument.name}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(attachedDocument.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={removeAttachment}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl p-2 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Email Preview */}
                {isFormValid && (
                  <div className="bg-slate-50 rounded-xl p-5 border-2 border-slate-200">
                    <button
                      type="button"
                      onClick={() => setEmailPreview(!emailPreview)}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2"
                    >
                      {emailPreview ? '− Hide' : '+ Show'} Email Preview
                    </button>
                    
                    {emailPreview && (
                      <div className="mt-4">
                        <p className="text-xs font-bold text-slate-500 mb-3">EMAIL PREVIEW:</p>
                        <div 
                          className="border-2 border-slate-200 rounded-xl overflow-auto max-h-96 bg-white"
                          dangerouslySetInnerHTML={{ __html: generateHTMLEmail() }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {/* Send Buttons */}
                <div className="pt-2 space-y-3">
                  {status === 'idle' && (
                    <>
                      <button
                        onClick={handleSend}
                        disabled={!isFormValid}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <Send className="w-5 h-5" />
                        Open in Email Client (Simple Text)
                      </button>
                      
                      {isFormValid && (
                        <button
                          onClick={downloadHTMLEmail}
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          <FileDown className="w-5 h-5" />
                          Download HTML Email (For Outlook - Recommended)
                          {attachedDocument && <span className="text-xs bg-purple-500 px-3 py-1 rounded-full">+ Attachment Note</span>}
                        </button>
                      )}
                    </>
                  )}

                  {status === 'sending' && (
                    <div className="w-full bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                      <Clock className="w-5 h-5 animate-spin" />
                      Opening Email Client...
                    </div>
                  )}

                  {status === 'sent' && (
                    <div className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                      <CheckCircle className="w-6 h-6" />
                      Saved to History!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          /* Company Settings */
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 px-8 py-7">
              <h2 className="text-2xl font-bold text-white">Company Branding Settings</h2>
              <p className="text-purple-100 mt-1">Customize your company name and logo for emails</p>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companySettings.companyName}
                    onChange={(e) => saveCompanySettings({...companySettings, companyName: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Logo URL (Direct Image Link)
                  </label>
                  <input
                    type="url"
                    value={companySettings.logoUrl}
                    onChange={(e) => saveCompanySettings({...companySettings, logoUrl: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                    placeholder="https://i.imgur.com/yourlogo.png"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    ⚠️ Must be a direct image link (ends with .png, .jpg, or .jpeg)
                  </p>
                </div>

                {/* Logo Preview */}
                <div className="border-2 border-slate-200 rounded-xl p-6 bg-slate-50">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Logo Preview:</h3>
                  <div className="flex items-center justify-center bg-white p-8 rounded-lg border border-slate-200 min-h-32">
                    {logoLoading ? (
                      <div className="text-center">
                        <div className="w-48 h-16 bg-slate-200 animate-pulse rounded mx-auto mb-2"></div>
                        <p className="text-sm text-slate-500">Loading logo...</p>
                      </div>
                    ) : logoError ? (
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                        <p className="text-sm text-red-600 font-medium">Logo failed to load</p>
                        <p className="text-xs text-slate-500 mt-1">Check if the URL is a direct image link</p>
                      </div>
                    ) : (
                      <img 
                        src={companySettings.logoUrl} 
                        alt="Company Logo"
                        className="max-w-xs max-h-24"
                      />
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    How to Get a Direct Image Link
                  </h3>
                  <div className="text-sm text-slate-700 space-y-3">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="font-semibold mb-2">Method 1: Using Imgur (Easiest)</p>
                      <ol className="list-decimal ml-5 space-y-1">
                        <li>Go to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">imgur.com/upload</a></li>
                        <li>Upload your logo (no account needed)</li>
                        <li>After upload, RIGHT-CLICK the image</li>
                        <li>Select "Copy image address" or "Copy image link"</li>
                        <li>Paste the URL here (should end with .png or .jpg)</li>
                      </ol>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="font-semibold mb-2">Method 2: Using Your Website</p>
                      <ol className="list-decimal ml-5 space-y-1">
                        <li>Upload logo to your website's images folder</li>
                        <li>Use the full URL: https://yoursite.com/images/logo.png</li>
                        <li>Make sure it's publicly accessible (not password protected)</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {!logoError && !logoLoading && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-slate-800">Settings Saved!</h3>
                    </div>
                    <p className="text-sm text-slate-700">
                      Your company name and logo will appear in all hiring emails automatically.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Email History */
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 px-8 py-7 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Sent Emails History</h2>
                <p className="text-slate-300 mt-1">Track all hiring confirmation emails</p>
              </div>
              <div className="flex gap-3">
                {sentEmails.length > 0 && (
                  <>
                    <button
                      onClick={exportHistory}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                    <button
                      onClick={clearHistory}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="p-8">
              {sentEmails.length === 0 ? (
                <div className="text-center py-16">
                  <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No emails sent yet</h3>
                  <p className="text-slate-500">Your sent confirmation emails will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sentEmails.map((email) => (
                    <div key={email.id} className="border-2 border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-800">{email.candidateName}</h3>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                              {email.role}
                            </span>
                            {email.hasAttachment && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                <Paperclip className="w-3 h-3" />
                                Attachment
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 font-medium mb-1">{email.email}</p>
                          <p className="text-sm text-slate-500">
                            Interview: {formatDate(email.interviewDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-slate-500 uppercase">Sent</p>
                          <p className="text-sm text-slate-700 font-medium">{email.sentAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {activeTab === 'send' && (
          <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center shadow-md">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">📧 How to Send Emails with Full Design:</h3>
                <div className="text-sm text-slate-700 space-y-4">
                  
                  <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                    <p className="font-bold mb-2 text-purple-700">🌟 RECOMMENDED METHOD for Outlook:</p>
                    <ol className="list-decimal ml-5 space-y-2">
                      <li><strong>Click "Download HTML Email"</strong> button above</li>
                      <li>Open <strong>Outlook</strong> (desktop or web)</li>
                      <li>Click <strong>"New Email"</strong></li>
                      <li>Go to <strong>Insert → Attach File</strong></li>
                      <li>Select the downloaded HTML file</li>
                      <li>Outlook will ask: <strong>"Insert as text"</strong> or <strong>"Insert as attachment"</strong></li>
                      <li>Choose <strong>"Insert as text"</strong></li>
                      <li>The beautiful designed email will appear! ✨</li>
                      <li>Add recipient email, attach your document, and send</li>
                    </ol>
                  </div>

                  <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                    <p className="font-bold mb-2 text-blue-700">Alternative: Simple Text Method</p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>Click "Open in Email Client"</li>
                      <li>Your email app opens with simple text format</li>
                      <li>Attach document manually and send</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}