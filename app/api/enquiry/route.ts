import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

type EnquiryBody = {
  name?: string;
  email?: string;
  company?: string;
  budget?: string;
  message?: string;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const mailHost = process.env.SMTP_HOST;
const mailPort = Number(process.env.SMTP_PORT ?? 587);
const mailUser = process.env.SMTP_USER;
const mailPass = process.env.SMTP_PASS;
const mailFrom = process.env.MAIL_FROM ?? '369 The Dev Store <369thedevstore@gmail.com>';
const mailTo = process.env.MAIL_TO ?? '369thedevstore@gmail.com';

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

const transporter =
  mailHost && mailUser && mailPass
    ? nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: mailPort === 465,
        auth: {
          user: mailUser,
          pass: mailPass,
        },
      })
    : null;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  if (!supabase || !transporter) {
    return Response.json(
      {
        error: 'Server is missing Supabase or email configuration.',
      },
      { status: 500 },
    );
  }

  let body: EnquiryBody;

  try {
    body = (await request.json()) as EnquiryBody;
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const company = body.company?.trim();
  const budget = body.budget?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message || !budget) {
    return Response.json({ error: 'Please fill in all required fields.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return Response.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  const enquiry = {
    name,
    email,
    company: company ?? '',
    budget,
    message,
  };

  const { error: insertError } = await supabase.from('enquiries').insert(enquiry);

  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 });
  }

  await transporter.sendMail({
    from: mailFrom,
    to: mailTo,
    replyTo: email,
    subject: `New enquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company ?? '-'}`,
      `Package: ${budget}`,
      '',
      message,
    ].join('\n'),
  });

  return Response.json({ message: 'Enquiry submitted. We will be in touch shortly.' });
}