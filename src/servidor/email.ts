import nodemailer from 'nodemailer';

export async function enviarEmailConta(destinatario: string, assunto: string, texto: string): Promise<void> {
  const smtp = process.env.AUTH_SMTP_URL;
  const remetente = process.env.AUTH_EMAIL_FROM;
  if (!smtp || !remetente) throw new Error('Envio de e-mails não configurado.');
  const transporte = nodemailer.createTransport(smtp);
  await transporte.sendMail({ from: remetente, to: destinatario, subject: assunto, text: texto });
}
