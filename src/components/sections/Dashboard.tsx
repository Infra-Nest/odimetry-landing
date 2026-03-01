import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, LogOut } from 'lucide-react';

export const Dashboard = () => {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();

  return (
    <section 
      className="py-16 md:py-24 bg-gray-900"
      aria-labelledby="dashboard-heading"
    >
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <h2 id="dashboard-heading" className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            {translate('dashboard.title')}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {translate('dashboard.subtitle')}
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="bg-gray-800 rounded-xl shadow-xl shadow-gray-900/50 border border-gray-700 overflow-hidden">
          {/* Header del dashboard */}
          <div className="bg-gray-900 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-100">{translate('dashboard.exampleDomain')}</h3>
                <p className="text-sm text-gray-400">{translate('dashboard.lastAudit')}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-medium">
                  {translate('dashboard.active')}
                </span>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  aria-label="Ir a login"
                >
                  <LogOut className="w-4 h-4" />
                  Login
                </button>
              </div>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" role="list" aria-label="Métricas de seguridad">
              <div className="bg-red-950/40 rounded-lg p-4 border border-red-600" role="listitem">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-red-100 font-semibold">{translate('dashboard.critical')}</span>
                  <XCircle className="w-5 h-5 text-red-300" aria-hidden="true" />
                </div>
                <div className="text-3xl font-bold text-red-200">3</div>
              </div>
              <div className="bg-amber-950/40 rounded-lg p-4 border border-amber-600" role="listitem">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-amber-100 font-semibold">{translate('dashboard.warnings')}</span>
                  <AlertCircle className="w-5 h-5 text-amber-300" aria-hidden="true" />
                </div>
                <div className="text-3xl font-bold text-amber-200">7</div>
              </div>
              <div className="bg-green-950/40 rounded-lg p-4 border border-green-600" role="listitem">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-100 font-semibold">{translate('dashboard.correct')}</span>
                  <CheckCircle2 className="w-5 h-5 text-green-300" aria-hidden="true" />
                </div>
                <div className="text-3xl font-bold text-green-200">12</div>
              </div>
              <div className="bg-blue-950/40 rounded-lg p-4 border border-blue-600" role="listitem">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-100 font-semibold">{translate('solution.total')}</span>
                  <TrendingUp className="w-5 h-5 text-blue-300" aria-hidden="true" />
                </div>
                <div className="text-3xl font-bold text-blue-200">22</div>
              </div>
            </div>

            {/* Detalles técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Puertos y servicios */}
              <Card className="border border-gray-700">
                <h4 className="font-semibold text-gray-100 mb-4">{translate('dashboard.portsAndServices')}</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-100">{translate('dashboard.port443')}</span>
                      <span className="text-sm text-gray-400 ml-2">{translate('dashboard.https')}</span>
                    </div>
                    <span className="px-2.5 py-1.5 bg-green-600 text-white rounded text-xs font-semibold">
                      {translate('dashboard.secureStatus')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-100">{translate('dashboard.port22')}</span>
                      <span className="text-sm text-gray-300 ml-2">{translate('dashboard.ssh')}</span>
                    </div>
                    <span className="px-2.5 py-1.5 bg-red-600 text-white rounded text-xs font-semibold">
                      {translate('dashboard.exposed')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-100">{translate('dashboard.port3306')}</span>
                      <span className="text-sm text-gray-300 ml-2">{translate('dashboard.mysql')}</span>
                    </div>
                    <span className="px-2.5 py-1.5 bg-amber-600 text-white rounded text-xs font-semibold">
                      {translate('dashboard.risk')}
                    </span>
                  </div>
                </div>
              </Card>

              {/* SSL/TLS */}
              <Card className="border border-gray-700">
                <h4 className="font-semibold text-gray-100 mb-4">{translate('dashboard.sslTlsAnalysis')}</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <span className="text-gray-200">{translate('dashboard.certificate')}</span>
                    <span className="font-semibold text-green-300">{translate('solution.valid')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <span className="text-gray-200">{translate('dashboard.protocols')}</span>
                    <span className="font-semibold text-amber-300">{translate('dashboard.tlsVersions')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <span className="text-gray-200">{translate('dashboard.cipherSuites')}</span>
                    <span className="font-semibold text-green-300">{translate('dashboard.secure')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <span className="text-gray-200">{translate('dashboard.hsts')}</span>
                    <span className="font-semibold text-red-300">{translate('dashboard.notConfigured')}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* CVEs detectadas */}
            <div className="mt-6">
              <Card className="border border-gray-700">
                <h4 className="font-semibold text-gray-100 mb-4">{translate('dashboard.vulnerabilitiesDetected')}</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-red-950/40 border border-red-600 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className="font-semibold text-red-100 text-base block mb-1">{translate('dashboard.cve1')}</span>
                        <p className="text-sm text-red-50 leading-relaxed">
                          {translate('dashboard.cve1Description')}
                        </p>
                      </div>
                      <span className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs font-semibold whitespace-nowrap shrink-0">
                        {translate('dashboard.critical')}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-amber-950/40 border border-amber-600 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className="font-semibold text-amber-100 text-base block mb-1">{translate('dashboard.cve2')}</span>
                        <p className="text-sm text-amber-50 leading-relaxed">
                          {translate('dashboard.cve2Description')}
                        </p>
                      </div>
                      <span className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-semibold whitespace-nowrap shrink-0">
                        {translate('dashboard.medium')}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

