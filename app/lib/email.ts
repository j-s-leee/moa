import { Resend } from "resend";

const resendClient = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  from = "noreply@mail.the-moa.top",
  to,
  subject,
  html,
}: {
  from?: string;
  to: string;
  subject: string;
  html: string;
}) => {
  const { error } = await resendClient.emails.send({
    from,
    to,
    subject,
    html,
  });
  if (error) {
    throw error;
  }
  return { success: true, message: "Email sent successfully" };
};
