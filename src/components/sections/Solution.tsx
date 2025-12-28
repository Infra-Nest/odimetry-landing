import { Zap, Eye, Target, XCircle, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const Solution = () => {
  const { t: translate } = useTranslation();

  return (
    <section 
      className="py-12 sm:py-16 md:py-24 bg-gray-900"
      aria-labelledby="solution-heading"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Contenido de texto */}
          <div className="px-1 sm:px-0">
            <h2 id="solution-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-4 sm:mb-6">
              {translate('solution.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              {translate('solution.description')}
            </p>
            
            <div className="space-y-5 sm:space-y-6" role="list">
              <div className="flex items-start space-x-3 sm:space-x-4" role="listitem">
                <div className="shrink-0" aria-hidden="true">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-1">{translate('solution.speed.title')}</h3>
                  <p className="text-sm sm:text-base text-gray-300">
                    {translate('solution.speed.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4" role="listitem">
                <div className="shrink-0" aria-hidden="true">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-1">{translate('solution.clarity.title')}</h3>
                  <p className="text-sm sm:text-base text-gray-300">
                    {translate('solution.clarity.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4" role="listitem">
                <div className="shrink-0" aria-hidden="true">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-1">{translate('solution.actionable.title')}</h3>
                  <p className="text-sm sm:text-base text-gray-300">
                    {translate('solution.actionable.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visualización */}
          <div className="relative px-1 sm:px-0" aria-label={translate('solution.auditSummary')}>
            <div className="bg-gray-800 rounded-xl shadow-xl shadow-gray-900/50 p-5 sm:p-6 md:p-8 border border-gray-700">
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-700">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-100">{translate('solution.auditSummary')}</h3>
                  <span className="text-xs sm:text-sm text-gray-400" aria-label={translate('solution.lastUpdate')}>{translate('solution.lastUpdate')}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4" role="list" aria-label="Métricas de auditoría">
                  <div className="bg-red-950/40 rounded-lg p-3 sm:p-4 border border-red-600" role="listitem">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm text-red-100 font-semibold">{translate('solution.critical')}</span>
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-300" aria-hidden="true" />
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-200">3</div>
                  </div>
                  <div className="bg-amber-950/40 rounded-lg p-3 sm:p-4 border border-amber-600" role="listitem">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm text-amber-100 font-semibold">{translate('solution.warnings')}</span>
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" aria-hidden="true" />
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-200">7</div>
                  </div>
                  <div className="bg-green-950/40 rounded-lg p-3 sm:p-4 border border-green-600" role="listitem">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm text-green-100 font-semibold">{translate('solution.correct')}</span>
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" aria-hidden="true" />
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-200">12</div>
                  </div>
                  <div className="bg-blue-950/40 rounded-lg p-3 sm:p-4 border border-blue-600" role="listitem">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm text-blue-100 font-semibold">{translate('solution.total')}</span>
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" aria-hidden="true" />
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-200">22</div>
                  </div>
                </div>

                <div className="pt-3 sm:pt-4 space-y-2 sm:space-y-2.5" role="list" aria-label="Detalles técnicos">
                  <div className="flex items-center justify-between text-xs sm:text-sm" role="listitem">
                    <span className="text-gray-200">{translate('solution.openPorts')}</span>
                    <span className="font-medium text-gray-100">8 {translate('solution.detected')}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm" role="listitem">
                    <span className="text-gray-200">{translate('solution.sslCertificate')}</span>
                    <span className="font-semibold text-green-300">{translate('solution.valid')}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm" role="listitem">
                    <span className="text-gray-200">{translate('solution.cvesFound')}</span>
                    <span className="font-semibold text-red-300">2 {translate('solution.criticalCves')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

