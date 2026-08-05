"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactMessage(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !subject || !message) {
      return { success: false, message: "Please fill in all required fields." };
    }

    const finalMessage = phone ? `Phone: ${phone}\n\n${message}` : message;

    const { error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          subject,
          message: finalMessage,
        }
      ]);

    if (error) {
      console.error("Supabase Error:", error);
      return { success: false, message: "Failed to send message. Please try again later." };
    }

    return { success: true, message: "Your message has been sent successfully!" };
  } catch (error) {
    console.error("Action Error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
