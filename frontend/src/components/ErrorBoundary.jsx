import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-[24px] border border-border shadow-sm">
          <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center text-coral mb-6">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-black mb-2">Oups ! Quelque chose s'est mal passé.</h2>
          <p className="text-[#6b7280] max-w-sm mb-8 leading-relaxed">
            Une erreur est survenue lors de l'affichage de cette section. Cela est souvent dû à un modèle de lettre incomplet.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-[#e8502a] text-white font-bold transition-transform hover:scale-[1.02]"
          >
            <RotateCcw size={18} /> Actualiser la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
