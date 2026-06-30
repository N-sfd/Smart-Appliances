// Vercel Function: send-booking-email
// RESEND_API_KEY is set in Vercel project environment variables — NEVER expose it in React frontend.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[send-booking-email] RESEND_API_KEY missing — skipping email');
    res.status(200).json({ success: true, skipped: true });
    return;
  }

  const fromEmail = process.env.FROM_EMAIL || 'noreply@smartappliancesmd.com';

  const body = req.body ?? {};
  const { requestNumber, customerName, email, service, preferredDate, preferredTime } = body;

  if (!email || !requestNumber) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const siteUrl = process.env.SITE_URL || 'https://smartappliancesmd.com';
  const trackLink = `${siteUrl}/track-request`;

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

  const formattedDate = formatPreferredDate(preferredDate);

  const htmlBody = `
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

  try {
    const apiRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Smart Appliances MD <${fromEmail}>`,
        to: [email],
        subject: `Booking Confirmed – ${requestNumber}`,
        html: htmlBody,
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error('[send-booking-email] Resend API error:', apiRes.status, errText);
      res.status(500).json({ error: 'Failed to send email' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('[send-booking-email] Unexpected error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
};
