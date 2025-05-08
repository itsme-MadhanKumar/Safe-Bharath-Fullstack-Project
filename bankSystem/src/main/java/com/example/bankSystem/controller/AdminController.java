package com.example.bankSystem.controller;
import com.example.bankSystem.model.*;
import com.example.bankSystem.repository.UserPaymentRepo;
import com.example.bankSystem.repository.UserRepo;
import com.example.bankSystem.service.MailSender;
import com.example.bankSystem.service.OtpGen;
import com.example.bankSystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@CrossOrigin(origins = "*")
public class AdminController
{
    @Autowired
    private UserService service;
    @Autowired
    UserRepo repo;
    @Autowired
    private OtpGen otpGen;
    @Autowired
    private MailSender mailSender;


    @PostMapping("/api/user/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordUpdateRequest request)
    {
        boolean flah = service.CheckOldPasswordService(request.getUserId(),request.getOldPassword());
        if (flah)
        {
            String email = service.fetchingEmailService(request.getUserId());
            if(email.equals("not found"))
            {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "Your Email was Not found"));
            }
            String otp = otpGen.generateOtp(email);
            mailSender.sending(email,otp);
            return ResponseEntity.ok(Collections.singletonMap("success", true));
        }
        else
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "Old password is incorrect"));
        }
    }


    @PostMapping("api/verify-otp-pop")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody OtpVerificationRequestPassword request) {
        Map<String, Object> response = new HashMap<>();
        String email = service.fetchingEmailService(request.getUserId());
        String storedotp = otpGen.getStoredOtp(email);
        if (storedotp.equals(request.getOtp())|| !storedotp.equals("null"))
        {
            otpGen.removeStoredOtp(email);
            service.updatingUserPasswordService(request.getUserId(),request.getNewPassword());
            response.put("success", true);
            response.put("message", "Password Changed Successfully - You Have been Logged out!!!");
            return ResponseEntity.ok(response);
        }
        else {
            response.put("success", false);
            response.put("message", "Invalid OTP. Please try again.");
            return ResponseEntity.badRequest().body(response);
        }
    }


    @PostMapping("/api/user/update-mobile")
    public ResponseEntity<?> updateMobile(@RequestBody MobileUpdateRequest request)
    {
        // boolean updated = userService.updatePassword(request.getEmail(), request.getOldPassword(), request.getNewPassword());
        boolean flah = service.fetchingOldMobileService(request.getUserId(),request.getOldMobile());
        if (flah)
        {
            String email = service.fetchingEmailService(request.getUserId());
            if(email.equals("not found"))
            {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "Your Email was Not found"));
            }
            String otp = otpGen.generateOtp(email);
            mailSender.sending(email,otp);
            return ResponseEntity.ok(Collections.singletonMap("success", true));
        } else
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "Old Mobile Number is incorrect"));
        }
    }

    @PostMapping("api/verify-otp-pop-mobile")
    public ResponseEntity<Map<String, Object>> verifyOtpMobile(@RequestBody OtpVerificationRequestMobile request)
    {
        Map<String, Object> response = new HashMap<>();
        String email = service.fetchingEmailService(request.getUserId());
        String storedotp = otpGen.getStoredOtp(email);
        System.out.println("New mobile"+request.getNewMobile());
        if (storedotp.equals(request.getOtp()) || !storedotp.equals("null"))
        {
            service.updatingUserMobileService(request.getUserId(),request.getNewMobile());
            otpGen.removeStoredOtp(email);
            response.put("success", true);
            response.put("message", "Mobile Number Changed Successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid OTP. Please try again.");
            return ResponseEntity.badRequest().body(response);
        }
    }


    @PostMapping("/api/email/change-email-request")
    public ResponseEntity<?> changeEmail(@RequestBody EmailUpdateRequest request)
    {
        String storedemail = service.fetchingEmailService(request.getUserId());

        if (storedemail.equals(request.getOldEmail()))
        {
            String otp1Gen = otpGen.generateOtp(request.getOldEmail());
            String otp2Gen = otpGen.generateOtp(request.getNewEmail());
            mailSender.sending(request.getOldEmail(),otp1Gen);
            mailSender.sending(request.getNewEmail(),otp2Gen);
            return ResponseEntity.ok("Email change request accepted");

        }
        return ResponseEntity.badRequest().body("Old Email is Incorrect!");
    }

    @PostMapping("api/email/verify-dual-otp")
    public ResponseEntity<Map<String, String> > verifyOtps(@RequestBody OtpVerificationRequestEmailtwo request)
    {
        Map<String, String> response = new HashMap<>();
        String Curentemail = service.fetchingEmailService(request.getUserId());
        String NewEmail = request.getNewEmail();
        String OtpOfCurrentEmail = otpGen.getStoredOtp(Curentemail);
        String OtpOfNewEmail = otpGen.getStoredOtp(NewEmail);

        if ((OtpOfCurrentEmail.equals(request.getOldOtp()))&&(OtpOfNewEmail.equals(request.getNewOtp())))
        {
            service.updatingUserEmailService(request.getUserId(),request.getNewEmail());
            otpGen.removeStoredOtp(Curentemail);
            response.put("message", "Email updated successfully");
            response.put("success", "true"); // <-- add this line
            return ResponseEntity.ok(response);
        }
        else {
            response.put("error", "Invalid OTPs");
            response.put("success", "false"); // <-- add this line
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }


    @PostMapping("/api/user/update-address")
    public ResponseEntity<?> updateAddress(@RequestBody AddressUpdateRequest request)
    {
        String Curentemail = service.fetchingEmailService(request.getUserId());
        String GeneratedOtp = otpGen.generateOtp(Curentemail);
        mailSender.sending(Curentemail,GeneratedOtp);
        if (GeneratedOtp!=null && Curentemail!=null)
        {
            return ResponseEntity.ok(Collections.singletonMap("success", true));
        }
        else
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "Old password is incorrect"));
        }
    }

    @PostMapping("api/verify-otp-pop-address")
    public ResponseEntity<Map<String, Object>> verifyOtpAddress(@RequestBody OtpVerificationRequestAddress request)
    {
        Map<String, Object> response = new HashMap<>();
        String Curentemail = service.fetchingEmailService(request.getUserId());
        String GeneratedOtp = otpGen.getStoredOtp(Curentemail);
        if (GeneratedOtp.equals(request.getOtp()))
        {
            otpGen.removeStoredOtp(Curentemail);
            service.updatingHomeAddressService(request.getUserId(),request.getAddresshome());
            response.put("success", true);
            response.put("message", "Home Address Changed Successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid OTP. Please try again.");
            return ResponseEntity.badRequest().body(response);
        }
    }


    @PostMapping("api/profile/updateProfilePic")
    public ResponseEntity<String> updateProfilePic(@RequestParam("userId") String aadhar,
                                                   @RequestParam("profilePic") MultipartFile file) {
        try {
            InputStream inputStream = file.getInputStream();
            boolean isUpdated = service.updateProfilePicture(aadhar,inputStream);

            if (isUpdated) {
                return ResponseEntity.ok("Profile picture updated successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }


    @GetMapping("api/user/profile/{aadhar}")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable String aadhar)
    {
        UserProfileDTO profile = repo.getUserProfile(aadhar);
        if (profile != null) {
            return ResponseEntity.ok(profile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/api/user/update-takeaction")
    public ResponseEntity<?> updateTakeAction(@RequestBody AccountActionRequest request)
    {
        String Curentemail = service.fetchingEmailService(request.getUserId());
        String GenerateOtp = otpGen.generateOtp(Curentemail);
        mailSender.sending(Curentemail,GenerateOtp);
        System.out.println("Action take "+request.getAction());
        System.out.println("OTP "+GenerateOtp);
        if (request.getAction()!=null)
        {
            return ResponseEntity.ok(Collections.singletonMap("success", true));
        }
        else
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "There is a Error"));
        }
    }

    @PostMapping("api/verify-otp-pop-takeAction")
    public ResponseEntity<Map<String, Object>> verifyOtpTakeAction(@RequestBody OtpVerificationRequestTakeaction request) {

        Map<String, Object> response = new HashMap<>();
        String Curentemail = service.fetchingEmailService(request.getUserId());
        String GeneratedOtp = otpGen.getStoredOtp(Curentemail);

        if (GeneratedOtp.equals(request.getOtp()))
        {
            response.put("success", true);
            response.put("message", "Action Taken Successfully  ! ");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid OTP. Please try again.");
            return ResponseEntity.badRequest().body(response);
        }
    }


    @PostMapping("/api/face/store-action-img")
    public ResponseEntity<String> storeActionImage(
            @RequestParam("userId") String aadhar,
            @RequestParam("actionTaken") String action,
            @RequestParam("capturedImage") MultipartFile capturedImage)
    {
        boolean isActionTaken = service.updatingTakeAction(aadhar,action);
        if (isActionTaken)
        {
            boolean success =service.storeAction(aadhar, action, capturedImage);
            return ResponseEntity.ok("Face action stored successfully.");
        }
        else
        {
            return ResponseEntity.badRequest().body("Failed to store action.");
        }
    }


    @GetMapping("api/user/dashboard")
    public ResponseEntity<UserDashboardDTO> getUserDashboard(@RequestParam String userId) {
        UserDashboardDTO user = service.fetchUserDashboard(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/api/user/generate-payment-password")
    public ResponseEntity<?> GeneratePaymentPassword(@RequestBody GeneratePaymentPasswordRequest request)
    {

        String Curentemail = service.fetchingEmailService(request.getUserId());
        String GenerateOtp = otpGen.generateOtp(Curentemail);
        mailSender.sending(Curentemail,GenerateOtp);
            return ResponseEntity.ok(Collections.singletonMap("success", true));
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("message", "Old password is incorrect"));
    }

    @PostMapping("api/verify-otp-generatePaymentPassword")
    public ResponseEntity<Map<String, Object>> verifyotpOfPaymentpassword(@RequestBody OtpVerificationRequestGeneratePaymentPassword request) {
        Map<String, Object> response = new HashMap<>();
        String Curentemail = service.fetchingEmailService(request.getUserId());
        String GeneratedOtp = otpGen.getStoredOtp(Curentemail);
        if (GeneratedOtp.equals(request.getOtpofpaymentpassword()))
        {
            service.UpdatingPaymentPasswordService(request.getUserId(),request.getPaymentPassword());
            response.put("success", true);
            response.put("message", "Payment Password changed Successfully ✅");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid OTP. Please try again.");
            return ResponseEntity.badRequest().body(response);
        }
    }
    @GetMapping("api/health-check")
    public ResponseEntity<String> checkHealth()
    {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("api/transactions/{userId}")
    public List<Transaction> getUserTransactions(@PathVariable String userId)
    {
        return service.getTransactionsByUserId(userId);
    }

    @GetMapping("api/notifications")
    public List<NotificationDTO> getNotifications(@RequestParam String userId)
    {
        return repo.getUserNotifications(userId);
    }

    @GetMapping("api/delete-step/{step}")
    public ResponseEntity<Map<String, String>> deleteStep(@PathVariable("step") int step, @RequestParam String userId) {
        // Simulate each step (Replace with actual business logic)
        try {
            // Introducing a delay of 5 seconds (5000 milliseconds)
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("STEP :"+step);
        System.out.println("Id : "+userId);

        // Create response map
        Map<String, String> response = new HashMap<>();

        switch (step)
        {
            case 1:
                response.put("success", "true");
                break;
            case 2:
                boolean isPendingLoan = service.isAnyPendingLoanService(userId);
                if(!isPendingLoan)
                {
                    response.put("message", "You have pending loans!");
                    response.put("success", "false");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }
                response.put("success", "true");
                break;
            case 3:
                boolean flag = service.deletingTransactionService(userId);
                if(!flag)
                {
                    response.put("message", "Error Try Again Later");
                    response.put("success", "false");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }
                response.put("success", "true");
                break;
            case 4:
                boolean flag1 = service.deletingNotificationService(userId);
                if(!flag1)
                {
                    response.put("message", "Error Try Again Later");
                    response.put("success", "false");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }
                response.put("success", "true");
                break;
            case 5:
                boolean flag2 = service.deletingAccountService(userId);
                if(!flag2)
                {
                    response.put("message", "Error Try Again Later");
                    response.put("success", "false");
                }
                response.put("success", "true");
                break;
            default:
                response.put("message", "Error Try Again Later");
                response.put("success", "false");
                break;
        }
        return ResponseEntity.ok(response);
    }


}
