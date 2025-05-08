package com.example.bankSystem.service;
import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.*;
import java.util.Properties;

@Service
@Async
public class MailSender
{
    public void sending(String email,String otp)
    {
        // Sender's email credentials
        final String senderEmail = "safebharathbank@gmail.com";
        final String password = "pcyi kksz lpca cgvu";

        // SMTP server configuration
        String host = "smtp.gmail.com"; // Change for other email services
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", "587");

        // Create a session with the authentication
        Session session = Session.getInstance(properties,new Authenticator()
        {
            @Override
            protected jakarta.mail.PasswordAuthentication getPasswordAuthentication()
            {
                return new PasswordAuthentication(senderEmail, password);
            }
        });
        try
        {
            // Create a MimeMessage
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(senderEmail));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(email)
            );
            message.setSubject("Don't share this otp with anyone");
            message.setText("Your OTP : "+otp);

            // Send the email
            Transport.send(message);
            System.out.println("Email sent successfully!✅");
        }
        catch(MessagingException e)
        {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
    }

    public void AutoApprovalEmailSending(String fullName, String email, String aadhar) {
        // Sender's email credentials
        final String senderEmail = "safebharathbank@gmail.com";
        final String password = "pcyi kksz lpca cgvu";

        // SMTP server configuration
        String host = "smtp.gmail.com";
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", "587");

        // Create a session with the authentication
        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected jakarta.mail.PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(senderEmail, password);
            }
        });

        try {
            // Create a MimeMessage
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(senderEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("🎉 Welcome to SafeBharat Bank - Your Account is Activated!");

            // Craft welcome message
            String welcomeMessage = "Dear " + fullName + ",\n\n"
                    + "We are delighted to welcome you to SafeBharat Bank! 🎉\n\n"
                    + "Your account associated with Aadhar number " + aadhar + " has been successfully activated.\n\n"
                    + "You can now log in to your account and start using our services immediately.\n\n"
                    + "If you have any questions or need support, feel free to reach out to us.\n\n"
                    + "Warm regards,\n"
                    + "SafeBharat Bank Team";

            message.setText(welcomeMessage);

            // Send the email
            Transport.send(message);
            System.out.println("Welcome email sent successfully to " + email + " ✅");

        } catch (MessagingException e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
    }

}
