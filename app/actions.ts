'use server'

import { Resend } from 'resend'
import { contactFormSchema } from '@/lib/schema'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(formData: FormData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  }

  // Validate the form data
  const result = contactFormSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Invalid form data' }
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'fotovideo.designo@gmail.com',
      subject: `Nova prijava obrasca od ${data.name}`,
      text: `
        Ime: ${data.name}
        E-mail: ${data.email}
        Poruka: ${data.message}
      `,
    })

    return { success: true }
  } catch {
    return { error: 'Failed to send email' }
  }
}
