import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, AlertTriangle, FileText, Shield, Send } from "lucide-react";
import { toast } from "sonner";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: '',
    subject: '',
    message: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.requestType || !formData.subject || !formData.message || !formData.consent) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide.');
      return;
    }

    setIsSubmitting(true);

    try {
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Configuration Supabase manquante');
      }

      const functionUrl = `${supabaseUrl}/functions/v1/contact-submit`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      toast.success('Message envoyé. Nous vous répondrons dès que possible.');
      setFormData({
        name: '',
        email: '',
        requestType: '',
        subject: '',
        message: '',
        consent: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi du message. Veuillez réessayer ou nous contacter directement par email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <section className="max-w-[820px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-10">
          <MapPin size={16} /> Retour à l'accueil
        </Link>

        <p className="eyebrow text-foreground/60">Contactez Clameo</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1.05] font-black tracking-[-0.04em]">
          Une question, une erreur à signaler
        </h1>
        <p className="mt-4 text-foreground/70 max-w-xl">
          Une erreur dans une lettre générée, une question sur le service, ou une demande de partenariat ? Écrivez-nous.
        </p>

        <div className="mt-12 space-y-10">
          {/* Question générale */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <Mail className="text-trust shrink-0 mt-0.5" size={18} />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Question générale</h2>
                <p className="mt-1.5 text-sm text-foreground/70 leading-relaxed">
                  Utilisez ce formulaire pour toute demande générale, question ou suggestion d'amélioration.
                </p>
              </div>
            </div>
          </section>

          {/* Signaler une erreur */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-trust shrink-0 mt-0.5" size={18} />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Signaler une erreur dans une lettre</h2>
                <p className="mt-1.5 text-sm text-foreground/70 leading-relaxed">
                  Vous avez trouvé une erreur ou une incohérence dans une lettre générée par Clameo ? Décrivez-la nous pour que nous puissions l'améliorer.
                </p>
              </div>
            </div>
          </section>

          {/* Partenariat / Envoi recommandé */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <Send className="text-trust shrink-0 mt-0.5" size={18} />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Partenariat / Envoi recommandé</h2>
                <p className="mt-1.5 text-sm text-foreground/70 leading-relaxed">
                  Vous êtes un service d'envoi en recommandé, une plateforme juridique, ou un professionnel du droit intéressé par un partenariat ? Contactez-nous pour en discuter.
                </p>
              </div>
            </div>
          </section>

          {/* Confidentialité */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <Shield className="text-trust shrink-0 mt-0.5" size={18} />
              <div>
                <h2 className="text-xl font-semibold text-foreground">Confidentialité</h2>
                <p className="mt-1.5 text-sm text-foreground/70 leading-relaxed">
                  Les informations envoyées via ce formulaire servent uniquement à répondre à votre demande.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Contact Form */}
        <div className="mt-12 rounded-lg border border-border bg-card p-6 lg:p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Formulaire de contact</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Nom <span className="text-[#e8502a]">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
                required
                className="w-full px-4 py-3 bg-white border rounded-[14px] focus:outline-none transition text-[#333333] placeholder:text-[#999999]"
                style={{ borderColor: 'var(--border)' }}
                onFocus={(e) => e.target.style.borderColor = '#e8502a'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email <span className="text-[#e8502a]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                className="w-full px-4 py-3 bg-white border rounded-[14px] focus:outline-none transition text-[#333333] placeholder:text-[#999999]"
                style={{ borderColor: 'var(--border)' }}
                onFocus={(e) => e.target.style.borderColor = '#e8502a'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Request Type */}
            <div>
              <label htmlFor="requestType" className="block text-sm font-medium text-foreground mb-2">
                Type de demande <span className="text-[#e8502a]">*</span>
              </label>
              <select
                id="requestType"
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border rounded-[14px] focus:outline-none transition text-[#333333]"
                style={{ borderColor: 'var(--border)' }}
                onFocus={(e) => e.target.style.borderColor = '#e8502a'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              >
                <option value="">Sélectionnez un type</option>
                <option value="Question générale">Question générale</option>
                <option value="Signaler une erreur">Signaler une erreur</option>
                <option value="Partenariat">Partenariat</option>
                <option value="Confidentialité">Confidentialité</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                Sujet <span className="text-[#e8502a]">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Sujet de votre message"
                required
                className="w-full px-4 py-3 bg-white border rounded-[14px] focus:outline-none transition text-[#333333] placeholder:text-[#999999]"
                style={{ borderColor: 'var(--border)' }}
                onFocus={(e) => e.target.style.borderColor = '#e8502a'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Message <span className="text-[#e8502a]">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Décrivez votre demande..."
                rows={5}
                required
                className="w-full px-4 py-3 bg-white border rounded-[14px] focus:outline-none transition text-[#333333] placeholder:text-[#999999] resize-none"
                style={{ borderColor: 'var(--border)' }}
                onFocus={(e) => e.target.style.borderColor = '#e8502a'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                required
                className="mt-1 w-4 h-4 text-[#e8502a] border border-border rounded focus:outline-none focus:ring-2 focus:ring-[#e8502a]/20"
                style={{ borderColor: 'var(--border)' }}
              />
              <label htmlFor="consent" className="text-sm text-foreground/70 leading-relaxed">
                J'accepte que mes informations soient utilisées pour répondre à ma demande. <span className="text-[#e8502a]">*</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-coral w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[14px] text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Envoyer le message
                </>
              )}
            </button>
          </form>

          {/* Fallback Email */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-foreground/70 mb-4">
              Préférez-vous nous contacter directement par email ?
            </p>
            <p className="text-lg font-medium text-foreground mb-4">
              hello@clameo.fr
            </p>
            <a 
              href="mailto:hello@clameo.fr"
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition"
            >
              <Mail size={16} />
              Ouvrir votre client email
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
