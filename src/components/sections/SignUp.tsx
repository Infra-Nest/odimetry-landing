import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { createUser } from '../../services/authService';
import type { CreateUserRequest } from '../../types/auth';

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
  const [createOrg, setCreateOrg] = useState(false);

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
    } catch (err: any) {
      setError(err?.message || translate('signup.errors.general'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-950 text-white" aria-labelledby="signup-heading">
      <Container>
        <div className="max-w-xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6 sm:p-8">
          <h2 id="signup-heading" className="text-2xl sm:text-3xl font-bold mb-3 text-gray-100">
            {translate('signup.title')}
          </h2>
          <p className="text-sm text-gray-400 mb-6">{translate('signup.subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label={translate('signup.title')}>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
                {translate('signup.email')} *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">
                {translate('signup.password')} *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder={translate('signup.passwordPlaceholder', 'At least 12 characters')}
              />
            </div>

            {/* Optional user fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input placeholder="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
              <input placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Convert to base64 to send as profile_image_url (or handle upload separately)
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfileImageUrl(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />              <input placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>

            {/* Existing org id or create new org toggle */}
            <div className="flex items-center space-x-3">
              <input id="createOrg" type="checkbox" checked={createOrg} onChange={(e) => setCreateOrg(e.target.checked)} className="h-4 w-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-400" />
              <label htmlFor="createOrg" className="text-sm text-gray-300">{translate('signup.createOrganization')}</label>
            </div>

            {/* Existing org ID */}
            {!createOrg && (
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="organizationId">
                  Organization ID
                  </label>
                  <input
                  type="number"
                  id="organizationId"
                  value={organizationId || ''}
                  onChange={(e) => setOrganizationId(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
              </div>
              )}


            {/* Organization fields */}
            {createOrg && (
              <div className="space-y-3">
                <input placeholder="Organization Name *" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                <select value={orgType} onChange={(e) => setOrgType(e.target.value as 'personal' | 'business')} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none">
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                </select>
                <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                <input placeholder="Website URL" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                <input placeholder="Tax ID" value={taxId} onChange={(e) => setTaxId(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                <input placeholder="Address" value={legalAddress} onChange={(e) => setLegalAddress(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                  <input placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>
                <input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
              </div>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-green-400">{success}</p>}

            <div className="pt-3">
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? translate('signup.submitting', 'Creating...') : translate('signup.submit')}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
};
