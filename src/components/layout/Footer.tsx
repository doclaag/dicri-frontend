import { Linkedin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              Sistema de Gestión de Evidencias DICRI
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ministerio Público de Guatemala © {currentYear}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-600">
              Desarrollado por{" "}
              <a
                href="https://www.linkedin.com/in/doclaag/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-dicri-primary hover:text-dicri-secondary transition-colors inline-flex items-center gap-1"
              >
                Luis Alonzo
                <Linkedin size={16} className="inline" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};