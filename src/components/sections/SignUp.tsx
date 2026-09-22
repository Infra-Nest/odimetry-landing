import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { createUser } from '../../services/authService';
import type { CreateUserRequest } from '../../types/auth';

const fieldClassName = 'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-[border-color,box-shadow,background-color]';

export const SignUp = () => {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();

  // ----- User fields -----
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [surname, setSurname] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // ----- Organization selection -----
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [createOrg, setCreateOrg] = useState(true);

  // ----- Organization creation fields -----
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<'personal' | 'business'>('business');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [taxId, setTaxId] = useState('');
  const [legalAddress, setLegalAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  // ----- UI state -----
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const organizationIdRef = useRef<HTMLInputElement>(null);
  const organizationNameRef = useRef<HTMLInputElement>(null);

  // ----- Validation -----
  const validate = () => {
    if (!email) return translate('signup.errors.emailRequired', 'Please enter your email.');
    if (!password || password.length < 12)
      return translate('signup.errors.passwordLength', 'Password must be at least 12 characters long.');
    if (!createOrg && !organizationId) 
      return translate('signup.errors.orgRequired', 'Please select an organization ID or create a new one.');
    if (createOrg && !orgName) return translate('signup.errors.orgNameRequired', 'Organization name is required.');
    return null;
  };

  // ----- Form submission -----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      if (!email) {
        emailRef.current?.focus();
      } else if (!password || password.length < 12) {
        passwordRef.current?.focus();
      } else if (!createOrg && !organizationId) {
        organizationIdRef.current?.focus();
      } else if (createOrg && !orgName) {
        organizationNameRef.current?.focus();
      }
      return;
    }

    // ----- Build payload -----
    const payload: CreateUserRequest = {
      user: {
        email,
        password,
        firstname: firstname || undefined,
        surname: surname || undefined,
        profile_image_url: profileImageUrl || undefined,
        phone_number: phoneNumber || undefined,
      },
    };

    if (createOrg) {
      payload.organization = {
        name: orgName,
        org_type: orgType,
        description: description || undefined,
        website_url: websiteUrl || undefined,
        tax_id: taxId || undefined,
        legal_address_line: legalAddress || undefined,
        legal_city: city || undefined,
        legal_postal_code: postalCode || undefined,
        legal_country: country || undefined,
      };
    } else if (organizationId) {
      payload.user.organization_id = organizationId;
    }

    try {
      setLoading(true);
      await createUser(payload);
      setSuccess(translate('signup.success'));
      setTimeout(() => navigate('/'), 1500);
    } catch (err: unknown) {
      const fallback = translate('signup.errors.general');
      setError(err instanceof Error && err.message ? err.message : fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-950 text-white" aria-labelledby="signup-heading">
      <Container>
        <div className="max-w-xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6 sm:p-8">
          <h1 id="signup-heading" className="text-2xl sm:text-3xl font-bold mb-3 text-gray-100">
            {translate('signup.title')}
          </h1>
          <p className="text-sm text-gray-400 mb-6">{translate('signup.subtitle')}</p>
          <p className="text-sm text-gray-400 mb-6">{translate('signup.availabilityNote', 'Account creation requires the Odimetry service to be available.')}</p>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label={translate('signup.title')} aria-busy={loading}>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
                {translate('signup.email')} *
              </label>
              <input
                id="email"
                ref={emailRef}
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={fieldClassName}
                placeholder="you@example.com"
                aria-describedby={error ? 'signup-feedback' : undefined}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
                {translate('signup.password')} *
              </label>
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={fieldClassName}
                placeholder={translate('signup.passwordPlaceholder', 'At least 12 characters')}
                aria-describedby={error ? 'signup-feedback' : undefined}
              />
            </div>

            {/* Optional user fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="firstname">
                  {translate('signup.firstname')}
                </label>
                <input id="firstname" name="firstname" autoComplete="given-name" value={firstname} onChange={(e) => setFirstname(e.target.value)} className={fieldClassName} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="surname">
                  {translate('signup.surname')}
                </label>
                <input id="surname" name="surname" autoComplete="family-name" value={surname} onChange={(e) => setSurname(e.target.value)} className={fieldClassName} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="profileImage">
                  {translate('signup.profileImage')}
                </label>
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    const maxSize = 2 * 1024 * 1024; // Límite de 2MB

                    if (file) {
                      if (file.size > maxSize) {
                        setError(translate('signup.errors.fileTooLarge'));
                        e.target.value = '';
                        setProfileImageUrl('');
                        return;
                      }

                      setError(null);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setProfileImageUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className={fieldClassName}
                  aria-describedby={error ? 'signup-feedback' : undefined}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="phoneNumber">
                  {translate('signup.phoneNumber')}
                </label>
                <input id="phoneNumber" name="phoneNumber" type="tel" inputMode="tel" autoComplete="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={fieldClassName} />
              </div>
            </div>

            {/* Create a workspace or explicitly join an existing organization */}
            <fieldset className="space-y-3">
              <legend className="text-base font-semibold text-gray-100">{translate('signup.workspace')}</legend>
              <label htmlFor="createOrg" className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-gray-300">
                <input id="createOrg" name="organizationMode" type="radio" value="create" checked={createOrg} onChange={() => setCreateOrg(true)} aria-describedby="workspace-hint" className="h-4 w-4 border-gray-600 bg-gray-800 text-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400" />
                <span>{translate('signup.createOrganization')}</span>
              </label>
              <p id="workspace-hint" className="text-sm text-gray-400">{translate('signup.workspaceHint', 'Create your own workspace. You do not need an existing organization ID.')}</p>
              <label htmlFor="joinOrg" className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-gray-300">
                <input id="joinOrg" name="organizationMode" type="radio" value="join" checked={!createOrg} onChange={() => setCreateOrg(false)} aria-describedby="existing-org-hint" className="h-4 w-4 border-gray-600 bg-gray-800 text-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400" />
                <span>{translate('signup.existingOrganization', 'Join an existing organization')}</span>
              </label>
              <p id="existing-org-hint" className="text-sm text-gray-400">{translate('signup.existingOrgHint', 'Use this option only if you know the internal numeric ID of the organization you should join.')}</p>
            </fieldset>

            {/* Existing org ID */}
            {!createOrg && (
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="organizationId">
                    {translate('signup.organization.id')}
                  </label>
                  <input
                  ref={organizationIdRef}
                  type="number"
                  id="organizationId"
                  name="organizationId"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  required
                  autoComplete="off"
                  value={organizationId || ''}
                  onChange={(e) => setOrganizationId(Number(e.target.value))}
                  className={fieldClassName}
                  aria-describedby={error ? 'existing-org-hint signup-feedback' : 'existing-org-hint'}
                  />
              </div>
              )}


            {/* Organization fields */}
            {createOrg && (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="organizationName">
                    {translate('signup.organization.name')} *
                  </label>
                  <input ref={organizationNameRef} id="organizationName" name="organizationName" autoComplete="organization" value={orgName} onChange={(e) => setOrgName(e.target.value)} required className={fieldClassName} aria-describedby={error ? 'signup-feedback' : undefined} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="organizationType">
                    {translate('signup.organization.type')}
                  </label>
                  <select id="organizationType" name="organizationType" value={orgType} onChange={(e) => setOrgType(e.target.value as 'personal' | 'business')} className={fieldClassName}>
                  <option value="personal">{translate('signup.orgTypes.personal')}</option>
                  <option value="business">{translate('signup.orgTypes.business')}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="organizationDescription">
                    {translate('signup.organization.description')}
                  </label>
                  <textarea id="organizationDescription" name="organizationDescription" value={description} onChange={(e) => setDescription(e.target.value)} className={fieldClassName} rows={3} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="websiteUrl">
                    {translate('signup.organization.websiteUrl')}
                  </label>
                  <input id="websiteUrl" name="websiteUrl" type="url" autoComplete="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className={fieldClassName} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="taxId">
                    {translate('signup.organization.taxId')}
                  </label>
                  <input id="taxId" name="taxId" autoComplete="off" value={taxId} onChange={(e) => setTaxId(e.target.value)} className={fieldClassName} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="legalAddress">
                    {translate('signup.organization.legalAddress')}
                  </label>
                  <input id="legalAddress" name="legalAddress" autoComplete="street-address" value={legalAddress} onChange={(e) => setLegalAddress(e.target.value)} className={fieldClassName} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="city">
                      {translate('signup.organization.city')}
                    </label>
                    <input id="city" name="city" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} className={fieldClassName} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="postalCode">
                      {translate('signup.organization.postalCode')}
                    </label>
                    <input id="postalCode" name="postalCode" inputMode="numeric" autoComplete="postal-code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={fieldClassName} />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="country">
                    {translate('signup.organization.country')}
                  </label>
                  <input id="country" name="country" autoComplete="country-name" value={country} onChange={(e) => setCountry(e.target.value)} className={fieldClassName} />
                </div>
              </div>
            )}

            {error && <p id="signup-feedback" className="text-sm text-red-400" role="alert" aria-live="assertive" aria-atomic="true">{error}</p>}
            {success && <p id="signup-success" className="text-sm text-green-400" role="status" aria-live="polite" aria-atomic="true">{success}</p>}

            <div className="pt-3">
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? translate('signup.submitting', 'Creating…') : translate('signup.submit')}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
};
