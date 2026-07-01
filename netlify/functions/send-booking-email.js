// Netlify Function: send-booking-email
// RESEND_API_KEY is set in Netlify environment — NEVER expose it in React frontend.
//
// Sends two independent emails per booking: an admin notification (to ADMIN_EMAIL) and a
// customer confirmation (to the booking's email). Each is attempted and reported separately —
// a failure in one never blocks or falsely reports success for the other.
//
// PRODUCTION NOTE: onboarding@resend.dev (Resend's shared test sender) can only deliver to the
// email address of the Resend account owner. Sending a customer confirmation to any other
// address (e.g. a customer's Gmail) will fail with something like "You can only send testing
// emails to your own email address." To send to arbitrary customers:
//   1. Buy/use a real domain.
//   2. Add the domain in Resend and add the required DNS records.
//   3. Wait until the domain shows as verified in Resend.
//   4. Set FROM_EMAIL to an address on that domain, e.g. FROM_EMAIL=Smart Appliances MD <noreply@yourdomain.com>
//   5. Redeploy.

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));

const formatPreferredDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dateStr;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const isResendTestDomainError = (message) =>
  /only send testing emails|verify a domain|own email address/i.test(message ?? '');

function buildCustomerHtml({ requestNumber, customerName, service, formattedDate, preferredTime, trackLink }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  @media only screen and (max-width: 600px) {
    .email-container { width: 100% !important; }
    .email-body { padding: 24px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" class="email-container" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#0B3D91;padding:28px 36px;">
            <p style="margin:0;color:#fff;font-size:20px;font-weight:800;letter-spacing:-0.02em;">Smart Appliances MD</p>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Home Service Booking Confirmation</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td class="email-body" style="padding:36px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F172A;">
              Request Received${customerName ? `, ${customerName}` : ''}!
            </p>
            <p style="margin:0 0 28px;font-size:15px;color:#64748B;line-height:1.6;">
              We've received your service request and will contact you shortly to confirm your appointment.
            </p>

            <!-- Request ID badge -->
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;">Request ID</p>
            <div style="display:inline-block;background:#EFF6FF;border:1.5px solid #1A73E8;border-radius:999px;padding:8px 20px;margin-bottom:28px;">
              <span style="font-size:16px;font-weight:800;color:#1A73E8;letter-spacing:0.04em;">${requestNumber}</span>
            </div>

            <!-- Details table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;margin-bottom:28px;">
              ${service ? `
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #E2E8F0;font-size:13px;color:#64748B;width:40%;">Service</td>
                <td style="padding:12px 16px;border-bottom:1px solid #E2E8F0;font-size:13px;color:#0F172A;font-weight:600;">${service}</td>
              </tr>` : ''}
              ${formattedDate ? `
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #E2E8F0;font-size:13px;color:#64748B;">Preferred Date</td>
                <td style="padding:12px 16px;border-bottom:1px solid #E2E8F0;font-size:13px;color:#0F172A;font-weight:600;">${formattedDate}</td>
              </tr>` : ''}
              ${preferredTime ? `
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #E2E8F0;font-size:13px;color:#64748B;">Time Slots</td>
                <td style="padding:12px 16px;border-bottom:1px solid #E2E8F0;font-size:13px;color:#0F172A;font-weight:600;">${preferredTime}</td>
              </tr>` : ''}
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#64748B;">Status</td>
                <td style="padding:12px 16px;font-size:13px;color:#15803D;font-weight:700;">New — Pending review</td>
              </tr>
            </table>

            <!-- Track button -->
            <a href="${trackLink}" style="display:block;background:#0B3D91;color:#fff;text-decoration:none;text-align:center;padding:14px 24px;border-radius:12px;font-size:15px;font-weight:700;margin-bottom:12px;">
              Track Request Status
            </a>
            <p style="margin:0 0 24px;font-size:13px;color:#94A3B8;line-height:1.6;text-align:center;">
              Use your Request ID to check your service status.
            </p>

            <p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.6;text-align:center;">
              Questions? Call us at <a href="tel:2405760397" style="color:#1A73E8;font-weight:600;">240-576-0397</a>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#F8FAFC;padding:20px 36px;border-top:1px solid #E2E8F0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94A3B8;">
              Smart Appliances MD · Maryland, DC, Virginia, Pennsylvania, West Virginia
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildAdminHtml({ requestNumber, customerName, email, phone, service, formattedDate, preferredTime, adminLink }) {
  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#F1F5F9;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:100%;">
        <tr>
          <td style="background:#0B3D91;padding:24px 32px;">
            <p style="margin:0;color:#fff;font-size:18px;font-weight:800;">New Booking Request</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;font-size:14px;color:#0F172A;">A new service request was just submitted.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;">
              <tr><td style="padding:10px 16px;font-size:13px;color:#64748B;width:40%;">Request ID</td><td style="padding:10px 16px;font-size:13px;color:#0F172A;font-weight:700;">${requestNumber}</td></tr>
              <tr><td style="padding:10px 16px;font-size:13px;color:#64748B;">Customer</td><td style="padding:10px 16px;font-size:13px;color:#0F172A;">${customerName || '—'}</td></tr>
              <tr><td style="padding:10px 16px;font-size:13px;color:#64748B;">Email</td><td style="padding:10px 16px;font-size:13px;color:#0F172A;">${email}</td></tr>
              ${phone ? `<tr><td style="padding:10px 16px;font-size:13px;color:#64748B;">Phone</td><td style="padding:10px 16px;font-size:13px;color:#0F172A;">${phone}</td></tr>` : ''}
              ${service ? `<tr><td style="padding:10px 16px;font-size:13px;color:#64748B;">Service</td><td style="padding:10px 16px;font-size:13px;color:#0F172A;">${service}</td></tr>` : ''}
              ${formattedDate ? `<tr><td style="padding:10px 16px;font-size:13px;color:#64748B;">Preferred Date</td><td style="padding:10px 16px;font-size:13px;color:#0F172A;">${formattedDate}</td></tr>` : ''}
              ${preferredTime ? `<tr><td style="padding:10px 16px;font-size:13px;color:#64748B;">Time Slot</td><td style="padding:10px 16px;font-size:13px;color:#0F172A;">${preferredTime}</td></tr>` : ''}
            </table>
            <a href="${adminLink}" style="display:block;background:#0B3D91;color:#fff;text-decoration:none;text-align:center;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:700;margin-top:20px;">
              View in Admin Dashboard
            </a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendViaResend(apiKey, { from, to, subject, html }) {
  try {
    const apiRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return { sent: false, error: `${apiRes.status} ${errText}` };
    }
    return { sent: true, error: null };
  } catch (err) {
    return { sent: false, error: err.message ?? 'Unknown error' };
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[send-booking-email] RESEND_API_KEY missing — skipping admin and customer emails');
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: false,
        adminEmailSent: false,
        customerEmailSent: false,
        skippedReason: 'RESEND_API_KEY missing',
      }),
    };
  }

  const fromEmail = process.env.FROM_EMAIL || 'noreply@smartappliancesmd.com';
  const adminEmail = process.env.ADMIN_EMAIL;

  let body;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { requestNumber, customerName, email, phone, service, preferredDate, preferredTime } = body;

  if (!email || !requestNumber) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  const siteUrl = process.env.SITE_URL || 'https://smartappliancesmd.com';
  const trackLink = `${siteUrl}/track-request`;
  const adminLink = `${siteUrl}/admin/bookings`;
  const formattedDate = formatPreferredDate(preferredDate);

  const safe = {
    requestNumber: escapeHtml(requestNumber),
    customerName: escapeHtml(customerName),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    service: escapeHtml(service),
    formattedDate: escapeHtml(formattedDate),
    preferredTime: escapeHtml(preferredTime),
  };

  const customerHtml = buildCustomerHtml({ ...safe, trackLink });
  const adminHtml = buildAdminHtml({ ...safe, adminLink });

  const tasks = [];

  tasks.push(
    adminEmail
      ? sendViaResend(apiKey, {
          from: `Smart Appliances MD <${fromEmail}>`,
          to: adminEmail,
          subject: `New Booking Request – ${requestNumber}`,
          html: adminHtml,
        })
      : Promise.resolve({ sent: false, error: 'ADMIN_EMAIL not configured — set ADMIN_EMAIL env var to receive booking notifications' }),
  );

  tasks.push(
    sendViaResend(apiKey, {
      from: `Smart Appliances MD <${fromEmail}>`,
      to: email,
      subject: `Booking Confirmed – ${requestNumber}`,
      html: customerHtml,
    }),
  );

  const [adminResult, customerResult] = await Promise.all(tasks);

  if (adminResult.error) {
    console.error('[send-booking-email] Admin email failed:', adminResult.error);
  } else {
    console.log('[send-booking-email] Admin email sent for', requestNumber);
  }

  if (customerResult.error) {
    console.error('[send-booking-email] Customer email failed:', customerResult.error);
    if (isResendTestDomainError(customerResult.error)) {
      console.warn(
        '[send-booking-email] If customer email fails with Resend test-domain restriction, verify a custom domain in Resend and update FROM_EMAIL.',
      );
    }
  } else {
    console.log('[send-booking-email] Customer email sent for', requestNumber);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: adminResult.sent || customerResult.sent,
      adminEmailSent: adminResult.sent,
      customerEmailSent: customerResult.sent,
      adminEmailError: adminResult.error,
      customerEmailError: customerResult.error,
    }),
  };
};
